"use client";

import { useState, useCallback } from "react";
import Flashcard from "./Flashcard";

interface FlashcardItem {
  id: number;
  title: string;
  flashcardFront: string;
  flashcardBack: string;
}

export default function FlashcardDeck({ cards }: { cards: FlashcardItem[] }) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);

  const shuffle = useCallback(() => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
  }, [deck]);

  if (deck.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-600">
        No flashcards available for this topic.
      </div>
    );
  }

  const current = deck[index];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 font-mono">
          {index + 1} / {deck.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={shuffle}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            Shuffle
          </button>
        </div>
      </div>

      <Flashcard
        key={`${current.id}-${index}`}
        front={current.flashcardFront}
        back={current.flashcardBack}
        title={current.title}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="btn-secondary disabled:opacity-30"
        >
          Previous
        </button>
        <button
          onClick={() => setIndex(Math.min(deck.length - 1, index + 1))}
          disabled={index === deck.length - 1}
          className="btn-primary disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-px bg-white/[0.06] mt-6">
        <div
          className="bg-accent h-px transition-all duration-300"
          style={{ width: `${((index + 1) / deck.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
