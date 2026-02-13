"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FlashcardDeck from "@/components/FlashcardDeck";

interface FlashcardData {
  topicName: string;
  topicSlug: string;
  topicIcon: string;
  flashcards: {
    id: number;
    title: string;
    flashcardFront: string;
    flashcardBack: string;
  }[];
}

export default function TopicFlashcardsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<FlashcardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/flashcards?topicSlug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="card text-center text-gray-600 py-12">Loading flashcards...</div>
      </div>
    );
  }

  if (!data || data.flashcards.length === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Flashcards</h1>
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No flashcards available for this topic yet.</p>
          <Link href={`/topics/${slug}`} className="btn-secondary">
            Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 font-mono">
        <Link href={`/topics/${slug}`} className="hover:text-accent transition-colors">
          {data.topicName}
        </Link>
        <span className="text-gray-800">/</span>
        <span className="text-gray-500">Flashcards</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
          {data.topicIcon} {data.topicName} Flashcards
        </h1>
        <p className="text-gray-600 text-sm">
          {data.flashcards.length} cards to review
        </p>
      </div>

      <FlashcardDeck cards={data.flashcards} />
    </div>
  );
}
