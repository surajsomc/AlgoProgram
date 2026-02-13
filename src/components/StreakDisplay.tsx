"use client";

import { useState, useEffect } from "react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  todayActivity: {
    problemsSolved: number;
    problemsAttempted: number;
    quizzesTaken: number;
    minutesStudied: number;
  };
}

export default function StreakDisplay() {
  const [data, setData] = useState<StreakData | null>(null);

  useEffect(() => {
    fetch("/api/streaks")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="bg-black p-6">
        <p className="text-xs text-gray-600 uppercase tracking-[0.15em] font-mono mb-3">Streak</p>
        <p className="text-4xl font-bold text-gray-700 tracking-tight">--</p>
      </div>
    );
  }

  const todaySolved = data.todayActivity.problemsSolved;
  const progress = Math.min(100, (todaySolved / data.dailyGoal) * 100);

  return (
    <div className="bg-black p-6">
      <p className="text-xs text-gray-600 uppercase tracking-[0.15em] font-mono mb-3">Streak</p>
      <p className="text-4xl font-bold text-accent tracking-tight">
        {data.currentStreak}
        <span className="text-lg text-gray-700 font-normal"> days</span>
      </p>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 font-mono">{todaySolved}/{data.dailyGoal} today</span>
        </div>
        <div className="w-full h-1 bg-white/[0.06]">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
