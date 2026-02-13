"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProblemActions({
  problemId,
  currentStatus,
  getTimeSpent,
}: {
  problemId: number;
  currentStatus: string | null;
  getTimeSpent?: () => number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markAs = async (action: "solve" | "attempt" | "mastered") => {
    setLoading(true);
    const timeSpentSecs = getTimeSpent ? getTimeSpent() : 0;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, action, timeSpentSecs }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {currentStatus !== "solved" && currentStatus !== "mastered" && (
        <button
          onClick={() => markAs("solve")}
          disabled={loading}
          className="btn-success"
        >
          {loading ? "Saving..." : "Mark as Solved"}
        </button>
      )}
      {currentStatus === "solved" && (
        <button
          onClick={() => markAs("mastered")}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Saving..." : "Mark as Mastered"}
        </button>
      )}
      {!currentStatus && (
        <button
          onClick={() => markAs("attempt")}
          disabled={loading}
          className="btn-secondary"
        >
          Mark as Attempted
        </button>
      )}
      {currentStatus === "mastered" && (
        <p className="text-accent text-sm font-medium py-2">
          You&apos;ve mastered this problem!
        </p>
      )}
      {currentStatus === "solved" && (
        <p className="text-emerald-400 text-sm font-medium py-2">
          Solved! Mark as mastered when you can solve it quickly.
        </p>
      )}
    </div>
  );
}
