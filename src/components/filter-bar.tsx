"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GENRES, RATING_OPTIONS, Genre } from "@/hooks/use-book-filters";

interface FilterBarProps {
  searchInput: string;
  selectedGenres: Genre[];
  minRating: number;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onToggleGenre: (genre: Genre) => void;
  onRemoveGenre: (genre: Genre) => void;
  onSetMinRating: (rating: number) => void;
  onClearSearch: () => void;
  onResetAll: () => void;
}

export function FilterBar({
  searchInput,
  selectedGenres,
  minRating,
  hasActiveFilters,
  resultCount,
  totalCount,
  onSearchChange,
  onToggleGenre,
  onRemoveGenre,
  onSetMinRating,
  onClearSearch,
  onResetAll,
}: FilterBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open search if there's already a value (e.g. on filter reset restore)
  useEffect(() => {
    if (searchInput) setSearchOpen(true);
  }, [searchInput]);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearchIconClick = () => {
    if (searchOpen && !searchInput) {
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search icon + Rating in one row */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Rating Filter */}
        <div className="flex flex-wrap gap-2 items-center">
        {RATING_OPTIONS.map((option) => {
          const isSelected = minRating === option.value;
          return (
            <Badge
              key={option.value}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground text-sm px-3 py-1"
              onClick={() => onSetMinRating(option.value)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSetMinRating(option.value);
                }
              }}
            >
              {option.label}
            </Badge>
          );
        })}
      </div>

        {/* Search */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleSearchIconClick}
            aria-label="Suche öffnen"
            className="text-foreground hover:opacity-70 transition-opacity"
          >
            <Search className="h-5 w-5" />
          </button>
          {searchOpen && (
            <div className="relative">
              <Input
                ref={inputRef}
                type="search"
                placeholder="Suche..."
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-3 pr-8 h-10 text-base w-56"
                aria-label="Bücher durchsuchen"
              />
              {searchInput && (
                <button
                  onClick={() => { onClearSearch(); setSearchOpen(false); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Suche leeren"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Genre Chips */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedGenres.length === 0 ? "default" : "outline"}
            className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground text-sm px-3 py-1"
            onClick={() => {
              selectedGenres.forEach((g) => onRemoveGenre(g));
            }}
            role="checkbox"
            aria-checked={selectedGenres.length === 0}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectedGenres.forEach((g) => onRemoveGenre(g));
              }
            }}
          >
            Alle
          </Badge>
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Badge
                key={genre}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground text-sm px-3 py-1"
                onClick={() => onToggleGenre(genre)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleGenre(genre);
                  }
                }}
              >
                {genre}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Active Filters & Result Count */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">
            {resultCount} von {totalCount} Büchern
          </span>
          <div className="flex-1" />

          {/* Active genre chips */}
          {selectedGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <button
                onClick={() => onRemoveGenre(genre)}
                aria-label={`Filter ${genre} entfernen`}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Active rating chip */}
          {minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {minRating}+ {"\u{1F918}"}
              <button
                onClick={() => onSetMinRating(0)}
                aria-label="Bewertungsfilter entfernen"
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Active search chip */}
          {searchInput.trim() && (
            <Badge variant="secondary" className="gap-1">
              &ldquo;{searchInput.trim()}&rdquo;
              <button
                onClick={onClearSearch}
                aria-label="Suchfilter entfernen"
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Alle zurücksetzen
          </Button>
        </div>
      )}
    </div>
  );
}
