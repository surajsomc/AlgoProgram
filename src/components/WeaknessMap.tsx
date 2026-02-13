"use client";

import { useState, useEffect } from "react";

interface Weakness {
  pattern: string;
  correct: number;
  total: number;
  accuracy: number;
}

export default function WeaknessMap() {
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weakness")
      .then((r) => r.json())
      .then((data) => {
        setWeaknesses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-600">Loading weakness data...</div>
    );
  }

  if (weaknesses.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-600 text-sm">
        Complete problems and quizzes to see your weakest patterns.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {weaknesses.slice(0, 10).map((w) => {
        const barColor =
          w.accuracy < 40
            ? "bg-red-500"
            : w.accuracy < 70
            ? "bg-amber-500"
            : "bg-emerald-500";
        const textColor =
          w.accuracy < 40
            ? "text-red-400"
            : w.accuracy < 70
            ? "text-amber-400"
            : "text-emerald-400";

        return (
          <div key={w.pattern} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-36 truncate font-mono">
              {w.pattern}
            </span>
            <div className="flex-1 h-2 bg-white/[0.06]">
              <div
                className={`h-full ${barColor} transition-all duration-300`}
                style={{ width: `${w.accuracy}%` }}
              />
            </div>
            <span className={`text-xs font-mono ${textColor} w-10 text-right`}>
              {w.accuracy}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
