"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-surface border border-border animate-pulse" />;
  }

  const currentTheme = resolvedTheme || theme || "light";
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Beralih ke Mode ${isDark ? "Terang" : "Gelap"}`}
      aria-label={`Beralih ke Mode ${isDark ? "Terang" : "Gelap"}`}
      className={cn(
        "relative flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface hover:bg-background text-text-primary transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-subtle",
        className
      )}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-gold transition-all" />
      ) : (
        <Moon className="w-4 h-4 text-primary transition-all" />
      )}
      <span className="sr-only">Ganti mode tema</span>
    </button>
  );
}
