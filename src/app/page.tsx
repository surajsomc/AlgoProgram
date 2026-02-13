import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import StreakDisplay from "@/components/StreakDisplay";
import WeaknessMap from "@/components/WeaknessMap";
import StudyTimeline from "@/components/StudyTimeline";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import ReviewDueCard from "@/components/ReviewDueCard";

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
    prisma.problemAttempt.count({ where: { status: { in: ["solved", "mastered"] } } }),
    prisma.problemAttempt.count({ where: { status: "attempted" } }),
    prisma.userProgress.findFirst({
      orderBy: { lastStudied: "desc" },
      include: { topic: true },
    }),
  ]);

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

  // Get problems due for review
  const now = new Date();
  const dueForReview = await prisma.problemAttempt.findMany({
    where: { nextReviewDate: { lte: now } },
    include: {
      problem: {
        include: { topic: { select: { name: true, slug: true, icon: true } } },
      },
    },
    orderBy: { nextReviewDate: "asc" },
    take: 5,
  });

  return (
    <div className="max-w-5xl">
      <div className="mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Track your DSA interview prep progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] mb-10 animate-stagger">
        <div className="bg-black p-6">
          <p className="text-xs text-gray-600 uppercase tracking-[0.15em] font-mono mb-3">Topics Studied</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {topicsStudied}
            <span className="text-lg text-gray-700 font-normal">/{totalTopics}</span>
          </p>
          <div className="mt-3">
            <ProgressBar value={topicsStudied} max={totalTopics} size="md" />
          </div>
        </div>
        <div className="bg-black p-6">
          <p className="text-xs text-gray-600 uppercase tracking-[0.15em] font-mono mb-3">Problems Solved</p>
          <p className="text-4xl font-bold text-emerald-400 tracking-tight">
            {problemsSolved}
            <span className="text-lg text-gray-700 font-normal">/{totalProblems}</span>
          </p>
          <div className="mt-3">
            <ProgressBar value={problemsSolved} max={totalProblems} size="md" />
          </div>
        </div>
        <div className="bg-black p-6">
          <p className="text-xs text-gray-600 uppercase tracking-[0.15em] font-mono mb-3">Attempted</p>
          <p className="text-4xl font-bold text-amber-400 tracking-tight">
            {problemsAttempted}
          </p>
          <p className="text-xs text-gray-700 mt-3">
            Keep solving to turn these green
          </p>
        </div>
        <StreakDisplay />
      </div>

      {/* Due for Review */}
      {dueForReview.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white tracking-tight">Due for Review</h2>
            <Link href="/review" className="text-xs text-accent hover:text-accent-light font-mono">
              View all →
            </Link>
          </div>
          <div className="space-y-px">
            {dueForReview.map((a) => (
              <ReviewDueCard
                key={a.id}
                id={a.problem.id}
                title={a.problem.title}
                difficulty={a.problem.difficulty}
                pattern={a.problem.pattern}
                status={a.status}
                interval={a.interval}
                nextReviewDate={a.nextReviewDate?.toISOString() || ""}
                topicName={a.problem.topic.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Continue Studying */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {recentProgress && (
          <Link href={`/topics/${recentProgress.topic.slug}`}>
            <div className="card-hover cursor-pointer">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-mono mb-3">
                Recently Studied
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{recentProgress.topic.icon}</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    {recentProgress.topic.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Continue →
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {nextTopic && (
          <Link href={`/topics/${nextTopic.slug}`}>
            <div className="card-hover cursor-pointer border-accent/15 bg-accent/[0.02]">
              <p className="text-[10px] text-accent uppercase tracking-[0.15em] font-mono mb-3">
                Up Next
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{nextTopic.icon}</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    {nextTopic.name}
                  </h3>
                  <p className="text-sm text-gray-600">Start learning →</p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Weakness Map */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Weakest Patterns</h2>
        <WeaknessMap />
      </div>

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Recent Activity</h2>
        <StudyTimeline />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/patterns" className="btn-primary">
          Pattern Guide
        </Link>
        <Link href="/quiz" className="btn-secondary">
          Take a Quiz
        </Link>
        <Link href="/topics" className="btn-secondary">
          Browse Topics
        </Link>
        <Link href="/flashcards" className="btn-secondary">
          Flashcards
        </Link>
      </div>

      {/* Calendar Heatmap */}
      <div className="mb-10">
        <CalendarHeatmap />
      </div>
    </div>
  );
}
