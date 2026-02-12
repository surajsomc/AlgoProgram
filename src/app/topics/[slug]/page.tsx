import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import ProblemCard from "@/components/ProblemCard";
import StudyButton from "./StudyButton";

export const dynamic = "force-dynamic";

export default async function TopicDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const topic = await prisma.topic.findUnique({
    where: { slug: params.slug },
    include: {
      concepts: { orderBy: { order: "asc" } },
      problems: {
        orderBy: { order: "asc" },
        include: { attempts: { select: { status: true } } },
      },
      progress: { select: { completed: true } },
    },
  });

  if (!topic) notFound();

  const isStudied = topic.progress.some((p) => p.completed);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <span className="text-2xl sm:text-3xl">{topic.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{topic.name}</h1>
          {isStudied && (
            <span className="badge-easy">Studied</span>
          )}
        </div>
        <p className="text-gray-400">{topic.description}</p>
      </div>

      {/* Concepts / Learn Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Learn
        </h2>
        <div className="space-y-6">
          {topic.concepts.map((concept) => (
            <div key={concept.id} className="card">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                {concept.title}
              </h3>
              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                {concept.content}
              </div>

              {(concept.timeComplexity || concept.spaceComplexity) && (
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
                  {concept.timeComplexity && (
                    <div className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                      <span className="text-xs text-gray-500">Time: </span>
                      <span className="text-sm text-emerald-400 font-mono">
                        {concept.timeComplexity}
                      </span>
                    </div>
                  )}
                  {concept.spaceComplexity && (
                    <div className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                      <span className="text-xs text-gray-500">Space: </span>
                      <span className="text-sm text-amber-400 font-mono">
                        {concept.spaceComplexity}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {concept.whenToUse && (
                <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-indigo-400 font-medium mb-1">
                    When to use
                  </p>
                  <p className="text-sm text-gray-300">{concept.whenToUse}</p>
                </div>
              )}

              {concept.codeExample && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Example</p>
                  <CodeBlock code={concept.codeExample} />
                </div>
              )}
            </div>
          ))}
        </div>

        {!isStudied && <StudyButton topicId={topic.id} />}
      </section>

      {/* Problems / Practice Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Practice ({topic.problems.length} problems)
        </h2>
        <div className="space-y-2">
          {topic.problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              id={problem.id}
              title={problem.title}
              difficulty={problem.difficulty}
              pattern={problem.pattern}
              status={problem.attempts[0]?.status}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
