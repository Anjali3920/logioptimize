import { AlgorithmBadge } from "@/components/AlgorithmBadge";
import { KpiCard } from "@/components/KpiCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  BoxSelect,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  CpuIcon,
  GitBranch,
  Layers,
  Network,
  Package,
  Route,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Static Data ──────────────────────────────────────────────────────────────

const throughputData = [
  { day: "Mon", packages: 1820 },
  { day: "Tue", packages: 2140 },
  { day: "Wed", packages: 1980 },
  { day: "Thu", packages: 2560 },
  { day: "Fri", packages: 2890 },
  { day: "Sat", packages: 2100 },
  { day: "Sun", packages: 1357 },
];

const kpiCards = [
  {
    title: "Total Packages",
    value: "12,847",
    subtitle: "across all depots",
    variant: "cyan" as const,
    icon: Package,
    trend: { value: 8.4, label: "vs last week" },
  },
  {
    title: "Active Vehicles",
    value: "48",
    subtitle: "32 en-route now",
    variant: "blue" as const,
    icon: Truck,
    trend: { value: 5.2, label: "utilisation" },
  },
  {
    title: "Routes Optimized",
    value: "1,293",
    subtitle: "this month",
    variant: "amber" as const,
    icon: Route,
    trend: { value: 12.1, label: "efficiency gain" },
  },
  {
    title: "Cost Saved",
    value: "$89,432",
    subtitle: "fuel & time savings",
    variant: "green" as const,
    icon: Zap,
    trend: { value: 19.7, label: "vs baseline" },
  },
];

const modules = [
  {
    id: "sorting",
    path: "/sorting",
    icon: Layers,
    title: "Sorting",
    subtitle: "Delivery Prioritization Engine",
    description:
      "Multi-criteria sort engine with real-time VIP queue separation. Step-by-step merge, quick, and heap sort on live delivery data.",
    algorithms: ["Merge Sort", "Quick Sort", "Heap Sort", "VIP Queue"],
    badges: ["O(n log n)", "O(n²) worst"],
    color: "cyan",
    badgeVariant: "cyan" as const,
  },
  {
    id: "routes",
    path: "/routes",
    icon: Network,
    title: "Graph Algorithms",
    subtitle: "Route Optimization",
    description:
      "Interactive city graph with Dijkstra and Bellman-Ford path finding. MST construction with Prim and Kruskal for minimal infrastructure cost.",
    algorithms: ["Dijkstra", "Bellman-Ford", "Prim MST", "Kruskal MST"],
    badges: ["O((V+E) log V)", "O(VE)"],
    color: "blue",
    badgeVariant: "blue" as const,
  },
  {
    id: "vehicles",
    path: "/vehicles",
    icon: Truck,
    title: "Greedy Algorithms",
    subtitle: "Vehicle Assignment",
    description:
      "Activity selection and knapsack-based vehicle loading. Live comparison between greedy approximation and provably optimal DP solutions.",
    algorithms: ["Activity Selection", "Fractional Knapsack", "Job Scheduling"],
    badges: ["O(n log n)", "O(n)"],
    color: "amber",
    badgeVariant: "amber" as const,
  },
  {
    id: "dp",
    path: "/dp",
    icon: BoxSelect,
    title: "Dynamic Programming",
    subtitle: "Cost Minimization",
    description:
      "DP table visualizer for 0/1 knapsack and multi-stage planning. Floyd-Warshall all-pairs shortest path with animated matrix fill.",
    algorithms: ["0/1 Knapsack", "Floyd-Warshall", "Stage Planning"],
    badges: ["O(nW)", "O(V³)"],
    color: "green",
    badgeVariant: "green" as const,
  },
  {
    id: "divide-conquer",
    path: "/divide-conquer",
    icon: GitBranch,
    title: "Divide & Conquer",
    subtitle: "Scalability Engine",
    description:
      "Parallel merge sort with zone-division heuristics. Closest-pair warehouse algorithm and Master Theorem complexity analysis.",
    algorithms: ["Parallel Merge Sort", "Closest Pair", "Network Zoning"],
    badges: ["T(n)=2T(n/2)+O(n)", "O(n log n)"],
    color: "cyan",
    badgeVariant: "cyan" as const,
  },
  {
    id: "performance",
    path: "/performance",
    icon: BarChart3,
    title: "Performance Analysis",
    subtitle: "Algorithm Benchmarks",
    description:
      "Empirical runtime measurements across 100→10,000 node scales. Side-by-side algorithm comparison with memory and throughput charts.",
    algorithms: ["Execution Time", "Memory Usage", "Scalability Plots"],
    badges: ["100 nodes", "10,000 nodes"],
    color: "blue",
    badgeVariant: "blue" as const,
  },
];

