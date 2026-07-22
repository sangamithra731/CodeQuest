const LEVELS = { Beginner: 1, Intermediate: 2, Advanced: 3 };

export default function DifficultyIcon({ difficulty = "Beginner" }) {
  const active = LEVELS[difficulty] || 1;
  const bars = [4, 7, 10]; // heights in px, ascending

  return (
    <svg width="14" height="10" viewBox="0 0 14 10" className="shrink-0">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 5}
          y={10 - h}
          width="3"
          height={h}
          fill={i < active ? "currentColor" : "currentColor"}
          opacity={i < active ? 1 : 0.25}
        />
      ))}
    </svg>
  );
}