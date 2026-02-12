"use client";

import { useState } from "react";

interface HintAccordionProps {
  hints: string[];
}

export default function HintAccordion({ hints }: HintAccordionProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Hints</h3>
      {hints.map((hint, i) => (
        <div key={i}>
          {i < revealedCount ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
              <span className="text-indigo-400 font-medium">Hint {i + 1}:</span>{" "}
              {hint}
            </div>
          ) : i === revealedCount ? (
            <button
              onClick={() => setRevealedCount(revealedCount + 1)}
              className="btn-secondary text-xs w-full"
            >
              Reveal Hint {i + 1} of {hints.length}
            </button>
          ) : (
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-3 text-sm text-gray-600">
              Hint {i + 1} (locked)
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
