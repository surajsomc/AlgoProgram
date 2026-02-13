"use client";

import { useState, useEffect } from "react";

interface Event {
  id: number;
  type: string;
  entityName: string;
  metadata: string;
  createdAt: string;
}

const eventIcons: Record<string, string> = {
  problem_solve: "✓",
  problem_attempt: "~",
  problem_mastered: "★",
  quiz_completed: "Q",
  topic_studied: "📖",
};

export default function StudyTimeline() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  if (events.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-600 text-sm">
        Your study activity will appear here.
      </div>
    );
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-0">
      {events.slice(0, 10).map((event) => (
        <div
          key={event.id}
          className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
        >
          <div className="w-7 h-7 flex items-center justify-center text-xs bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
            {eventIcons[event.type] || "·"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 truncate">{event.entityName}</p>
          </div>
          <span className="text-[11px] text-gray-700 font-mono flex-shrink-0">
            {formatTime(event.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
