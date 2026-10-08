"use client";

import React, { useState } from "react";
import { Bell, Plus, User, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface UserHeaderProps {
  userName?: string;
  userEmail?: string;
  unreadNotificationsCount?: number;
  onOpenQuickRecord?: () => void;
  isImpersonating?: boolean;
}

export function UserHeader({
  userName = "Pengguna",
  userEmail = "user@dicatetin.id",
  unreadNotificationsCount = 0,
  onOpenQuickRecord,
  isImpersonating = false,
}: UserHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur-md">
      {/* Left side / Mobile logo */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Link href="/app" className="font-heading font-bold text-lg text-text-primary">
            Dicate<span className="text-primary">tin</span>
          </Link>
        </div>
        <div className="hidden md:block">
          <p className="text-xs text-text-secondary">Selamat datang kembali,</p>
          <h2 className="text-sm md:text-base font-bold text-text-primary">{userName}</h2>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5">
        {onOpenQuickRecord && (
          <Button
            onClick={onOpenQuickRecord}
            size="sm"
            className="hidden sm:inline-flex gap-1.5 font-semibold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Transaksi</span>
          </Button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface hover:bg-background text-text-primary transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-expense text-[10px] font-bold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-surface p-4 shadow-card z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Notifikasi
                </span>
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
                  Tandai sudah dibaca
                </span>
              </div>
              <div className="space-y-2 text-xs text-text-secondary py-2 text-center">
                Belum ada notifikasi baru hari ini.
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        {/* User avatar indicator */}
        <Link
          href="/app/pengaturan"
          className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-border bg-surface hover:bg-background transition-colors"
          title="Pengaturan Akun"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
            {userName.slice(0, 1).toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  );
}
