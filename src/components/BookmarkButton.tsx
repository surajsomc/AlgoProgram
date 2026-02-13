"use client";

import { useState } from "react";

export default function BookmarkButton({
  problemId,
  initialBookmarked = false,
}: {
  problemId: number;
  initialBookmarked?: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    setBookmarked(!bookmarked);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });
      const data = await res.json();
      setBookmarked(data.bookmarked);
    } catch {
      setBookmarked(bookmarked);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1.5 transition-colors ${
        bookmarked ? "text-amber-400" : "text-gray-600 hover:text-gray-400"
      }`}
      title={bookmarked ? "Remove bookmark" : "Bookmark this problem"}
    >
      <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    </button>
  );
}
