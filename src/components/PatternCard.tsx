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
    <div className="card-hover">
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-[15px] font-semibold text-accent">{pattern}</h3>
        <Link
          href={`/topics/${topicSlug}`}
          className="text-xs text-gray-600 hover:text-accent transition-colors shrink-0"
        >
          {topicName} →
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{description}</p>
      <div>
        <p className="text-[10px] font-medium text-gray-600 mb-2 uppercase tracking-[0.15em] font-mono">
          Signals
        </p>
        <div className="flex flex-wrap gap-1.5">
          {signals.map((signal, i) => (
            <span
              key={i}
              className="text-xs bg-white/[0.04] text-gray-400 px-2 py-0.5 border border-white/[0.06]"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
