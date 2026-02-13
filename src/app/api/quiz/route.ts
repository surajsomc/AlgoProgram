import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { todayString } from "@/lib/sm2";

export async function POST(request: NextRequest) {
  const { score, total, patternPerformance } = await request.json();

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const quizAttempt = await prisma.quizAttempt.create({
    data: {
      score,
      total,
      percentage,
      patternPerformance: JSON.stringify(patternPerformance || {}),
    },
  });

  // Update DailyActivity
  const today = todayString();
  await prisma.dailyActivity.upsert({
    where: { date: today },
    update: { quizzesTaken: { increment: 1 } },
    create: { date: today, quizzesTaken: 1 },
  });

  // Log event
  await prisma.studyEvent.create({
    data: {
      type: "quiz_completed",
      entityId: quizAttempt.id,
      entityName: `Quiz: ${score}/${total} (${percentage}%)`,
      metadata: JSON.stringify({ score, total, percentage }),
    },
  });

  return NextResponse.json(quizAttempt);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicSlug = searchParams.get("topic");
  const count = parseInt(searchParams.get("count") || "10", 10);

  const where: Record<string, unknown> = {};
  if (topicSlug) {
    const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
    if (topic) where.topicId = topic.id;
  }

  const problems = await prisma.problem.findMany({
    where,
    include: {
      topic: { select: { name: true } },
    },
  });

  // Shuffle and take `count` problems
  const shuffled = problems.sort(() => Math.random() - 0.5).slice(0, count);

  // Get all unique patterns for generating wrong answers
  const allPatterns = Array.from(new Set(problems.map((p) => p.pattern)));

  const questions = shuffled.map((problem) => {
    // Generate options: correct answer + 3 wrong ones
    const wrongPatterns = allPatterns
      .filter((p) => p !== problem.pattern)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [problem.pattern, ...wrongPatterns].sort(
      () => Math.random() - 0.5
    );
    const correctAnswer = options.indexOf(problem.pattern);

    return {
      id: problem.id,
      question: `Which algorithmic pattern best solves this problem?\n\n"${problem.title}": ${problem.description.slice(0, 200)}...`,
      options,
      correctAnswer,
      explanation: `This problem uses the "${problem.pattern}" pattern. ${problem.explanation.slice(0, 200)}`,
      topicName: problem.topic.name,
      difficulty: problem.difficulty,
    };
  });

  return NextResponse.json(questions);
}
