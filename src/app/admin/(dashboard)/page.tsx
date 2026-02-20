"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BooksTable } from "@/components/books-table";
import { CsvImport } from "@/components/csv-import";
import { BookOpen, Upload, Eye } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminDashboardPage() {
  const [pageViews, setPageViews] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase
      .from("page_views")
      .select("count")
      .single()
      .then(({ data }) => setPageViews(data?.count ?? 0));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Verwalte deine Buchempfehlungen.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-4 py-2">
          <Eye className="h-4 w-4" />
          <span>
            {pageViews === null ? "..." : pageViews.toLocaleString("de-DE")} Seitenaufrufe
          </span>
        </div>
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
