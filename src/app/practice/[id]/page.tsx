import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DifficultyBadge from "@/components/DifficultyBadge";
import HintAccordion from "@/components/HintAccordion";
import AlgorithmPicker from "@/components/AlgorithmPicker";
import ProblemActions from "./ProblemActions";
import SolutionClient from "./SolutionClient";

export const dynamic = "force-dynamic";

export default async function ProblemPage({
  params,
}: {
  params: { id: string };
}) {
  const problemId = parseInt(params.id, 10);
  if (isNaN(problemId)) notFound();

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      topic: { select: { name: true, slug: true, icon: true } },
      attempts: { select: { status: true } },
    },
  });

  if (!problem) notFound();

  const hints: string[] = JSON.parse(problem.hints);
  const examples: { input: string; output: string; explanation?: string }[] =
    JSON.parse(problem.examples);
  const status = problem.attempts[0]?.status || null;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link
          href={`/topics/${problem.topic.slug}`}
          className="hover:text-gray-300 transition-colors"
        >
          {problem.topic.icon} {problem.topic.name}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{problem.title}</span>
      </div>

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {problem.title}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <DifficultyBadge difficulty={problem.difficulty} />
          {status && (
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                status === "solved"
                  ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
                  : "bg-amber-900/50 text-amber-400 border border-amber-800"
              }`}
            >
              {status === "solved" ? "Solved" : "Attempted"}
            </span>
          )}
        </div>
      </div>

      {/* Problem Description */}
      <div className="card mb-6">
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          {problem.description}
        </div>
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-gray-300">Examples</h3>
          {examples.map((ex, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm"
            >
              <div className="mb-1">
                <span className="text-gray-500">Input: </span>
                <code className="text-indigo-400">{ex.input}</code>
              </div>
              <div className="mb-1">
                <span className="text-gray-500">Output: </span>
                <code className="text-emerald-400">{ex.output}</code>
              </div>
              {ex.explanation && (
                <div className="text-gray-500 mt-1">
                  <span>Explanation: </span>
                  {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Algorithm Picker - the core interaction */}
      <AlgorithmPicker correctPattern={problem.pattern} />

      {/* Hints */}
      {hints.length > 0 && (
        <div className="mb-6">
          <HintAccordion hints={hints} />
        </div>
      )}

      {/* Solution (collapsible) */}
      <SolutionClient solution={problem.solution} explanation={problem.explanation} />

      {/* Actions */}
      <ProblemActions problemId={problem.id} currentStatus={status} />
    </div>
  );
}
