# Product Requirements Document

## Vision
Eine persönliche Buch-Review- und Affiliate-Seite, auf der Bücher mit Titel, Autor, Beschreibung, Bewertung (5-Sterne) und Amazon-Kauflinks präsentiert werden. Die Seite dient als kuratierte Empfehlungsliste und ermöglicht Besuchern, Bücher nach Genre und Bewertung zu filtern.

## Target Users
- **Besucher:** Leser, die nach Buchempfehlungen suchen und über Affiliate-Links kaufen können
- **Admin (Seitenbetreiber):** Verwaltet die Bücherliste, importiert Daten per CSV, pflegt Bewertungen und Links

## Core Features (Roadmap)

| Priority | Feature | ID | Status |
|----------|---------|-----|--------|
| P0 (MVP) | Bücherliste & Display | PROJ-1 | Planned |
| P0 (MVP) | Filter & Suche | PROJ-2 | Planned |
| P0 (MVP) | CSV Import & Admin-Auth | PROJ-3 | Planned |
| P1 | Buch-Verwaltung (Admin-Panel) | PROJ-4 | Planned |

## Success Metrics
- Bücher werden korrekt mit allen Feldern angezeigt (Titel, Autor, Bild, Beschreibung, Bewertung, Link)
- Filter und Suche liefern relevante Ergebnisse in < 200ms
- CSV-Import verarbeitet Dateien fehlerfrei
- Seite lädt in < 2 Sekunden (Lighthouse Performance Score > 90)

## Constraints
- Einzelperson als Admin (kein Team)
- Supabase als Backend (PostgreSQL + Auth)
- Vercel als Hosting-Plattform
- Bilder müssen extern gehostet oder über Supabase Storage verwaltet werden

## Non-Goals
- Keine Community-Features (Kommentare, Nutzer-Bewertungen)
- Keine Multi-User-Registrierung
- Keine API für Drittanbieter
- Keine automatische Buch-Daten-Abfrage von externen APIs (Google Books etc.)

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
