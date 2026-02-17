# PROJ-1: Bücherliste & Display

## Status: In Progress
**Created:** 2026-02-16
**Last Updated:** 2026-02-16

## Dependencies
- None

## User Stories
- As a Besucher, I want to eine Liste aller Bücher auf der Startseite sehen so that ich schnell interessante Bücher entdecken kann
- As a Besucher, I want to für jedes Buch Titel, Autor, Beschreibung, Bewertung und Bild sehen so that ich mir ein Bild vom Buch machen kann
- As a Besucher, I want to einen Amazon-Link pro Buch sehen so that ich das Buch direkt kaufen kann
- As a Besucher, I want to die Seite auf meinem Smartphone nutzen können so that ich auch unterwegs Bücher durchstöbern kann
- As a Besucher, I want to die Bewertung als Sterne-Anzeige (1-5) sehen so that ich die Qualität auf einen Blick einschätzen kann

## Acceptance Criteria
- [ ] Startseite zeigt alle Bücher in einem responsiven Grid an
- [ ] Jede Buchkarte zeigt: Cover-Bild, Titel, Autor, kurze Beschreibung (max. 150 Zeichen), Sterne-Bewertung (1-5), Amazon-Link-Button
- [ ] Bewertung wird visuell als ausgefüllte/leere Rock-On-Emojis (🤘) dargestellt
- [ ] Amazon-Link öffnet sich in einem neuen Tab (`target="_blank"`)
- [ ] Layout ist responsive: 1 Spalte (Mobile), 2 Spalten (Tablet), 3-4 Spalten (Desktop)
- [ ] Bücher ohne Bild zeigen einen Platzhalter an
- [ ] Seite lädt innerhalb von 2 Sekunden
- [ ] Bilder werden mit `next/image` optimiert (lazy loading, responsive sizes)

## Edge Cases
- Was passiert, wenn kein Buch in der Datenbank ist? → Leere-Zustand-Meldung anzeigen ("Noch keine Bücher vorhanden")
- Was passiert, wenn ein Buch kein Bild hat? → Platzhalter-Bild anzeigen
- Was passiert, wenn die Beschreibung sehr lang ist? → Auf 150 Zeichen kürzen mit "..."
- Was passiert, wenn der Amazon-Link fehlt? → Kauf-Button nicht anzeigen
- Was passiert, wenn die Bewertung 0 ist? → Keine Sterne anzeigen, "Noch nicht bewertet" text

## Technical Requirements
- Performance: Lighthouse Score > 90
- Browser Support: Chrome, Firefox, Safari, Edge
- Accessibility: Alle Bilder mit Alt-Text, Bewertung mit aria-label
- SEO: Meta-Tags für Titel und Beschreibung der Seite

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Component Structure
```
Homepage (/)
├── Page Header ("Meine Buchempfehlungen")
├── Book Grid Section
│   ├── BookCard (pro Buch)
│   │   ├── Cover Image (Platzhalter-Fallback)
│   │   ├── Title
│   │   ├── Author
│   │   ├── Description (max 150 Zeichen)
│   │   ├── RockRating (🤘 x 1-5)
│   │   └── Amazon Link Button
│   └── Empty State ("Noch keine Bücher vorhanden")
└── Footer (optional)
```

### Data Model (Supabase Tabelle: `books`)
- `id` — UUID, automatisch generiert
- `title` — Text, Pflichtfeld
- `author` — Text, Pflichtfeld
- `description` — Text, optional
- `genre` — Text (z.B. "Sachbuch", "Fiktion")
- `rating` — Zahl 1-5
- `image_url` — URL zum Cover-Bild
- `amazon_link` — Affiliate-/Kauflink
- `created_at` — Zeitstempel

Zugriff: Öffentlich lesbar (RLS), sortiert nach created_at desc.

### Tech Decisions
- **Supabase** — Datenbank wird bereits jetzt aufgesetzt, damit PROJ-3/4 nahtlos darauf aufbauen
- **Server-Side Rendering** — SEO-optimiert, Bücher werden serverseitig geladen
- **shadcn/ui Card + Button** — Konsistentes Design, bereits installiert
- **next/image** — Automatische Bild-Optimierung, Lazy Loading
- **RockRating mit 🤘** — Eigene Komponente, zeigt ausgefüllte/ausgegraute Emojis

### Dependencies
Keine zusätzlichen Pakete nötig. Alles bereits installiert.

### Implementation Flow
1. Supabase-Tabelle `books` erstellen + RLS + Testdaten
2. `RockRating` Komponente bauen
3. `BookCard` Komponente bauen (shadcn Card)
4. `BookGrid` Container (responsives Grid)
5. Startseite: Daten laden + Grid rendern + Edge Cases

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
