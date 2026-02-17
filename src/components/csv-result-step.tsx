"use client";

import type { ImportResult } from "@/components/csv-import";
import type { RowError } from "@/lib/csv-validation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface CsvResultStepProps {
  result: ImportResult;
  errorRows: RowError[];
  onReset: () => void;
}

export function CsvResultStep({
  result,
  errorRows,
  onReset,
}: CsvResultStepProps) {
  const hasErrors = result.errors > 0 || errorRows.length > 0;
  const totalSuccess = result.imported + result.overwritten;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {totalSuccess > 0 ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          Import abgeschlossen
        </CardTitle>
        <CardDescription>
          Zusammenfassung des CSV-Imports.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {result.imported}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">
              Neu importiert
            </p>
          </div>

          {result.overwritten > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {result.overwritten}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Ueberschrieben
              </p>
            </div>
          )}

          {result.skipped > 0 && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {result.skipped}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500">
                Uebersprungen
              </p>
            </div>
          )}

          {(result.errors > 0 || errorRows.length > 0) && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-center">
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {result.errors + errorRows.length}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500">Fehler</p>
            </div>
          )}
        </div>

        {/* Warnings for invalid URLs */}
        {hasErrors && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {errorRows.length} Zeilen konnten nicht validiert werden und wurden
              uebersprungen.
              {result.errors > 0 &&
                ` ${result.errors} Zeilen konnten nicht in die Datenbank geschrieben werden.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Neuen Import starten
          </Button>
          <Button asChild variant="default">
            <a href="/">
              <BookOpen className="mr-2 h-4 w-4" />
              Zur Buecherliste
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
