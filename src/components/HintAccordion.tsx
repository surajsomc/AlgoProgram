"use client";

import { useState } from "react";

interface HintAccordionProps {
  hints: string[];
}

export default function HintAccordion({ hints }: HintAccordionProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400">Hints</h3>
      {hints.map((hint, i) => (
        <div key={i}>
          {i < revealedCount ? (
            <div className="bg-white/[0.03] border border-white/[0.06] p-3 text-sm text-gray-300">
              <span className="text-accent font-medium">Hint {i + 1}:</span>{" "}
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
            <div className="border border-white/[0.04] p-3 text-sm text-gray-700">
              Hint {i + 1} (locked)
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
