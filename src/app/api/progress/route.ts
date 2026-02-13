import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sm2, actionToQuality, todayString, yesterdayString } from "@/lib/sm2";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topicId, problemId, action, usedHints, timeSpentSecs } = body;

  // Keep existing topic study action
  if (action === "study" && topicId) {
    const progress = await prisma.userProgress.upsert({
      where: { topicId },
      update: { completed: true, lastStudied: new Date() },
      create: { topicId, completed: true },
    });

    await logEvent("topic_studied", topicId, `Topic ${topicId}`, { action });

    return NextResponse.json(progress);
  }

  if (!problemId || !action) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Map action to status
  let status: string;
  if (action === "mastered") status = "mastered";
  else if (action === "solve") status = "solved";
  else status = "attempted";

  // Get existing attempt for SM-2 input
  const existing = await prisma.problemAttempt.findUnique({
    where: { problemId },
  });

  const quality = actionToQuality(action, usedHints || false, timeSpentSecs || 0);

  const sm2Result = sm2({
    quality,
    repetitions: existing?.repetitions ?? 0,
    easeFactor: existing?.easeFactor ?? 2.5,
    interval: existing?.interval ?? 0,
  });

  // Upsert ProblemAttempt
  const attempt = await prisma.problemAttempt.upsert({
    where: { problemId },
    update: {
      status,
      attemptCount: existing ? existing.attemptCount + 1 : 1,
      timeSpentSecs: timeSpentSecs || 0,
      lastAttemptAt: new Date(),
      nextReviewDate: sm2Result.nextReviewDate,
      interval: sm2Result.interval,
      easeFactor: sm2Result.easeFactor,
      repetitions: sm2Result.repetitions,
    },
    create: {
      problemId,
      status,
      timeSpentSecs: timeSpentSecs || 0,
      nextReviewDate: sm2Result.nextReviewDate,
      interval: sm2Result.interval,
      easeFactor: sm2Result.easeFactor,
      repetitions: sm2Result.repetitions,
    },
  });

  // Update DailyActivity
  const today = todayString();
  const activityUpdate: Record<string, unknown> = {};
  if (status === "solved" || status === "mastered") {
    activityUpdate.problemsSolved = { increment: 1 };
  } else {
    activityUpdate.problemsAttempted = { increment: 1 };
  }
  if (timeSpentSecs) {
    activityUpdate.minutesStudied = { increment: Math.ceil(timeSpentSecs / 60) };
  }

  await prisma.dailyActivity.upsert({
    where: { date: today },
    update: activityUpdate,
    create: {
      date: today,
      problemsSolved: status === "solved" || status === "mastered" ? 1 : 0,
      problemsAttempted: status === "attempted" ? 1 : 0,
      minutesStudied: timeSpentSecs ? Math.ceil(timeSpentSecs / 60) : 0,
    },
  });

  // Update streak
  await updateStreak(today);

  // Log event
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { title: true },
  });
  await logEvent("problem_" + action, problemId, problem?.title || `Problem ${problemId}`, {
    status,
    quality,
    nextReview: sm2Result.nextReviewDate.toISOString(),
  });

  return NextResponse.json(attempt);
}

async function updateStreak(today: string) {
  const yesterday = yesterdayString();

  let settings = await prisma.userSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { id: 1, dailyGoal: 3, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
    });
    return;
  }

  if (settings.lastActiveDate === today) {
    return; // Already active today
  }

  let newStreak: number;
  if (settings.lastActiveDate === yesterday) {
    newStreak = settings.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  await prisma.userSettings.update({
    where: { id: 1 },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, settings.longestStreak),
      lastActiveDate: today,
    },
  });
}

async function logEvent(type: string, entityId: number, entityName: string, metadata: Record<string, unknown>) {
  await prisma.studyEvent.create({
    data: {
      type,
      entityId,
      entityName,
      metadata: JSON.stringify(metadata),
    },
  });
}

export async function GET() {
  const [topicsStudied, problemsSolved, problemsAttempted, totalTopics, totalProblems] =
    await Promise.all([
      prisma.userProgress.count({ where: { completed: true } }),
      prisma.problemAttempt.count({ where: { status: { in: ["solved", "mastered"] } } }),
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
