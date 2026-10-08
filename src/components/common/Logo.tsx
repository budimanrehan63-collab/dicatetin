import Link from "next/link";
import { WalletCards } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showIcon?: boolean;
}

export function Logo({
  className,
  size = "md",
  href = "/",
  showIcon = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-bold",
    lg: "text-2xl font-extrabold",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none font-heading group", className)}>
      {showIcon && (
        <div className="flex items-center justify-center p-1.5 rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105 shadow-subtle">
          <WalletCards className={iconSizes[size]} strokeWidth={2.2} />
        </div>
      )}
      <div className="flex items-baseline">
        <span className={cn("text-text-primary tracking-tight", sizeClasses[size])}>
          Dicate<span className="text-primary">tin</span>
        </span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold ml-0.5 animate-pulse" />
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
