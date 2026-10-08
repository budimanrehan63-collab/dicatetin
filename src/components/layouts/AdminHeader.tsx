"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  adminEmail?: string;
  impersonatingUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  onExitImpersonation?: () => void;
}

export function AdminHeader({
  adminEmail = "fauzymnf29@gmail.com",
  impersonatingUser = null,
  onExitImpersonation,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col w-full sticky top-0 z-30">
      {/* Impersonation Banner if active */}
      {impersonatingUser && (
        <div className="bg-expense text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-md animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>
              MODE ADMIN: Anda sedang melihat dashboard sebagai{" "}
              <strong>{impersonatingUser.name} ({impersonatingUser.email})</strong>
            </span>
          </div>
          {onExitImpersonation && (
            <Button
              onClick={onExitImpersonation}
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-white text-expense hover:bg-white/90 border-none font-bold"
            >
              Kembali ke Admin
            </Button>
          )}
        </div>
      )}

      <header className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Link href="/admin" className="font-heading font-bold text-base text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-expense" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="text-sm font-bold text-text-primary">Superadmin Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-7 h-7 rounded-lg bg-expense/10 text-expense flex items-center justify-center text-xs font-bold">
              F
            </div>
            <span className="text-xs font-semibold text-text-primary hidden sm:inline-block">
              {adminEmail}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
