import Link from "next/link";
import DifficultyBadge from "./DifficultyBadge";

interface ProblemCardProps {
  id: number;
  title: string;
  difficulty: string;
  pattern: string;
  status?: string;
}

export default function ProblemCard({
  id,
  title,
  difficulty,
  pattern,
  status,
}: ProblemCardProps) {
  return (
    <Link href={`/practice/${id}`}>
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors group">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm ${
              status === "solved"
                ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
                : status === "attempted"
                ? "bg-amber-900/50 text-amber-400 border border-amber-800"
                : "bg-gray-800 text-gray-500 border border-gray-700"
            }`}
          >
            {status === "solved" ? "✓" : status === "attempted" ? "~" : id}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-gray-200 group-hover:text-indigo-400 transition-colors truncate">
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{pattern}</p>
          </div>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>
    </Link>
  );
}
