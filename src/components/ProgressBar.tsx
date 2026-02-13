interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  size?: "sm" | "md";
}

export default function ProgressBar({
  value,
  max,
  label,
  size = "sm",
}: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const height = size === "sm" ? "h-[3px]" : "h-1";

  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{label}</span>
          <span>
            {value}/{max} ({percent}%)
          </span>
        </div>
      )}
      <div className={`w-full bg-white/[0.06] ${height}`}>
        <div
          className={`bg-accent ${height} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
