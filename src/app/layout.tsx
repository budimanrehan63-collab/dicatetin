import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dicatetin — Aplikasi Manajemen Keuangan Pribadi Berbasis AI & Telegram",
  description:
    "Catat pengeluaran cukup lewat chat, voice note, atau foto struk di Telegram. Dicatetin merapikannya jadi laporan dan grafik keuangan yang jelas.",
  keywords: [
    "manajemen keuangan",
    "catat keuangan",
    "aplikasi keuangan",
    "bot telegram keuangan",
    "scan struk ai",
    "anggaran bulanan",
  ],
  authors: [{ name: "Dicatetin Team" }],
  openGraph: {
    title: "Dicatetin — Catat Pengeluaran Secepat Kirim Chat",
    description: "Web app manajemen keuangan dengan bot Telegram AI. Tahu ke mana perginya uangmu tanpa ribet.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-text-primary antialiased font-body selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
