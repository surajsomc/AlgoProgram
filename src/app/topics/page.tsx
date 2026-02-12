import { prisma } from "@/lib/prisma";
import TopicCard from "@/components/TopicCard";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      problems: { select: { id: true } },
      progress: { select: { completed: true } },
    },
  });

  const solvedAttempts = await prisma.problemAttempt.findMany({
    where: { status: "solved" },
    select: { problemId: true },
  });
  const solvedSet = new Set(solvedAttempts.map((a) => a.problemId));

  return (
    <div className="max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Topics</h1>
        <p className="text-gray-400">
          Work through these in order for the best learning path
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            name={topic.name}
            slug={topic.slug}
            description={topic.description}
            icon={topic.icon}
            problemCount={topic.problems.length}
            solvedCount={topic.problems.filter((p) => solvedSet.has(p.id)).length}
            isCompleted={topic.progress.some((p) => p.completed)}
          />
        ))}
      </div>
    </div>
  );
}
