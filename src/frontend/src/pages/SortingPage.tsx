import { AlgorithmBadge } from "@/components/AlgorithmBadge";
import { SortBarsContainer } from "@/components/SortBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ArrayStep,
  generateMergeSortSteps,
  generateQuickSortSteps,
  useAlgorithm,
} from "@/hooks/useAlgorithm";
import type { DeliveryRequest } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Hash,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DESTINATIONS = [
  "Downtown Hub",
  "Westside DC",
  "Airport Depot",
  "North Terminal",
  "Harbor Gate",
  "East Corridor",
  "Central Station",
  "Tech Park",
  "Riverside Dock",
  "Summit Base",
  "Midtown Drop",
  "South Campus",
  "Valley Hub",
  "Uptown Stop",
  "Crossroads DC",
  "Lakefront Zone",
  "Metro Center",
  "Highland Depot",
  "Seaside Route",
  "Frontier Gate",
];

const VIP_DELIVERIES: DeliveryRequest[] = [
  {
    id: "VIP-001",
    packageWeight: 12,
    deadline: 1,
    customerPriority: "VIP",
    distance: 15,
    value: 5000,
    destination: "Executive Tower",
    status: "PENDING",
  },
  {
    id: "VIP-002",
    packageWeight: 5,
    deadline: 2,
    customerPriority: "VIP",
    distance: 22,
    value: 8200,
    destination: "Diamond HQ",
    status: "PENDING",
  },
  {
    id: "VIP-003",
    packageWeight: 30,
    deadline: 2,
    customerPriority: "VIP",
    distance: 8,
    value: 12000,
    destination: "Gold Reserve",
    status: "PENDING",
  },
  {
    id: "VIP-004",
    packageWeight: 7,
    deadline: 3,
    customerPriority: "VIP",
    distance: 45,
    value: 3800,
    destination: "Platinum Suite",
    status: "PENDING",
  },
  {
    id: "VIP-005",
    packageWeight: 18,
    deadline: 4,
    customerPriority: "VIP",
    distance: 30,
    value: 6500,
    destination: "Crystal Vault",
    status: "PENDING",
  },
  {
    id: "VIP-006",
    packageWeight: 9,
    deadline: 5,
    customerPriority: "VIP",
    distance: 12,
    value: 4200,
    destination: "Prestige Center",
    status: "PENDING",
  },
];

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDeliveries(count: number): DeliveryRequest[] {
  const priorities: DeliveryRequest["customerPriority"][] = [
    "HIGH",
    "HIGH",
    "MEDIUM",
    "MEDIUM",
    "LOW",
    "LOW",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `PKG-${String(i + 1).padStart(3, "0")}`,
    packageWeight: rnd(1, 50),
    deadline: rnd(1, 10),
    customerPriority: priorities[rnd(0, priorities.length - 1)],
    distance: rnd(5, 100),
    value: rnd(100, 2000),
    destination: DESTINATIONS[i % DESTINATIONS.length],
    status: "PENDING" as const,
  }));
}

// ─── Heap Sort Steps ──────────────────────────────────────────────────────────

function generateHeapSortSteps(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  function heapify(array: number[], size: number, root: number) {
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    if (l < size && array[l] > array[largest]) largest = l;
    if (r < size && array[r] > array[largest]) largest = r;
    if (largest !== root) {
      steps.push({
        array: [...array],
        comparing: [root, largest],
        swapping: [],
        sorted: [...sorted],
      });
      [array[root], array[largest]] = [array[largest], array[root]];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [root, largest],
        sorted: [...sorted],
      });
      heapify(array, size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.push(i);
    steps.push({
      array: [...a],
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
    });
    heapify(a, i, 0);
  }
  sorted.push(0);
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: a.map((_, i2) => i2),
  });
  return steps;
}

// ─── Types & Constants ────────────────────────────────────────────────────────

type SortKey = "deadline" | "priority" | "weight";
type AlgoTab = "merge" | "quick" | "heap";

const PRIORITY_WEIGHT: Record<DeliveryRequest["customerPriority"], number> = {
  VIP: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
};

