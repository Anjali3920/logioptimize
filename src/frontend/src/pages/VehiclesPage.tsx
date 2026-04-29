import { AlgorithmBadge } from "@/components/AlgorithmBadge";
import { KpiCard } from "@/components/KpiCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { KnapsackItem, Vehicle } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Play,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Static fleet data ────────────────────────────────────────────────────────

const FLEET: Vehicle[] = [
  {
    id: "van-a",
    name: "Van A",
    capacity: 100,
    fuelCost: 0.12,
    currentLoad: 67,
    assignedDeliveries: ["D1", "D3", "D5"],
    status: "IN_USE",
  },
  {
    id: "van-b",
    name: "Van B",
    capacity: 80,
    fuelCost: 0.1,
    currentLoad: 22,
    assignedDeliveries: ["D2"],
    status: "AVAILABLE",
  },
  {
    id: "van-c",
    name: "Van C",
    capacity: 150,
    fuelCost: 0.15,
    currentLoad: 114,
    assignedDeliveries: ["D4", "D6", "D7", "D8"],
    status: "IN_USE",
  },
  {
    id: "van-d",
    name: "Van D",
    capacity: 120,
    fuelCost: 0.13,
    currentLoad: 0,
    assignedDeliveries: [],
    status: "MAINTENANCE",
  },
];

// ─── Activity Selection data ───────────────────────────────────────────────────

interface DeliveryJob {
  id: string;
  label: string;
  start: number;
  end: number;
  location: string;
}

const JOBS: DeliveryJob[] = [
  { id: "j1", label: "J1", start: 0, end: 3, location: "Downtown" },
  { id: "j2", label: "J2", start: 1, end: 4, location: "Midtown" },
  { id: "j3", label: "J3", start: 3, end: 5, location: "Uptown" },
  { id: "j4", label: "J4", start: 0, end: 2, location: "Eastside" },
  { id: "j5", label: "J5", start: 5, end: 7, location: "Westside" },
  { id: "j6", label: "J6", start: 4, end: 6, location: "Harbor" },
  { id: "j7", label: "J7", start: 6, end: 9, location: "Airport" },
  { id: "j8", label: "J8", start: 2, end: 4, location: "Southport" },
  { id: "j9", label: "J9", start: 7, end: 10, location: "Northgate" },
  { id: "j10", label: "J10", start: 8, end: 11, location: "Riverside" },
  { id: "j11", label: "J11", start: 9, end: 12, location: "Market St" },
  { id: "j12", label: "J12", start: 2, end: 6, location: "Tech Park" },
];

// ─── Fractional Knapsack data ─────────────────────────────────────────────────

interface PackageItem extends KnapsackItem {
  ratio: number;
  fraction?: number;
  fractionalWeight?: number;
}

const PACKAGES: PackageItem[] = [
  { id: "p1", name: "Electronics Batch", weight: 15, value: 240, ratio: 16.0 },
  { id: "p2", name: "Pharma Supplies", weight: 10, value: 150, ratio: 15.0 },
  { id: "p3", name: "Luxury Apparel", weight: 20, value: 260, ratio: 13.0 },
  { id: "p4", name: "Auto Parts", weight: 30, value: 330, ratio: 11.0 },
  { id: "p5", name: "Food Crate", weight: 25, value: 225, ratio: 9.0 },
  { id: "p6", name: "Office Supplies", weight: 12, value: 96, ratio: 8.0 },
  { id: "p7", name: "Hardware Tools", weight: 18, value: 126, ratio: 7.0 },
  { id: "p8", name: "Textile Rolls", weight: 22, value: 132, ratio: 6.0 },
];

const KNAPSACK_CAPACITY = 100;

// ─── Job Scheduling data ──────────────────────────────────────────────────────

interface ScheduleJob {
  id: string;
  label: string;
  profit: number;
  deadline: number;
  slot?: number;
  scheduled?: boolean;
}

