"use client";

import { useState } from "react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

export default function QuizQuestion({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    onAnswer(index === correctAnswer);
  };

  return (
    <div className="card space-y-4">
      <p className="text-gray-200 font-medium leading-relaxed">{question}</p>

      <div className="space-y-2">
        {options.map((option, i) => {
          let borderColor = "border-gray-700 hover:border-gray-600";
          let bgColor = "bg-gray-800/50";
          let textColor = "text-gray-300";

          if (answered) {
            if (i === correctAnswer) {
              borderColor = "border-emerald-600";
              bgColor = "bg-emerald-900/20";
              textColor = "text-emerald-400";
            } else if (i === selected) {
              borderColor = "border-red-600";
              bgColor = "bg-red-900/20";
              textColor = "text-red-400";
            }
          } else if (i === selected) {
            borderColor = "border-indigo-600";
            bgColor = "bg-indigo-900/20";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border ${borderColor} ${bgColor} ${textColor} text-sm transition-colors`}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`p-4 rounded-lg border text-sm ${
            selected === correctAnswer
              ? "bg-emerald-900/20 border-emerald-800 text-emerald-300"
              : "bg-amber-900/20 border-amber-800 text-amber-300"
          }`}
        >
          <p className="font-medium mb-1">
            {selected === correctAnswer ? "Correct!" : "Not quite."}
          </p>
          <p className="text-gray-400">{explanation}</p>
        </div>
      )}
    </div>
  );
}
