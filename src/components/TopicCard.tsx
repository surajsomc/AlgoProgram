import Link from "next/link";

interface TopicCardProps {
  name: string;
  slug: string;
  description: string;
  icon: string;
  problemCount: number;
  solvedCount: number;
  isCompleted: boolean;
}

export default function TopicCard({
  name,
  slug,
  description,
  icon,
  problemCount,
  solvedCount,
  isCompleted,
}: TopicCardProps) {
  const progress = problemCount > 0 ? (solvedCount / problemCount) * 100 : 0;

  return (
    <Link href={`/topics/${slug}`}>
      <div className="card-hover cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <span className="text-2xl">{icon}</span>
          {isCompleted && (
            <span className="badge-easy">Studied</span>
          )}
        </div>
        <h3 className="text-[15px] font-semibold text-white mb-1 group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 font-mono">
            <span>
              {solvedCount}/{problemCount}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/[0.06] h-[3px]">
            <div
              className="bg-accent h-[3px] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
