import React from "react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Logo size="md" href="/" />
        <ThemeToggle />
      </header>

      {/* Main Content Card Container */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-text-secondary py-4">
        &copy; {new Date().getFullYear()} Dicatetin.id &middot; Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
