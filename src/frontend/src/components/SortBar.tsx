import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SortBarProps {
  value: number;
  maxValue: number;
  index: number;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isPivot?: boolean;
  showValue?: boolean;
}

export function SortBar({
  value,
  maxValue,
  index,
  isComparing = false,
  isSwapping = false,
  isSorted = false,
  isPivot = false,
  showValue = false,
}: SortBarProps) {
  const heightPct = Math.max(4, (value / maxValue) * 100);

  const barColor = isPivot
    ? "bg-accent border-accent/50"
    : isSwapping
      ? "bg-destructive border-destructive/50"
      : isComparing
        ? "bg-secondary border-secondary/50"
        : isSorted
          ? "bg-[oklch(0.62_0.20_145)] border-[oklch(0.62_0.20_145)]/50"
          : "bg-primary/70 border-primary/40";

  const glowColor = isPivot
    ? "shadow-[0_0_8px_oklch(0.68_0.22_60/0.5)]"
    : isSwapping
      ? "shadow-[0_0_8px_oklch(0.56_0.24_22/0.5)]"
      : isComparing
        ? "shadow-[0_0_8px_oklch(0.55_0.26_252/0.5)]"
        : isSorted
          ? "shadow-[0_0_6px_oklch(0.62_0.20_145/0.4)]"
          : "";

  return (
    <motion.div
      key={index}
      className="flex flex-col items-center justify-end gap-1 flex-1"
      style={{ height: "100%" }}
    >
      {showValue && (
        <span className="text-[9px] font-mono text-muted-foreground">
          {value}
        </span>
      )}
      <motion.div
        layout
        className={cn(
          "w-full rounded-t border transition-colors duration-150",
          barColor,
          glowColor,
        )}
        style={{ height: `${heightPct}%` }}
        animate={{ height: `${heightPct}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
}

interface SortBarsContainerProps {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  height?: string;
  showValues?: boolean;
}

export function SortBarsContainer({
  array,
  comparing = [],
  swapping = [],
  sorted = [],
  pivot,
  height = "200px",
  showValues = false,
}: SortBarsContainerProps) {
  const maxValue = Math.max(...array, 1);

  return (
    <div
      className="flex items-end gap-0.5 w-full rounded-lg bg-background/50 border border-border/30 p-3"
      style={{ height }}
    >
      {array.map((value, idx) => (
        <SortBar
          key={`bar-${idx}-${value}`}
          value={value}
          maxValue={maxValue}
          index={idx}
          isComparing={comparing.includes(idx)}
          isSwapping={swapping.includes(idx)}
          isSorted={sorted.includes(idx)}
          isPivot={pivot === idx}
          showValue={showValues}
        />
      ))}
    </div>
  );
}
