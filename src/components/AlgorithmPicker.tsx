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
    <div className="card mb-6 border-indigo-500/20 bg-indigo-950/10">
      <h3 className="text-sm font-semibold text-indigo-400 mb-1">
        Which algorithm or data structure would you use?
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Read the problem above and pick the best approach
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => {
          const isThis = selected === option;
          const isAnswer = option === correctPattern;

          let cls =
            "text-left w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all ";

          if (!revealed) {
            cls +=
              "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-indigo-500 hover:bg-indigo-950/30 hover:text-white cursor-pointer";
          } else if (isAnswer) {
            cls +=
              "border-emerald-600 bg-emerald-900/30 text-emerald-400";
          } else if (isThis && !isAnswer) {
            cls +=
              "border-red-600 bg-red-900/30 text-red-400";
          } else {
            cls += "border-gray-800 bg-gray-900/50 text-gray-600";
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
          className={`mt-4 p-3 rounded-lg text-sm ${
            isCorrect
              ? "bg-emerald-900/20 border border-emerald-800 text-emerald-300"
              : "bg-red-900/20 border border-red-800 text-red-300"
          }`}
        >
          {isCorrect ? (
            <p>Correct! This problem uses <strong>{correctPattern}</strong>.</p>
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
