interface RockRatingProps {
  rating: number; // 0-5
}

export function RockRating({ rating }: RockRatingProps) {
  if (rating === 0) {
    return (
      <span className="text-sm text-muted-foreground" aria-label="Noch nicht bewertet">
        Noch nicht bewertet
      </span>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Bewertung: ${rating} von 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-lg leading-none ${
            i < rating ? "opacity-100" : "opacity-25 grayscale"
          }`}
          aria-hidden="true"
        >
          🤘
        </span>
      ))}
    </div>
  );
}
