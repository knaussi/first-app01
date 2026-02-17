"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { Book } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RockRating } from "@/components/rock-rating";
import { BookFormSheet } from "@/components/book-form-sheet";
import { DeleteBookDialog } from "@/components/delete-book-dialog";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

type SortField = "title" | "author" | "rating";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 50;

export function BooksTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(`Fehler beim Laden: ${error.message}`);
        return;
      }

      setBooks(data ?? []);
    } catch {
      toast.error("Buecher konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Filter and sort
  const filteredAndSortedBooks = useMemo(() => {
    let result = books;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.genre && book.genre.toLowerCase().includes(query))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title, "de");
          break;
        case "author":
          comparison = a.author.localeCompare(b.author, "de");
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [books, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBooks.length / PAGE_SIZE);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedBooks.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedBooks, currentPage]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  }

  function handleNewBook() {
    setEditingBook(null);
    setSheetOpen(true);
  }

  function handleEditBook(book: Book) {
    setEditingBook(book);
    setSheetOpen(true);
  }

  function handleDeleteClick(book: Book) {
    setDeletingBook(book);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingBook) return;

    setDeleting(true);
    try {
      const supabase = createSupabaseBrowserClient();

      // Delete cover image from storage if it's a Supabase URL
      if (deletingBook.image_url && deletingBook.image_url.includes("book-covers")) {
        const urlParts = deletingBook.image_url.split("/book-covers/");
        if (urlParts[1]) {
          await supabase.storage
            .from("book-covers")
            .remove([urlParts[1]]);
        }
      }

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", deletingBook.id);

      if (error) {
        toast.error(`Fehler beim Loeschen: ${error.message}`);
        return;
      }

      toast.success(`"${deletingBook.title}" wurde geloescht.`);
      setDeleteDialogOpen(false);
      setDeletingBook(null);
      fetchBooks();
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Suche nach Titel, Autor oder Genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleNewBook}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Buch
        </Button>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedBooks.length}{" "}
          {filteredAndSortedBooks.length === 1 ? "Buch" : "Buecher"}
          {searchQuery && ` fuer "${searchQuery}"`}
        </p>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredAndSortedBooks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
          {searchQuery ? (
            <p>Keine Buecher gefunden fuer &quot;{searchQuery}&quot;</p>
          ) : (
            <div>
              <p className="mb-2">Noch keine Buecher vorhanden.</p>
              <Button variant="outline" onClick={handleNewBook}>
                <Plus className="mr-2 h-4 w-4" />
                Erstes Buch hinzufuegen
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Bild</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("title")}
                    >
                      Titel
                      {getSortIcon("title")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("author")}
                    >
                      Autor
                      {getSortIcon("author")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Genre</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8"
                      onClick={() => handleSort("rating")}
                    >
                      Bewertung
                      {getSortIcon("rating")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px] text-right">
                    Aktionen
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div className="relative w-10 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
                        {book.image_url ? (
                          <Image
                            src={book.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-4 w-4 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {book.title}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {book.author}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {book.genre ? (
                        <Badge variant="secondary">{book.genre}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          &ndash;
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <RockRating rating={book.rating} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBook(book)}
                          aria-label={`${book.title} bearbeiten`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(book)}
                          aria-label={`${book.title} loeschen`}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Book Form Sheet */}
      <BookFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        book={editingBook}
        onSuccess={fetchBooks}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBookDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        bookTitle={deletingBook?.title ?? ""}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
}
