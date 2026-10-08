import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-5 flex flex-col justify-between hover:border-primary/30 transition-all", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs md:text-sm font-medium text-text-secondary">{title}</span>
        <div className={cn("p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center", iconClassName)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
            {trend && (
              <span
                className={cn(
                  "font-semibold",
                  trend.isPositive ? "text-income" : "text-expense"
                )}
              >
                {trend.isPositive ? "▲" : "▼"} {trend.value}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
