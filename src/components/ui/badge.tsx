import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-border bg-surface text-text-secondary hover:bg-border/60",
        destructive:
          "border-transparent bg-expense/10 text-expense hover:bg-expense/20",
        income:
          "border-transparent bg-income/10 text-income hover:bg-income/20",
        warning:
          "border-transparent bg-budgetWarning/10 text-budgetWarning hover:bg-budgetWarning/20",
        gold:
          "border-transparent bg-gold/15 text-gold hover:bg-gold/25 font-bold",
        outline: "text-text-primary border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
