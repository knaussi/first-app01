"use client";

import { Suspense, useState, useEffect } from "react";
import { Book } from "@/lib/types";
import { useBookFilters } from "@/hooks/use-book-filters";
import { FilterBar } from "@/components/filter-bar";
import { BookGrid } from "@/components/book-grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 60;

interface BookListClientProps {
  books: Book[];
}

function BookListClientInner({ books }: BookListClientProps) {
  const {
    searchInput,
    selectedGenres,
    minRating,
    hasActiveFilters,
    filteredBooks,
    setSearchInput,
    toggleGenre,
    removeGenre,
    setMinRating,
    clearSearch,
    resetAll,
  } = useBookFilters(books);

  const [page, setPage] = useState(1);

  // Reset to page 1 when filters change
  // selectedGenres.join() converts array to stable string for comparison
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, [searchInput, selectedGenres.join(","), minRating]);

  const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);
  const pageBooks = filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <FilterBar
        searchInput={searchInput}
        selectedGenres={selectedGenres}
        minRating={minRating}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredBooks.length}
        totalCount={books.length}
        onSearchChange={setSearchInput}
        onToggleGenre={toggleGenre}
        onRemoveGenre={removeGenre}
        onSetMinRating={setMinRating}
        onClearSearch={clearSearch}
        onResetAll={resetAll}
      />
      <BookGrid books={pageBooks} isFiltered={hasActiveFilters} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
          <span className="text-sm text-muted-foreground">
            Seite {page} von {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={page === totalPages}
          >
            Weiter
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </>
  );
}

export function BookListClient({ books }: BookListClientProps) {
  return (
    <Suspense fallback={<BookGrid books={books} isFiltered={false} />}>
      <BookListClientInner books={books} />
    </Suspense>
  );
}
