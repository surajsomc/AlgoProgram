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
          let borderColor = "border-white/[0.08] hover:border-accent/40";
          let bgColor = "bg-white/[0.02]";
          let textColor = "text-gray-400";

          if (answered) {
            if (i === correctAnswer) {
              borderColor = "border-emerald-500/50";
              bgColor = "bg-emerald-500/10";
              textColor = "text-emerald-400";
            } else if (i === selected) {
              borderColor = "border-red-500/50";
              bgColor = "bg-red-500/10";
              textColor = "text-red-400";
            }
          } else if (i === selected) {
            borderColor = "border-accent/50";
            bgColor = "bg-accent/10";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 border ${borderColor} ${bgColor} ${textColor} text-sm transition-all duration-150`}
            >
              <span className="font-mono font-medium mr-2 text-gray-600">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`p-4 border text-sm animate-fadeIn ${
            selected === correctAnswer
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
              : "bg-amber-500/5 border-amber-500/20 text-amber-300"
          }`}
        >
          <p className="font-medium mb-1">
            {selected === correctAnswer ? "Correct." : "Not quite."}
          </p>
          <p className="text-gray-500">{explanation}</p>
        </div>
      )}
    </div>
  );
}
