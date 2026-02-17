"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BooksTable } from "@/components/books-table";
import { CsvImport } from "@/components/csv-import";
import { BookOpen, Upload } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Verwalte deine Buchempfehlungen.
        </p>
      </div>

      <Tabs defaultValue="books" className="space-y-6">
        <TabsList>
          <TabsTrigger value="books" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Buecher verwalten
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="h-4 w-4" />
            CSV Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BooksTable />
        </TabsContent>

        <TabsContent value="import">
          <div className="max-w-3xl">
            <CsvImport />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
