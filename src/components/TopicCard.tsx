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
      <div className="card hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{icon}</span>
          {isCompleted && (
            <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
              Studied
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {solvedCount}/{problemCount} problems
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
