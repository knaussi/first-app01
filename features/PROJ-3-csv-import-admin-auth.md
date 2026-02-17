# PROJ-3: CSV Import & Admin-Auth

## Status: In Progress
**Created:** 2026-02-16
**Last Updated:** 2026-02-16

## Dependencies
- Requires: PROJ-1 (Bücherliste & Display) - Datenmodell muss definiert sein

## User Stories
- As an Admin, I want to mich mit E-Mail und Passwort einloggen so that nur ich Bücher verwalten kann
- As an Admin, I want to eine CSV-Datei mit Büchern hochladen so that ich viele Bücher auf einmal importieren kann
- As an Admin, I want to eine Vorschau der CSV-Daten sehen bevor sie importiert werden so that ich Fehler erkennen kann
- As an Admin, I want to nach dem Import eine Zusammenfassung sehen so that ich weiß, wie viele Bücher importiert wurden
- As an Admin, I want to mich ausloggen können so that niemand anderes Zugriff hat

## Acceptance Criteria
- [ ] Login-Seite unter `/admin/login` erreichbar
- [ ] Authentifizierung über Supabase Auth (E-Mail/Passwort)
- [ ] Nur ein vordefinierter Admin-Account (kein Registrierungs-Formular)
- [ ] Admin-Bereich unter `/admin` ist nur nach Login zugänglich
- [ ] CSV-Upload akzeptiert `.csv`-Dateien
- [ ] Erwartete CSV-Spalten: titel, autor, beschreibung, genre, bewertung, bild_url, amazon_link
- [ ] Vorschau zeigt die ersten 5 Zeilen der CSV vor dem Import
- [ ] Validierung: Pflichtfelder (Titel, Autor), Bewertung muss 1-5 sein
- [ ] Fehlerhafte Zeilen werden übersprungen und in einer Fehlerliste angezeigt
- [ ] Erfolgsseite zeigt: X Bücher importiert, Y Fehler
- [ ] Duplikate (gleicher Titel + Autor) werden erkannt und der Nutzer wird gefragt: Überschreiben oder überspringen?
- [ ] Logout-Button im Admin-Bereich sichtbar

## Edge Cases
- Was passiert bei einer leeren CSV? → Fehlermeldung "Die Datei enthält keine Daten"
- Was passiert bei falschen Spalten-Namen? → Fehlermeldung mit erwarteten Spalten
- Was passiert bei sehr großen CSV-Dateien (>1000 Zeilen)? → Batch-Import mit Fortschrittsanzeige
- Was passiert bei ungültigen URLs in bild_url oder amazon_link? → Warnung anzeigen, trotzdem importieren
- Was passiert bei Sonderzeichen in CSV-Feldern? → UTF-8 Encoding wird unterstützt
- Was passiert, wenn die Session abläuft? → Redirect zum Login mit Meldung

## Technical Requirements
- Security: Admin-Route durch Middleware geschützt
- Security: CSRF-Schutz für Upload-Formular
- Performance: Import von 100 Büchern < 5 Sekunden
- Datei-Limit: Max. 5MB CSV-Datei

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Component Structure
```
/admin/login         (öffentlich zugänglich)
└── LoginPage
    ├── E-Mail Feld
    ├── Passwort Feld
    └── "Einloggen" Button

/admin               (nur nach Login zugänglich)
└── AdminDashboard
    ├── AdminHeader
    │   ├── Titel: "Admin"
    │   └── Logout Button
    │
    └── CsvImportSection
        ├── Step 1: Upload
        │   ├── Datei-Upload-Bereich (Drag & Drop oder Klick)
        │   └── Erwartetes Format-Info
        │
        ├── Step 2: Vorschau (nach Dateiauswahl)
        │   ├── Vorschau-Tabelle (erste 5 Zeilen)
        │   ├── Fehler-Liste (ungültige Zeilen)
        │   ├── Duplikat-Dialog: Überschreiben / Überspringen
        │   └── "Importieren"-Button
        │
        └── Step 3: Ergebnis (nach Import)
            ├── "X Bücher importiert"
            ├── "Y Zeilen übersprungen"
            └── "Neuen Import starten" Button
```

### Security
- Middleware schützt alle `/admin/*` Routen serverseitig
- Ohne gültige Session → Redirect zu `/admin/login`
- Supabase Auth (E-Mail/Passwort), kein Registrierungsformular
- RLS: INSERT/UPDATE/DELETE nur für authentifizierte Nutzer (bereits eingerichtet)

### CSV Import Flow
1. Nutzer wählt .csv Datei → Browser parst client-side
2. Validierung: Spalten, Pflichtfelder, Bewertung 1-5
3. Vorschau: Erste 5 Zeilen + Fehler-Liste
4. Duplikate prüfen (Titel + Autor gegen DB)
5. Nutzer bestätigt → Batch-Insert (50er Batches) in Supabase
6. Ergebnis-Zusammenfassung

### Tech Decisions
- **CSV-Parsing im Browser** — Kein Server-Upload nötig, Daten gehen direkt in DB
- **Supabase Auth** — Bereits als Dependency, nahtlos mit RLS
- **Next.js Middleware** — Sicherster Schutz, läuft vor jeder Anfrage serverseitig
- **3-Schritt-Prozess** — Verhindert versehentliche Imports durch Vorschau
- **papaparse** — Bewährtes CSV-Parsing (UTF-8, robust, schnell)

### Dependencies
- `papaparse` + `@types/papaparse` — CSV-Parsing im Browser
- `@supabase/ssr` — Serverseitige Auth für Middleware

### Implementation Flow
1. `papaparse` + `@supabase/ssr` installieren
2. Supabase Auth: Server/Browser Clients aufsetzen
3. Admin-Account in Supabase anlegen
4. Middleware für `/admin/*` Schutz
5. Login-Seite `/admin/login`
6. Admin Layout mit Header + Logout
7. CSV Upload + Parser + Validierung
8. Vorschau-Tabelle + Duplikat-Dialog
9. Batch-Import + Fortschritt + Ergebnis

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
