import { cn } from "@/lib/utils";

interface AlgorithmBadgeProps {
  complexity: string;
  label?: string;
  variant?: "cyan" | "amber" | "blue" | "green" | "red" | "muted";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  cyan: "bg-primary/10 text-primary border-primary/30",
  amber: "bg-accent/10 text-accent border-accent/30",
  blue: "bg-secondary/10 text-secondary border-secondary/30",
  green:
    "bg-[oklch(0.62_0.20_145)]/10 text-[oklch(0.62_0.20_145)] border-[oklch(0.62_0.20_145)]/30",
  red: "bg-destructive/10 text-destructive border-destructive/30",
  muted: "bg-muted/50 text-muted-foreground border-border/40",
};

export function AlgorithmBadge({
  complexity,
  label,
  variant = "cyan",
  size = "md",
  className,
}: AlgorithmBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border rounded font-mono font-semibold",
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
        variantStyles[variant],
        className,
      )}
    >
      {label && (
        <span className="opacity-70 font-body font-normal">{label}:</span>
      )}
      {complexity}
    </span>
  );
}

// Preset complexity badges
export function BigOBadge({
  complexity,
  className,
}: { complexity: string; className?: string }) {
  const color =
    complexity.includes("n²") || complexity.includes("n^2")
      ? "red"
      : complexity.includes("n log") || complexity.includes("n·log")
        ? "cyan"
        : complexity.includes("log")
          ? "green"
          : complexity.includes("n!")
            ? "red"
            : "blue";

  return (
    <AlgorithmBadge
      complexity={complexity}
      label="O"
      variant={color as "cyan" | "amber" | "blue" | "green" | "red" | "muted"}
      className={className}
    />
  );
}
