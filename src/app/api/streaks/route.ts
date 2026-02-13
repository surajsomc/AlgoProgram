import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { todayString } from "@/lib/sm2";

export async function GET() {
  let settings = await prisma.userSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { id: 1, dailyGoal: 3, currentStreak: 0, longestStreak: 0, lastActiveDate: "" },
    });
  }

  const today = todayString();
  const todayActivity = await prisma.dailyActivity.findUnique({
    where: { date: today },
  });

  return NextResponse.json({
    currentStreak: settings.currentStreak,
    longestStreak: settings.longestStreak,
    dailyGoal: settings.dailyGoal,
    todayActivity: todayActivity || {
      problemsSolved: 0,
      problemsAttempted: 0,
      quizzesTaken: 0,
      minutesStudied: 0,
    },
  });
}
