import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ReviewDueCard from "@/components/ReviewDueCard";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const now = new Date();
  const dueAttempts = await prisma.problemAttempt.findMany({
    where: { nextReviewDate: { lte: now } },
    include: {
      problem: {
        include: { topic: { select: { name: true, slug: true, icon: true } } },
      },
    },
    orderBy: { nextReviewDate: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          Review
        </h1>
        <p className="text-gray-600 text-sm">
          Problems due for spaced repetition review
        </p>
      </div>

      {dueAttempts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-2">No problems due for review!</p>
          <p className="text-sm text-gray-600 mb-6">
            Solve some problems and they&apos;ll appear here based on your spaced repetition schedule.
          </p>
          <Link href="/topics" className="btn-primary">
            Browse Topics
          </Link>
        </div>
      ) : (
        <div className="space-y-px">
          {dueAttempts.map((a) => (
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
      )}
    </div>
  );
}
