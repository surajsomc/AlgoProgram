import Link from "next/link";

interface PatternCardProps {
  pattern: string;
  description: string;
  signals: string[];
  topicSlug: string;
  topicName: string;
}

export default function PatternCard({
  pattern,
  description,
  signals,
  topicSlug,
  topicName,
}: PatternCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-indigo-400">{pattern}</h3>
        <Link
          href={`/topics/${topicSlug}`}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {topicName} →
        </Link>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
          When you see:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {signals.map((signal, i) => (
            <span
              key={i}
              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
