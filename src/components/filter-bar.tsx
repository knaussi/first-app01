"use client";

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
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Suche nach Titel oder Autor..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
          aria-label="Bücher durchsuchen"
        />
        {searchInput && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Suche leeren"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Genre Chips */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Genre</p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedGenres.length === 0 ? "default" : "outline"}
            className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground"
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
                className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground"
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

      {/* Rating Filter */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Bewertung</p>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => {
            const isSelected = minRating === option.value;
            return (
              <Badge
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground"
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
