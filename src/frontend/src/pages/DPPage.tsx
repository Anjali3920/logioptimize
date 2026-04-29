import { AlgorithmBadge } from "@/components/AlgorithmBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DPResult, KnapsackItem } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Play,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

// ─── Knapsack Data ─────────────────────────────────────────────────────────

const PACKAGES: KnapsackItem[] = [
  { id: "pkg-a", name: "Pkg A", weight: 2, value: 6 },
  { id: "pkg-b", name: "Pkg B", weight: 3, value: 10 },
  { id: "pkg-c", name: "Pkg C", weight: 4, value: 12 },
  { id: "pkg-d", name: "Pkg D", weight: 5, value: 18 },
  { id: "pkg-e", name: "Pkg E", weight: 6, value: 22 },
  { id: "pkg-f", name: "Pkg F", weight: 7, value: 25 },
];

const CAPACITY = 15;

function buildKnapsackDP(items: KnapsackItem[], W: number): DPResult {
  const n = items.length;
  const table: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(W + 1).fill(0),
  );
  const start = performance.now();

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (items[i - 1].weight <= w) {
        table[i][w] = Math.max(
          table[i - 1][w],
          table[i - 1][w - items[i - 1].weight] + items[i - 1].value,
        );
      } else {
        table[i][w] = table[i - 1][w];
      }
    }
  }

  const selected: KnapsackItem[] = [];
  let w = W;
  for (let i = n; i > 0; i--) {
    if (table[i][w] !== table[i - 1][w]) {
      selected.unshift({ ...items[i - 1], selected: true });
      w -= items[i - 1].weight;
    }
  }

  return {
    table,
    selectedItems: selected,
    totalValue: table[n][W],
    totalWeight: selected.reduce((s, it) => s + it.weight, 0),
    executionTime: performance.now() - start,
  };
}

// ─── Multi-Stage Data ──────────────────────────────────────────────────────

interface MSNode {
  id: string;
  label: string;
  stage: number;
}

interface MSEdge {
  from: string;
  to: string;
  cost: number;
}

const MS_NODES: MSNode[] = [
  { id: "start", label: "Start", stage: 0 },
  { id: "b1", label: "B1", stage: 1 },
  { id: "b2", label: "B2", stage: 1 },
  { id: "b3", label: "B3", stage: 1 },
  { id: "c1", label: "C1", stage: 2 },
  { id: "c2", label: "C2", stage: 2 },
  { id: "c3", label: "C3", stage: 2 },
  { id: "end", label: "End", stage: 3 },
];

const MS_EDGES: MSEdge[] = [
  { from: "start", to: "b1", cost: 12 },
  { from: "start", to: "b2", cost: 8 },
  { from: "start", to: "b3", cost: 15 },
  { from: "b1", to: "c1", cost: 18 },
  { from: "b1", to: "c2", cost: 22 },
  { from: "b2", to: "c1", cost: 14 },
  { from: "b2", to: "c2", cost: 19 },
  { from: "b2", to: "c3", cost: 21 },
  { from: "b3", to: "c2", cost: 11 },
  { from: "b3", to: "c3", cost: 9 },
  { from: "c1", to: "end", cost: 25 },
  { from: "c2", to: "end", cost: 16 },
  { from: "c3", to: "end", cost: 20 },
];

const MS_OPTIMAL_PATH = ["start", "b2", "c1", "end"];

const MS_DP_STAGES = [
  { node: "c1", bestNext: "end", cost: 25, total: 25 },
  { node: "c2", bestNext: "end", cost: 16, total: 16 },
  { node: "c3", bestNext: "end", cost: 20, total: 20 },
  { node: "b1", bestNext: "c1", cost: 18, total: 43 },
  { node: "b2", bestNext: "c1", cost: 14, total: 39 },
  { node: "b3", bestNext: "c3", cost: 9, total: 29 },
  { node: "start", bestNext: "b2", cost: 8, total: 47 },
];

