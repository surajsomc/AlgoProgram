"use client";

import { useState, useRef } from "react";
import Timer from "@/components/Timer";
import HintAccordion from "@/components/HintAccordion";
import AlgorithmPicker from "@/components/AlgorithmPicker";
import SolutionClient from "./SolutionClient";
import ProblemActions from "./ProblemActions";

export default function TimedPracticeWrapper({
  isTimed,
  minutes,
  problemId,
  solution,
  explanation,
  currentStatus,
  hints,
  examples,
  description,
  correctPattern,
}: {
  isTimed: boolean;
  minutes: number;
  problemId: number;
  solution: string;
  explanation: string;
  currentStatus: string | null;
  hints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  description: string;
  correctPattern: string;
}) {
  const [timerExpired, setTimerExpired] = useState(false);
  const mountTimeRef = useRef(Date.now());

  const getTimeSpent = () => Math.floor((Date.now() - mountTimeRef.current) / 1000);

  return (
    <>
      {/* Timer */}
      {isTimed && !timerExpired && (
        <Timer minutes={minutes} onExpire={() => setTimerExpired(true)} />
      )}
      {timerExpired && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Time is up! Solution has been revealed.
        </div>
      )}

      {/* Problem Description */}
      <div className="card mb-6">
        <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-gray-400">Examples</h3>
          {examples.map((ex, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/[0.06] p-4 text-sm"
            >
              <div className="mb-1">
                <span className="text-gray-600 font-mono text-xs">Input: </span>
                <code className="text-accent font-mono">{ex.input}</code>
              </div>
              <div className="mb-1">
                <span className="text-gray-600 font-mono text-xs">Output: </span>
                <code className="text-emerald-400 font-mono">{ex.output}</code>
              </div>
              {ex.explanation && (
                <div className="text-gray-600 mt-1 text-xs">
                  {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Algorithm Picker */}
      <AlgorithmPicker correctPattern={correctPattern} />

      {/* Hints */}
      {hints.length > 0 && (
        <div className="mb-6">
          <HintAccordion hints={hints} />
        </div>
      )}

      {/* Solution */}
      <SolutionClient
        solution={solution}
        explanation={explanation}
        timerExpired={timerExpired}
      />

      {/* Actions */}
      <ProblemActions
        problemId={problemId}
        currentStatus={currentStatus}
        getTimeSpent={getTimeSpent}
      />
    </>
  );
}
