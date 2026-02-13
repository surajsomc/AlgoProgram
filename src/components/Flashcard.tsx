"use client";

import { useState } from "react";

export default function Flashcard({
  front,
  back,
  title,
}: {
  front: string;
  back: string;
  title?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        <div className="flip-card-front card border-l-2 border-l-accent p-6 sm:p-8">
          {title && (
            <p className="text-xs text-gray-600 font-mono mb-3 uppercase tracking-wider">{title}</p>
          )}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-wrap">{front}</p>
          <p className="text-xs text-gray-700 mt-4 font-mono">Click to flip</p>
        </div>
        <div className="flip-card-back card border-l-2 border-l-emerald-500 p-6 sm:p-8">
          {title && (
            <p className="text-xs text-emerald-500/60 font-mono mb-3 uppercase tracking-wider">{title}</p>
          )}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-wrap">{back}</p>
          <p className="text-xs text-gray-700 mt-4 font-mono">Click to flip back</p>
        </div>
      </div>
    </div>
  );
}
