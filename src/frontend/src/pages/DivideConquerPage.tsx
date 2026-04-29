import { AlgorithmBadge } from "@/components/AlgorithmBadge";
import { Button } from "@/components/ui/button";
import { BarChart2, GitBranch, Grid, Layers, Zap } from "lucide-react";
import { useCallback, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Warehouse {
  id: string;
  x: number;
  y: number;
}

interface ZonePoint {
  id: string;
  x: number;
  y: number;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const WAREHOUSES: Warehouse[] = [
  { id: "W1", x: 58, y: 72 },
  { id: "W2", x: 142, y: 38 },
  { id: "W3", x: 210, y: 115 },
  { id: "W4", x: 88, y: 195 },
  { id: "W5", x: 305, y: 55 },
  { id: "W6", x: 378, y: 148 },
  { id: "W7", x: 240, y: 245 },
  { id: "W8", x: 420, y: 290 },
  { id: "W9", x: 165, y: 295 },
  { id: "W10", x: 458, y: 82 },
  { id: "W11", x: 330, y: 200 },
  { id: "W12", x: 75, y: 320 },
  { id: "W13", x: 252, y: 268 },
  { id: "W14", x: 185, y: 168 },
  { id: "W15", x: 400, y: 220 },
  { id: "W16", x: 120, y: 138 },
  { id: "W17", x: 350, y: 310 },
  { id: "W18", x: 480, y: 160 },
  { id: "W19", x: 290, y: 130 },
  { id: "W20", x: 440, y: 50 },
];

const ZONE_POINTS: ZonePoint[] = [
  { id: "zp-01", x: 45, y: 55 },
  { id: "zp-02", x: 120, y: 80 },
  { id: "zp-03", x: 80, y: 140 },
  { id: "zp-04", x: 200, y: 60 },
  { id: "zp-05", x: 170, y: 130 },
  { id: "zp-06", x: 110, y: 200 },
  { id: "zp-07", x: 220, y: 180 },
  { id: "zp-08", x: 55, y: 220 },
  { id: "zp-09", x: 190, y: 220 },
  { id: "zp-10", x: 150, y: 300 },
  { id: "zp-11", x: 310, y: 45 },
  { id: "zp-12", x: 380, y: 90 },
  { id: "zp-13", x: 340, y: 160 },
  { id: "zp-14", x: 460, y: 55 },
  { id: "zp-15", x: 410, y: 140 },
  { id: "zp-16", x: 480, y: 190 },
  { id: "zp-17", x: 290, y: 120 },
  { id: "zp-18", x: 445, y: 110 },
  { id: "zp-19", x: 320, y: 240 },
  { id: "zp-20", x: 390, y: 280 },
  { id: "zp-21", x: 460, y: 240 },
  { id: "zp-22", x: 280, y: 300 },
  { id: "zp-23", x: 350, y: 320 },
  { id: "zp-24", x: 420, y: 310 },
  { id: "zp-25", x: 480, y: 340 },
  { id: "zp-26", x: 95, y: 310 },
  { id: "zp-27", x: 60, y: 270 },
  { id: "zp-28", x: 170, y: 280 },
];

const ZONE_STATS = [
  { id: "zone-1", name: "Zone 1 (NW)", deliveries: 247 },
  { id: "zone-2", name: "Zone 2 (NE)", deliveries: 312 },
  { id: "zone-3", name: "Zone 3 (SW)", deliveries: 198 },
  { id: "zone-4", name: "Zone 4 (SE)", deliveries: 289 },
];

const ZONE_COLORS = [
  "oklch(0.63 0.3 200)",
  "oklch(0.55 0.26 252)",
  "oklch(0.68 0.22 60)",
  "oklch(0.62 0.20 145)",
];

const ZONE_FILL_COLORS = [
  "oklch(0.63 0.3 200 / 0.08)",
  "oklch(0.55 0.26 252 / 0.08)",
  "oklch(0.68 0.22 60 / 0.08)",
  "oklch(0.62 0.20 145 / 0.08)",
];

const SCALABILITY_DATA = [
  { name: "100", bubbleSort: 0.01, mergeSort: 0.001, parallel: 0.0008 },
  { name: "1K", bubbleSort: 1, mergeSort: 0.01, parallel: 0.008 },
  { name: "10K", bubbleSort: 100, mergeSort: 0.13, parallel: 0.1 },
];

const SCALABILITY_TABLE = [
  {
    id: "size-100",
    size: "Small (100)",
    bubbleSort: "0.01ms",
    mergeSort: "0.001ms",
    parallel: "0.0008ms",
  },
  {
    id: "size-1k",
    size: "Medium (1,000)",
    bubbleSort: "1ms",
    mergeSort: "0.01ms",
    parallel: "0.008ms",
  },
  {
    id: "size-10k",
    size: "Large (10,000)",
    bubbleSort: "100ms",
    mergeSort: "0.13ms",
    parallel: "0.1ms",
  },
];

// ─── Recurrence Tree levels ───────────────────────────────────────────────────

const RECURRENCE_LEVELS = [
  {
    id: "rec-level-0",
    label: "Level 0",
    work: "O(n)",
    nodes: [{ id: "rn-n", label: "n" }],
  },
  {
    id: "rec-level-1",
    label: "Level 1",
    work: "2×O(n/2)",
    nodes: [
      { id: "rn-n2a", label: "n/2" },
      { id: "rn-n2b", label: "n/2" },
    ],
  },
  {
    id: "rec-level-2",
    label: "Level 2",
    work: "4×O(n/4)",
    nodes: [
      { id: "rn-n4a", label: "n/4" },
      { id: "rn-n4b", label: "n/4" },
      { id: "rn-n4c", label: "n/4" },
      { id: "rn-n4d", label: "n/4" },
    ],
  },
  {
    id: "rec-level-3",
    label: "Level 3",
    work: "8×O(n/8)",
    nodes: [
      { id: "rn-n8a", label: "n/8" },
      { id: "rn-n8b", label: "n/8" },
      { id: "rn-n8c", label: "n/8" },
      { id: "rn-n8d", label: "n/8" },
      { id: "rn-n8e", label: "n/8" },
      { id: "rn-n8f", label: "n/8" },
      { id: "rn-n8g", label: "n/8" },
      { id: "rn-n8h", label: "n/8" },
    ],
  },
];

// ─── Merge Sort divide tree ───────────────────────────────────────────────────

const ORIGINAL_ARRAY = [
  38, 27, 43, 3, 9, 82, 10, 45, 17, 65, 31, 54, 22, 71, 8, 60,
];

function buildDivideLevels(arr: number[]): number[][][] {
  const levels: number[][][] = [];
  let current: number[][] = [arr];
  levels.push(current);
  while (current[0].length > 1) {
    const next: number[][] = [];
    for (const chunk of current) {
      const mid = Math.ceil(chunk.length / 2);
      next.push(chunk.slice(0, mid));
      next.push(chunk.slice(mid));
    }
    current = next;
    levels.push(current);
  }
  return levels;
}

function buildMergeLevels(arr: number[]): number[][][] {
  const levels: number[][][] = [arr.map((v) => [v])];
  let current = arr.map((v) => [v]);
  while (current.length > 1) {
    const merged: number[][] = [];
    for (let i = 0; i < current.length; i += 2) {
      if (i + 1 < current.length) {
        merged.push([...current[i], ...current[i + 1]]);
      } else {
        merged.push([...current[i]]);
      }
    }
    levels.push(merged);
    current = merged;
  }
  return levels;
}

const DIVIDE_LEVELS = buildDivideLevels(ORIGINAL_ARRAY);
const MERGE_LEVELS = buildMergeLevels(ORIGINAL_ARRAY).reverse();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dist(a: Warehouse, b: Warehouse): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function findClosestPair(pts: Warehouse[]): [Warehouse, Warehouse, number] {
  let best: [Warehouse, Warehouse, number] = [
    pts[0],
    pts[1],
    dist(pts[0], pts[1]),
  ];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = dist(pts[i], pts[j]);
      if (d < best[2]) best = [pts[i], pts[j], d];
    }
  }
  return best;
}

