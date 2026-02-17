"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  validateColumns,
  validateRows,
  mapCsvRowToBook,
  EXPECTED_COLUMNS,
  type ParsedRow,
  type RowError,
} from "@/lib/csv-validation";
import { CsvUploadStep } from "@/components/csv-upload-step";
import { CsvPreviewStep } from "@/components/csv-preview-step";
import { CsvResultStep } from "@/components/csv-result-step";

export type ImportStep = "upload" | "preview" | "result";

export type DuplicateStrategy = "overwrite" | "skip";

export interface DuplicateInfo {
  row: ParsedRow;
  existingId: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  overwritten: number;
  errors: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BATCH_SIZE = 50;

export function CsvImport() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [validRows, setValidRows] = useState<ParsedRow[]>([]);
  const [errorRows, setErrorRows] = useState<RowError[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [duplicates, setDuplicates] = useState<DuplicateInfo[]>([]);
  const [duplicateStrategy, setDuplicateStrategy] =
    useState<DuplicateStrategy>("skip");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);

  const resetAll = useCallback(() => {
    setStep("upload");
    setValidRows([]);
    setErrorRows([]);
    setTotalRows(0);
    setDuplicates([]);
    setDuplicateStrategy("skip");
    setImportResult(null);
    setUploading(false);
    setImporting(false);
    setImportProgress(0);
    setFileError(null);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setFileError(null);

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Bitte waehle eine .csv-Datei aus.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Die Datei ist zu gross. Maximal 5MB erlaubt.");
      return;
    }

    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: async (results) => {
        const rawData = results.data as Record<string, string>[];

        // Check for empty file
        if (rawData.length === 0) {
          setFileError("Die Datei enthaelt keine Daten.");
          setUploading(false);
          return;
        }

        // Validate column names
        const columns = results.meta.fields ?? [];
        const columnCheck = validateColumns(columns);
        if (!columnCheck.valid) {
          setFileError(
            `Fehlende Spalten: ${columnCheck.missing.join(", ")}. Erwartete Spalten: ${EXPECTED_COLUMNS.join(", ")}`
          );
          setUploading(false);
          return;
        }

        // Validate rows
        const parseResult = validateRows(rawData);
        setValidRows(parseResult.validRows);
        setErrorRows(parseResult.errorRows);
        setTotalRows(parseResult.totalRows);

        // Check for duplicates against existing books
        if (parseResult.validRows.length > 0) {
          try {
            const supabase = createSupabaseBrowserClient();
            const titles = parseResult.validRows.map((r) => r.data.titel);
            const authors = parseResult.validRows.map((r) => r.data.autor);

            const { data: existingBooks } = await supabase
              .from("books")
              .select("id, title, author")
              .in("title", titles)
              .in("author", authors);

            if (existingBooks && existingBooks.length > 0) {
              const dupes: DuplicateInfo[] = [];
              for (const row of parseResult.validRows) {
                const match = existingBooks.find(
                  (b) =>
                    b.title.toLowerCase() === row.data.titel.toLowerCase() &&
                    b.author.toLowerCase() === row.data.autor.toLowerCase()
                );
                if (match) {
                  dupes.push({ row, existingId: match.id });
                }
              }
              setDuplicates(dupes);
            }
          } catch {
            // If duplicate check fails, continue without it
            console.error("Duplikat-Pruefung fehlgeschlagen");
          }
        }

        setStep("preview");
        setUploading(false);
      },
      error: () => {
        setFileError(
          "Die Datei konnte nicht gelesen werden. Ist sie im CSV-Format?"
        );
        setUploading(false);
      },
    });
  }, []);

  const handleImport = useCallback(async () => {
    setImporting(true);
    setImportProgress(0);

    const supabase = createSupabaseBrowserClient();
    let imported = 0;
    let skipped = 0;
    let overwritten = 0;
    let errors = 0;

    // Separate duplicates from new rows
    const duplicateIds = new Set(duplicates.map((d) => d.row.rowIndex));

    const newRows = validRows.filter((r) => !duplicateIds.has(r.rowIndex));
    const dupeRows = validRows.filter((r) => duplicateIds.has(r.rowIndex));

    // Import new rows in batches
    const allNewBooks = newRows.map((r) => mapCsvRowToBook(r.data));
    const totalBatches =
      Math.ceil(allNewBooks.length / BATCH_SIZE) +
      (duplicateStrategy === "overwrite"
        ? Math.ceil(dupeRows.length / BATCH_SIZE)
        : 0);
    let completedBatches = 0;

    for (let i = 0; i < allNewBooks.length; i += BATCH_SIZE) {
      const batch = allNewBooks.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from("books").insert(batch);
      if (error) {
        errors += batch.length;
      } else {
        imported += batch.length;
      }
      completedBatches++;
      setImportProgress(
        Math.round((completedBatches / Math.max(totalBatches, 1)) * 100)
      );
    }

    // Handle duplicates
    if (duplicateStrategy === "overwrite") {
      for (let i = 0; i < dupeRows.length; i += BATCH_SIZE) {
        const batch = dupeRows.slice(i, i + BATCH_SIZE);
        for (const row of batch) {
          const dupeInfo = duplicates.find(
            (d) => d.row.rowIndex === row.rowIndex
          );
          if (dupeInfo) {
            const bookData = mapCsvRowToBook(row.data);
            const { error } = await supabase
              .from("books")
              .update(bookData)
              .eq("id", dupeInfo.existingId);
            if (error) {
              errors++;
            } else {
              overwritten++;
            }
          }
        }
        completedBatches++;
        setImportProgress(
          Math.round((completedBatches / Math.max(totalBatches, 1)) * 100)
        );
      }
    } else {
      skipped += dupeRows.length;
    }

    setImportResult({ imported, skipped, overwritten, errors });
    setImportProgress(100);
    setImporting(false);
    setStep("result");
  }, [validRows, duplicates, duplicateStrategy]);

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <CsvUploadStep
          onFileSelect={handleFileSelect}
          uploading={uploading}
          error={fileError}
        />
      )}

      {step === "preview" && (
        <CsvPreviewStep
          validRows={validRows}
          errorRows={errorRows}
          totalRows={totalRows}
          duplicates={duplicates}
          duplicateStrategy={duplicateStrategy}
          onDuplicateStrategyChange={setDuplicateStrategy}
          onImport={handleImport}
          onCancel={resetAll}
          importing={importing}
          importProgress={importProgress}
        />
      )}

      {step === "result" && importResult && (
        <CsvResultStep
          result={importResult}
          errorRows={errorRows}
          onReset={resetAll}
        />
      )}
    </div>
  );
}
