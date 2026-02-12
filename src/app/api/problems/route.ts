import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicSlug = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty");

  const where: Record<string, unknown> = {};
  if (topicSlug) {
    const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
    if (topic) where.topicId = topic.id;
  }
  if (difficulty) where.difficulty = difficulty;

  const problems = await prisma.problem.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      topic: { select: { name: true, slug: true } },
      attempts: { select: { status: true } },
    },
  });

  const result = problems.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
    pattern: p.pattern,
    topicName: p.topic.name,
    topicSlug: p.topic.slug,
    status: p.attempts[0]?.status || null,
  }));

  return NextResponse.json(result);
}
