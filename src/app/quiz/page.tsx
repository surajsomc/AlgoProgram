"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const patternPerformanceRef = useRef<Record<string, { correct: number; total: number }>>({});

  const fetchQuestions = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setFinished(false);
    patternPerformanceRef.current = {};
    const res = await fetch("/api/quiz?count=10");
    const data = await res.json();
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);

    // Track per-pattern performance
    const current = questions[currentIndex];
    if (current) {
      const correctPattern = current.options[current.correctAnswer];
      if (!patternPerformanceRef.current[correctPattern]) {
        patternPerformanceRef.current[correctPattern] = { correct: 0, total: 0 };
      }
      patternPerformanceRef.current[correctPattern].total += 1;
      if (correct) {
        patternPerformanceRef.current[correctPattern].correct += 1;
      }
    }
  }, [questions, currentIndex]);

  const saveQuizResults = useCallback(async () => {
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          total: questions.length,
          patternPerformance: patternPerformanceRef.current,
        }),
      });
    } catch {
      // silent
    }
  }, [score, questions.length]);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      saveQuizResults();
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Quiz Mode</h1>
        <div className="card text-center text-gray-600 py-12">
          Loading questions...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Quiz Mode</h1>
        <div className="card text-center text-gray-600 py-12">
          No questions available. Seed the database first.
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const patternPerf = patternPerformanceRef.current;
    const patterns = Object.entries(patternPerf).sort(
      (a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total)
    );

    return (
      <div className="max-w-3xl animate-fadeIn">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">Quiz Complete</h1>
        <div className="card text-center py-10 mb-6">
          <p className="text-6xl font-bold mb-3 tracking-tight">
            <span
              className={
                percentage >= 70 ? "text-emerald-400" : percentage >= 40 ? "text-amber-400" : "text-red-400"
              }
            >
              {score}/{questions.length}
            </span>
          </p>
          <p className="text-gray-500 mb-1 font-mono text-sm">{percentage}%</p>
          <p className="text-sm text-gray-600 mb-8">
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

        {/* Pattern Breakdown */}
        {patterns.length > 0 && (
          <div className="card">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Pattern Breakdown</h3>
            <div className="space-y-2">
              {patterns.map(([pattern, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
                const textColor = pct >= 70 ? "text-emerald-400" : pct >= 40 ? "text-amber-400" : "text-red-400";
                return (
                  <div key={pattern} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-36 truncate font-mono">{pattern}</span>
                    <div className="flex-1 h-2 bg-white/[0.06]">
                      <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-xs font-mono ${textColor} w-16 text-right`}>
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Quiz Mode
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Identify the right algorithm pattern for each problem
          </p>
        </div>
        <div className="flex sm:flex-col sm:text-right gap-3 sm:gap-0">
          <p className="text-xs text-gray-600 font-mono">
            {currentIndex + 1}/{questions.length}
          </p>
          <p className="text-sm sm:text-lg font-bold text-accent font-mono">
            {score}/{answered}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/[0.06] h-px mb-8">
        <div
          className="bg-accent h-px transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Topic + Difficulty */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-600 bg-white/[0.03] px-2 py-0.5 border border-white/[0.06] font-mono">
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

      <div className="mt-6 flex justify-end">
        <button onClick={nextQuestion} className="btn-primary">
          {currentIndex < questions.length - 1
            ? "Next Question →"
            : "See Results"}
        </button>
      </div>
    </div>
  );
}
