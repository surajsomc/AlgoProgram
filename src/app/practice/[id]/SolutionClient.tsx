"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";

export default function SolutionClient({
  solution,
  explanation,
}: {
  solution: string;
  explanation: string;
}) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="mb-6">
      {!showSolution ? (
        <button
          onClick={() => setShowSolution(true)}
          className="btn-secondary w-full"
        >
          Show Solution
        </button>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">Solution</h3>
          <CodeBlock code={solution} />
          <div className="card bg-gray-900/50">
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">
              Why this approach?
            </h4>
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
