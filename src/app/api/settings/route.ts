import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  let settings = await prisma.userSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { id: 1, dailyGoal: 3, currentStreak: 0, longestStreak: 0, lastActiveDate: "" },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { dailyGoal } = await request.json();

  const settings = await prisma.userSettings.upsert({
    where: { id: 1 },
    update: { dailyGoal },
    create: { id: 1, dailyGoal, currentStreak: 0, longestStreak: 0, lastActiveDate: "" },
  });

  return NextResponse.json(settings);
}
