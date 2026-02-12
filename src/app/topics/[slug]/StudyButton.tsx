"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudyButton({ topicId }: { topicId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markStudied = async () => {
    setLoading(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, action: "study" }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={markStudied}
      disabled={loading}
      className="btn-primary mt-4"
    >
      {loading ? "Saving..." : "Mark as Studied"}
    </button>
  );
}
