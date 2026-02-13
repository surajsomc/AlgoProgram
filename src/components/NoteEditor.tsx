"use client";

import { useState, useRef, useCallback } from "react";

export default function NoteEditor({
  problemId,
  conceptId,
  initialContent = "",
}: {
  problemId?: number;
  conceptId?: number;
  initialContent?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(async (text: string) => {
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problemId || undefined,
          conceptId: conceptId || undefined,
          content: text,
        }),
      });
      setSaved(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaved(false), 2000);
    } catch {
      // silent fail
    }
  }, [problemId, conceptId]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-wider">Notes</p>
        {saved && (
          <span className="text-xs text-emerald-400 animate-fadeIn">Saved</span>
        )}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => save(content)}
        placeholder="Add your notes here..."
        className="w-full bg-white/[0.03] border border-white/[0.06] p-3 text-sm text-gray-300 placeholder-gray-700 resize-y min-h-[80px] focus:outline-none focus:border-accent/30 transition-colors"
        rows={3}
      />
    </div>
  );
}