const activityFeed = [
  {
    id: "act-1",
    icon: Route,
    color: "text-primary",
    bgColor: "bg-primary/10",
    message: "Dijkstra completed — Route #A12 optimized",
    detail: "3.2 km saved · 8 min faster",
    timestamp: "2 min ago",
    tag: "ROUTE OPT",
    tagVariant: "cyan" as const,
  },
  {
    id: "act-2",
    icon: Layers,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    message: "Merge Sort — 847 packages prioritized",
    detail: "Completed in 12 ms · VIP queue: 14 items",
    timestamp: "5 min ago",
    tag: "SORTING",
    tagVariant: "blue" as const,
  },
  {
    id: "act-3",
    icon: Truck,
    color: "text-accent",
    bgColor: "bg-accent/10",
    message: "Vehicle assignment — Fleet #B7 loaded",
    detail: "Utilization: 94% · Knapsack optimal",
    timestamp: "11 min ago",
    tag: "GREEDY",
    tagVariant: "amber" as const,
  },
  {
    id: "act-4",
    icon: BoxSelect,
    color: "text-[oklch(0.62_0.20_145)]",
    bgColor: "bg-[oklch(0.62_0.20_145)]/10",
    message: "Floyd-Warshall — All-pairs paths recalculated",
    detail: "28 nodes · 784 pairs updated in 34 ms",
    timestamp: "18 min ago",
    tag: "DP",
    tagVariant: "green" as const,
  },
  {
    id: "act-5",
    icon: GitBranch,
    color: "text-primary",
    bgColor: "bg-primary/10",
    message: "Zone division — Region North split into 3 sub-zones",
    detail: "Balanced load: 847 / 891 / 832 packages",
    timestamp: "31 min ago",
    tag: "DIV & CON",
    tagVariant: "cyan" as const,
  },
  {
    id: "act-6",
    icon: CheckCircle2,
    color: "text-[oklch(0.62_0.20_145)]",
    bgColor: "bg-[oklch(0.62_0.20_145)]/10",
    message: "Bellman-Ford — Negative-weight edge detected & handled",
    detail: "Traffic anomaly #T-009 on Route #C4 flagged",
    timestamp: "47 min ago",
    tag: "ROUTE OPT",
    tagVariant: "cyan" as const,
  },
];

