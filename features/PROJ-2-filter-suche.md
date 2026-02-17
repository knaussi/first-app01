# PROJ-2: Filter & Suche

## Status: In Progress
**Created:** 2026-02-16
**Last Updated:** 2026-02-17

## Dependencies
- Requires: PROJ-1 (Bücherliste & Display) - die Bücherliste muss existieren, um gefiltert zu werden

## User Stories
- As a Besucher, I want to Bücher nach Genre/Kategorie filtern so that ich nur Bücher aus einem bestimmten Bereich sehe
- As a Besucher, I want to Bücher nach Bewertung filtern so that ich nur die besten Bücher sehe
- As a Besucher, I want to nach Büchern per Freitext suchen so that ich ein bestimmtes Buch schnell finden kann
- As a Besucher, I want to mehrere Filter gleichzeitig kombinieren so that ich meine Suche eingrenzen kann
- As a Besucher, I want to aktive Filter auf einen Blick sehen und einzeln entfernen so that ich weiß, warum bestimmte Bücher angezeigt werden

## Acceptance Criteria
- [ ] Genre-Filter als Chip-Auswahl: AlltimeFav, Biografie, Empfehlung, English, Kreativ, Kunst, Sachbuch, Unterhaltung, Sport
- [ ] Bewertungs-Filter: Mindestens X Sterne (z.B. "4+ Sterne")
- [ ] Freitext-Suchfeld durchsucht Titel und Autor
- [ ] Filter sind kombinierbar (z.B. Genre "Sachbuch" + Bewertung "4+ Sterne")
- [ ] Aktive Filter werden als Chips/Tags angezeigt und sind einzeln entfernbar
- [ ] "Alle Filter zurücksetzen"-Button, wenn Filter aktiv sind
- [ ] Ergebnisse aktualisieren sich sofort (client-side Filterung, kein Page-Reload)
- [ ] Wenn keine Bücher den Filtern entsprechen: "Keine Bücher gefunden"-Meldung anzeigen
- [ ] Suchfeld hat ein Debounce von 300ms
- [ ] Filter-Zustand wird in der URL gespeichert (Sharing möglich)

## Edge Cases
- Was passiert bei einer leeren Suche? → Alle Bücher anzeigen
- Was passiert bei Sonderzeichen in der Suche? → Werden escaped, keine Fehler
- Was passiert, wenn ein Genre keine Bücher hat? → Genre wird trotzdem angezeigt, Ergebnis zeigt "Keine Bücher gefunden"
- Was passiert bei sehr vielen Genres? → Maximal 10-15 Genres, scrollbar bei Bedarf
- Was passiert, wenn die Suche nur aus Leerzeichen besteht? → Wird wie leere Suche behandelt

## Technical Requirements
- Performance: Filterung < 100ms (client-side)
- Accessibility: Suchfeld mit Label, Filter-Buttons fokussierbar per Tastatur
- URL-Params: Genre, Bewertung und Suchtext als Query-Parameter

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Component Structure
```
Homepage (/)
├── Page Header
├── FilterBar (NEU - Client Component)
│   ├── SearchInput (Freitext, 300ms Debounce)
│   ├── GenreFilter (Chips: Alle / AlltimeFav / Biografie / Empfehlung / English / Kreativ / Kunst / Sachbuch / Unterhaltung / Sport)
│   ├── RatingFilter (Buttons: Alle / 3+ / 4+ / 5🤘)
│   └── ActiveFilters
│       ├── FilterChip (pro aktivem Filter, mit ×-Button)
│       └── "Alle zurücksetzen"-Button
│
└── BookGrid (bestehend, bekommt gefilterte Liste)
    ├── BookCard × N
    └── Empty State ("Keine Bücher gefunden")
```

### Data Flow
- Bücher werden einmalig serverseitig aus Supabase geladen
- Filterung passiert komplett client-side (kein Reload, kein neuer DB-Call)
- Filter-Zustand wird in URL-Parametern gespeichert (z.B. `/?genre=Sachbuch&rating=4&q=habits`)

### Tech Decisions
- **Client-Side Filterung** — Schnell (< 100ms), kein Netzwerk nötig, reicht für < 1000 Bücher
- **URL als Filter-State** — Links teilbar, Browser-Zurück funktioniert
- **shadcn/ui Badge** — Für Genre-Chips und aktive Filter-Tags
- **Debounce (300ms)** — Verhindert zu häufiges Filtern beim Tippen

### Genres (fest definiert)
AlltimeFav, Biografie, Empfehlung, English, Kreativ, Kunst, Sachbuch, Unterhaltung, Sport

### Dependencies
Keine neuen Pakete nötig.

### Implementation Flow
1. Startseite umbauen: Server Component lädt Daten → Client Component filtert
2. `FilterBar` Komponente (Search + Genre-Chips + Rating)
3. Filter-Logik: URL-Parameter lesen/schreiben + client-side Filterung
4. `ActiveFilters` Chips mit Entfernen-Funktion
5. Empty State anpassen

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
