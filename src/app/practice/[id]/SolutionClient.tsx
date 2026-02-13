"use client";

import { useState, useEffect } from "react";
import CodeBlock from "@/components/CodeBlock";

export default function SolutionClient({
  solution,
  explanation,
  timerExpired,
}: {
  solution: string;
  explanation: string;
  timerExpired?: boolean;
}) {
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (timerExpired) setShowSolution(true);
  }, [timerExpired]);

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
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-sm font-medium text-gray-400">Solution</h3>
          <CodeBlock code={solution} />
          <div className="card">
            <h4 className="text-sm font-medium text-accent mb-2">
              Why this approach?
            </h4>
            <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
