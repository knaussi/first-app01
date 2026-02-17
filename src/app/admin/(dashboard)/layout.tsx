import { AdminHeader } from "@/components/admin-header";

export const metadata = {
  title: "Admin | Buchempfehlungen",
  description: "Admin-Bereich zur Verwaltung der Buchempfehlungen.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
