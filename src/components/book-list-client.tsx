"use client";

import { Suspense } from "react";
import { Book } from "@/lib/types";
import { useBookFilters } from "@/hooks/use-book-filters";
import { FilterBar } from "@/components/filter-bar";
import { BookGrid } from "@/components/book-grid";

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
      <BookGrid books={filteredBooks} isFiltered={hasActiveFilters} />
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