const SCHEDULE_JOBS: ScheduleJob[] = [
  { id: "s1", label: "Depot Run A", profit: 200, deadline: 2 },
  { id: "s2", label: "VIP Express", profit: 180, deadline: 1 },
  { id: "s3", label: "Cold Chain", profit: 150, deadline: 3 },
  { id: "s4", label: "Bulk Freight", profit: 120, deadline: 3 },
  { id: "s5", label: "Night Delivery", profit: 100, deadline: 2 },
  { id: "s6", label: "Standard Parcel", profit: 80, deadline: 1 },
];

// ─── Algorithm implementations ────────────────────────────────────────────────

function runActivitySelection(jobs: DeliveryJob[]): Set<string> {
  const sorted = [...jobs].sort((a, b) => a.end - b.end);
  const selected: string[] = [];
  let lastEnd = -1;
  for (const job of sorted) {
    if (job.start >= lastEnd) {
      selected.push(job.id);
      lastEnd = job.end;
    }
  }
  return new Set(selected);
}

interface KnapsackResult {
  packed: PackageItem[];
  totalValue: number;
  totalWeight: number;
}

function runFractionalKnapsack(
  items: PackageItem[],
  capacity: number,
): KnapsackResult {
  const sorted = [...items].sort((a, b) => b.ratio - a.ratio);
  let remaining = capacity;
  let totalValue = 0;
  let totalWeight = 0;
  const packed: PackageItem[] = [];
  for (const item of sorted) {
    if (remaining <= 0) break;
    if (item.weight <= remaining) {
      packed.push({ ...item, fraction: 1.0, fractionalWeight: item.weight });
      totalValue += item.value;
      totalWeight += item.weight;
      remaining -= item.weight;
    } else {
      const frac = remaining / item.weight;
      packed.push({ ...item, fraction: frac, fractionalWeight: remaining });
      totalValue += item.value * frac;
      totalWeight += remaining;
      remaining = 0;
    }
  }
  return { packed, totalValue, totalWeight };
}

function runDP01Knapsack(
  items: KnapsackItem[],
  capacity: number,
): { selectedItems: KnapsackItem[]; totalValue: number } {
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (items[i - 1].weight <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - items[i - 1].weight] + items[i - 1].value,
        );
      }
    }
  }
  const selected: KnapsackItem[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      w -= items[i - 1].weight;
    }
  }
  return { selectedItems: selected, totalValue: dp[n][capacity] };
}

function runGreedy01(items: PackageItem[], capacity: number): number {
  const sorted = [...items].sort((a, b) => b.ratio - a.ratio);
  let remaining = capacity;
  let total = 0;
  for (const item of sorted) {
    if (item.weight <= remaining) {
      total += item.value;
      remaining -= item.weight;
    }
  }
  return total;
}

function runJobScheduling(jobs: ScheduleJob[]): {
  scheduled: ScheduleJob[];
  totalProfit: number;
} {
  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
  const maxSlot = Math.max(...jobs.map((j) => j.deadline));
  const slots: (string | null)[] = new Array(maxSlot).fill(null);
  const scheduled: ScheduleJob[] = [];
  for (const job of sorted) {
    for (let s = job.deadline - 1; s >= 0; s--) {
      if (slots[s] === null) {
        slots[s] = job.id;
        scheduled.push({ ...job, slot: s + 1, scheduled: true });
        break;
      }
    }
  }
  return {
    scheduled,
    totalProfit: scheduled.reduce((a, j) => a + j.profit, 0),
  };
}

// ─── Neon color palette for charts ───────────────────────────────────────────

const NEON: string[] = [
  "#00e5ff",
  "#6366f1",
  "#f59e0b",
  "#22c55e",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
];

