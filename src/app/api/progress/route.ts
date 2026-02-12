import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topicId, problemId, action } = body;

  if (action === "study" && topicId) {
    const progress = await prisma.userProgress.upsert({
      where: { topicId },
      update: { completed: true, lastStudied: new Date() },
      create: { topicId, completed: true },
    });
    return NextResponse.json(progress);
  }

  if (action === "solve" && problemId) {
    const attempt = await prisma.problemAttempt.upsert({
      where: { problemId },
      update: { status: "solved", createdAt: new Date() },
      create: { problemId, status: "solved" },
    });
    return NextResponse.json(attempt);
  }

  if (action === "attempt" && problemId) {
    const attempt = await prisma.problemAttempt.upsert({
      where: { problemId },
      update: { status: "attempted", createdAt: new Date() },
      create: { problemId, status: "attempted" },
    });
    return NextResponse.json(attempt);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function GET() {
  const [topicsStudied, problemsSolved, problemsAttempted, totalTopics, totalProblems] =
    await Promise.all([
      prisma.userProgress.count({ where: { completed: true } }),
      prisma.problemAttempt.count({ where: { status: "solved" } }),
      prisma.problemAttempt.count({ where: { status: "attempted" } }),
      prisma.topic.count(),
      prisma.problem.count(),
    ]);

  return NextResponse.json({
    topicsStudied,
    totalTopics,
    problemsSolved,
    problemsAttempted,
    totalProblems,
  });
}