const statusItems = [
  { label: "Sorting Queue", value: "247 items" },
  { label: "Active Routes", value: "18" },
  { label: "Vehicle Util.", value: "84%" },
  { label: "System Load", value: "Normal" },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-elevated px-3 py-2 text-xs font-mono">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="text-primary font-semibold">
        {payload[0].value.toLocaleString()} pkgs
      </p>
    </div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

const iconColorMap: Record<string, string> = {
  cyan: "text-primary bg-primary/10 border-primary/20",
  blue: "text-secondary bg-secondary/10 border-secondary/20",
  amber: "text-accent bg-accent/10 border-accent/20",
  green:
    "text-[oklch(0.62_0.20_145)] bg-[oklch(0.62_0.20_145)]/10 border-[oklch(0.62_0.20_145)]/20",
};

const arrowColorMap: Record<string, string> = {
  cyan: "text-primary",
  blue: "text-secondary",
  amber: "text-accent",
  green: "text-[oklch(0.62_0.20_145)]",
};

function ModuleCard({
  module,
  index,
}: {
  module: (typeof modules)[0];
  index: number;
}) {
  const Icon = module.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={module.path}
        data-ocid={`module.${module.id}.card`}
        className="group card-elevated flex flex-col gap-4 p-5 hover:border-primary/30 transition-smooth h-full"
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={`p-2.5 rounded-lg border ${iconColorMap[module.color] ?? iconColorMap.cyan}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground"
          >
            {module.id.replace("-", " ").toUpperCase()}
          </Badge>
        </div>

        <div className="flex-1">
          <h3 className="font-display font-bold text-foreground text-base leading-tight">
            {module.title}
          </h3>
          <p
            className={`text-xs font-mono mt-0.5 ${arrowColorMap[module.color] ?? arrowColorMap.cyan}`}
          >
            {module.subtitle}
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">
            {module.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {module.algorithms.map((alg) => (
            <AlgorithmBadge
              key={alg}
              complexity={alg}
              variant={module.badgeVariant}
              size="sm"
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/30">
          <div className="flex gap-1.5 flex-wrap">
            {module.badges.map((b) => (
              <span
                key={b}
                className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded"
              >
                {b}
              </span>
            ))}
          </div>
          <span
            className={`flex items-center gap-1 text-xs font-semibold transition-smooth ${arrowColorMap[module.color] ?? arrowColorMap.cyan}`}
          >
            Explore
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div className="min-h-screen" data-ocid="dashboard.page">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="surface-grid relative overflow-hidden border-b border-border/30 px-6 py-14 md:py-20"
        data-ocid="dashboard.hero.section"
      >
        {/* Radial glow backdrop */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.63 0.3 200 / 0.14) 0%, transparent 65%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Engine badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 text-primary text-xs font-mono px-3 py-1 rounded-full">
              <CpuIcon className="w-3 h-3" />
              Logistics Optimization Engine · v2.4
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-3"
          >
            <span className="gradient-cyan-text">LogiOptimize</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground font-display font-medium mb-4"
          >
            Smart Logistics Network Optimization Engine
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-2xl text-muted-foreground text-base leading-relaxed mb-10"
          >
            A full-scale algorithmic system combining sorting, graph theory,
            greedy heuristics, dynamic programming, and divide &amp; conquer to
            solve real-world delivery logistics — from package prioritization to
            cost-minimal routing across thousands of nodes.
          </motion.p>

          {/* KPI Grid */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            data-ocid="dashboard.kpi.section"
          >
            {kpiCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              >
                <KpiCard
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  variant={card.variant}
                  icon={card.icon}
                  trend={card.trend}
                />
              </motion.div>
            ))}
          </div>

          {/* Throughput Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card-elevated p-5"
            data-ocid="dashboard.throughput.chart"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">
                  Daily Throughput
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  packages processed per day
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-mono text-primary border-primary/30"
              >
                Last 7 days
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={throughputData} barSize={28}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.26 0.025 262 / 0.35)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "oklch(0.6 0.018 262)",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "oklch(0.6 0.018 262)",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "oklch(0.26 0.025 262 / 0.3)" }}
                />
                <Bar
                  dataKey="packages"
                  fill="oklch(0.63 0.3 200)"
                  radius={[4, 4, 0, 0]}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* ── System Status Bar ─────────────────────────────────────────────── */}
      <section
        className="border-b border-border/30 bg-card px-6 py-3"
        data-ocid="dashboard.status.section"
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.62_0.20_145)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.62_0.20_145)]" />
            </span>
            <span className="text-xs font-mono font-semibold text-[oklch(0.62_0.20_145)] uppercase tracking-widest">
              System Online
            </span>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs font-mono"
              >
                <CircleDot className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="text-foreground font-semibold">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Module Overview Grid ──────────────────────────────────────────── */}
      <section
        className="px-6 py-14 bg-background"
        data-ocid="dashboard.modules.section"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Core Modules
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Optimization Engine
            </h2>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">
              Five algorithmic pillars powering real-time logistics decisions —
              from micro-second sorting to network-wide cost minimization.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            data-ocid="dashboard.modules.list"
          >
            {modules.map((mod, i) => (
              <ModuleCard key={mod.id} module={mod} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Activity Feed ──────────────────────────────────────────── */}
      <section
        className="px-6 pb-16 bg-muted/10"
        data-ocid="dashboard.activity.section"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 pt-14 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Live Events
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Recent Activity
              </h2>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-xs text-muted-foreground"
            >
              Last 60 min
            </Badge>
          </motion.div>

          <div
            className="card-elevated overflow-hidden"
            data-ocid="dashboard.activity.list"
          >
            {activityFeed.map((event, i) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className={`flex items-start gap-4 px-5 py-4 ${i < activityFeed.length - 1 ? "border-b border-border/30" : ""}`}
                  data-ocid={`dashboard.activity.item.${i + 1}`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${event.bgColor}`}
                  >
                    <Icon className={`w-4 h-4 ${event.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {event.message}
                      </p>
                      <AlgorithmBadge
                        complexity={event.tag}
                        variant={event.tagVariant}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.detail}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground flex-shrink-0 mt-0.5">
                    {event.timestamp}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
