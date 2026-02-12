import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
