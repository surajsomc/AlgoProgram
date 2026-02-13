import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import StudyButton from "./StudyButton";
import TopicProblems from "./TopicProblems";

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
        include: {
          attempts: { select: { status: true } },
          bookmarks: { select: { id: true } },
          notes: { select: { id: true } },
        },
      },
      progress: { select: { completed: true } },
    },
  });

  if (!topic) notFound();

  const isStudied = topic.progress.some((p) => p.completed);

  const problemsData = topic.problems.map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    pattern: p.pattern,
    status: p.attempts[0]?.status,
    isBookmarked: p.bookmarks.length > 0,
    hasNote: p.notes.length > 0,
  }));

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-2xl sm:text-3xl">{topic.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{topic.name}</h1>
          {isStudied && (
            <span className="badge-easy">Studied</span>
          )}
        </div>
        <p className="text-gray-600 text-sm">{topic.description}</p>
        <div className="flex gap-3 mt-4">
          <Link href={`/topics/${topic.slug}/flashcards`} className="btn-secondary text-xs px-3 py-1.5">
            Study Flashcards
          </Link>
          <Link href={`/topics/${topic.slug}/cheatsheet`} className="btn-secondary text-xs px-3 py-1.5">
            View Cheat Sheet
          </Link>
        </div>
      </div>

      {/* Concepts / Learn Section */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-5 tracking-tight">
          Learn
        </h2>
        <div className="space-y-6">
          {topic.concepts.map((concept) => (
            <div key={concept.id} className="card">
              <h3 className="text-[15px] font-semibold text-accent mb-3">
                {concept.title}
              </h3>
              <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap mb-4">
                {concept.content}
              </div>

              {(concept.timeComplexity || concept.spaceComplexity) && (
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                  {concept.timeComplexity && (
                    <div className="bg-white/[0.03] px-3 py-1.5 border border-white/[0.06]">
                      <span className="text-xs text-gray-600">Time: </span>
                      <span className="text-sm text-emerald-400 font-mono">
                        {concept.timeComplexity}
                      </span>
                    </div>
                  )}
                  {concept.spaceComplexity && (
                    <div className="bg-white/[0.03] px-3 py-1.5 border border-white/[0.06]">
                      <span className="text-xs text-gray-600">Space: </span>
                      <span className="text-sm text-amber-400 font-mono">
                        {concept.spaceComplexity}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {concept.whenToUse && (
                <div className="bg-accent/[0.03] border border-accent/15 p-3 mb-4">
                  <p className="text-xs text-accent font-medium mb-1">
                    When to use
                  </p>
                  <p className="text-sm text-gray-400">{concept.whenToUse}</p>
                </div>
              )}

              {concept.codeExample && (
                <div>
                  <p className="text-xs text-gray-600 mb-2 font-mono">Example</p>
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
        <h2 className="text-lg font-semibold text-white mb-5 tracking-tight">
          Practice <span className="text-gray-600 font-normal text-sm font-mono">({topic.problems.length})</span>
        </h2>
        <TopicProblems problems={problemsData} />
      </section>
    </div>
  );
}
