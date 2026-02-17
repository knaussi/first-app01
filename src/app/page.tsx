import { BookListClient } from "@/components/book-list-client";
import { getBooks } from "@/lib/books";

export default async function Home() {
  const books = await getBooks();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Meine Buchempfehlungen
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kuratierte Buchtipps mit ehrlichen Bewertungen
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <BookListClient books={books} />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Meine Buchempfehlungen
        </div>
      </footer>
    </div>
  );
}
