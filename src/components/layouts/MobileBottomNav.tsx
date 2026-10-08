"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  Menu,
  X,
  ScanLine,
  Wallet,
  BarChart3,
  Send,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MobileBottomNavProps {
  onOpenQuickRecord?: () => void;
}

export function MobileBottomNav({ onOpenQuickRecord }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const moreNavItems = [
    { label: "Scan Struk", href: "/app/scan", icon: ScanLine, isPro: true },
    { label: "Wallet & Rekening", href: "/app/wallet", icon: Wallet },
    { label: "Laporan & Export", href: "/app/laporan", icon: BarChart3 },
    { label: "Telegram Bot", href: "/app/telegram", icon: Send, isPro: true },
    { label: "Pengaturan Akun", href: "/app/pengaturan", icon: Settings },
    { label: "Tutorial & Panduan", href: "/app/tutorial", icon: HelpCircle },
  ];

  return (
    <>
      {/* Drawer for 'Lainnya' Menu */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative z-10 bg-surface border-t border-border rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-base text-text-primary">
                Menu Lainnya
              </h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMoreMenu(false)}
                    className={cn(
                      "flex flex-col items-start gap-2 p-3.5 rounded-2xl border border-border transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background hover:bg-surface text-text-primary"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isActive ? "text-primary-foreground" : "text-primary"
                        )}
                      />
                      {item.isPro && (
                        <span
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded",
                            isActive ? "bg-white/20 text-white" : "bg-gold/20 text-gold"
                          )}
                        >
                          PRO
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/api/auth/logout"
                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-expense/30 text-expense text-xs font-semibold bg-expense/5 hover:bg-expense/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main 5-Item Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-surface/95 backdrop-blur-lg px-2 py-2 flex items-center justify-around shadow-lg">
        {/* 1. Beranda */}
        <Link
          href="/app"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[11px] font-medium transition-colors",
            pathname === "/app"
              ? "text-primary font-bold"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Beranda</span>
        </Link>

        {/* 2. Transaksi */}
        <Link
          href="/app/transaksi"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[11px] font-medium transition-colors",
            pathname.startsWith("/app/transaksi")
              ? "text-primary font-bold"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Receipt className="w-5 h-5" />
          <span>Transaksi</span>
        </Link>

        {/* 3. Floating Quick Record Button */}
        <button
          onClick={onOpenQuickRecord}
          type="button"
          aria-label="Catat Transaksi Cepat"
          className="flex items-center justify-center -mt-6 w-13 h-13 p-3.5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* 4. Budget */}
        <Link
          href="/app/budget"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[11px] font-medium transition-colors",
            pathname.startsWith("/app/budget")
              ? "text-primary font-bold"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <PieChart className="w-5 h-5" />
          <span>Budget</span>
        </Link>

        {/* 5. Lainnya */}
        <button
          onClick={() => setShowMoreMenu(true)}
          type="button"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[11px] font-medium transition-colors",
            showMoreMenu ? "text-primary font-bold" : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Menu className="w-5 h-5" />
          <span>Lainnya</span>
        </button>
      </nav>
    </>
  );
}
