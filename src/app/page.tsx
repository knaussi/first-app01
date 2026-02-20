import Image from "next/image";
import { BookListClient } from "@/components/book-list-client";
import { getBooks } from "@/lib/books";
import { incrementPageViews } from "@/lib/page-views";

export const dynamic = "force-dynamic";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  incrementPageViews(); // fire-and-forget, kein await damit die Seite nicht wartet
  const books = shuffle(await getBooks());

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Image
            src="https://knaussi.com/wp-content/uploads/2021/12/logo_1000.png.pagespeed.ce.1uAZOOlQhX.png"
            alt="knaussi Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
          <a
            href="https://knaussi.com/#play"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            ← zurück zu knaussi.com
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 pb-8 sm:px-6 lg:px-8 text-center max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Mein Bücherstapel
        </h1>
        <p className="mt-4 text-base text-foreground leading-relaxed">
          Irgendwann hab ich mal ein Zimmer mit Regalen, die voller Bücher sind. Wie in den alten
          Filmen, Bibliotheken-Style. Bis es so weit ist, kannst du hier durch meine gelesenen
          Bücher stöbern – mit persönlichen Lese-Empfehlungen und ehrlichem Feedback. Aber nicht
          vergessen: alles Geschmacksache. 🤘
        </p>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <BookListClient books={books} />
      </main>

      {/* Footer */}
      <footer className="mt-auto" style={{ backgroundColor: "#bbd6b7" }}>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-sm text-foreground">
          &copy; Markus Knauss{" "}
          //{" "}
          <a
            href="https://knaussi.com/impressum"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            Impressum
          </a>
        </div>
      </footer>
    </div>
  );
}
