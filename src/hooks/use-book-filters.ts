"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Book } from "@/lib/types";

export const GENRES = [
  "AlltimeFav",
  "Biografie",
  "Empfehlung",
  "English",
  "Kreativ",
  "Kunst",
  "Sachbuch",
  "Unterhaltung",
  "Sport",
] as const;

export type Genre = (typeof GENRES)[number];

export const RATING_OPTIONS = [
  { label: "Alle", value: 0 },
  { label: "🤘🤘🤘", value: 3 },
  { label: "🤘🤘🤘🤘", value: 4 },
  { label: "🤘🤘🤘🤘🤘", value: 5 },
] as const;

interface UseBookFiltersReturn {
  /** Current search query (debounced for filtering, raw for input) */
  searchQuery: string;
  /** Raw input value (updates immediately) */
  searchInput: string;
  /** Currently selected genres */
  selectedGenres: Genre[];
  /** Minimum rating filter (0 = all) */
  minRating: number;
  /** Whether any filter is active */
  hasActiveFilters: boolean;
  /** Filtered books */
  filteredBooks: Book[];
  /** Set the search input (debounced) */
  setSearchInput: (value: string) => void;
  /** Toggle a genre on/off */
  toggleGenre: (genre: Genre) => void;
  /** Set the minimum rating */
  setMinRating: (rating: number) => void;
  /** Remove a specific genre filter */
  removeGenre: (genre: Genre) => void;
  /** Clear the search query */
  clearSearch: () => void;
  /** Reset all filters */
  resetAll: () => void;
}

export function useBookFilters(books: Book[]): UseBookFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial state from URL
  const urlGenres = searchParams.get("genre")?.split(",").filter(Boolean) as Genre[] ?? [];
  const urlRating = Number(searchParams.get("rating")) || 0;
  const urlQuery = searchParams.get("q") ?? "";

  const [searchInput, setSearchInputState] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync debounced query to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "0") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const setSearchInput = useCallback((value: string) => {
    setSearchInputState(value);
  }, []);

  const toggleGenre = useCallback(
    (genre: Genre) => {
      const current = searchParams.get("genre")?.split(",").filter(Boolean) ?? [];
      const updated = current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre];
      updateURL({ genre: updated.length > 0 ? updated.join(",") : null });
    },
    [searchParams, updateURL]
  );

  const removeGenre = useCallback(
    (genre: Genre) => {
      const current = searchParams.get("genre")?.split(",").filter(Boolean) ?? [];
      const updated = current.filter((g) => g !== genre);
      updateURL({ genre: updated.length > 0 ? updated.join(",") : null });
    },
    [searchParams, updateURL]
  );

  const setMinRating = useCallback(
    (rating: number) => {
      updateURL({ rating: rating > 0 ? String(rating) : null });
    },
    [updateURL]
  );

  const clearSearch = useCallback(() => {
    setSearchInputState("");
    setDebouncedQuery("");
    updateURL({ q: null });
  }, [updateURL]);

  const resetAll = useCallback(() => {
    setSearchInputState("");
    setDebouncedQuery("");
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Filter books
  const filteredBooks = useMemo(() => {
    let result = books;

    // Genre filter
    if (urlGenres.length > 0) {
      result = result.filter(
        (book) => book.genre && urlGenres.includes(book.genre as Genre)
      );
    }

    // Rating filter
    if (urlRating > 0) {
      result = result.filter((book) => book.rating >= urlRating);
    }

    // Search filter (uses debounced query)
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    return result;
  }, [books, urlGenres, urlRating, debouncedQuery]);

  const hasActiveFilters = urlGenres.length > 0 || urlRating > 0 || debouncedQuery !== "";

  return {
    searchQuery: debouncedQuery,
    searchInput,
    selectedGenres: urlGenres,
    minRating: urlRating,
    hasActiveFilters,
    filteredBooks,
    setSearchInput,
    toggleGenre,
    setMinRating,
    removeGenre,
    clearSearch,
    resetAll,
  };
}