// ─── Vehicle card ─────────────────────────────────────────────────────────────

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  const pct = Math.round((vehicle.currentLoad / vehicle.capacity) * 100);
  const barColor =
    pct > 80 ? "bg-destructive" : pct > 50 ? "bg-accent" : "bg-primary";
  const statusLabel =
    vehicle.status === "AVAILABLE"
      ? "Available"
      : vehicle.status === "IN_USE"
        ? "In Use"
        : "Maintenance";
  const statusCls =
    vehicle.status === "AVAILABLE"
      ? "text-[oklch(0.62_0.20_145)] border-[oklch(0.62_0.20_145)]/30"
      : vehicle.status === "IN_USE"
        ? "text-primary border-primary/30"
        : "text-muted-foreground border-border/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card-elevated p-5 flex flex-col gap-3"
      data-ocid={`vehicles.fleet.item.${index + 1}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-md">
            <Truck className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-foreground">
            {vehicle.name}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-mono ${statusCls}`}
        >
          {statusLabel}
        </Badge>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Load: {vehicle.currentLoad}kg</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: index * 0.08 + 0.3,
            }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Remaining: {vehicle.capacity - vehicle.currentLoad}kg / Cap:{" "}
          {vehicle.capacity}kg
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Package className="w-3.5 h-3.5" />
        <span>{vehicle.assignedDeliveries.length} packages assigned</span>
      </div>
    </motion.div>
  );
}

// ─── Gantt timeline SVG ───────────────────────────────────────────────────────

