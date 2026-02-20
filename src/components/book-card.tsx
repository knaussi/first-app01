import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RockRating } from "@/components/rock-rating";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function BookCard({ book }: BookCardProps) {
  const cardContent = (
    <Card className="flex flex-col overflow-hidden h-full bg-background border-gray-200">
      {/* Cover Image */}
      <div className="relative aspect-[2/3] w-full bg-muted">
        {book.image_url ? (
          <Image
            src={book.image_url}
            alt={`Cover von ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center p-4">
              <svg
                className="mx-auto h-12 w-12 mb-2 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span className="text-sm">Kein Cover</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-foreground">{book.author}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {book.genres && book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.genres.map((g) => (
              <span key={g} className="text-xs text-muted-foreground">{g}</span>
            ))}
          </div>
        )}

        {book.description && (
          <p className="text-sm text-foreground leading-relaxed !mt-5">
            {truncate(book.description, 150)}
          </p>
        )}

        <RockRating rating={book.rating} />
      </CardContent>
    </Card>
  );

  if (book.amazon_link) {
    return (
      <a
        href={book.amazon_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${book.title} bei Amazon kaufen`}
        className="block h-full hover:brightness-95 transition-all"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
