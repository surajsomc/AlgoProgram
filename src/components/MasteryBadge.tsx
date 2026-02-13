export default function MasteryBadge({ level }: { level?: string | null }) {
  if (level === "mastered") {
    return (
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-mono badge-mastered">
        ★
      </div>
    );
  }

  if (level === "solved") {
    return (
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        ✓
      </div>
    );
  }

  if (level === "attempted") {
    return (
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
        ~
      </div>
    );
  }

  return (
    <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-mono bg-white/[0.03] text-gray-600 border border-white/[0.06]">
      ·
    </div>
  );
}
