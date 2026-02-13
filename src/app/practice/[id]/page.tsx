import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DifficultyBadge from "@/components/DifficultyBadge";
import HintAccordion from "@/components/HintAccordion";
import AlgorithmPicker from "@/components/AlgorithmPicker";
import BookmarkButton from "@/components/BookmarkButton";
import NoteEditor from "@/components/NoteEditor";
import TimedPracticeWrapper from "./TimedPracticeWrapper";

export const dynamic = "force-dynamic";

export default async function ProblemPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { timed?: string; minutes?: string };
}) {
  const problemId = parseInt(params.id, 10);
  if (isNaN(problemId)) notFound();

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      topic: { select: { name: true, slug: true, icon: true } },
      attempts: { select: { status: true } },
      bookmarks: { select: { id: true } },
      notes: { select: { content: true } },
    },
  });

  if (!problem) notFound();

  const hints: string[] = JSON.parse(problem.hints);
  const examples: { input: string; output: string; explanation?: string }[] =
    JSON.parse(problem.examples);
  const status = problem.attempts[0]?.status || null;
  const isBookmarked = problem.bookmarks.length > 0;
  const noteContent = problem.notes[0]?.content || "";

  const isTimed = searchParams.timed === "true";
  const timerMinutes = parseInt(searchParams.minutes || "30", 10);

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 sm:mb-8 font-mono">
        <Link
          href={`/topics/${problem.topic.slug}`}
          className="hover:text-accent transition-colors"
        >
          {problem.topic.name}
        </Link>
        <span className="text-gray-800">/</span>
        <span className="text-gray-500 truncate">{problem.title}</span>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
          {problem.title}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <DifficultyBadge difficulty={problem.difficulty} />
          {status && (
            <span
              className={`text-xs px-2 py-0.5 ${
                status === "mastered"
                  ? "badge-mastered"
                  : status === "solved"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {status === "mastered" ? "Mastered" : status === "solved" ? "Solved" : "Attempted"}
            </span>
          )}
          <BookmarkButton problemId={problem.id} initialBookmarked={isBookmarked} />
        </div>
      </div>

      <TimedPracticeWrapper
        isTimed={isTimed}
        minutes={timerMinutes}
        problemId={problem.id}
        solution={problem.solution}
        explanation={problem.explanation}
        currentStatus={status}
        hints={hints}
        examples={examples}
        description={problem.description}
        correctPattern={problem.pattern}
      />

      {/* Notes */}
      <NoteEditor problemId={problem.id} initialContent={noteContent} />
    </div>
  );
}
