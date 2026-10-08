import React from "react";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface MoneyTextProps {
  amount: number | null | undefined;
  type?: "income" | "expense" | "transfer" | "neutral";
  showSign?: boolean;
  showPrefix?: boolean;
  className?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
}

export function MoneyText({
  amount,
  type = "neutral",
  showSign = false,
  showPrefix = true,
  className,
  size = "base",
}: MoneyTextProps) {
  const sizeClasses = {
    xs: "text-xs font-semibold",
    sm: "text-sm font-semibold",
    base: "text-base font-semibold",
    lg: "text-lg font-bold",
    xl: "text-xl font-bold",
    "2xl": "text-2xl font-extrabold tracking-tight",
    "3xl": "text-3xl font-extrabold tracking-tight",
  };

  const typeColorClasses = {
    income: "text-income",
    expense: "text-expense",
    transfer: "text-text-secondary",
    neutral: "text-text-primary",
  };

  const formatted = formatIDR(amount, {
    showSign: showSign && type !== "neutral",
    showPrefix,
  });

  return (
    <span
      className={cn(
        "tabular-nums font-heading inline-block select-text",
        sizeClasses[size],
        typeColorClasses[type],
        className
      )}
    >
      {formatted}
    </span>
  );
}
