import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const bookmarks = await prisma.bookmark.findMany({
    include: {
      problem: {
        include: {
          topic: { select: { name: true, slug: true } },
          attempts: { select: { status: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(request: NextRequest) {
  const { problemId } = await request.json();

  if (!problemId) {
    return NextResponse.json({ error: "problemId required" }, { status: 400 });
  }

  const existing = await prisma.bookmark.findUnique({
    where: { problemId },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { problemId } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({ data: { problemId } });
  return NextResponse.json({ bookmarked: true });
}
