"use client";

import { useState, useEffect } from "react";
import QuizQuestion from "@/components/QuizQuestion";

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topicName: string;
  difficulty: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setFinished(false);
    const res = await fetch("/api/quiz?count=10");
    const data = await res.json();
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Mode</h1>
        <div className="card text-center text-gray-400 py-12">
          Loading questions...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Mode</h1>
        <div className="card text-center text-gray-400 py-12">
          No questions available. Seed the database first.
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Complete!</h1>
        <div className="card text-center py-8">
          <p className="text-5xl font-bold mb-2">
            <span
              className={
                percentage >= 70 ? "text-emerald-400" : percentage >= 40 ? "text-amber-400" : "text-red-400"
              }
            >
              {score}/{questions.length}
            </span>
          </p>
          <p className="text-gray-400 mb-1">{percentage}% correct</p>
          <p className="text-sm text-gray-500 mb-6">
            {percentage >= 70
              ? "Great job! You're getting the hang of pattern recognition."
              : percentage >= 40
              ? "Good effort! Review the patterns you missed."
              : "Keep practicing! Check the Pattern Guide for help."}
          </p>
          <button onClick={fetchQuestions} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quiz Mode</h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Identify the right algorithm pattern for each problem
          </p>
        </div>
        <div className="flex sm:flex-col sm:text-right gap-3 sm:gap-0">
          <p className="text-xs sm:text-sm text-gray-400">
            Question {currentIndex + 1}/{questions.length}
          </p>
          <p className="text-sm sm:text-lg font-bold text-indigo-400">
            Score: {score}/{answered}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Topic + Difficulty */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
          {current.topicName}
        </span>
        <span
          className={
            current.difficulty === "Easy"
              ? "badge-easy"
              : current.difficulty === "Medium"
              ? "badge-medium"
              : "badge-hard"
          }
        >
          {current.difficulty}
        </span>
      </div>

      <QuizQuestion
        key={current.id}
        question={current.question}
        options={current.options}
        correctAnswer={current.correctAnswer}
        explanation={current.explanation}
        onAnswer={handleAnswer}
      />

      <div className="mt-4 flex justify-end">
        <button onClick={nextQuestion} className="btn-primary">
          {currentIndex < questions.length - 1
            ? "Next Question →"
            : "See Results"}
        </button>
      </div>
    </div>
  );
}
