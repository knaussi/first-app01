import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meine Buchempfehlungen | Kuratierte Buchtipps",
  description:
    "Entdecke handverlesene Buchempfehlungen mit ehrlichen Bewertungen und direkten Amazon-Links. Sachbuecher, Fiktion und mehr.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
