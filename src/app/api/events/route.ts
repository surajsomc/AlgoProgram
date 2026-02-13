import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await prisma.studyEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(events);
}
