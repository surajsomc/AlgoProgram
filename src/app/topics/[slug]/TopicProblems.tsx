"use client";

import { useState } from "react";
import ProblemCard from "@/components/ProblemCard";
import DifficultyFilter from "@/components/DifficultyFilter";

interface ProblemData {
  id: number;
  title: string;
  difficulty: string;
  pattern: string;
  status?: string;
  isBookmarked?: boolean;
  hasNote?: boolean;
}

export default function TopicProblems({ problems }: { problems: ProblemData[] }) {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? problems
    : problems.filter((p) => p.difficulty === filter);

  return (
    <>
      <DifficultyFilter selected={filter} onChange={setFilter} />
      <div className="space-y-px">
        {filtered.map((problem) => (
          <ProblemCard
            key={problem.id}
            id={problem.id}
            title={problem.title}
            difficulty={problem.difficulty}
            pattern={problem.pattern}
            status={problem.status}
            isBookmarked={problem.isBookmarked}
            hasNote={problem.hasNote}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-600 py-4">No {filter.toLowerCase()} problems in this topic.</p>
        )}
      </div>
    </>
  );
}
