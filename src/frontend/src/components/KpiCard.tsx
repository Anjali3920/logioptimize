import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "cyan" | "blue" | "amber" | "green" | "default";
  trend?: { value: number; label: string };
  className?: string;
}

const variantStyles: Record<
  string,
  { border: string; glow: string; iconBg: string; valueColor: string }
> = {
  cyan: {
    border: "border-primary/30",
    glow: "shadow-neon-cyan",
    iconBg: "bg-primary/10",
    valueColor: "text-primary",
  },
  blue: {
    border: "border-secondary/30",
    glow: "shadow-[0_0_20px_rgba(80,120,255,0.25)]",
    iconBg: "bg-secondary/10",
    valueColor: "text-secondary",
  },
  amber: {
    border: "border-accent/30",
    glow: "shadow-[0_0_20px_rgba(255,180,0,0.2)]",
    iconBg: "bg-accent/10",
    valueColor: "text-accent",
  },
  green: {
    border: "border-[oklch(0.62_0.20_145)]/30",
    glow: "shadow-[0_0_20px_rgba(0,200,120,0.2)]",
    iconBg: "bg-[oklch(0.62_0.20_145)]/10",
    valueColor: "text-[oklch(0.62_0.20_145)]",
  },
  default: {
    border: "border-border/40",
    glow: "",
    iconBg: "bg-muted",
    valueColor: "text-foreground",
  },
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: KpiCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "kpi-card relative overflow-hidden",
        styles.border,
        styles.glow,
        className,
      )}
    >
      {/* Top gradient line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px",
          variant === "cyan" &&
            "bg-gradient-to-r from-transparent via-primary/60 to-transparent",
          variant === "blue" &&
            "bg-gradient-to-r from-transparent via-secondary/60 to-transparent",
          variant === "amber" &&
            "bg-gradient-to-r from-transparent via-accent/60 to-transparent",
          variant === "green" &&
            "bg-gradient-to-r from-transparent via-[oklch(0.62_0.20_145)]/60 to-transparent",
          variant === "default" &&
            "bg-gradient-to-r from-transparent via-border/60 to-transparent",
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
            {title}
          </p>
          <p
            className={cn(
              "text-3xl font-display font-bold tracking-tight",
              styles.valueColor,
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-xs font-mono",
                trend.value >= 0
                  ? "text-[oklch(0.62_0.20_145)]"
                  : "text-destructive",
              )}
            >
              <span>{trend.value >= 0 ? "▲" : "▼"}</span>
              <span>
                {Math.abs(trend.value)}% {trend.label}
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={cn("p-2.5 rounded-md flex-shrink-0", styles.iconBg)}>
            <Icon className={cn("w-5 h-5", styles.valueColor)} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
