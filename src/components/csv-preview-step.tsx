"use client";

import type { ParsedRow, RowError } from "@/lib/csv-validation";
import type { DuplicateInfo, DuplicateStrategy } from "@/components/csv-import";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  AlertTriangle,
  Copy,
  Loader2,
  Import,
  ArrowLeft,
} from "lucide-react";

interface CsvPreviewStepProps {
  validRows: ParsedRow[];
  errorRows: RowError[];
  totalRows: number;
  duplicates: DuplicateInfo[];
  duplicateStrategy: DuplicateStrategy;
  onDuplicateStrategyChange: (strategy: DuplicateStrategy) => void;
  onImport: () => void;
  onCancel: () => void;
  importing: boolean;
  importProgress: number;
}

export function CsvPreviewStep({
  validRows,
  errorRows,
  totalRows,
  duplicates,
  duplicateStrategy,
  onDuplicateStrategyChange,
  onImport,
  onCancel,
  importing,
  importProgress,
}: CsvPreviewStepProps) {
  const previewRows = validRows.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vorschau
          </CardTitle>
          <CardDescription>
            {totalRows} Zeilen gefunden. Pruefe die Daten vor dem Import.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default" className="text-sm">
              {validRows.length} gueltig
            </Badge>
            {errorRows.length > 0 && (
              <Badge variant="destructive" className="text-sm">
                {errorRows.length} fehlerhaft
              </Badge>
            )}
            {duplicates.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {duplicates.length} Duplikate
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Vorschau (erste {previewRows.length} Zeilen)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Titel</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="w-[80px]">Bewertung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.rowIndex}>
                    <TableCell className="text-muted-foreground">
                      {row.rowIndex}
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.data.titel}
                    </TableCell>
                    <TableCell>{row.data.autor}</TableCell>
                    <TableCell>{row.data.genre || "-"}</TableCell>
                    <TableCell>{row.data.bewertung}/5</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {validRows.length > 5 && (
            <p className="text-xs text-muted-foreground mt-2">
              ... und {validRows.length - 5} weitere gueltige Zeilen
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error Rows */}
      {errorRows.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Fehlerhafte Zeilen ({errorRows.length})
            </CardTitle>
            <CardDescription>
              Diese Zeilen werden beim Import uebersprungen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {errorRows.map((row) => (
                <Alert key={row.rowIndex} variant="destructive">
                  <AlertDescription className="text-xs">
                    <strong>Zeile {row.rowIndex}:</strong>{" "}
                    {row.errors.join("; ")}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Duplicate Handling */}
      {duplicates.length > 0 && (
        <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Copy className="h-4 w-4 text-yellow-600" />
              Duplikate gefunden ({duplicates.length})
            </CardTitle>
            <CardDescription>
              Diese Buecher existieren bereits (gleicher Titel + Autor).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              {duplicates.slice(0, 5).map((dupe) => (
                <p key={dupe.row.rowIndex} className="text-sm">
                  - {dupe.row.data.titel} von {dupe.row.data.autor}
                </p>
              ))}
              {duplicates.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  ... und {duplicates.length - 5} weitere
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">
                Wie sollen Duplikate behandelt werden?
              </label>
              <Select
                value={duplicateStrategy}
                onValueChange={(value) =>
                  onDuplicateStrategyChange(value as DuplicateStrategy)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Ueberspringen</SelectItem>
                  <SelectItem value="overwrite">Ueberschreiben</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Progress */}
      {importing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Import laeuft...
                </span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!importing && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Abbrechen
          </Button>
          <Button
            onClick={onImport}
            disabled={validRows.length === 0}
          >
            <Import className="mr-2 h-4 w-4" />
            {validRows.length} Buecher importieren
          </Button>
        </div>
      )}
    </div>
  );
}
