import type { Metadata } from "next";
import { Ubuntu, Open_Sans } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ubuntu",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Mein Bücherstapel // knaussi",
  description:
    "Entdecke handverlesene Buchempfehlungen mit ehrlichen Bewertungen und direkten Amazon-Links. Sachbuecher, Fiktion und mehr.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${ubuntu.variable} ${openSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
