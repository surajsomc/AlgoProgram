"use client";

import { useState, useMemo } from "react";

const ALL_PATTERNS = [
  "Hash Map / Hash Set",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Fast & Slow Pointers",
  "Linked List Reversal",
  "Monotonic Stack",
  "Stack (Matching/Parsing)",
  "BFS (Level Order)",
  "DFS (Recursive)",
  "Trie",
  "Heap / Top-K",
  "Graph BFS",
  "Graph DFS",
  "Topological Sort",
  "Union Find",
  "1D Dynamic Programming",
  "2D Dynamic Programming",
  "Backtracking",
  "Greedy",
  "Merge Intervals",
  "Bit Manipulation",
  "Math",
  "Prefix Sum",
  "Kadane's Algorithm",
  "Divide and Conquer",
  "Binary Search on Answer",
  "Sorting",
  "Design (Data Structure)",
  "Recursion",
];

interface AlgorithmPickerProps {
  correctPattern: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AlgorithmPicker({ correctPattern }: AlgorithmPickerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const revealed = selected !== null;

  const options = useMemo(() => {
    const wrong = shuffle(
      ALL_PATTERNS.filter(
        (p) => p.toLowerCase() !== correctPattern.toLowerCase()
      )
    ).slice(0, 3);
    return shuffle([correctPattern, ...wrong]);
  }, [correctPattern]);

  const isCorrect = selected === correctPattern;

  return (
    <div className="card mb-6 border-accent/15 bg-accent/[0.02]">
      <h3 className="text-sm font-medium text-accent mb-1">
        Which algorithm or data structure would you use?
      </h3>
      <p className="text-xs text-gray-600 mb-4">
        Read the problem above and pick the best approach
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => {
          const isThis = selected === option;
          const isAnswer = option === correctPattern;

          let cls =
            "text-left w-full px-4 py-3 border text-sm font-medium transition-all duration-150 ";

          if (!revealed) {
            cls +=
              "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-accent/40 hover:bg-accent/[0.04] hover:text-white cursor-pointer";
          } else if (isAnswer) {
            cls +=
              "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
          } else if (isThis && !isAnswer) {
            cls +=
              "border-red-500/50 bg-red-500/10 text-red-400";
          } else {
            cls += "border-white/[0.04] bg-transparent text-gray-700";
          }

          return (
            <button
              key={option}
              onClick={() => !revealed && setSelected(option)}
              disabled={revealed}
              className={cls}
            >
              {revealed && isAnswer && "✓ "}
              {revealed && isThis && !isAnswer && "✗ "}
              {option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className={`mt-4 p-3 text-sm border animate-fadeIn ${
            isCorrect
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/5 border-red-500/20 text-red-300"
          }`}
        >
          {isCorrect ? (
            <p>Correct. This problem uses <strong>{correctPattern}</strong>.</p>
          ) : (
            <p>
              Not quite. The best approach is <strong>{correctPattern}</strong>.
              Check the hints and solution below for why.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
