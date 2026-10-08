"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo size="md" href="/" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#fitur" className="hover:text-primary transition-colors">
            Fitur
          </a>
          <a href="#cara-kerja" className="hover:text-primary transition-colors">
            Cara Kerja
          </a>
          <a href="#perbandingan" className="hover:text-primary transition-colors">
            Perbandingan
          </a>
          <a href="#harga" className="hover:text-primary transition-colors">
            Harga
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="font-semibold text-xs">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="font-bold text-xs gap-1.5 shadow-subtle">
            <Link href="/daftar">
              <span>Coba Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-border bg-surface text-text-primary"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface p-4 space-y-3 animate-in fade-in">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-text-primary">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-background"
            >
              Fitur
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-background"
            >
              Cara Kerja
            </a>
            <a
              href="#perbandingan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-background"
            >
              Perbandingan
            </a>
            <a
              href="#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-background"
            >
              Harga
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-background"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Masuk ke Akun</Link>
            </Button>
            <Button asChild className="w-full font-bold">
              <Link href="/daftar">Daftar Sekarang</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
