import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-secondary mb-4 shadow-subtle">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-semibold text-text-primary mb-1 font-heading">{title}</h4>
      <p className="text-xs md:text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <>
          {actionHref ? (
            <Button asChild variant="default">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          ) : (
            <Button onClick={onAction} variant="default">
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
