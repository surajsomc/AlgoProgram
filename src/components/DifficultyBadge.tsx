interface DifficultyBadgeProps {
  difficulty: string;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const className =
    difficulty === "Easy"
      ? "badge-easy"
      : difficulty === "Medium"
      ? "badge-medium"
      : "badge-hard";

  return <span className={className}>{difficulty}</span>;
}
