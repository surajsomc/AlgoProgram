import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      concepts: {
        where: { flashcardFront: { not: "" } },
        select: { id: true },
      },
    },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          Flashcards
        </h1>
        <p className="text-gray-600 text-sm">
          Review key concepts with interactive flashcards
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {topics.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.slug}/flashcards`}>
            <div className="card-hover cursor-pointer text-center py-8">
              <span className="text-3xl mb-3 block">{topic.icon}</span>
              <h3 className="text-sm font-semibold text-white mb-1">{topic.name}</h3>
              <p className="text-xs text-gray-600 font-mono">
                {topic.concepts.length} card{topic.concepts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
