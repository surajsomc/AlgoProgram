import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const problemId = searchParams.get("problemId");
  const conceptId = searchParams.get("conceptId");

  if (problemId) {
    const note = await prisma.note.findUnique({
      where: { problemId: parseInt(problemId) },
    });
    return NextResponse.json(note);
  }

  if (conceptId) {
    const note = await prisma.note.findUnique({
      where: { conceptId: parseInt(conceptId) },
    });
    return NextResponse.json(note);
  }

  return NextResponse.json({ error: "problemId or conceptId required" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const { problemId, conceptId, content } = await request.json();

  if (!content && content !== "") {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  if (problemId) {
    const note = await prisma.note.upsert({
      where: { problemId },
      update: { content },
      create: { problemId, content },
    });
    return NextResponse.json(note);
  }

  if (conceptId) {
    const note = await prisma.note.upsert({
      where: { conceptId },
      update: { content },
      create: { conceptId, content },
    });
    return NextResponse.json(note);
  }

  return NextResponse.json({ error: "problemId or conceptId required" }, { status: 400 });
}
