import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const bookmarks = await prisma.bookmark.findMany({
    include: {
      problem: {
        include: {
          topic: { select: { name: true, slug: true } },
          attempts: { select: { status: true } },
          notes: { select: { id: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          Bookmarks
        </h1>
        <p className="text-gray-600 text-sm">
          Problems you&apos;ve saved for later
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-2">No bookmarked problems yet</p>
          <p className="text-sm text-gray-600 mb-6">
            Bookmark problems while practicing to find them here.
          </p>
          <Link href="/topics" className="btn-primary">
            Browse Topics
          </Link>
        </div>
      ) : (
        <div className="space-y-px">
          {bookmarks.map((b) => (
            <ProblemCard
              key={b.id}
              id={b.problem.id}
              title={b.problem.title}
              difficulty={b.problem.difficulty}
              pattern={b.problem.pattern}
              status={b.problem.attempts[0]?.status}
              isBookmarked={true}
              hasNote={b.problem.notes.length > 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
