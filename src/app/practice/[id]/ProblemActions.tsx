"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProblemActions({
  problemId,
  currentStatus,
}: {
  problemId: number;
  currentStatus: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markAs = async (action: "solve" | "attempt") => {
    setLoading(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, action }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-3">
      {currentStatus !== "solved" && (
        <button
          onClick={() => markAs("solve")}
          disabled={loading}
          className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Saving..." : "Mark as Solved"}
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
      {currentStatus === "solved" && (
        <p className="text-emerald-400 text-sm font-medium py-2">
          You solved this problem!
        </p>
      )}
    </div>
  );
}
