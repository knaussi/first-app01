import { CsvImport } from "@/components/csv-import";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Verwalte deine Buchempfehlungen. Importiere Buecher per CSV-Upload.
        </p>
      </div>

      <CsvImport />
    </div>
  );
}