function getZoneIndex(p: ZonePoint): number {
  if (p.x < 250 && p.y < 175) return 0;
  if (p.x >= 250 && p.y < 175) return 1;
  if (p.x < 250 && p.y >= 175) return 2;
  return 3;
}

// ─── Shared Section Components ────────────────────────────────────────────────

function SectionCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return <div className={`card-elevated p-6 ${className}`}>{children}</div>;
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 mt-0.5 shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ─── Parallel Merge Sort Visualization ───────────────────────────────────────

function MergeSortViz() {
  const [activeLevel, setActiveLevel] = useState<number>(-1);
  const [phase, setPhase] = useState<"idle" | "dividing" | "merging" | "done">(
    "idle",
  );

  const runDivide = useCallback(async () => {
    setPhase("dividing");
    setActiveLevel(-1);
    for (let i = 0; i < DIVIDE_LEVELS.length; i++) {
      await new Promise<void>((r) => setTimeout(r, 420));
      setActiveLevel(i);
    }
    setPhase("done");
  }, []);

  const runMerge = useCallback(async () => {
    setPhase("merging");
    setActiveLevel(-1);
    for (let i = 0; i < MERGE_LEVELS.length; i++) {
      await new Promise<void>((r) => setTimeout(r, 420));
      setActiveLevel(i);
    }
    setPhase("done");
  }, []);

  const levels = phase === "merging" ? MERGE_LEVELS : DIVIDE_LEVELS;
  const displayLevels =
    activeLevel >= 0 ? levels.slice(0, activeLevel + 1) : [DIVIDE_LEVELS[0]];

  return (
    <SectionCard>
      <SectionTitle
        icon={GitBranch}
        title="Parallel Merge Sort — Divide Phase"
      />

      <div className="space-y-3 mb-6 min-h-[220px] overflow-x-auto">
        {displayLevels.map((level, li) => {
          const levelKey = `ms-lvl-${li}-${phase}`;
          return (
            <div
              key={levelKey}
              className="flex flex-wrap gap-1 items-center animate-in fade-in duration-300"
            >
              <span className="text-xs text-muted-foreground w-14 text-right mr-2 font-mono shrink-0">
                L{li}:
              </span>
              {level.map((chunk, ci) => {
                const chunkKey = `ck-${li}-${ci}-${chunk[0]}-${chunk.length}`;
                return (
                  <div key={chunkKey} className="flex gap-0.5">
                    {chunk.map((val) => {
                      const valKey = `v-${li}-${ci}-${val}`;
                      return (
                        <span
                          key={valKey}
                          className="w-7 h-7 flex items-center justify-center text-[10px] font-mono rounded border font-semibold"
                          style={{
                            background:
                              li === activeLevel
                                ? "oklch(0.63 0.3 200 / 0.2)"
                                : "oklch(0.22 0.018 262 / 0.6)",
                            borderColor:
                              li === activeLevel
                                ? "oklch(0.63 0.3 200 / 0.5)"
                                : "oklch(0.26 0.025 262 / 0.4)",
                            color:
                              li === activeLevel
                                ? "oklch(0.63 0.3 200)"
                                : "oklch(0.7 0.018 262)",
                          }}
                        >
                          {val}
                        </span>
                      );
                    })}
                    {ci < level.length - 1 && (
                      <span className="w-2 flex items-center justify-center text-muted-foreground/20 text-xs">
                        |
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap mb-5">
        <Button
          data-ocid="merge-sort.divide_button"
          size="sm"
          onClick={runDivide}
          disabled={phase === "dividing" || phase === "merging"}
          className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
        >
          <GitBranch className="w-4 h-4 mr-1.5" />
          {phase === "dividing" ? "Dividing…" : "Run Divide Phase"}
        </Button>
        <Button
          data-ocid="merge-sort.merge_button"
          size="sm"
          variant="outline"
          onClick={runMerge}
          disabled={phase === "dividing" || phase === "merging"}
          className="border-secondary/40 text-secondary hover:bg-secondary/10"
        >
          <Layers className="w-4 h-4 mr-1.5" />
          {phase === "merging" ? "Merging…" : "Run Merge Phase"}
        </Button>
        {phase === "done" && (
          <Button
            data-ocid="merge-sort.reset_button"
            size="sm"
            variant="outline"
            onClick={() => {
              setPhase("idle");
              setActiveLevel(-1);
            }}
            className="border-muted text-muted-foreground hover:bg-muted/30"
          >
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-lg bg-muted/30 border border-primary/10 p-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary font-semibold">With parallelism:</span>{" "}
          8 threads → O(n) work each → Total:{" "}
          <span className="text-secondary font-semibold">O(n log n)</span>
        </p>
      </div>
    </SectionCard>
  );
}

// ─── Closest Pair Visualization ───────────────────────────────────────────────

function ClosestPairViz() {
  const [closest, setClosest] = useState<[Warehouse, Warehouse, number] | null>(
    null,
  );
  const [running, setRunning] = useState(false);
  const [showLine, setShowLine] = useState(false);

  const handleFind = useCallback(async () => {
    setRunning(true);
    setShowLine(false);
    setClosest(null);
    await new Promise<void>((r) => setTimeout(r, 800));
    const result = findClosestPair(WAREHOUSES);
    setClosest(result);
    await new Promise<void>((r) => setTimeout(r, 300));
    setShowLine(true);
    setRunning(false);
  }, []);

  return (
    <SectionCard>
      <SectionTitle
        icon={Grid}
        title="Closest Pair — Warehouse Proximity Analysis"
      />

      <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20 mb-4">
        <svg
          width="100%"
          viewBox="0 0 500 350"
          style={{ display: "block" }}
          role="img"
          aria-label="Warehouse closest pair visualization"
        >
          {[50, 100, 150, 200, 250, 300, 350].map((y) => (
            <line
              key={`hg-y${y}`}
              x1={0}
              y1={y}
              x2={500}
              y2={y}
              stroke="oklch(0.26 0.025 262 / 0.2)"
              strokeWidth={0.5}
            />
          ))}
          {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((x) => (
            <line
              key={`vg-x${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={350}
              stroke="oklch(0.26 0.025 262 / 0.2)"
              strokeWidth={0.5}
            />
          ))}

          {running && (
            <line
              x1={250}
              y1={0}
              x2={250}
              y2={350}
              stroke="oklch(0.68 0.22 60 / 0.6)"
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />
          )}

          {showLine && closest && (
            <line
              x1={closest[0].x}
              y1={closest[0].y}
              x2={closest[1].x}
              y2={closest[1].y}
              stroke="oklch(0.63 0.3 200)"
              strokeWidth={2}
              strokeDasharray="4,2"
              style={{
                filter: "drop-shadow(0 0 6px oklch(0.63 0.3 200 / 0.8))",
              }}
            />
          )}

          {WAREHOUSES.map((w) => {
            const isClosest =
              closest != null &&
              (w.id === closest[0].id || w.id === closest[1].id);
            return (
              <g key={`wh-${w.id}`}>
                <circle
                  cx={w.x}
                  cy={w.y}
                  r={isClosest ? 7 : 5}
                  fill={
                    isClosest
                      ? "oklch(0.63 0.3 200 / 0.3)"
                      : "oklch(0.55 0.26 252 / 0.2)"
                  }
                  stroke={
                    isClosest
                      ? "oklch(0.63 0.3 200)"
                      : "oklch(0.55 0.26 252 / 0.7)"
                  }
                  strokeWidth={isClosest ? 2 : 1}
                  style={
                    isClosest
                      ? {
                          filter:
                            "drop-shadow(0 0 5px oklch(0.63 0.3 200 / 0.7))",
                        }
                      : undefined
                  }
                />
                <text
                  x={w.x + 8}
                  y={w.y - 6}
                  fontSize={8}
                  fill="oklch(0.6 0.018 262)"
                  fontFamily="var(--font-mono)"
                >
                  {w.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <Button
        data-ocid="closest-pair.find_button"
        size="sm"
        onClick={handleFind}
        disabled={running}
        className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 mb-4"
      >
        <Zap className="w-4 h-4 mr-1.5" />
        {running ? "Computing…" : "Find Closest Pair"}
      </Button>

      {closest && showLine && (
        <div
          data-ocid="closest-pair.result"
          className="rounded-lg bg-primary/5 border border-primary/20 p-3 font-mono text-xs space-y-1 animate-in fade-in duration-300"
        >
          <p>
            <span className="text-muted-foreground">Closest warehouses:</span>{" "}
            <span className="text-primary font-semibold">
              {closest[0].id} & {closest[1].id}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Distance:</span>{" "}
            <span className="text-accent font-semibold">
              {(closest[2] * 0.47).toFixed(1)}km
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Complexity:</span>{" "}
            <span className="text-primary">O(n log n)</span>
            <span className="text-muted-foreground mx-2">vs</span>
            <span className="text-destructive">O(n²) brute force</span>
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// ─── Zone Division Visualization ──────────────────────────────────────────────

function ZoneDivisionViz() {
  const [visibleZones, setVisibleZones] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleDivide = useCallback(async () => {
    setRunning(true);
    setDone(false);
    setVisibleZones(0);
    for (let i = 1; i <= 4; i++) {
      await new Promise<void>((r) => setTimeout(r, 350));
      setVisibleZones(i);
    }
    setDone(true);
    setRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setVisibleZones(0);
    setDone(false);
  }, []);

  const zoneBoundaries = [
    { id: "zb-nw", x: 0, y: 0, w: 250, h: 175, zone: 0 },
    { id: "zb-ne", x: 250, y: 0, w: 250, h: 175, zone: 1 },
    { id: "zb-sw", x: 0, y: 175, w: 250, h: 175, zone: 2 },
    { id: "zb-se", x: 250, y: 175, w: 250, h: 175, zone: 3 },
  ];

  return (
    <SectionCard>
      <SectionTitle
        icon={Grid}
        title="Delivery Zone Division — Quadtree Partitioning"
      />

      <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20 mb-4">
        <svg
          width="100%"
          viewBox="0 0 500 350"
          style={{ display: "block" }}
          role="img"
          aria-label="Delivery zone division quadtree visualization"
        >
          {zoneBoundaries.slice(0, visibleZones).map((zb) => (
            <rect
              key={`zfill-${zb.id}`}
              x={zb.x}
              y={zb.y}
              width={zb.w}
              height={zb.h}
              fill={ZONE_FILL_COLORS[zb.zone]}
              className="animate-in fade-in duration-300"
            />
          ))}

          {visibleZones >= 4 && (
            <>
              <line
                x1={250}
                y1={0}
                x2={250}
                y2={350}
                stroke="oklch(0.63 0.3 200 / 0.4)"
                strokeWidth={1.5}
              />
              <line
                x1={0}
                y1={175}
                x2={500}
                y2={175}
                stroke="oklch(0.63 0.3 200 / 0.4)"
                strokeWidth={1.5}
              />
            </>
          )}

          {ZONE_POINTS.map((p) => {
            const zi = getZoneIndex(p);
            const isColored = done && zi < visibleZones;
            return (
              <circle
                key={`zpt-${p.id}`}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={
                  isColored ? ZONE_COLORS[zi] : "oklch(0.6 0.018 262 / 0.8)"
                }
                style={
                  isColored
                    ? { filter: `drop-shadow(0 0 3px ${ZONE_COLORS[zi]})` }
                    : undefined
                }
              />
            );
          })}

          {visibleZones >= 4 &&
            zoneBoundaries.map((zb) => (
              <text
                key={`zlabel-${zb.id}`}
                x={zb.x + zb.w / 2}
                y={zb.y + zb.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontFamily="var(--font-mono)"
                fill={ZONE_COLORS[zb.zone]}
                fontWeight={700}
              >
                Zone {zb.zone + 1}
              </text>
            ))}
        </svg>
      </div>

      <div className="flex gap-3 mb-5">
        <Button
          data-ocid="zone-division.divide_button"
          size="sm"
          onClick={handleDivide}
          disabled={running}
          className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
        >
          <Grid className="w-4 h-4 mr-1.5" />
          {running ? "Dividing…" : "Divide into Zones"}
        </Button>
        {done && (
          <Button
            data-ocid="zone-division.reset_button"
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="border-muted text-muted-foreground hover:bg-muted/30"
          >
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-border/30 overflow-hidden mb-4">
        <table className="w-full text-sm" data-ocid="zone-division.stats_table">
          <thead>
            <tr className="bg-muted/40 border-b border-border/30">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                Zone
              </th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                Deliveries
              </th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody>
            {ZONE_STATS.map((z, zi) => (
              <tr
                key={z.id}
                className="border-b border-border/20 hover:bg-muted/20 transition-colors"
              >
                <td
                  className="px-4 py-2.5 font-mono text-xs font-semibold"
                  style={{ color: ZONE_COLORS[zi] }}
                >
                  {z.name}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">
                  {z.deliveries.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                  {((z.deliveries / 1046) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
            <tr className="bg-muted/20">
              <td className="px-4 py-2.5 font-mono text-xs font-semibold text-foreground">
                Total
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-foreground font-bold">
                1,046
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-primary">
                100%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary font-semibold">Balanced zones</span>{" "}
          enable parallel processing —{" "}
          <span className="text-accent font-semibold">
            4× throughput improvement
          </span>{" "}
          with O(n log n) zone-finding complexity
        </p>
      </div>
    </SectionCard>
  );
}

// ─── Scalability Chart ────────────────────────────────────────────────────────

function ScalabilityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="card-elevated p-3 text-xs font-mono space-y-1 min-w-[170px]">
      <p className="text-muted-foreground border-b border-border/30 pb-1 mb-1">
        n = {label}
      </p>
      {payload.map((p) => (
        <p key={`tip-${p.name}`} style={{ color: p.color }}>
          {p.name}: {p.value}ms
        </p>
      ))}
    </div>
  );
}

function ScalabilityChart() {
  return (
    <SectionCard>
      <SectionTitle
        icon={BarChart2}
        title="Scalability: Small → Medium → Large City"
        subtitle="Execution time comparison across input sizes (log scale)"
      />

      <div className="h-64 mb-6" data-ocid="scalability.chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={SCALABILITY_DATA}
            margin={{ top: 5, right: 20, left: 0, bottom: 18 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.26 0.025 262 / 0.3)"
            />
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 11,
                fill: "oklch(0.6 0.018 262)",
                fontFamily: "var(--font-mono)",
              }}
              label={{
                value: "Input Size (n)",
                position: "insideBottom",
                offset: -8,
                fill: "oklch(0.5 0.018 262)",
                fontSize: 11,
              }}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              tick={{
                fontSize: 11,
                fill: "oklch(0.6 0.018 262)",
                fontFamily: "var(--font-mono)",
              }}
              label={{
                value: "Time (ms, log)",
                angle: -90,
                position: "insideLeft",
                fill: "oklch(0.5 0.018 262)",
                fontSize: 11,
              }}
            />
            <Tooltip content={<ScalabilityTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                paddingTop: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="bubbleSort"
              name="O(n²) Bubble Sort"
              stroke="oklch(0.56 0.24 22)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.56 0.24 22)", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="mergeSort"
              name="O(n log n) Merge Sort"
              stroke="oklch(0.63 0.3 200)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.63 0.3 200)", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="parallel"
              name="O(n log²n) Parallel"
              stroke="oklch(0.62 0.20 145)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.62 0.20 145)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-border/30 overflow-hidden">
        <table className="w-full text-xs" data-ocid="scalability.table">
          <thead>
            <tr className="bg-muted/40 border-b border-border/30">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wide">
                City Scale
              </th>
              <th className="text-right px-4 py-2.5 text-destructive font-medium uppercase tracking-wide">
                O(n²) Bubble
              </th>
              <th className="text-right px-4 py-2.5 text-primary font-medium uppercase tracking-wide">
                O(n log n) Merge
              </th>
              <th className="text-right px-4 py-2.5 text-[oklch(0.62_0.20_145)] font-medium uppercase tracking-wide">
                Parallel D&C
              </th>
            </tr>
          </thead>
          <tbody>
            {SCALABILITY_TABLE.map((row) => (
              <tr
                key={`scale-${row.id}`}
                className="border-b border-border/20 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-2.5 font-mono text-foreground">
                  {row.size}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-destructive">
                  {row.bubbleSort}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-primary">
                  {row.mergeSort}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[oklch(0.62_0.20_145)]">
                  {row.parallel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export function DivideConquerPage() {
  const levelColors = [
    { l: 0.63, c: 0.3, h: 200 },
    { l: 0.55, c: 0.26, h: 210 },
    { l: 0.48, c: 0.22, h: 215 },
    { l: 0.42, c: 0.18, h: 218 },
  ];

  return (
    <div
      className="min-h-screen bg-background surface-grid"
      data-ocid="divide-conquer.page"
    >
      {/* Page Header */}
      <div className="border-b border-border/30 bg-card/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <AlgorithmBadge
              complexity="O(n log n)"
              label="Parallel Merge Sort"
              variant="cyan"
            />
            <AlgorithmBadge
              complexity="O(n log n)"
              label="Closest Pair"
              variant="blue"
            />
            <AlgorithmBadge
              complexity="O(n log n)"
              label="Zone Division"
              variant="green"
            />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-cyan-text mt-1 mb-1">
            Module 5: Divide &amp; Conquer — Scalability Engine
          </h1>
          <p className="text-muted-foreground text-base">
            Handling 10<sup>6</sup>+ delivery requests through recursive
            decomposition
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Recurrence & Master Theorem */}
        <SectionCard>
          <SectionTitle
            icon={GitBranch}
            title="Recurrence & Master Theorem"
            subtitle="Formal complexity analysis via the Master Theorem"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-lg bg-muted/30 border border-primary/20 p-5 flex flex-col gap-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
                Recurrence Relation
              </p>
              <p
                className="text-2xl font-mono font-bold text-primary"
                style={{ textShadow: "0 0 20px oklch(0.63 0.3 200 / 0.4)" }}
              >
                T(n) = 2T(n/2) + O(n)
              </p>
              <div className="text-xs font-mono text-muted-foreground space-y-1 border-t border-border/30 pt-3">
                <p>
                  <span className="text-foreground">a</span> = 2 subproblems
                </p>
                <p>
                  <span className="text-foreground">b</span> = 2 (halving each
                  time)
                </p>
                <p>
                  <span className="text-foreground">f(n)</span> = O(n) combine
                  step
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 border border-secondary/20 p-5 flex flex-col gap-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
                Master Theorem Result
              </p>
              <p className="text-sm font-mono text-secondary leading-relaxed">
                a=2, b=2, f(n)=n
                <br />
                log<sub>b</sub>(a) = log<sub>2</sub>(2) = 1<br />
                f(n) = Θ(n<sup>1</sup>) → <strong>Case 2</strong>
              </p>
              <div className="rounded bg-secondary/10 border border-secondary/30 px-3 py-2">
                <p className="text-base font-mono font-bold text-secondary">
                  T(n) = Θ(n log n)
                </p>
              </div>
            </div>
          </div>

          {/* Recurrence Tree */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3">
              Recurrence Tree (4 levels)
            </p>
            <div className="space-y-2">
              {RECURRENCE_LEVELS.map((level, li) => {
                const col = levelColors[li];
                return (
                  <div
                    key={level.id}
                    className="flex items-center gap-3 flex-wrap"
                  >
                    <span className="text-xs font-mono text-muted-foreground w-16 shrink-0">
                      {level.label}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {level.nodes.map((node) => (
                        <span
                          key={node.id}
                          className="px-2 py-1 rounded border text-xs font-mono font-semibold"
                          style={{
                            background: `oklch(${col.l} ${col.c} ${col.h} / 0.15)`,
                            borderColor: `oklch(${col.l} ${col.c} ${col.h} / 0.4)`,
                            color: `oklch(${col.l} ${col.c} ${col.h})`,
                          }}
                        >
                          {node.label}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground ml-auto shrink-0">
                      = {level.work}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-xs font-mono text-accent px-3">
                Total: O(log n) levels × O(n) work = O(n log n)
              </span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
          </div>
        </SectionCard>

        {/* Merge Sort + Closest Pair */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <MergeSortViz />
          <ClosestPairViz />
        </div>

        {/* Zone Division */}
        <ZoneDivisionViz />

        {/* Scalability */}
        <ScalabilityChart />
      </div>
    </div>
  );
}
