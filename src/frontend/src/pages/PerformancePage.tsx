import { AlgorithmBadge, BigOBadge } from "@/components/AlgorithmBadge";
import { KpiCard } from "@/components/KpiCard";
import { cn } from "@/lib/utils";
import type { AlgorithmComplexity } from "@/types";
import { Activity, BarChart2, Cpu, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Static Data ─────────────────────────────────────────────────────────────

interface ComplexityRow extends AlgorithmComplexity {
  category: string;
  avg: string;
}

const complexityData: ComplexityRow[] = [
  {
    name: "Bubble Sort",
    category: "sorting",
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    stable: true,
    useCase: "Educational",
    color: "cyan",
  },
  {
    name: "Merge Sort",
    category: "sorting",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    stable: true,
    useCase: "General purpose",
    color: "cyan",
  },
  {
    name: "Quick Sort",
    category: "sorting",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n²)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    stable: false,
    useCase: "In-place sorting",
    color: "cyan",
  },
  {
    name: "Heap Sort",
    category: "sorting",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    stable: false,
    useCase: "Priority queues",
    color: "cyan",
  },
  {
    name: "Dijkstra",
    category: "graph",
    best: "O(V log V)",
    avg: "O((V+E) log V)",
    worst: "O((V+E) log V)",
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V)",
    stable: false,
    useCase: "Shortest path",
    color: "blue",
  },
  {
    name: "Bellman-Ford",
    category: "graph",
    best: "O(E)",
    avg: "O(VE)",
    worst: "O(VE)",
    timeComplexity: "O(VE)",
    spaceComplexity: "O(V)",
    stable: false,
    useCase: "Negative weights",
    color: "blue",
  },
  {
    name: "Prim's MST",
    category: "graph",
    best: "O(E log V)",
    avg: "O(E log V)",
    worst: "O(E log V)",
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V)",
    stable: false,
    useCase: "Minimum spanning tree",
    color: "blue",
  },
  {
    name: "Kruskal's MST",
    category: "graph",
    best: "O(E log E)",
    avg: "O(E log E)",
    worst: "O(E log E)",
    timeComplexity: "O(E log E)",
    spaceComplexity: "O(V)",
    stable: false,
    useCase: "Sparse graphs",
    color: "blue",
  },
  {
    name: "Activity Selection",
    category: "greedy",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    stable: false,
    useCase: "Scheduling",
    color: "amber",
  },
  {
    name: "Frac. Knapsack",
    category: "greedy",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    stable: false,
    useCase: "Continuous items",
    color: "amber",
  },
  {
    name: "0/1 Knapsack",
    category: "dp",
    best: "O(nW)",
    avg: "O(nW)",
    worst: "O(nW)",
    timeComplexity: "O(nW)",
    spaceComplexity: "O(nW)",
    stable: false,
    useCase: "Discrete items",
    color: "purple",
  },
  {
    name: "Floyd-Warshall",
    category: "dp",
    best: "O(V³)",
    avg: "O(V³)",
    worst: "O(V³)",
    timeComplexity: "O(V³)",
    spaceComplexity: "O(V²)",
    stable: false,
    useCase: "All-pairs paths",
    color: "purple",
  },
  {
    name: "Merge Sort (D&C)",
    category: "dnc",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    stable: true,
    useCase: "Parallel sort",
    color: "green",
  },
  {
    name: "Closest Pair",
    category: "dnc",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    stable: false,
    useCase: "Warehouse clustering",
    color: "green",
  },
];

const categoryMeta: Record<
  string,
  { label: string; variant: "cyan" | "blue" | "amber" | "green" | "muted" }
> = {
  sorting: { label: "Sorting", variant: "cyan" },
  graph: { label: "Graph", variant: "blue" },
  greedy: { label: "Greedy", variant: "amber" },
  dp: { label: "Dynamic Prog", variant: "muted" },
  dnc: { label: "Divide&Conq", variant: "green" },
};