// SVG positions
const NODE_POS: Record<string, { x: number; y: number }> = {
  start: { x: 60, y: 110 },
  b1: { x: 190, y: 40 },
  b2: { x: 190, y: 110 },
  b3: { x: 190, y: 180 },
  c1: { x: 360, y: 40 },
  c2: { x: 360, y: 110 },
  c3: { x: 360, y: 180 },
  end: { x: 500, y: 110 },
};

// ─── Floyd-Warshall Data ───────────────────────────────────────────────────

const FW_CITIES = ["A", "B", "C", "D", "E"];
const INF = 9999;

const FW_INITIAL: number[][] = [
  [0, 7, INF, 8, INF],
  [INF, 0, 3, INF, INF],
  [INF, INF, 0, 2, INF],
  [INF, INF, INF, 0, 5],
  [INF, INF, INF, INF, 0],
];

interface FWResult {
  matrices: number[][][];
  updating: [number, number][][];
}

function runFloydWarshall(dist: number[][]): FWResult {
  const n = dist.length;
  const matrices: number[][][] = [dist.map((r) => [...r])];
  const updating: [number, number][][] = [[]];
  let current = dist.map((r) => [...r]);

  for (let k = 0; k < n; k++) {
    const next = current.map((r) => [...r]);
    const changed: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (current[i][k] + current[k][j] < next[i][j]) {
          next[i][j] = current[i][k] + current[k][j];
          changed.push([i, j]);
        }
      }
    }
    matrices.push(next.map((r) => [...r]));
    updating.push(changed);
    current = next;
  }

  return { matrices, updating };
}

function fmtDist(v: number) {
  return v >= INF ? "∞" : String(v);
}

// ─── Shared Sub-Components ─────────────────────────────────────────────────

function SectionHeader({
  title,
  icon,
}: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
        {icon}
      </div>
      <h2 className="text-lg font-display font-semibold text-foreground">
        {title}
      </h2>
    </div>
  );
}

// ─── Knapsack Section ──────────────────────────────────────────────────────

