import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await prisma.dailyActivity.findMany({
    orderBy: { date: "asc" },
    take: 365,
  });

  return NextResponse.json(activities);
}
