"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  CheckSquare,
  CreditCard,
  Package,
  Key,
  Sliders,
  FileText,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils/cn";

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Kelola User", href: "/admin/users", icon: Users },
  { label: "Persetujuan", href: "/admin/persetujuan", icon: CheckSquare },
  { label: "Pembayaran", href: "/admin/pembayaran", icon: CreditCard },
  { label: "Kelola Paket", href: "/admin/paket", icon: Package },
  { label: "Pengaturan API", href: "/admin/api", icon: Key },
  { label: "Pengaturan Sistem", href: "/admin/pengaturan", icon: Sliders },
  { label: "Log Aktivitas", href: "/admin/log", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface min-h-screen p-4 justify-between shrink-0 select-none">
      <div>
        <div className="px-3 py-3 mb-2 flex items-center justify-between">
          <Logo size="sm" href="/admin" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-expense/15 text-expense border border-expense/30">
            ADMIN
          </span>
        </div>

        <p className="px-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Panel Manajemen
        </p>

        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-text-secondary hover:text-text-primary hover:bg-background/80"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive
                      ? "text-primary-foreground"
                      : "text-text-secondary group-hover:text-primary"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <Link
          href="/app"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-primary hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lihat Dashboard User</span>
        </Link>
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-expense hover:bg-expense/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Admin</span>
        </Link>
      </div>
    </aside>
  );
}