function KnapsackSection() {
  const [result, setResult] = useState<DPResult | null>(null);
  const [animating, setAnimating] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);

  const handleBuild = useCallback(async () => {
    setAnimating(true);
    setVisibleRows(0);
    setResult(null);
    const res = buildKnapsackDP(PACKAGES, CAPACITY);
    setResult(res);

    for (let i = 0; i <= PACKAGES.length; i++) {
      await new Promise<void>((r) => setTimeout(r, 110));
      setVisibleRows(i + 1);
    }
    setAnimating(false);
  }, []);

  const selectedIds = new Set(result?.selectedItems.map((it) => it.id) ?? []);

  // Greedy by value/weight ratio
  const greedyItems = [...PACKAGES]
    .sort((a, b) => b.value / b.weight - a.value / a.weight)
    .reduce<{ items: KnapsackItem[]; w: number }>(
      (acc, item) => {
        if (acc.w + item.weight <= CAPACITY) {
          acc.items.push(item);
          acc.w += item.weight;
        }
        return acc;
      },
      { items: [], w: 0 },
    );

  const capacities = Array.from({ length: CAPACITY + 1 }, (_, i) => i);

  return (
    <section
      className="card-elevated p-6 space-y-5"
      data-ocid="knapsack.section"
    >
      <SectionHeader
        title="0/1 Knapsack — Optimal Package Loading"
        icon={<Zap size={18} />}
      />

      {/* Package grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-lg border p-3 text-center transition-smooth ${
              selectedIds.has(pkg.id)
                ? "border-primary/60 bg-primary/10 shadow-[0_0_12px_oklch(var(--primary)/0.2)]"
                : "border-border/40 bg-muted/20"
            }`}
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">
              {pkg.name}
            </div>
            <div className="text-sm font-semibold text-foreground">
              {pkg.weight}kg
            </div>
            <div className="text-xs text-primary font-mono">${pkg.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">
          Vehicle capacity:{" "}
          <span className="text-foreground font-mono font-semibold">
            {CAPACITY} kg
          </span>
        </p>
        <Button
          onClick={handleBuild}
          disabled={animating}
          className="gap-2"
          data-ocid="knapsack.build_button"
        >
          <Play size={14} />
          {animating ? "Building…" : "Build DP Table"}
        </Button>
      </div>

      {/* DP Table */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            dp[item][capacity] — rows animate in row by row
          </p>
          <div className="overflow-x-auto scrollbar-thin rounded-lg border border-border/30">
            <table className="min-w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-muted/40">
                  <th className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left text-muted-foreground border-r border-border/30 whitespace-nowrap">
                    Item ↓ Cap →
                  </th>
                  {capacities.map((cap) => (
                    <th
                      key={`cap-header-${cap}`}
                      className="px-2 py-2 text-center text-muted-foreground border-r border-border/20 min-w-[28px]"
                    >
                      {cap}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: PACKAGES.length + 1 }, (_, rowIdx) => {
                  const item = rowIdx === 0 ? null : PACKAGES[rowIdx - 1];
                  const rowKey =
                    rowIdx === 0
                      ? "row-empty"
                      : `row-${PACKAGES[rowIdx - 1].id}`;
                  const isVisible = rowIdx < visibleRows;

                  return (
                    <motion.tr
                      key={rowKey}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isVisible ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-border/20 hover:bg-muted/10"
                    >
                      <td className="sticky left-0 z-10 bg-card px-3 py-1.5 text-muted-foreground font-semibold border-r border-border/30 whitespace-nowrap">
                        {item ? item.name : "∅"}
                      </td>
                      {capacities.map((cap) => {
                        const val = result.table[rowIdx][cap];
                        const isMax =
                          rowIdx === PACKAGES.length &&
                          cap === CAPACITY &&
                          val === result.totalValue;
                        const isImproved =
                          rowIdx > 0 &&
                          val > 0 &&
                          val !== result.table[rowIdx - 1][cap];

                        return (
                          <td
                            key={`cell-${rowKey}-c${cap}`}
                            className={`px-2 py-1.5 text-center border-r border-border/20 transition-colors ${
                              isMax
                                ? "bg-primary/20 text-primary font-bold"
                                : isImproved
                                  ? "text-primary/75"
                                  : val === 0
                                    ? "text-muted-foreground/30"
                                    : "text-foreground/60"
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Result panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} className="text-primary" />
                <span className="text-sm font-semibold text-primary">
                  DP Optimal Solution
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Selected: {result.selectedItems.map((i) => i.name).join(", ")}
              </p>
              <p className="text-xs font-mono">
                Weight:{" "}
                <span className="text-foreground">{result.totalWeight} kg</span>
                {" · "}Value:{" "}
                <span className="text-primary font-bold">
                  ${result.totalValue}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Time: {result.executionTime.toFixed(3)}ms
              </p>
            </div>

            <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={15} className="text-accent" />
                <span className="text-sm font-semibold text-accent">
                  Greedy (Suboptimal)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Selected: {greedyItems.items.map((i) => i.name).join(", ")}
              </p>
              <p className="text-xs font-mono">
                Weight:{" "}
                <span className="text-foreground">{greedyItems.w} kg</span>
                {" · "}Value:{" "}
                <span className="text-accent font-bold">
                  ${greedyItems.items.reduce((s, i) => s + i.value, 0)}
                </span>
              </p>
              <p className="text-xs text-destructive mt-1">
                Gap: −$
                {result.totalValue -
                  greedyItems.items.reduce((s, i) => s + i.value, 0)}{" "}
                vs DP
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

// ─── Multi-Stage Section ───────────────────────────────────────────────────

function MultiStageSection() {
  const [solved, setSolved] = useState(false);
  const [animStep, setAnimStep] = useState(-1);

  const handleSolve = useCallback(async () => {
    setSolved(false);
    setAnimStep(-1);
    for (let i = 0; i < MS_DP_STAGES.length; i++) {
      await new Promise<void>((r) => setTimeout(r, 220));
      setAnimStep(i);
    }
    setSolved(true);
  }, []);

  const isOptimalEdge = (from: string, to: string) =>
    MS_OPTIMAL_PATH.some(
      (_node, idx) =>
        idx < MS_OPTIMAL_PATH.length - 1 &&
        MS_OPTIMAL_PATH[idx] === from &&
        MS_OPTIMAL_PATH[idx + 1] === to,
    );

  const isOptimalNode = (id: string) => solved && MS_OPTIMAL_PATH.includes(id);

  return (
    <section
      className="card-elevated p-6 space-y-5"
      data-ocid="multistage.section"
    >
      <SectionHeader
        title="Multi-Stage Delivery — Minimize Total Cost"
        icon={<ChevronRight size={18} />}
      />

      {/* Network SVG */}
      <div className="rounded-xl border border-border/30 bg-muted/10 p-4 overflow-x-auto">
        <svg
          viewBox="0 0 560 220"
          className="w-full max-w-2xl mx-auto"
          style={{ minWidth: 320 }}
          role="img"
          aria-label="Multi-stage delivery network diagram"
        >
          <title>Multi-stage delivery network</title>
          {/* Edges */}
          {MS_EDGES.map((edge) => {
            const s = NODE_POS[edge.from];
            const t = NODE_POS[edge.to];
            const optimal = solved && isOptimalEdge(edge.from, edge.to);
            const mx = (s.x + t.x) / 2;
            const my = (s.y + t.y) / 2;
            return (
              <g key={`edge-${edge.from}-${edge.to}`}>
                <line
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={
                    optimal ? "oklch(0.63 0.3 200)" : "oklch(0.26 0.025 262)"
                  }
                  strokeWidth={optimal ? 2.5 : 1.5}
                  strokeOpacity={optimal ? 1 : 0.5}
                  style={{ transition: "all 0.5s" }}
                />
                <text
                  x={mx}
                  y={my - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill={
                    optimal ? "oklch(0.63 0.3 200)" : "oklch(0.6 0.018 262)"
                  }
                  fontFamily="var(--font-mono)"
                >
                  ${edge.cost}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {MS_NODES.map((node) => {
            const pos = NODE_POS[node.id];
            const optimal = isOptimalNode(node.id);
            return (
              <g key={`node-${node.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  fill={
                    optimal
                      ? "oklch(0.63 0.3 200 / 0.18)"
                      : "oklch(0.15 0.012 262)"
                  }
                  stroke={
                    optimal ? "oklch(0.63 0.3 200)" : "oklch(0.26 0.025 262)"
                  }
                  strokeWidth={optimal ? 2 : 1.5}
                  style={{ transition: "all 0.5s" }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={
                    optimal ? "oklch(0.63 0.3 200)" : "oklch(0.93 0.012 262)"
                  }
                  fontFamily="var(--font-display)"
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* Stage labels */}
          {(
            [
              { label: "Stage 0", x: 60 },
              { label: "Stage 1", x: 190 },
              { label: "Stage 2", x: 360 },
              { label: "Stage 3", x: 500 },
            ] as { label: string; x: number }[]
          ).map((s) => (
            <text
              key={`stage-lbl-${s.label}`}
              x={s.x}
              y={210}
              textAnchor="middle"
              fontSize="9"
              fill="oklch(0.6 0.018 262)"
              fontFamily="var(--font-body)"
            >
              {s.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSolve}
          className="gap-2"
          data-ocid="multistage.solve_button"
        >
          <Play size={14} />
          Find Optimal Route
        </Button>
      </div>

      {/* DP table */}
      <div className="rounded-lg border border-border/30 overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2 text-left">Node</th>
              <th className="px-4 py-2 text-left">Best Next</th>
              <th className="px-4 py-2 text-right">Edge Cost</th>
              <th className="px-4 py-2 text-right">Total to End</th>
            </tr>
          </thead>
          <tbody>
            {MS_DP_STAGES.map((row, idx) => {
              const isActive = animStep >= idx;
              const isOptimal = solved && MS_OPTIMAL_PATH.includes(row.node);
              return (
                <motion.tr
                  key={`ms-row-${row.node}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0.2 }}
                  transition={{ duration: 0.25 }}
                  className={`border-t border-border/20 ${isOptimal ? "bg-primary/8" : "hover:bg-muted/10"}`}
                >
                  <td
                    className={`px-4 py-2 font-semibold ${isOptimal ? "text-primary" : "text-foreground"}`}
                  >
                    {row.node.toUpperCase()}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {row.bestNext.toUpperCase()}
                  </td>
                  <td className="px-4 py-2 text-right text-foreground">
                    ${row.cost}
                  </td>
                  <td
                    className={`px-4 py-2 text-right font-bold ${isOptimal ? "text-primary" : "text-foreground"}`}
                  >
                    ${row.total}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-center gap-3"
          data-ocid="multistage.success_state"
        >
          <CheckCircle2 size={18} className="text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary">
              Optimal Path Found
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Start → B2 → C1 → End &nbsp;|&nbsp; Total cost:{" "}
              <span className="text-foreground font-mono font-bold">$47</span>
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}

// ─── Floyd-Warshall Section ────────────────────────────────────────────────

function FloydWarshallSection() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [fwResult] = useState<FWResult>(() => runFloydWarshall(FW_INITIAL));

  const handleRun = useCallback(async () => {
    setRunning(true);
    setStep(0);
    for (let k = 1; k <= FW_CITIES.length; k++) {
      await new Promise<void>((r) => setTimeout(r, 600));
      setStep(k);
    }
    setRunning(false);
  }, []);

  const currentMatrix = fwResult.matrices[step];
  const currentUpdating = new Set(
    (fwResult.updating[step] ?? []).map(([i, j]) => `${i}-${j}`),
  );

  return (
    <section className="card-elevated p-6 space-y-5" data-ocid="floyd.section">
      <SectionHeader
        title="Floyd-Warshall — Complete Network Analysis"
        icon={<TrendingUp size={18} />}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Iteration:</span>
          <span className="font-mono font-semibold text-foreground">
            {step === 0 ? "Initial" : `k = ${FW_CITIES[step - 1]}`}
          </span>
          <span className="opacity-30">|</span>
          <span>
            {step}/{FW_CITIES.length} complete
          </span>
        </div>
        <Button
          onClick={handleRun}
          disabled={running}
          className="gap-2"
          data-ocid="floyd.run_button"
        >
          <Play size={14} />
          {running ? "Running…" : "Run Floyd-Warshall"}
        </Button>
      </div>

      {/* Matrix */}
      <div className="rounded-xl border border-border/30 overflow-hidden">
        <table className="w-full text-sm font-mono border-collapse">
          <thead>
            <tr className="bg-muted/40">
              <th className="px-4 py-3 text-left text-muted-foreground border-r border-border/30 w-12">
                ↘
              </th>
              {FW_CITIES.map((city) => (
                <th
                  key={`fw-col-${city}`}
                  className="px-4 py-3 text-center text-muted-foreground border-r border-border/20"
                >
                  {city}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FW_CITIES.map((rowCity, i) => (
              <tr
                key={`fw-row-${rowCity}`}
                className="border-t border-border/20"
              >
                <td className="px-4 py-3 text-center font-semibold text-muted-foreground bg-muted/20 border-r border-border/30">
                  {rowCity}
                </td>
                {FW_CITIES.map((colCity, j) => {
                  const val = currentMatrix[i][j];
                  const isUpdated = currentUpdating.has(`${i}-${j}`);
                  const isDiag = i === j;

                  return (
                    <motion.td
                      key={`fw-cell-${rowCity}-${colCity}`}
                      animate={{
                        backgroundColor: isUpdated
                          ? "oklch(0.68 0.22 60 / 0.25)"
                          : isDiag
                            ? "oklch(0.22 0.018 262 / 0.5)"
                            : "transparent",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`px-4 py-3 text-center border-r border-border/20 ${
                        isUpdated
                          ? "text-accent font-bold"
                          : isDiag
                            ? "text-muted-foreground"
                            : val >= INF
                              ? "text-muted-foreground/40"
                              : "text-foreground"
                      }`}
                    >
                      {fmtDist(val)}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-accent/30 inline-block" />
          Updated this iteration
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-muted/50 inline-block" />
          Diagonal (self)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono opacity-40">∞</span>
          <span className="ml-1">No direct path</span>
        </div>
      </div>

      {step === FW_CITIES.length && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-primary/30 bg-primary/5 p-4"
          data-ocid="floyd.success_state"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">
              All pairs computed
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs font-mono">
            <span>
              Longest path: <span className="text-foreground">A → E = 18</span>
            </span>
            <span>
              Shortest (non-self):{" "}
              <span className="text-foreground">B → C = 3</span>
            </span>
            <span>
              Complexity: <span className="text-primary">O(V³) = O(125)</span>
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
}

// ─── DP vs Greedy Section ──────────────────────────────────────────────────

const DP_VS_GREEDY_EXAMPLES = [
  {
    key: "knapsack",
    scenario: "Package loading (0/1 Knapsack)",
    dpValue: "$93",
    greedyValue: "$75",
    gap: "$18",
    reason: "Greedy picks highest ratio first, misses the optimal combination",
  },
  {
    key: "multistage",
    scenario: "Multi-stage routing",
    dpValue: "$47",
    greedyValue: "$54",
    gap: "$7",
    reason: "Greedy takes cheapest next edge, ignores future stage costs",
  },
  {
    key: "allpairs",
    scenario: "All-pairs shortest path",
    dpValue: "Exact",
    greedyValue: "Approx.",
    gap: "Up to 40%",
    reason: "Nearest-neighbor greedy cannot guarantee globally optimal paths",
  },
];

function DPvsGreedySection() {
  return (
    <section
      className="card-elevated p-6 space-y-5"
      data-ocid="dp-vs-greedy.section"
    >
      <SectionHeader
        title="Why DP Beats Greedy"
        icon={<AlertTriangle size={18} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            DP Strategy
          </p>
          <p className="text-base font-display font-semibold text-primary">
            Global Optimum
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Considers all subproblems before deciding
          </p>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Greedy Strategy
          </p>
          <p className="text-base font-display font-semibold text-accent">
            Local Optimum
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Makes best immediate choice, may get stuck
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Scenario</th>
              <th className="px-4 py-3 text-center text-primary">DP Result</th>
              <th className="px-4 py-3 text-center text-accent">
                Greedy Result
              </th>
              <th className="px-4 py-3 text-center text-destructive">Gap</th>
            </tr>
          </thead>
          <tbody>
            {DP_VS_GREEDY_EXAMPLES.map((ex) => (
              <tr
                key={`dpvg-${ex.key}`}
                className="border-t border-border/20 hover:bg-muted/10"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground text-xs">
                    {ex.scenario}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {ex.reason}
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-primary">
                  {ex.dpValue}
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-accent">
                  {ex.greedyValue}
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-destructive">
                  {ex.gap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-muted/20 border border-border/30 p-4 text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">When to use DP:</strong> Overlapping
        subproblems + optimal substructure. Both conditions must hold. DP trades{" "}
        <span className="text-primary font-mono">O(nW)</span> space for
        guaranteed optimality — Greedy uses{" "}
        <span className="text-accent font-mono">O(1)</span> space but may miss
        the global solution.
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function DPPage() {
  return (
    <div
      className="min-h-screen bg-background surface-grid"
      data-ocid="dp.page"
    >
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
          data-ocid="dp.header"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary text-xs font-mono"
            >
              Module 4
            </Badge>
            <Badge
              variant="outline"
              className="border-muted-foreground/30 text-muted-foreground text-xs"
            >
              Dynamic Programming
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-cyan-text leading-tight">
            Dynamic Programming
            <span className="block text-2xl sm:text-3xl text-foreground/80 font-normal mt-1">
              Optimal Cost Minimization
            </span>
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Globally optimal solutions through subproblem decomposition — where
            greedy shortcuts fail, DP guarantees the best possible outcome by
            building solutions bottom-up.
          </p>

          <div className="flex flex-wrap gap-2">
            <AlgorithmBadge
              complexity="O(nW)"
              label="0/1 Knapsack"
              variant="cyan"
            />
            <AlgorithmBadge
              complexity="O(kn²)"
              label="Multi-Stage DP"
              variant="blue"
            />
            <AlgorithmBadge
              complexity="O(V³)"
              label="Floyd-Warshall"
              variant="amber"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <KnapsackSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <MultiStageSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <FloydWarshallSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <DPvsGreedySection />
        </motion.div>
      </div>
    </div>
  );
}
