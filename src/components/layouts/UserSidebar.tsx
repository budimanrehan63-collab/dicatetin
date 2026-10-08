"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ScanLine,
  Wallet,
  PieChart,
  BarChart3,
  Send,
  Settings,
  HelpCircle,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  isPro?: boolean;
}

export const USER_NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/app", icon: LayoutDashboard },
  { label: "Transaksi", href: "/app/transaksi", icon: Receipt },
  { label: "Scan Struk", href: "/app/scan", icon: ScanLine, isPro: true },
  { label: "Wallet", href: "/app/wallet", icon: Wallet },
  { label: "Budget", href: "/app/budget", icon: PieChart },
  { label: "Laporan & Export", href: "/app/laporan", icon: BarChart3 },
  { label: "Telegram Bot", href: "/app/telegram", icon: Send, isPro: true },
  { label: "Pengaturan", href: "/app/pengaturan", icon: Settings },
  { label: "Tutorial", href: "/app/tutorial", icon: HelpCircle },
];

interface UserSidebarProps {
  userPlan?: string; // 'basic' | 'pro'
}

export function UserSidebar({ userPlan = "pro" }: UserSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface min-h-screen p-4 justify-between shrink-0 select-none">
      <div>
        <div className="px-3 py-3 mb-4">
          <Logo size="md" href="/app" />
        </div>

        <nav className="space-y-1">
          {USER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-text-secondary hover:text-text-primary hover:bg-background/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      isActive
                        ? "text-primary-foreground"
                        : "text-text-secondary group-hover:text-primary"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.isPro && (
                  <span
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gold/15 text-gold"
                    )}
                  >
                    PRO
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Plan & Footer badge */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/15 text-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary capitalize">
                Paket {userPlan}
              </p>
              <p className="text-[10px] text-text-secondary">Aktif s/d 30 Hari</p>
            </div>
          </div>
          {userPlan !== "pro" && (
            <Link
              href="/app/pengaturan"
              className="text-xs text-primary font-bold hover:underline"
            >
              Upgrade
            </Link>
          )}
        </div>

        <Link
          href="/api/auth/logout"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-expense hover:bg-expense/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </Link>
      </div>
    </aside>
  );
}
