import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      problems: {
        select: { id: true },
      },
      progress: {
        select: { completed: true },
      },
      _count: {
        select: { problems: true },
      },
    },
  });

  const problemIds = topics.flatMap((t) => t.problems.map((p) => p.id));
  const solvedAttempts = await prisma.problemAttempt.findMany({
    where: {
      problemId: { in: problemIds },
      status: "solved",
    },
    select: { problemId: true },
  });
  const solvedSet = new Set(solvedAttempts.map((a) => a.problemId));

  const result = topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    slug: topic.slug,
    description: topic.description,
    icon: topic.icon,
    order: topic.order,
    problemCount: topic._count.problems,
    solvedCount: topic.problems.filter((p) => solvedSet.has(p.id)).length,
    isCompleted: topic.progress.some((p) => p.completed),
  }));

  return NextResponse.json(result);
}
