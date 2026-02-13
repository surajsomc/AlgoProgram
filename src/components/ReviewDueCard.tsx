import Link from "next/link";
import DifficultyBadge from "./DifficultyBadge";
import MasteryBadge from "./MasteryBadge";

interface ReviewDueCardProps {
  id: number;
  title: string;
  difficulty: string;
  pattern: string;
  status: string;
  interval: number;
  nextReviewDate: string;
  topicName: string;
}

export default function ReviewDueCard({
  id,
  title,
  difficulty,
  pattern,
  status,
  interval,
  topicName,
}: ReviewDueCardProps) {
  return (
    <Link href={`/practice/${id}`}>
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-150 group">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <MasteryBadge level={status} />
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-gray-300 group-hover:text-accent transition-colors truncate">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-600 truncate font-mono">{pattern}</p>
              <span className="text-xs text-gray-700">·</span>
              <p className="text-xs text-gray-600 truncate">{topicName}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-gray-600 font-mono">
            {interval < 1 ? "new" : `${Math.round(interval)}d interval`}
          </span>
          <DifficultyBadge difficulty={difficulty} />
        </div>
      </div>
    </Link>
  );
}
