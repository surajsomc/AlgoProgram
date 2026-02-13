import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Aggregate from QuizAttempt patternPerformance
  const quizAttempts = await prisma.quizAttempt.findMany({
    select: { patternPerformance: true },
  });

  const patternStats: Record<string, { correct: number; total: number }> = {};

  for (const qa of quizAttempts) {
    try {
      const perf = JSON.parse(qa.patternPerformance) as Record<string, { correct: number; total: number }>;
      for (const [pattern, stats] of Object.entries(perf)) {
        if (!patternStats[pattern]) {
          patternStats[pattern] = { correct: 0, total: 0 };
        }
        patternStats[pattern].correct += stats.correct;
        patternStats[pattern].total += stats.total;
      }
    } catch {
      // skip malformed
    }
  }

  // Also aggregate from ProblemAttempts per pattern
  const attempts = await prisma.problemAttempt.findMany({
    include: { problem: { select: { pattern: true } } },
  });

  for (const attempt of attempts) {
    const pattern = attempt.problem.pattern;
    if (!pattern) continue;
    if (!patternStats[pattern]) {
      patternStats[pattern] = { correct: 0, total: 0 };
    }
    patternStats[pattern].total += 1;
    if (attempt.status === "solved" || attempt.status === "mastered") {
      patternStats[pattern].correct += 1;
    }
  }

  const weaknesses = Object.entries(patternStats)
    .map(([pattern, stats]) => ({
      pattern,
      correct: stats.correct,
      total: stats.total,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return NextResponse.json(weaknesses);
}
