# PROJ-4: Buch-Verwaltung (Admin-Panel)

## Status: In Progress
**Created:** 2026-02-16
**Last Updated:** 2026-02-17

## Dependencies
- Requires: PROJ-1 (Bücherliste & Display) - Datenmodell muss definiert sein
- Requires: PROJ-3 (CSV Import & Admin-Auth) - Admin-Authentifizierung muss existieren

## User Stories
- As an Admin, I want to ein neues Buch manuell hinzufügen so that ich einzelne Bücher ohne CSV eintragen kann
- As an Admin, I want to ein bestehendes Buch bearbeiten so that ich Fehler korrigieren oder Infos aktualisieren kann
- As an Admin, I want to ein Buch löschen so that ich veraltete oder falsche Einträge entfernen kann
- As an Admin, I want to ein Cover-Bild hochladen so that ich nicht nur externe URLs verwenden muss
- As an Admin, I want to eine Übersicht aller Bücher im Admin-Bereich sehen so that ich den Bestand verwalten kann

## Acceptance Criteria
- [ ] Admin-Dashboard unter `/admin` zeigt eine Tabelle aller Bücher (Titel, Autor, Genre, Bewertung, Status)
- [ ] "Neues Buch"-Button öffnet ein Formular mit allen Feldern
- [ ] Formular-Felder: Titel (Pflicht), Autor (Pflicht), Beschreibung, Genre (Dropdown), Bewertung (1-5 Sterne-Auswahl), Bild-Upload oder URL, Amazon-Link
- [ ] Bearbeiten-Button pro Buch öffnet das Formular vorausgefüllt
- [ ] Löschen-Button mit Bestätigungsdialog ("Bist du sicher?")
- [ ] Bild-Upload speichert Bilder in Supabase Storage
- [ ] Formular-Validierung: Titel und Autor sind Pflichtfelder, Bewertung 1-5
- [ ] Erfolgsmeldung nach Speichern/Löschen (Toast-Notification)
- [ ] Admin-Tabelle ist sortierbar nach Titel, Autor, Bewertung
- [ ] Admin-Tabelle hat eine einfache Suchfunktion

## Edge Cases
- Was passiert beim Löschen eines Buchs mit hochgeladenem Bild? → Bild wird ebenfalls aus Storage gelöscht
- Was passiert bei einem Upload von nicht-Bild-Dateien? → Fehlermeldung, nur JPG/PNG/WebP erlaubt
- Was passiert bei sehr großen Bildern? → Max. 2MB, automatische Komprimierung oder Fehlermeldung
- Was passiert bei gleichzeitigem Bearbeiten (wenn Admin in zwei Tabs offen)? → Letzte Änderung gewinnt
- Was passiert, wenn Supabase Storage voll ist? → Fehlermeldung anzeigen

## Technical Requirements
- Security: Alle Operationen nur mit gültiger Admin-Session
- Performance: Tabelle paginiert bei > 50 Büchern
- Bild-Upload: Max. 2MB, Formate: JPG, PNG, WebP
- UX: Optimistic UI Updates für schnelles Feedback

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Component Structure
```
/admin                    (geschützt durch bestehende Middleware)
└── AdminDashboard (erweitert)
    ├── AdminHeader (bestehend)
    ├── AdminNav (NEU - Tabs)
    │   ├── "Bücher verwalten"
    │   └── "CSV Import" (bestehend)
    │
    └── BooksAdminSection (NEU)
        ├── Toolbar (Suchfeld + "Neues Buch"-Button)
        ├── BooksTable (sortierbar, paginiert ab 50)
        │   └── pro Zeile: Bild | Titel | Autor | Genre | Bewertung | Bearbeiten | Löschen
        │
        ├── BookFormSheet (Slide-in Panel für Neu/Bearbeiten)
        │   ├── Titel (Pflicht), Autor (Pflicht)
        │   ├── Beschreibung, Genre (Dropdown), Bewertung (🤘 1-5)
        │   ├── Bild: Upload ODER URL
        │   └── Amazon-Link
        │
        └── DeleteConfirmDialog ("Bist du sicher?")
```

### Bild-Upload
- Supabase Storage Bucket: `book-covers` (öffentlich lesbar)
- Erlaubte Formate: JPG, PNG, WebP (max. 2MB)
- Beim Löschen eines Buchs → Bild wird aus Storage entfernt
- Zwei Optionen: Datei hochladen ODER externe URL eingeben

### Tech Decisions
- **Sheet statt eigene Seite** — Kein Seitenwechsel, schneller Workflow
- **Supabase Storage** — Bereits verfügbar, kostenlos bis 1GB, öffentliche URLs
- **Tab-Navigation** — Admin-Dashboard bleibt übersichtlich
- **Sonner (Toast)** — Kurze Erfolgsmeldungen ohne Flow-Unterbrechung
- **react-hook-form + Zod** — Robuste Formular-Validierung (bereits installiert)

### Dependencies
Keine neuen Pakete nötig. Alles bereits installiert.

### Implementation Flow
1. Supabase Storage Bucket `book-covers` erstellen
2. AdminNav mit Tabs (Bücher / CSV Import)
3. BooksTable mit Suche + Sortierung + Pagination
4. BookFormSheet (Neu/Bearbeiten) mit Bild-Upload
5. Löschen mit Bestätigungsdialog + Storage-Cleanup
6. Toast-Notifications

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
