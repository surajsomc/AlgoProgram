"use client";

const levels = ["All", "Easy", "Medium", "Hard"] as const;

export default function DifficultyFilter({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (level: string) => void;
}) {
  return (
    <div className="flex gap-px bg-white/[0.06] mb-6">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            selected === level
              ? level === "Easy"
                ? "bg-emerald-500/10 text-emerald-400"
                : level === "Medium"
                ? "bg-amber-500/10 text-amber-400"
                : level === "Hard"
                ? "bg-red-500/10 text-red-400"
                : "bg-accent/10 text-accent"
              : "bg-black text-gray-600 hover:text-gray-400 hover:bg-white/[0.03]"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