const ALGO_INFO: Record<
  AlgoTab,
  {
    name: string;
    complexity: string;
    space: string;
    stable: boolean;
    desc: string;
    useCase: string;
    bestCase: string;
    worstCase: string;
    variant: "cyan" | "blue" | "green";
  }
> = {
  merge: {
    name: "Merge Sort",
    complexity: "O(n log n)",
    space: "O(n)",
    stable: true,
    variant: "cyan",
    desc: "Divide-and-conquer algorithm that recursively splits the array and merges sorted halves. Ideal for deadline-based sorting where stability preserves original ordering of equal-priority packages.",
    useCase:
      "Best for sorting delivery deadlines where equal-deadline packages must preserve insertion order (FIFO fairness).",
    bestCase: "Ω(n log n)",
    worstCase: "O(n log n)",
  },
  quick: {
    name: "Quick Sort",
    complexity: "O(n log n)",
    space: "O(log n)",
    stable: false,
    variant: "blue",
    desc: "Partition-based algorithm that selects a pivot and recursively sorts sub-arrays. Cache-friendly and in-place — best average performance for priority-based delivery sorting.",
    useCase:
      "Best for sorting by customer priority scores where in-place swaps minimize memory overhead in large logistics queues.",
    bestCase: "Ω(n log n)",
    worstCase: "O(n²)",
  },
  heap: {
    name: "Heap Sort",
    complexity: "O(n log n)",
    space: "O(1)",
    stable: false,
    variant: "green",
    desc: "Heap data structure-based sort that builds a max-heap then extracts maximums sequentially. Guarantees worst-case O(n log n) — critical for real-time package weight sorting with strict SLA requirements.",
    useCase:
      "Best for sorting by package weight when memory is constrained and consistent worst-case guarantees are required.",
    bestCase: "Ω(n log n)",
    worstCase: "O(n log n)",
  },
};

const COMPARISON_TABLE = [
  {
    name: "Bubble Sort",
    time: "O(n²)",
    space: "O(1)",
    stable: true,
    useCase: "Naive baseline — never use in production",
    naive: true,
  },
  {
    name: "Insertion Sort",
    time: "O(n²)",
    space: "O(1)",
    stable: true,
    useCase: "Small n (<50), nearly-sorted queues",
    naive: true,
  },
  {
    name: "Merge Sort",
    time: "O(n log n)",
    space: "O(n)",
    stable: true,
    useCase: "Deadline-sorted delivery batches",
    naive: false,
  },
  {
    name: "Quick Sort",
    time: "O(n log n)",
    space: "O(log n)",
    stable: false,
    useCase: "Priority scoring, high-throughput queues",
    naive: false,
  },
  {
    name: "Heap Sort",
    time: "O(n log n)",
    space: "O(1)",
    stable: false,
    useCase: "Memory-constrained embedded sorting",
    naive: false,
  },
];

const IMPACT_CARDS = [
  {
    icon: Zap,
    iconColor: "text-destructive",
    title: "Without sorting",
    stat: "23% deadlines missed",
    desc: "Unsorted O(n²) queues cause cascading delays — late packages compound in distribution centers.",
    border: "border-destructive/20",
    statColor: "text-destructive",
  },
  {
    icon: TrendingUp,
    iconColor: "text-primary",
    title: "With O(n log n)",
    stat: "12× faster scheduling",
    desc: "Merge/Quick/Heap Sort process 10,000 orders in milliseconds vs. minutes for naive bubble sort.",
    border: "neon-cyan-border",
    statColor: "neon-cyan",
  },
  {
    icon: Shield,
    iconColor: "text-[oklch(0.62_0.20_145)]",
    title: "Stability preserves fairness",
    stat: "FIFO ordering maintained",
    desc: "Stable sorts (Merge Sort) guarantee equal-priority packages dispatch in arrival order — no bias.",
    border: "border-[oklch(0.62_0.20_145)]/20",
    statColor: "text-[oklch(0.62_0.20_145)]",
  },
];

// ─── Priority badge helper ────────────────────────────────────────────────────

