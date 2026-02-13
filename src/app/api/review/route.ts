import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  const dueAttempts = await prisma.problemAttempt.findMany({
    where: {
      nextReviewDate: { lte: now },
    },
    include: {
      problem: {
        include: {
          topic: { select: { name: true, slug: true, icon: true } },
        },
      },
    },
    orderBy: { nextReviewDate: "asc" },
  });

  const problems = dueAttempts.map((a) => ({
    id: a.problem.id,
    title: a.problem.title,
    difficulty: a.problem.difficulty,
    pattern: a.problem.pattern,
    status: a.status,
    interval: a.interval,
    nextReviewDate: a.nextReviewDate,
    topicName: a.problem.topic.name,
    topicSlug: a.problem.topic.slug,
    topicIcon: a.problem.topic.icon,
  }));

  return NextResponse.json(problems);
}
