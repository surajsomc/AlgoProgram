import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [
    totalTopics,
    totalProblems,
    topicsStudied,
    problemsSolved,
    problemsAttempted,
    recentProgress,
  ] = await Promise.all([
    prisma.topic.count(),
    prisma.problem.count(),
    prisma.userProgress.count({ where: { completed: true } }),
    prisma.problemAttempt.count({ where: { status: "solved" } }),
    prisma.problemAttempt.count({ where: { status: "attempted" } }),
    prisma.userProgress.findFirst({
      orderBy: { lastStudied: "desc" },
      include: { topic: true },
    }),
  ]);

  // Find the next topic to study (first unstudied topic in order)
  const studiedTopicIds = (
    await prisma.userProgress.findMany({
      where: { completed: true },
      select: { topicId: true },
    })
  ).map((p) => p.topicId);

  const nextTopic = await prisma.topic.findFirst({
    where: { id: { notIn: studiedTopicIds.length > 0 ? studiedTopicIds : [0] } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Track your DSA interview prep progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Topics Studied</p>
          <p className="text-3xl font-bold text-white">
            {topicsStudied}
            <span className="text-lg text-gray-600">/{totalTopics}</span>
          </p>
          <ProgressBar value={topicsStudied} max={totalTopics} size="md" />
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Problems Solved</p>
          <p className="text-3xl font-bold text-emerald-400">
            {problemsSolved}
            <span className="text-lg text-gray-600">/{totalProblems}</span>
          </p>
          <ProgressBar value={problemsSolved} max={totalProblems} size="md" />
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Problems Attempted</p>
          <p className="text-3xl font-bold text-amber-400">
            {problemsAttempted}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Keep solving to turn these green
          </p>
        </div>
      </div>

      {/* Continue Studying */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentProgress && (
          <Link href={`/topics/${recentProgress.topic.slug}`}>
            <div className="card hover:border-gray-700 transition-colors cursor-pointer">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Recently Studied
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{recentProgress.topic.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {recentProgress.topic.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Continue practicing →
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {nextTopic && (
          <Link href={`/topics/${nextTopic.slug}`}>
            <div className="card hover:border-indigo-500/30 border-indigo-500/20 transition-colors cursor-pointer bg-indigo-950/20">
              <p className="text-xs text-indigo-400 uppercase tracking-wider mb-2">
                Up Next
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{nextTopic.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {nextTopic.name}
                  </h3>
                  <p className="text-sm text-gray-400">Start learning →</p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
        <Link href="/patterns" className="btn-primary text-sm sm:text-base">
          Pattern Guide
        </Link>
        <Link href="/quiz" className="btn-secondary text-sm sm:text-base">
          Take a Quiz
        </Link>
        <Link href="/topics" className="btn-secondary text-sm sm:text-base">
          Browse Topics
        </Link>
      </div>
    </div>
  );
}
