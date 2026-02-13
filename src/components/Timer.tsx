"use client";

import { useState, useEffect, useCallback } from "react";

export default function Timer({
  minutes,
  onExpire,
}: {
  minutes: number;
  onExpire: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const totalSeconds = minutes * 60;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const percentage = (secondsLeft / totalSeconds) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const getColor = useCallback(() => {
    if (percentage > 50) return "bg-emerald-500";
    if (percentage > 20) return "bg-amber-500";
    return "bg-red-500";
  }, [percentage]);

  const pulse = secondsLeft <= 60 && secondsLeft > 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">Time Remaining</span>
        <span className={`text-sm font-mono font-bold ${
          percentage > 50 ? "text-emerald-400" : percentage > 20 ? "text-amber-400" : "text-red-400"
        } ${pulse ? "animate-pulse" : ""}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${getColor()} ${pulse ? "animate-pulse" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