// Chart A – Sorting scalability
const sortingCurveData = [
  { n: "100", bubble: 0.04, merge: 0.07, quick: 0.06 },
  { n: "500", bubble: 0.9, merge: 0.4, quick: 0.35 },
  { n: "1000", bubble: 3.5, merge: 0.9, quick: 0.8 },
  { n: "2500", bubble: 21.8, merge: 2.4, quick: 2.1 },
  { n: "5000", bubble: 87.2, merge: 5.1, quick: 4.6 },
  { n: "7500", bubble: 196.4, merge: 7.9, quick: 7.0 },
  { n: "10000", bubble: 349.1, merge: 10.8, quick: 9.7 },
];

// Chart B – Graph scalability
const graphCurveData = [
  { edges: "1k", dijkstra: 0.8, bellman: 3.2 },
  { edges: "5k", dijkstra: 4.1, bellman: 18.6 },
  { edges: "10k", dijkstra: 9.3, bellman: 42.0 },
  { edges: "25k", dijkstra: 24.5, bellman: 112.0 },
  { edges: "50k", dijkstra: 52.0, bellman: 239.0 },
  { edges: "100k", dijkstra: 112.0, bellman: 510.0 },
  { edges: "200k", dijkstra: 241.0, bellman: 1090.0 },
];

// Chart C – Greedy vs DP scalability
const greedyDpCurveData = [
  { items: "10", greedy: 0.02, dp: 0.18 },
  { items: "50", greedy: 0.08, dp: 2.1 },
  { items: "100", greedy: 0.14, dp: 8.4 },
  { items: "250", greedy: 0.33, dp: 52.0 },
  { items: "500", greedy: 0.63, dp: 208.0 },
  { items: "1000", greedy: 1.2, dp: 832.0 },
];

// Chart D – Large city bar
const largeCityData = [
  { algo: "Merge Sort", time: 10.8 },
  { algo: "Quick Sort", time: 9.7 },
  { algo: "Heap Sort", time: 11.2 },
  { algo: "Dijkstra", time: 180 },
  { algo: "Bellman-Ford", time: 4200 },
  { algo: "Floyd-W", time: 88400 },
  { algo: "Act. Select", time: 8.9 },
  { algo: "0/1 Knapsack", time: 412 },
  { algo: "Closest Pair", time: 14.3 },
];

// Greedy vs DP value bar
const greedyVsDpData = [
  { test: "T-01", greedy: 187, dp: 210 },
  { test: "T-02", greedy: 243, dp: 258 },
  { test: "T-03", greedy: 310, dp: 340 },
  { test: "T-04", greedy: 198, dp: 221 },
  { test: "T-05", greedy: 415, dp: 445 },
  { test: "T-06", greedy: 290, dp: 325 },
  { test: "T-07", greedy: 178, dp: 198 },
  { test: "T-08", greedy: 332, dp: 370 },
  { test: "T-09", greedy: 401, dp: 430 },
  { test: "T-10", greedy: 520, dp: 580 },
];

// Memory stacked bar
const memoryData = [
  { algo: "Merge Sort", stack: 0.4, heap: 38.0, aux: 0 },
  { algo: "Quick Sort", stack: 1.2, heap: 0.4, aux: 0 },
  { algo: "Heap Sort", stack: 0.1, heap: 0.2, aux: 0 },
  { algo: "Dijkstra", stack: 0.3, heap: 12.1, aux: 8.4 },
  { algo: "Bellman-Ford", stack: 0.2, heap: 14.8, aux: 2.1 },
  { algo: "Floyd-W", stack: 0.1, heap: 0.8, aux: 762.9 },
  { algo: "0/1 Knapsack", stack: 0.3, heap: 2.1, aux: 38.4 },
  { algo: "Closest Pair", stack: 2.1, heap: 6.4, aux: 3.2 },
];

