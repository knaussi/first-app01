import { Search } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { Book } from "@/lib/types";

interface BookGridProps {
  books: Book[];
  /** Whether filters are currently active (changes empty state message) */
  isFiltered?: boolean;
}

export function BookGrid({ books, isFiltered = false }: BookGridProps) {
  if (books.length === 0) {
    // Filtered empty state
    if (isFiltered) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search
            className="h-16 w-16 text-muted-foreground/50 mb-4"
            strokeWidth={1}
            aria-hidden="true"
          />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Keine Bücher gefunden
          </h2>
          <p className="text-sm text-muted-foreground/70">
            Versuche andere Filter oder setze die Suche zurück.
          </p>
        </div>
      );
    }

    // Default empty state (no books at all)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="h-16 w-16 text-muted-foreground/50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
        <h2 className="text-xl font-semibold text-muted-foreground mb-2">
          Noch keine Buecher vorhanden
        </h2>
        <p className="text-sm text-muted-foreground/70">
          Buecher werden hier angezeigt, sobald sie hinzugefuegt wurden.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
