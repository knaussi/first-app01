"use client";

interface RockRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function RockRatingInput({
  value,
  onChange,
  disabled = false,
}: RockRatingInputProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Bewertung"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === ratingValue}
            aria-label={`${ratingValue} von 5`}
            className={`text-2xl leading-none transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-0.5 ${
              ratingValue <= value
                ? "opacity-100"
                : "opacity-25 grayscale"
            } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => {
              if (!disabled) {
                // Click same rating to deselect (set to 0)
                onChange(value === ratingValue ? 0 : ratingValue);
              }
            }}
            disabled={disabled}
          >
            🤘
          </button>
        );
      })}
      {value > 0 && (
        <span className="text-sm text-muted-foreground ml-2">
          {value}/5
        </span>
      )}
    </div>
  );
}