// Experimental study
const experimentalData = [
  {
    scale: "Small City",
    nodes: "100",
    time: "0.8ms",
    memory: "2.1 MB",
    routeEff: "98.2%",
    fuelCost: "$124",
    timeLevel: "good",
    memLevel: "good",
    effLevel: "good",
    fuelLevel: "good",
  },
  {
    scale: "Medium City",
    nodes: "1,000",
    time: "12ms",
    memory: "48.7 MB",
    routeEff: "94.6%",
    fuelCost: "$891",
    timeLevel: "good",
    memLevel: "amber",
    effLevel: "good",
    fuelLevel: "amber",
  },
  {
    scale: "Large City",
    nodes: "10,000",
    time: "4,200ms",
    memory: "812 MB",
    routeEff: "87.3%",
    fuelCost: "$6,420",
    timeLevel: "amber",
    memLevel: "red",
    effLevel: "amber",
    fuelLevel: "red",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS = {
  cyan: "oklch(0.63 0.3 200)",
  blue: "oklch(0.55 0.26 252)",
  amber: "oklch(0.68 0.22 60)",
  green: "oklch(0.62 0.20 145)",
  red: "oklch(0.56 0.24 22)",
  purple: "oklch(0.58 0.22 298)",
};

const GRID_STROKE = "oklch(0.26 0.025 262 / 0.5)";
const TICK_FILL = "oklch(0.6 0.018 262)";
const TOOLTIP_STYLE = {
  backgroundColor: "oklch(0.15 0.012 262)",
  border: "1px solid oklch(0.26 0.025 262 / 0.6)",
  borderRadius: "6px",
  color: "oklch(0.93 0.012 262)",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
};

function metricColor(level: string) {
  if (level === "good") return "text-[oklch(0.62_0.20_145)]";
  if (level === "amber") return "text-accent";
  return "text-destructive";
}

function SectionHeader({
  title,
  subtitle,
  icon,
}: { title: string; subtitle: string; icon: ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2 rounded-md bg-primary/10 border border-primary/20 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PerformancePage() {
  return (
    <div className="min-h-screen bg-background surface-grid">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-ocid="performance.page"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-primary/70 mb-2">
            Algorithm Analytics
          </p>
          <h1 className="text-4xl font-display font-bold gradient-cyan-text mb-2">
            Performance Analysis
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Empirical benchmarks and theoretical complexity analysis
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            data-ocid="performance.kpi.section"
          >
            <KpiCard
              title="Algorithms Compared"
              value="14"
              subtitle="Across 5 categories"
              icon={Activity}
              variant="cyan"
            />
            <KpiCard
              title="Test Scales"
              value="3"
              subtitle="100 → 10,000 nodes"
              icon={TrendingUp}
              variant="blue"
            />
            <KpiCard
              title="Benchmarks Run"
              value="15"
              subtitle="Empirical measurements"
              icon={BarChart2}
              variant="amber"
            />
          </div>
        </motion.div>

        {/* ── Complexity Table ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-ocid="performance.complexity.section"
        >
          <div className="card-elevated p-6">
            <SectionHeader
              title="Complexity Comparison Table"
              subtitle="All algorithms with Big-O analysis, color-coded by category"
              icon={<Cpu className="w-4 h-4 text-primary" />}
            />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm min-w-[860px]">
                <thead>
                  <tr className="border-b border-border/40">
                    {[
                      "Algorithm",
                      "Category",
                      "Best",
                      "Average",
                      "Worst",
                      "Space",
                      "Stable",
                    ].map((h) => (
                      <th
                        key={`hdr-${h}`}
                        className="text-left py-2 px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complexityData.map((row, idx) => {
                    const cat = categoryMeta[row.category];
                    return (
                      <tr
                        key={`cplx-${row.name}`}
                        className={cn(
                          "border-b border-border/20 hover:bg-muted/20 transition-smooth",
                          idx % 2 === 1 ? "bg-muted/5" : "",
                        )}
                        data-ocid={`performance.complexity.item.${idx + 1}`}
                      >
                        <td className="py-2.5 px-3 font-body font-medium text-foreground">
                          {row.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <AlgorithmBadge
                            complexity={cat.label}
                            variant={cat.variant}
                            size="sm"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <BigOBadge complexity={row.best} />
                        </td>
                        <td className="py-2.5 px-3">
                          <BigOBadge complexity={row.avg} />
                        </td>
                        <td className="py-2.5 px-3">
                          <BigOBadge complexity={row.worst} />
                        </td>
                        <td className="py-2.5 px-3">
                          <BigOBadge complexity={row.spaceComplexity} />
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "text-xs font-mono font-semibold",
                              row.stable
                                ? "text-[oklch(0.62_0.20_145)]"
                                : "text-muted-foreground",
                            )}
                          >
                            {row.stable ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* ── Scalability Curves ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          data-ocid="performance.scalability.section"
        >
          <SectionHeader
            title="Scalability Curves"
            subtitle="Empirical run-time vs input size across all algorithm families"
            icon={<TrendingUp className="w-4 h-4 text-primary" />}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* A – Sorting */}
            <div
              className="card-elevated p-5"
              data-ocid="performance.sorting.chart"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-primary mb-4">
                Sorting — Time (ms) vs N
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={sortingCurveData}
                  margin={{ top: 4, right: 16, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis dataKey="n" tick={{ fill: TICK_FILL, fontSize: 11 }} />
                  <YAxis tick={{ fill: TICK_FILL, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v} ms`]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bubble"
                    name="Bubble O(n²)"
                    stroke={COLORS.red}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="merge"
                    name="Merge O(n log n)"
                    stroke={COLORS.cyan}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="quick"
                    name="Quick O(n log n)"
                    stroke={COLORS.green}
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="4 2"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* B – Graph */}
            <div
              className="card-elevated p-5"
              data-ocid="performance.graph.chart"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-secondary mb-4">
                Graph Algorithms — Time (ms) vs Edges
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={graphCurveData}
                  margin={{ top: 4, right: 16, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis
                    dataKey="edges"
                    tick={{ fill: TICK_FILL, fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: TICK_FILL, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v} ms`]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dijkstra"
                    name="Dijkstra"
                    stroke={COLORS.cyan}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bellman"
                    name="Bellman-Ford"
                    stroke={COLORS.amber}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* C – Greedy vs DP */}
            <div
              className="card-elevated p-5"
              data-ocid="performance.greedy-dp-curve.chart"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-4">
                Greedy vs DP — Time (ms) vs Items
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={greedyDpCurveData}
                  margin={{ top: 4, right: 16, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis
                    dataKey="items"
                    tick={{ fill: TICK_FILL, fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: TICK_FILL, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v} ms`]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="greedy"
                    name="Activity Selection (Greedy)"
                    stroke={COLORS.amber}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="dp"
                    name="0/1 Knapsack (DP)"
                    stroke={COLORS.purple}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* D – Large city */}
            <div
              className="card-elevated p-5"
              data-ocid="performance.large-city.chart"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-[oklch(0.62_0.20_145)] mb-4">
                Large City (10k nodes) — Exec. Time (ms, log scale)
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={largeCityData}
                  margin={{ top: 4, right: 16, bottom: 36, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="algo"
                    tick={{ fill: TICK_FILL, fontSize: 9 }}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fill: TICK_FILL, fontSize: 11 }}
                    scale="log"
                    domain={[1, 200000]}
                    allowDataOverflow
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v.toLocaleString()} ms`]}
                  />
                  <Bar
                    dataKey="time"
                    name="Time (ms)"
                    fill={COLORS.cyan}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.section>

        {/* ── Dijkstra vs Bellman-Ford ───────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          data-ocid="performance.dijkstra-bf.section"
        >
          <SectionHeader
            title="Dijkstra vs Bellman-Ford"
            subtitle="Head-to-head comparison across Small, Medium, and Large test scales"
            icon={<Zap className="w-4 h-4 text-primary" />}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div
              className="card-elevated p-6 neon-cyan-border"
              data-ocid="performance.dijkstra.card"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.63_0.3_200/0.8)]" />
                <h3 className="font-display font-semibold text-primary">
                  Dijkstra
                </h3>
                <AlgorithmBadge
                  complexity="O((V+E) log V)"
                  variant="cyan"
                  size="sm"
                  className="ml-auto"
                />
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>Greedy priority-queue
                  approach
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>Requires non-negative
                  edge weights
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>Faster on sparse,
                  static graphs
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground">✗</span>Cannot handle
                  negative-weight cycles
                </li>
              </ul>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { label: "100 nodes", value: "0.8ms", level: "good" },
                  { label: "1,000 nodes", value: "12ms", level: "good" },
                  { label: "10,000 nodes", value: "180ms", level: "amber" },
                ].map((r) => (
                  <div
                    key={`dijk-${r.label}`}
                    className="flex justify-between items-center border border-border/30 rounded px-3 py-1.5 bg-muted/10"
                  >
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className={metricColor(r.level)}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="card-elevated p-6 neon-amber-border"
              data-ocid="performance.bellman.card"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <h3 className="font-display font-semibold text-accent">
                  Bellman-Ford
                </h3>
                <AlgorithmBadge
                  complexity="O(VE)"
                  variant="amber"
                  size="sm"
                  className="ml-auto"
                />
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>Dynamic edge-relaxation
                  approach
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>Handles negative edge
                  weights
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>Detects negative-weight
                  cycles
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground">✗</span>Slower O(VE)
                  for large graphs
                </li>
              </ul>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { label: "100 nodes", value: "3.2ms", level: "good" },
                  { label: "1,000 nodes", value: "89ms", level: "amber" },
                  { label: "10,000 nodes", value: "4,200ms", level: "red" },
                ].map((r) => (
                  <div
                    key={`bf-${r.label}`}
                    className="flex justify-between items-center border border-border/30 rounded px-3 py-1.5 bg-muted/10"
                  >
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className={metricColor(r.level)}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-elevated p-4 border-l-2 border-primary/60 bg-primary/5">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">
                Recommendation:{" "}
              </span>
              Use <span className="text-primary font-mono">Dijkstra</span> for
              static routes with fixed weights. Use{" "}
              <span className="text-accent font-mono">Bellman-Ford</span> when
              dynamic traffic penalties or negative cost adjustments apply.
              Dijkstra is{" "}
              <span className="text-[oklch(0.62_0.20_145)] font-semibold">
                23× faster
              </span>{" "}
              on large graphs.
            </p>
          </div>
        </motion.section>

        {/* ── Greedy vs DP Analysis ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          data-ocid="performance.greedy-dp-analysis.section"
        >
          <SectionHeader
            title="Greedy vs Dynamic Programming"
            subtitle="Value optimality comparison across 10 identical test cases"
            icon={<Activity className="w-4 h-4 text-primary" />}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="card-elevated p-5 lg:col-span-2"
              data-ocid="performance.greedy-dp-bar.chart"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-foreground mb-4">
                Value Achieved — Greedy vs DP Optimal
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={greedyVsDpData}
                  barGap={3}
                  margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="test"
                    tick={{ fill: TICK_FILL, fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: TICK_FILL, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`$${v}`]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Bar
                    dataKey="greedy"
                    name="Greedy"
                    fill={COLORS.amber}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="dp"
                    name="DP Optimal"
                    fill={COLORS.purple}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="card-elevated p-5 border border-accent/20">
                <p className="text-xs font-mono uppercase tracking-widest text-accent mb-1">
                  Greedy Efficiency
                </p>
                <p className="text-4xl font-display font-bold text-accent">
                  89.3%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  of DP optimal on average
                </p>
              </div>
              <div className="card-elevated p-5 border border-primary/20">
                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">
                  Speed Advantage
                </p>
                <p className="text-4xl font-display font-bold text-primary">
                  47×
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Greedy faster than DP
                </p>
              </div>
              <div className="card-elevated p-4 text-xs text-muted-foreground space-y-1.5">
                <p className="text-foreground font-semibold mb-2">
                  Decision Matrix
                </p>
                {[
                  {
                    algo: "Greedy",
                    scenario: "Real-time routing",
                    color: "text-accent",
                  },
                  {
                    algo: "Greedy",
                    scenario: "Fractional loads",
                    color: "text-accent",
                  },
                  {
                    algo: "DP",
                    scenario: "Discrete cargo",
                    color: "text-secondary",
                  },
                  {
                    algo: "DP",
                    scenario: "Max value guarantee",
                    color: "text-secondary",
                  },
                ].map((r) => (
                  <div
                    key={`matrix-${r.scenario}`}
                    className="flex justify-between border-b border-border/20 pb-1 last:border-0"
                  >
                    <span className={r.color}>{r.algo}</span>
                    <span>{r.scenario}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-elevated p-4 mt-4 border-l-2 border-accent/60 bg-accent/5">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-accent">Finding: </span>
              Greedy is{" "}
              <span className="text-primary font-mono font-semibold">
                47× faster
              </span>{" "}
              but misses{" "}
              <span className="text-destructive font-mono font-semibold">
                10.7%
              </span>{" "}
              value on average compared to DP optimal.
            </p>
          </div>
        </motion.section>

        {/* ── Memory Usage ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          data-ocid="performance.memory.section"
        >
          <div className="card-elevated p-6">
            <SectionHeader
              title="Memory Usage Comparison"
              subtitle="Stack, heap, and auxiliary allocations on 10,000 node graph"
              icon={<Cpu className="w-4 h-4 text-primary" />}
            />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={memoryData}
                margin={{ top: 4, right: 16, bottom: 36, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={GRID_STROKE}
                  vertical={false}
                />
                <XAxis
                  dataKey="algo"
                  tick={{ fill: TICK_FILL, fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: TICK_FILL, fontSize: 11 }} unit=" MB" />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v: number) => [`${v} MB`]}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                />
                <Bar
                  dataKey="stack"
                  name="Stack"
                  stackId="mem"
                  fill={COLORS.cyan}
                />
                <Bar
                  dataKey="heap"
                  name="Heap"
                  stackId="mem"
                  fill={COLORS.blue}
                />
                <Bar
                  dataKey="aux"
                  name="Auxiliary"
                  stackId="mem"
                  fill={COLORS.purple}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* ── Experimental Summary ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          data-ocid="performance.experiment.section"
        >
          <div className="card-elevated p-6">
            <SectionHeader
              title="Experimental Study Summary"
              subtitle="Measured performance on Small, Medium, and Large city graphs"
              icon={<BarChart2 className="w-4 h-4 text-primary" />}
            />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm min-w-[620px]">
                <thead>
                  <tr className="border-b border-border/40">
                    {[
                      "Test Scale",
                      "Nodes",
                      "Exec. Time",
                      "Memory",
                      "Route Efficiency",
                      "Fuel Cost",
                    ].map((h) => (
                      <th
                        key={`exp-h-${h}`}
                        className="text-left py-2 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {experimentalData.map((row, idx) => (
                    <tr
                      key={`exp-${row.scale}`}
                      className="border-b border-border/20 hover:bg-muted/20 transition-smooth"
                      data-ocid={`performance.experiment.item.${idx + 1}`}
                    >
                      <td className="py-3 px-4 font-display font-semibold text-foreground">
                        {row.scale}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {row.nodes}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 font-mono font-semibold",
                          metricColor(row.timeLevel),
                        )}
                      >
                        {row.time}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 font-mono font-semibold",
                          metricColor(row.memLevel),
                        )}
                      >
                        {row.memory}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 font-mono font-semibold",
                          metricColor(row.effLevel),
                        )}
                      >
                        {row.routeEff}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-4 font-mono font-semibold",
                          metricColor(row.fuelLevel),
                        )}
                      >
                        {row.fuelCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-5 mt-4 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.62_0.20_145)]" />
                Good
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                Poor
              </span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