function ActivityTimeline({
  jobs,
  selectedIds,
}: {
  jobs: DeliveryJob[];
  selectedIds: Set<string>;
}) {
  const TOTAL_HOURS = 12;
  const ROW_H = 28;
  const ROW_GAP = 6;
  const LABEL_W = 36;
  const COL_W = 38;
  const svgH = jobs.length * (ROW_H + ROW_GAP) + 28;
  const svgW = LABEL_W + TOTAL_HOURS * COL_W + 8;

  return (
    <div className="overflow-x-auto scrollbar-thin rounded-lg bg-muted/10 border border-border/20 p-3">
      <svg
        width={svgW}
        height={svgH}
        role="img"
        aria-label="Activity selection Gantt chart"
        className="font-mono"
      >
        {/* Hour grid lines */}
        {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
          const hour = i;
          return (
            <g key={`grid-hr-h${hour}`}>
              <line
                x1={LABEL_W + i * COL_W}
                y1={0}
                x2={LABEL_W + i * COL_W}
                y2={svgH - 12}
                stroke="oklch(0.26 0.025 262 / 0.35)"
                strokeWidth={1}
                strokeDasharray={i === 0 ? "none" : "3 3"}
              />
              <text
                x={LABEL_W + i * COL_W}
                y={svgH - 2}
                textAnchor="middle"
                fontSize={9}
                fill="oklch(0.55 0.018 262)"
              >
                {i}h
              </text>
            </g>
          );
        })}

        {/* Job bars */}
        {jobs.map((job, idx) => {
          const isSelected = selectedIds.has(job.id);
          const x = LABEL_W + job.start * COL_W;
          const barW = (job.end - job.start) * COL_W;
          const y = idx * (ROW_H + ROW_GAP) + 4;

          return (
            <g key={job.id}>
              <text
                x={LABEL_W - 4}
                y={y + ROW_H / 2 + 4}
                textAnchor="end"
                fontSize={9}
                fill="oklch(0.55 0.018 262)"
                fontWeight="600"
              >
                {job.label}
              </text>
              <rect
                x={x + 2}
                y={y}
                width={barW - 4}
                height={ROW_H}
                rx={4}
                fill={
                  isSelected
                    ? "oklch(0.63 0.3 200 / 0.22)"
                    : "oklch(0.22 0.018 262 / 0.7)"
                }
                stroke={
                  isSelected ? "oklch(0.63 0.3 200)" : "oklch(0.26 0.025 262)"
                }
                strokeWidth={isSelected ? 1.5 : 1}
              />
              {isSelected && (
                <rect
                  x={x + 2}
                  y={y}
                  width={barW - 4}
                  height={2}
                  rx={1}
                  fill="oklch(0.63 0.3 200)"
                />
              )}
              <text
                x={x + barW / 2}
                y={y + ROW_H / 2 + 4}
                textAnchor="middle"
                fontSize={9}
                fill={
                  isSelected ? "oklch(0.85 0.015 200)" : "oklch(0.55 0.018 262)"
                }
                fontWeight={isSelected ? "700" : "400"}
              >
                {job.location}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function VehiclesPage() {
  // Activity Selection
  const [activityRan, setActivityRan] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  // Fractional Knapsack
  const [knapsackRan, setKnapsackRan] = useState(false);
  const [knapsackResult, setKnapsackResult] = useState<KnapsackResult | null>(
    null,
  );

  // Greedy vs DP
  const [comparisonRan, setComparisonRan] = useState(false);
  const [greedyValue, setGreedyValue] = useState(0);
  const [dpValue, setDpValue] = useState(0);
  const [dpItems, setDpItems] = useState<KnapsackItem[]>([]);

  // Job Scheduling
  const [scheduleRan, setScheduleRan] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<{
    scheduled: ScheduleJob[];
    totalProfit: number;
  } | null>(null);

  const handleActivitySelection = () => {
    setSelectedJobIds(runActivitySelection(JOBS));
    setActivityRan(true);
  };

  const handleKnapsack = () => {
    setKnapsackResult(runFractionalKnapsack(PACKAGES, KNAPSACK_CAPACITY));
    setKnapsackRan(true);
  };

  const handleComparison = () => {
    const gv = runGreedy01(PACKAGES, KNAPSACK_CAPACITY);
    const { totalValue, selectedItems } = runDP01Knapsack(
      PACKAGES,
      KNAPSACK_CAPACITY,
    );
    setGreedyValue(gv);
    setDpValue(totalValue);
    setDpItems(selectedItems);
    setComparisonRan(true);
  };

  const handleSchedule = () => {
    setScheduleResult(runJobScheduling(SCHEDULE_JOBS));
    setScheduleRan(true);
  };

  // Fleet KPI totals
  const totalCapacity = FLEET.reduce((a, v) => a + v.capacity, 0);
  const totalLoad = FLEET.reduce((a, v) => a + v.currentLoad, 0);
  const totalPackages = FLEET.reduce(
    (a, v) => a + v.assignedDeliveries.length,
    0,
  );
  const activeVehicles = FLEET.filter((v) => v.status !== "MAINTENANCE").length;

  // Pie chart data for fractional knapsack weight distribution
  const pieData: { name: string; value: number; fill: string }[] = [];
  if (knapsackResult) {
    for (let i = 0; i < knapsackResult.packed.length; i++) {
      const p = knapsackResult.packed[i];
      pieData.push({
        name: p.name,
        value: Math.round((p.fractionalWeight ?? p.weight) * 10) / 10,
        fill: NEON[i % NEON.length],
      });
    }
    const unused =
      Math.round((KNAPSACK_CAPACITY - knapsackResult.totalWeight) * 10) / 10;
    if (unused > 0.1) {
      pieData.push({
        name: "Empty",
        value: unused,
        fill: "oklch(0.22 0.018 262)",
      });
    }
  }

  // Bar chart for Greedy vs DP comparison
  const compBarData = comparisonRan
    ? [
        {
          name: "Greedy (0/1)",
          value: greedyValue,
          fill: "oklch(0.68 0.22 60)",
        },
        { name: "DP Optimal", value: dpValue, fill: "oklch(0.63 0.3 200)" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background surface-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* ── Page Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
          data-ocid="vehicles.page"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg neon-cyan-border self-start">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-cyan-text">
                Module 3: Vehicle Assignment — Greedy Engine
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Fast approximate solutions for real-time logistics
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AlgorithmBadge
              label="Activity Selection"
              complexity="O(n log n)"
              variant="cyan"
            />
            <AlgorithmBadge
              label="Fractional Knapsack"
              complexity="O(n log n)"
              variant="blue"
            />
            <AlgorithmBadge
              label="Job Scheduling"
              complexity="O(n log n)"
              variant="amber"
            />
          </div>
        </motion.div>

        {/* ── KPI Row ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard
            title="Fleet Size"
            value={FLEET.length}
            subtitle="Total vehicles"
            icon={Truck}
            variant="cyan"
          />
          <KpiCard
            title="Active"
            value={activeVehicles}
            subtitle="In service"
            icon={Zap}
            variant="green"
          />
          <KpiCard
            title="Fleet Load"
            value={`${Math.round((totalLoad / totalCapacity) * 100)}%`}
            subtitle={`${totalLoad}kg / ${totalCapacity}kg`}
            icon={Package}
            variant="amber"
          />
          <KpiCard
            title="Packages"
            value={totalPackages}
            subtitle="Assigned total"
            icon={TrendingUp}
            variant="blue"
          />
        </div>

        {/* ── Vehicle Fleet Overview ───────────────────── */}
        <section className="space-y-4" data-ocid="vehicles.fleet.section">
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <span className="w-1.5 h-5 bg-primary rounded-full inline-block" />
            Vehicle Fleet Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLEET.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
        </section>

        {/* ── Activity Selection Demo ──────────────────── */}
        <section
          className="card-elevated p-6 space-y-5"
          data-ocid="vehicles.activity.section"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                Activity Selection — Max Deliveries Per Vehicle
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sort jobs by finish time → greedily pick non-overlapping
                deliveries
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AlgorithmBadge complexity="O(n log n)" variant="cyan" />
              <Button
                size="sm"
                onClick={handleActivitySelection}
                data-ocid="vehicles.activity.run_button"
                className="gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Run Activity Selection
              </Button>
            </div>
          </div>

          <ActivityTimeline jobs={JOBS} selectedIds={selectedJobIds} />

          <AnimatePresence>
            {activityRan && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap items-center gap-2.5 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-sm font-mono"
                data-ocid="vehicles.activity.success_state"
              >
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-primary font-bold">
                  Selected: {selectedJobIds.size} out of {JOBS.length} jobs
                </span>
                <span className="text-muted-foreground">
                  — Maximum non-overlapping deliveries
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Fractional Knapsack Demo ─────────────────── */}
        <section
          className="card-elevated p-6 space-y-5"
          data-ocid="vehicles.knapsack.section"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                Fractional Knapsack — Maximize Value Per Trip
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vehicle capacity: {KNAPSACK_CAPACITY}kg · Sort by value/weight
                ratio, fill greedily (fractions allowed)
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AlgorithmBadge complexity="O(n log n)" variant="blue" />
              <Button
                size="sm"
                variant="outline"
                onClick={handleKnapsack}
                data-ocid="vehicles.knapsack.run_button"
                className="gap-1.5 border-secondary/40 text-secondary hover:bg-secondary/10"
              >
                <Play className="w-3.5 h-3.5" />
                Run Greedy Knapsack
              </Button>
            </div>
          </div>

          {/* Package table */}
          <div className="overflow-x-auto scrollbar-thin rounded-lg border border-border/30">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border/30 bg-muted/30">
                  {["Package", "Weight", "Value", "Ratio", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground ${h === "Package" ? "text-left" : h === "Status" ? "text-center" : "text-right"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map((pkg, i) => {
                  const packedEntry = knapsackResult?.packed.find(
                    (p) => p.id === pkg.id,
                  );
                  const isFull =
                    packedEntry && (packedEntry.fraction ?? 1) >= 0.999;
                  const isFrac =
                    packedEntry && (packedEntry.fraction ?? 1) < 0.999;

                  return (
                    <tr
                      key={pkg.id}
                      className={`border-b border-border/20 transition-colors ${packedEntry ? "bg-primary/5" : "hover:bg-muted/20"}`}
                      data-ocid={`vehicles.knapsack.item.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 text-foreground">
                        {pkg.name}
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">
                        {pkg.weight}kg
                      </td>
                      <td className="px-4 py-2.5 text-right text-accent">
                        ${pkg.value}
                      </td>
                      <td className="px-4 py-2.5 text-right text-primary font-semibold">
                        {pkg.ratio.toFixed(1)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {!knapsackRan && (
                          <span className="text-muted-foreground text-xs">
                            —
                          </span>
                        )}
                        {isFull && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-[oklch(0.62_0.20_145)] border-[oklch(0.62_0.20_145)]/40"
                          >
                            Full
                          </Badge>
                        )}
                        {isFrac && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-accent border-accent/40"
                          >
                            {Math.round((packedEntry.fraction ?? 0) * 100)}%
                          </Badge>
                        )}
                        {knapsackRan && !packedEntry && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-muted-foreground border-border/40"
                          >
                            Skipped
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <AnimatePresence>
            {knapsackRan && knapsackResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 gap-4"
                data-ocid="vehicles.knapsack.success_state"
              >
                <div className="flex flex-col justify-center gap-3">
                  <div className="px-4 py-3 rounded-lg bg-[oklch(0.62_0.20_145)]/10 border border-[oklch(0.62_0.20_145)]/30 font-mono text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[oklch(0.62_0.20_145)] flex-shrink-0" />
                    <span>
                      <span className="text-[oklch(0.62_0.20_145)] font-bold">
                        Total value: ${Math.round(knapsackResult.totalValue)}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        (
                        {(
                          (knapsackResult.totalWeight / KNAPSACK_CAPACITY) *
                          100
                        ).toFixed(1)}
                        % efficiency)
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">
                    Weight distribution of packed items vs remaining capacity (
                    {KNAPSACK_CAPACITY}kg total)
                  </p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={78}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={`pie-cell-${entry.name}`}
                            fill={entry.fill}
                            stroke="oklch(0.15 0.012 262)"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.18 0.014 262)",
                          border: "1px solid oklch(0.26 0.025 262)",
                          borderRadius: "6px",
                          fontSize: "11px",
                        }}
                        itemStyle={{ color: "oklch(0.93 0.012 262)" }}
                        formatter={(v: number) => [`${v}kg`, ""]}
                      />
                      <Legend
                        iconSize={8}
                        wrapperStyle={{ fontSize: "10px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Greedy vs DP ────────────────────────────── */}
        <section
          className="card-elevated p-6 space-y-5"
          data-ocid="vehicles.comparison.section"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
                Where Greedy Fails — 0/1 Knapsack Case
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                When items cannot be split, greedy ratio-sorting misses the
                global optimum
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AlgorithmBadge
                label="Greedy vs DP"
                complexity="O(n·W)"
                variant="amber"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleComparison}
                data-ocid="vehicles.comparison.run_button"
                className="gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
              >
                <Play className="w-3.5 h-3.5" />
                Run Comparison
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!comparisonRan ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2"
                data-ocid="vehicles.comparison.empty_state"
              >
                <DollarSign className="w-8 h-8 opacity-30" />
                <span>Click "Run Comparison" to see Greedy vs DP results</span>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
                data-ocid="vehicles.comparison.success_state"
              >
                {/* Side-by-side result cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-2">
                    <div className="text-xs font-mono text-accent uppercase tracking-wider">
                      Greedy (0/1 — by ratio)
                    </div>
                    <div className="text-3xl font-display font-bold text-accent">
                      ${greedyValue}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Picks by ratio but skips items that don't fit exactly
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
                    <div className="text-xs font-mono text-primary uppercase tracking-wider">
                      DP Optimal (0/1 Knapsack)
                    </div>
                    <div className="text-3xl font-display font-bold text-primary">
                      ${dpValue}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Items:{" "}
                      {dpItems.map((i) => i.name.split(" ")[0]).join(", ")}
                    </div>
                  </div>
                </div>

                {/* Bar chart */}
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={compBarData}
                      margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.26 0.025 262 / 0.4)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: "oklch(0.6 0.018 262)",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                      <YAxis
                        tick={{
                          fill: "oklch(0.6 0.018 262)",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                        }}
                        tickFormatter={(v: number) => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.18 0.014 262)",
                          border: "1px solid oklch(0.26 0.025 262)",
                          borderRadius: "6px",
                          fontSize: "11px",
                        }}
                        formatter={(v: number) => [`$${v}`, "Total Value"]}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {compBarData.map((entry) => (
                          <Cell
                            key={`comp-cell-${entry.name}`}
                            fill={entry.fill}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Warning card */}
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-sm font-bold text-destructive">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Greedy gave suboptimal result!{" "}
                    {(((dpValue - greedyValue) / dpValue) * 100).toFixed(1)}%
                    value lost vs optimal DP
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Greedy works for{" "}
                    <span className="text-primary font-semibold">
                      Fractional Knapsack
                    </span>{" "}
                    (items can be split) but fails for{" "}
                    <span className="text-destructive font-semibold">
                      0/1 Knapsack
                    </span>{" "}
                    where partial items aren't allowed. Dynamic Programming
                    guarantees the globally optimal selection via exhaustive
                    memoized subproblem evaluation — at{" "}
                    <span className="text-accent font-semibold">O(n·W)</span>{" "}
                    cost.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Job Scheduling with Deadlines ─────────────── */}
        <section
          className="card-elevated p-6 space-y-5"
          data-ocid="vehicles.schedule.section"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                Job Scheduling with Deadlines
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Greedy: sort by profit → assign to latest free slot ≤ deadline
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AlgorithmBadge complexity="O(n log n)" variant="amber" />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSchedule}
                data-ocid="vehicles.schedule.run_button"
                className="gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
              >
                <Play className="w-3.5 h-3.5" />
                Schedule Jobs
              </Button>
            </div>
          </div>

          {/* Job grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SCHEDULE_JOBS.map((job, i) => {
              const isScheduled = scheduleResult?.scheduled.find(
                (s) => s.id === job.id,
              );
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-lg border p-3 text-center transition-smooth ${
                    !scheduleRan
                      ? "border-border/30 bg-muted/20"
                      : isScheduled
                        ? "border-primary/40 bg-primary/8 shadow-[0_0_14px_oklch(0.63_0.3_200/0.18)]"
                        : "border-border/20 bg-muted/10 opacity-50"
                  }`}
                  data-ocid={`vehicles.schedule.item.${i + 1}`}
                >
                  <div className="text-xs font-mono text-muted-foreground mb-1">
                    {job.label}
                  </div>
                  <div className="text-lg font-display font-bold text-accent">
                    ${job.profit}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>DL: Slot {job.deadline}</span>
                  </div>
                  {scheduleRan && isScheduled && (
                    <div className="text-[10px] text-primary font-mono mt-1 font-bold">
                      → Slot {isScheduled.slot}
                    </div>
                  )}
                  {scheduleRan && !isScheduled && (
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                      Dropped
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {scheduleRan && scheduleResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap items-center gap-3"
                data-ocid="vehicles.schedule.success_state"
              >
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 font-mono text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-primary font-bold">
                    Scheduled {scheduleResult.scheduled.length}/
                    {SCHEDULE_JOBS.length} jobs
                  </span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-accent font-semibold">
                    Total profit: ${scheduleResult.totalProfit}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {SCHEDULE_JOBS.length - scheduleResult.scheduled.length} jobs
                  dropped (no slot available before deadline)
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
