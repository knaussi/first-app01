import { z } from "zod";

export const EXPECTED_COLUMNS = [
  "titel",
  "autor",
  "beschreibung",
  "genre",
  "bewertung",
  "bild_url",
  "amazon_link",
] as const;

export const csvRowSchema = z.object({
  titel: z.string().min(1, "Titel ist ein Pflichtfeld"),
  autor: z.string().min(1, "Autor ist ein Pflichtfeld"),
  beschreibung: z.string().optional().default(""),
  genre: z.string().optional().default(""), // kommagetrennte Genres
  bewertung: z.coerce
    .number()
    .int()
    .min(1, "Bewertung muss zwischen 1 und 5 sein")
    .max(5, "Bewertung muss zwischen 1 und 5 sein"),
  bild_url: z.string().refine((val) => { if (!val) return true; try { new URL(val); return true; } catch { return false; } }, { message: "Ungültige URL" }).optional().default(""),
  amazon_link: z.string().refine((val) => { if (!val) return true; try { new URL(val); return true; } catch { return false; } }, { message: "Ungültige URL" }).optional().default(""),
});

export type CsvRow = z.infer<typeof csvRowSchema>;

export interface ParsedRow {
  rowIndex: number;
  data: CsvRow;
}

export interface RowError {
  rowIndex: number;
  raw: Record<string, string>;
  errors: string[];
}

export interface CsvParseResult {
  validRows: ParsedRow[];
  errorRows: RowError[];
  totalRows: number;
}

/**
 * Maps a validated CSV row to the Supabase books table format.
 */
export function mapCsvRowToBook(row: CsvRow) {
  return {
    title: row.titel,
    author: row.autor,
    description: row.beschreibung || null,
    genres: row.genre
      ? row.genre.split(",").map((g) => g.trim()).filter(Boolean)
      : null,
    rating: row.bewertung,
    image_url: row.bild_url || null,
    amazon_link: row.amazon_link || null,
  };
}

/**
 * Validate column names in the CSV header.
 * Returns missing columns if any required columns are absent.
 */
export function validateColumns(
  columns: string[]
): { valid: true } | { valid: false; missing: string[] } {
  const normalized = columns.map((c) => c.trim().toLowerCase());
  const missing = EXPECTED_COLUMNS.filter((col) => !normalized.includes(col));
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
}

/**
 * Validate and parse CSV data rows.
 */
export function validateRows(
  data: Record<string, string>[]
): CsvParseResult {
  const validRows: ParsedRow[] = [];
  const errorRows: RowError[] = [];

  data.forEach((raw, index) => {
    // Normalize keys to lowercase
    const normalizedRaw: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      normalizedRaw[key.trim().toLowerCase()] = value;
    }

    const result = csvRowSchema.safeParse(normalizedRaw);

    if (result.success) {
      validRows.push({ rowIndex: index + 1, data: result.data });
    } else {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      errorRows.push({ rowIndex: index + 1, raw: normalizedRaw, errors });
    }
  });

  return { validRows, errorRows, totalRows: data.length };
}