function priorityStyle(p: DeliveryRequest["customerPriority"]) {
  if (p === "VIP") return "bg-accent/20 text-accent border-accent/40";
  if (p === "HIGH") return "bg-primary/20 text-primary border-primary/40";
  if (p === "MEDIUM")
    return "bg-secondary/20 text-secondary border-secondary/40";
  return "bg-muted/60 text-muted-foreground border-border/40";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SortingPage() {
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>(() =>
    generateDeliveries(20),
  );
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoTab>("merge");
  const [sortKey, setSortKey] = useState<SortKey>("deadline");
  const [swapCount, setSwapCount] = useState(0);

  const {
    state,
    start,
    pause,
    resume,
    reset,
    stepForward,
    stepBack,
    setSpeed,
  } = useAlgorithm<ArrayStep>();

  const sortValues = useMemo(() => {
    return deliveries.map((d) => {
      if (sortKey === "deadline") return d.deadline;
      if (sortKey === "priority") return PRIORITY_WEIGHT[d.customerPriority];
      return d.packageWeight;
    });
  }, [deliveries, sortKey]);

  const currentStep = state.steps[state.currentStep];
  const displayArray = currentStep?.array ?? sortValues;
  const comparing = currentStep?.comparing ?? [];
  const swapping = currentStep?.swapping ?? [];
  const sorted = currentStep?.sorted ?? [];

  useEffect(() => {
    setSpeed(200);
  }, [setSpeed]);

  const handleGenerate = useCallback(() => {
    reset();
    setDeliveries(generateDeliveries(20));
    setSwapCount(0);
  }, [reset]);

  const handleRunSort = useCallback(() => {
    if (state.status === "running") {
      pause();
      return;
    }
    if (state.status === "paused") {
      resume();
      return;
    }

    const arr = deliveries.map((d) => {
      if (sortKey === "deadline") return d.deadline;
      if (sortKey === "priority") return PRIORITY_WEIGHT[d.customerPriority];
      return d.packageWeight;
    });

    let steps: ArrayStep[];
    if (selectedAlgo === "merge") steps = generateMergeSortSteps(arr);
    else if (selectedAlgo === "quick") steps = generateQuickSortSteps(arr);
    else steps = generateHeapSortSteps(arr);

    const swaps = steps.filter((s) => s.swapping.length > 0).length;
    const comps = steps.filter((s) => s.comparing.length > 0).length;
    setSwapCount(swaps);
    start(steps, Math.round(steps.length * 0.8), comps);
  }, [deliveries, selectedAlgo, sortKey, state.status, start, pause, resume]);

  const handleReset = useCallback(() => {
    reset();
    setSwapCount(0);
  }, [reset]);

  const vipSorted = [...VIP_DELIVERIES].sort((a, b) => a.deadline - b.deadline);
  const regularDeliveries = deliveries
    .filter((d) => d.customerPriority !== "VIP")
    .slice(0, 8);
  const simTimeMs =
    state.comparisons > 0
      ? Math.round(state.comparisons * 0.04 * 100) / 100
      : 0;

  return (
    <div className="min-h-screen bg-background" data-ocid="sorting.page">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border/40 surface-grid">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono mb-3">
              <span>MODULE 01</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">Sorting Algorithms</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-cyan-text mb-2">
              Delivery Prioritization Engine
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Sorting algorithms for optimal delivery scheduling
            </p>
            <div className="flex flex-wrap gap-3">
              <AlgorithmBadge
                complexity="O(n log n)"
                label="Merge Sort"
                variant="cyan"
              />
              <AlgorithmBadge
                complexity="O(n log n)"
                label="Quick Sort"
                variant="blue"
              />
              <AlgorithmBadge
                complexity="O(n log n)"
                label="Heap Sort"
                variant="green"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Algorithm Tabs ────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs
            value={selectedAlgo}
            onValueChange={(v) => {
              setSelectedAlgo(v as AlgoTab);
              handleReset();
            }}
          >
            <TabsList
              className="bg-card border border-border/40 mb-6"
              data-ocid="sorting.algo.tab"
            >
              <TabsTrigger value="merge" data-ocid="sorting.merge.tab">
                Merge Sort
              </TabsTrigger>
              <TabsTrigger value="quick" data-ocid="sorting.quick.tab">
                Quick Sort
              </TabsTrigger>
              <TabsTrigger value="heap" data-ocid="sorting.heap.tab">
                Heap Sort
              </TabsTrigger>
            </TabsList>

            {(["merge", "quick", "heap"] as AlgoTab[]).map((algo) => (
              <TabsContent key={algo} value={algo}>
                <div className="card-elevated p-6 grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-display font-semibold text-foreground">
                        {ALGO_INFO[algo].name}
                      </h2>
                      <AlgorithmBadge
                        complexity={ALGO_INFO[algo].complexity}
                        variant={ALGO_INFO[algo].variant}
                      />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {ALGO_INFO[algo].desc}
                    </p>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Use Case in Logistics
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ALGO_INFO[algo].useCase}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4 border border-border/20 space-y-2 self-start">
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
                      Complexity Analysis
                    </p>
                    {[
                      { label: "Time", value: ALGO_INFO[algo].complexity },
                      { label: "Space", value: ALGO_INFO[algo].space },
                      { label: "Best Case", value: ALGO_INFO[algo].bestCase },
                      { label: "Worst Case", value: ALGO_INFO[algo].worstCase },
                      {
                        label: "Stable",
                        value: ALGO_INFO[algo].stable ? "Yes ✓" : "No ✗",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                        <span className="text-xs font-mono text-primary">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.section>

        {/* ── Interactive Demo ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-elevated p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Interactive Sorting Demo
                </h2>
                <p className="text-sm text-muted-foreground">
                  20 delivery requests — visualized step by step
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort key toggle */}
                <div
                  className="flex gap-1 bg-muted/40 rounded-lg p-1 border border-border/30"
                  data-ocid="sorting.key.toggle"
                >
                  {(["deadline", "priority", "weight"] as SortKey[]).map(
                    (k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setSortKey(k);
                          handleReset();
                        }}
                        data-ocid={`sorting.key.${k}`}
                        className={`px-3 py-1.5 rounded text-xs font-mono transition-smooth capitalize ${
                          sortKey === k
                            ? "bg-primary text-primary-foreground shadow"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {k === "weight"
                          ? "Weight"
                          : k === "deadline"
                            ? "Deadline"
                            : "Priority"}
                      </button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  data-ocid="sorting.generate.button"
                  className="gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  New Data
                </Button>
              </div>
            </div>

            {/* Bars */}
            <SortBarsContainer
              array={displayArray}
              comparing={comparing}
              swapping={swapping}
              sorted={sorted}
              height="220px"
            />

            {/* Controls row */}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stepBack}
                  disabled={state.status === "idle" || state.currentStep === 0}
                  data-ocid="sorting.step_back.button"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  onClick={handleRunSort}
                  disabled={state.status === "complete"}
                  data-ocid="sorting.run.primary_button"
                  className={`gap-2 min-w-[120px] ${
                    state.status === "running"
                      ? "bg-accent/80 hover:bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  {state.status === "running" ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : state.status === "paused" ? (
                    <>
                      <Play className="w-4 h-4" /> Resume
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Run Sort
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={stepForward}
                  disabled={
                    state.status === "idle" ||
                    state.currentStep >= state.steps.length - 1
                  }
                  data-ocid="sorting.step_forward.button"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={state.status === "idle"}
                  data-ocid="sorting.reset.button"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                {[
                  { color: "bg-secondary", label: "Comparing" },
                  { color: "bg-destructive", label: "Swapping" },
                  { color: "bg-[oklch(0.62_0.20_145)]", label: "Sorted" },
                  { color: "bg-primary/70", label: "Unsorted" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {state.status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
                data-ocid="sorting.stats.section"
              >
                {[
                  {
                    label: "Step",
                    value: `${state.currentStep + 1} / ${state.steps.length}`,
                  },
                  {
                    label: "Comparisons",
                    value: state.comparisons.toLocaleString(),
                  },
                  { label: "Swaps", value: swapCount.toLocaleString() },
                  {
                    label: "Est. Time",
                    value: `${simTimeMs}ms`,
                    highlight: state.status === "complete",
                  },
                ].map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className="bg-muted/20 rounded-lg p-3 border border-border/20 text-center"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {label}
                    </p>
                    <p
                      className={`text-lg font-mono font-bold ${highlight ? "neon-cyan" : "text-foreground"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* ── VIP Queue Section ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {/* VIP */}
            <div
              className="card-elevated p-6 neon-amber-border"
              data-ocid="sorting.vip_queue.panel"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-display font-semibold text-accent">
                    VIP Orders Queue
                  </h2>
                </div>
                <Badge className="bg-accent/20 text-accent border-accent/40 font-mono">
                  {vipSorted.length} items
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4 font-mono bg-accent/5 border border-accent/15 rounded px-3 py-2">
                Sorted by deadline — bypasses regular queue
              </p>
              <div className="space-y-2" data-ocid="sorting.vip_queue.list">
                {vipSorted.map((d, idx) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    data-ocid={`sorting.vip_queue.item.${idx + 1}`}
                    className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-lg px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Crown className="w-3.5 h-3.5 text-accent opacity-70 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-mono font-semibold text-foreground">
                          {d.id}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {d.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <span className="text-muted-foreground">
                        {d.packageWeight}kg
                      </span>
                      <span className="text-accent font-bold">
                        D:{d.deadline}h
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Regular */}
            <div
              className="card-elevated p-6"
              data-ocid="sorting.regular_queue.panel"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Hash className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Regular Queue
                  </h2>
                </div>
                <Badge className="bg-muted/60 text-muted-foreground border-border/40 font-mono">
                  {deliveries.length} items
                </Badge>
              </div>
              <div className="flex gap-3 mb-4 text-xs font-mono text-muted-foreground bg-muted/20 rounded px-3 py-2 border border-border/20">
                <span className="text-accent font-semibold">
                  VIP Queue: {vipSorted.length} items
                </span>
                <span>|</span>
                <span>Regular Queue: {deliveries.length} items</span>
              </div>
              <div
                className="space-y-2 max-h-[310px] overflow-y-auto scrollbar-thin"
                data-ocid="sorting.regular_queue.list"
              >
                {regularDeliveries.map((d, idx) => (
                  <div
                    key={d.id}
                    data-ocid={`sorting.regular_queue.item.${idx + 1}`}
                    className="flex items-center justify-between bg-muted/10 border border-border/20 rounded-lg px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-mono font-semibold text-foreground">
                        {d.id}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {d.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${priorityStyle(d.customerPriority)}`}
                      >
                        {d.customerPriority}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        D:{d.deadline}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Comparison Table ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/10">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Algorithm Comparison
              </h2>
              <p className="text-sm text-muted-foreground">
                O(n²) naive approaches vs O(n log n) optimal algorithms
              </p>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="sorting.comparison.table"
              >
                <thead>
                  <tr className="bg-muted/20 border-b border-border/30">
                    {[
                      "Algorithm",
                      "Time Complexity",
                      "Space Complexity",
                      "Stable?",
                      "Best Use Case",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((algo, idx) => (
                    <tr
                      key={algo.name}
                      data-ocid={`sorting.comparison.row.${idx + 1}`}
                      className={`border-b border-border/20 transition-smooth hover:bg-muted/10 ${algo.naive ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {algo.name}
                          </span>
                          {algo.naive && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                              naive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-mono text-xs ${algo.naive ? "text-destructive" : "text-primary"}`}
                        >
                          {algo.time}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-secondary">
                          {algo.space}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-mono text-xs font-semibold ${algo.stable ? "text-[oklch(0.62_0.20_145)]" : "text-muted-foreground"}`}
                        >
                          {algo.stable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {algo.useCase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* ── Why Sorting Matters ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-muted/20 rounded-xl border border-border/30 p-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-5">
              Why Sorting Matters
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {IMPACT_CARDS.map(
                (
                  {
                    icon: Icon,
                    iconColor,
                    title,
                    stat,
                    desc,
                    border,
                    statColor,
                  },
                  i,
                ) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.1 }}
                    data-ocid={`sorting.impact.card.${i + 1}`}
                    className={`kpi-card ${border}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                      <span className="text-sm font-semibold text-foreground">
                        {title}
                      </span>
                    </div>
                    <p
                      className={`text-xl font-display font-bold mb-2 ${statColor}`}
                    >
                      {stat}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
