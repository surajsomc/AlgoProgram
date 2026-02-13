import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicSlug = searchParams.get("topicSlug");

  if (!topicSlug) {
    return NextResponse.json({ error: "topicSlug required" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: {
      concepts: {
        where: {
          flashcardFront: { not: "" },
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          flashcardFront: true,
          flashcardBack: true,
        },
      },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({
    topicName: topic.name,
    topicSlug: topic.slug,
    topicIcon: topic.icon,
    flashcards: topic.concepts,
  });
}
