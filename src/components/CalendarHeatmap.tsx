"use client";

import { useState, useEffect, useMemo } from "react";

interface DayActivity {
  date: string;
  problemsSolved: number;
  problemsAttempted: number;
  quizzesTaken: number;
  minutesStudied: number;
}

export default function CalendarHeatmap() {
  const [activities, setActivities] = useState<DayActivity[]>([]);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then(setActivities)
      .catch(() => {});
  }, []);

  const { grid, months } = useMemo(() => {
    const activityMap = new Map<string, number>();
    for (const a of activities) {
      const total = a.problemsSolved + a.problemsAttempted + a.quizzesTaken;
      activityMap.set(a.date, total);
    }

    // Build 52 weeks x 7 days grid going backwards from today
    const today = new Date();
    const cells: { date: string; level: number }[] = [];
    const monthLabels: { label: string; col: number }[] = [];

    // Start from 52*7 days ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 52 * 7 + 1);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let lastMonth = -1;
    for (let i = 0; i < 52 * 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = activityMap.get(dateStr) || 0;
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
      cells.push({ date: dateStr, level });

      const month = d.getMonth();
      const week = Math.floor(i / 7);
      if (month !== lastMonth && d.getDay() === 0) {
        monthLabels.push({
          label: d.toLocaleString("default", { month: "short" }),
          col: week,
        });
        lastMonth = month;
      }
    }

    return { grid: cells, months: monthLabels };
  }, [activities]);

  const colorForLevel = (level: number) => {
    switch (level) {
      case 0: return "bg-white/[0.03]";
      case 1: return "bg-accent/20";
      case 2: return "bg-accent/40";
      case 3: return "bg-accent/60";
      case 4: return "bg-accent";
      default: return "bg-white/[0.03]";
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-4">Activity</h3>
      {/* Month labels */}
      <div className="flex gap-0 mb-1 ml-0" style={{ fontSize: 0 }}>
        {months.map((m, i) => (
          <span
            key={i}
            className="text-[10px] text-gray-700 font-mono inline-block"
            style={{ marginLeft: i === 0 ? 0 : `${(m.col - (i > 0 ? months[i - 1].col : 0) - 1) * 13}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>
      {/* Grid: 7 rows x 52 cols */}
      <div className="flex gap-[2px]">
        {Array.from({ length: 52 }, (_, week) => (
          <div key={week} className="flex flex-col gap-[2px]">
            {Array.from({ length: 7 }, (_, day) => {
              const idx = week * 7 + day;
              const cell = grid[idx];
              if (!cell) return <div key={day} className="w-[11px] h-[11px]" />;
              return (
                <div
                  key={day}
                  className={`w-[11px] h-[11px] ${colorForLevel(cell.level)}`}
                  title={`${cell.date}: ${cell.level > 0 ? cell.level + " activities" : "No activity"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 mt-3">
        <span className="text-[10px] text-gray-700 mr-1">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={`w-[11px] h-[11px] ${colorForLevel(level)}`} />
        ))}
        <span className="text-[10px] text-gray-700 ml-1">More</span>
      </div>
    </div>
  );
}
