import Link from "next/link";
import DifficultyBadge from "./DifficultyBadge";
import MasteryBadge from "./MasteryBadge";

interface ProblemCardProps {
  id: number;
  title: string;
  difficulty: string;
  pattern: string;
  status?: string;
  isBookmarked?: boolean;
  hasNote?: boolean;
  masteryLevel?: string;
}

export default function ProblemCard({
  id,
  title,
  difficulty,
  pattern,
  status,
  isBookmarked,
  hasNote,
  masteryLevel,
}: ProblemCardProps) {
  const level = masteryLevel || status;

  return (
    <Link href={`/practice/${id}`}>
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-150 group">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <MasteryBadge level={level} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-medium text-gray-300 group-hover:text-accent transition-colors truncate">
                {title}
              </h4>
              {isBookmarked && (
                <span className="text-amber-400 text-xs flex-shrink-0" title="Bookmarked">★</span>
              )}
              {hasNote && (
                <span className="text-gray-500 text-xs flex-shrink-0" title="Has notes">✎</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-0.5 truncate font-mono">{pattern}</p>
          </div>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>
    </Link>
  );
}
