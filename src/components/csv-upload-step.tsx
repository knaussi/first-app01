"use client";

import { useCallback, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EXPECTED_COLUMNS } from "@/lib/csv-validation";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";

interface CsvUploadStepProps {
  onFileSelect: (file: File) => void;
  uploading: boolean;
  error: string | null;
}

export function CsvUploadStep({
  onFileSelect,
  uploading,
  error,
}: CsvUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          CSV-Datei hochladen
        </CardTitle>
        <CardDescription>
          Lade eine CSV-Datei mit Buchdaten hoch, um mehrere Buecher auf einmal
          zu importieren.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Drop Zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="CSV-Datei hochladen per Drag-and-Drop oder Klick"
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}
            ${uploading ? "pointer-events-none opacity-50" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Datei wird verarbeitet...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  CSV-Datei hierher ziehen oder klicken
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Maximal 5MB, .csv Format
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Expected Format Info */}
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium mb-2">Erwartetes CSV-Format:</p>
          <code className="text-xs block bg-background rounded p-2 overflow-x-auto">
            {EXPECTED_COLUMNS.join(",")}
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Pflichtfelder: <strong>titel</strong>, <strong>autor</strong>,{" "}
            <strong>bewertung</strong> (1-5). Alle anderen Felder sind optional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
