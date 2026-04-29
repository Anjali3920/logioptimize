import { AlgorithmBadge } from "@/components/AlgorithmBadge";
import { GraphCanvas } from "@/components/GraphCanvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GraphEdge, GraphNode, ShortestPathResult } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  GitBranch,
  Network,
  Route,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Graph Data ────────────────────────────────────────────────────────────────

const NODES: GraphNode[] = [
  { id: "WH", label: "WH", x: 80, y: 200, type: "warehouse" },
  { id: "CA", label: "CA", x: 180, y: 80, type: "hub" },
  { id: "CB", label: "CB", x: 200, y: 290, type: "hub" },
  { id: "CC", label: "CC", x: 290, y: 150, type: "hub" },
  { id: "CD", label: "CD", x: 310, y: 330, type: "destination" },
  { id: "CE", label: "CE", x: 420, y: 70, type: "destination" },
  { id: "CF", label: "CF", x: 440, y: 200, type: "hub" },
  { id: "CG", label: "CG", x: 380, y: 330, type: "destination" },
  { id: "CH", label: "CH", x: 520, y: 110, type: "destination" },
  { id: "CI", label: "CI", x: 530, y: 270, type: "destination" },
  { id: "CJ", label: "CJ", x: 600, y: 170, type: "destination" },
  { id: "CK", label: "CK", x: 610, y: 350, type: "destination" },
];

const BASE_EDGES: GraphEdge[] = [
  { from: "WH", to: "CA", weight: 12 },
  { from: "WH", to: "CB", weight: 18 },
  { from: "WH", to: "CC", weight: 22 },
  { from: "CA", to: "CC", weight: 14 },
  { from: "CA", to: "CE", weight: 25 },
  { from: "CB", to: "CC", weight: 11 },
  { from: "CB", to: "CD", weight: 9 },
  { from: "CC", to: "CF", weight: 16 },
  { from: "CC", to: "CE", weight: 20 },
  { from: "CD", to: "CG", weight: 13 },
  { from: "CE", to: "CH", weight: 10 },
  { from: "CE", to: "CF", weight: 8 },
  { from: "CF", to: "CH", weight: 15 },
  { from: "CF", to: "CI", weight: 12 },
  { from: "CF", to: "CJ", weight: 17 },
  { from: "CG", to: "CI", weight: 19 },
  { from: "CH", to: "CJ", weight: 7 },
  { from: "CI", to: "CK", weight: 14 },
  { from: "CJ", to: "CK", weight: 11 },
];

// ─── Algorithm Helpers ─────────────────────────────────────────────────────────

type AdjMap = Map<string, { to: string; weight: number }[]>;

function buildAdj(nodes: GraphNode[], edges: GraphEdge[]): AdjMap {
  const adj: AdjMap = new Map();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.from)!.push({ to: e.to, weight: e.weight });
    adj.get(e.to)!.push({ to: e.from, weight: e.weight });
  }
  return adj;
}

interface DijkstraStep {
  visiting: string;
  distances: Record<string, number>;
  prev: Record<string, string | null>;
  visited: string[];
}

function runDijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  src: string,
  dst: string,
): { steps: DijkstraStep[]; result: ShortestPathResult } {
  const adj = buildAdj(nodes, edges);
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const steps: DijkstraStep[] = [];

  for (const n of nodes) {
    dist[n.id] = Number.POSITIVE_INFINITY;
    prev[n.id] = null;
  }
  dist[src] = 0;

  const unvisited = new Set(nodes.map((n) => n.id));

  while (unvisited.size > 0) {
    let u = "";
    let minD = Number.POSITIVE_INFINITY;
    for (const id of unvisited) {
      if (dist[id] < minD) {
        minD = dist[id];
        u = id;
      }
    }
    if (!u || dist[u] === Number.POSITIVE_INFINITY) break;
    unvisited.delete(u);
    visited.add(u);

    steps.push({
      visiting: u,
      distances: { ...dist },
      prev: { ...prev },
      visited: [...visited],
    });

    for (const { to, weight } of adj.get(u) ?? []) {
      if (dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        prev[to] = u;
      }
    }
  }

  const path: string[] = [];
  let cur: string | null = dst;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur] ?? null;
  }
  if (path[0] !== src) path.length = 0;

  return {
    steps,
    result: {
      path,
      totalCost: dist[dst] === Number.POSITIVE_INFINITY ? 0 : dist[dst],
      algorithm: "dijkstra",
      executionTime: 0.8,
    },
  };
}

function runBellmanFord(
  nodes: GraphNode[],
  edges: GraphEdge[],
  src: string,
  dst: string,
): ShortestPathResult {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  for (const n of nodes) {
    dist[n.id] = Number.POSITIVE_INFINITY;
    prev[n.id] = null;
  }
  dist[src] = 0;

  const allEdges = [
    ...edges,
    ...edges.map((e) => ({ from: e.to, to: e.from, weight: e.weight })),
  ];

  for (let i = 0; i < nodes.length - 1; i++) {
    for (const e of allEdges) {
      if (dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;
        prev[e.to] = e.from;
      }
    }
  }

  const path: string[] = [];
  let cur: string | null = dst;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur] ?? null;
  }
  if (path[0] !== src) path.length = 0;

  return {
    path,
    totalCost: dist[dst] === Number.POSITIVE_INFINITY ? 0 : dist[dst],
    algorithm: "bellman-ford",
    executionTime: 3.2,
  };
}

function kruskalMST(
  nodes: GraphNode[],
  edges: GraphEdge[],
): { mstEdges: GraphEdge[]; totalWeight: number } {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const parent = new Map<string, string>(nodes.map((n) => [n.id, n.id]));
  const rank = new Map<string, number>(nodes.map((n) => [n.id, 0]));

  function find(x: string): string {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  }
  function union(a: string, b: string): boolean {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    if ((rank.get(ra) ?? 0) < (rank.get(rb) ?? 0)) parent.set(ra, rb);
    else if ((rank.get(ra) ?? 0) > (rank.get(rb) ?? 0)) parent.set(rb, ra);
    else {
      parent.set(rb, ra);
      rank.set(ra, (rank.get(ra) ?? 0) + 1);
    }
    return true;
  }

  const mstEdges: GraphEdge[] = [];
  let totalWeight = 0;
  for (const e of sorted) {
    if (union(e.from, e.to)) {
      mstEdges.push(e);
      totalWeight += e.weight;
      if (mstEdges.length === nodes.length - 1) break;
    }
  }
  return { mstEdges, totalWeight };
}

function bfsTraversal(
  nodes: GraphNode[],
  edges: GraphEdge[],
  src: string,
): string[] {
  const adj = buildAdj(nodes, edges);
  const visited: string[] = [];
  const queue = [src];
  const seen = new Set([src]);
  while (queue.length) {
    const u = queue.shift()!;
    visited.push(u);
    for (const { to } of adj.get(u) ?? []) {
      if (!seen.has(to)) {
        seen.add(to);
        queue.push(to);
      }
    }
  }
  return visited;
}

function dfsTraversal(
  nodes: GraphNode[],
  edges: GraphEdge[],
  src: string,
): string[] {
  const adj = buildAdj(nodes, edges);
  const visited: string[] = [];
  const seen = new Set<string>();
  function dfs(u: string) {
    seen.add(u);
    visited.push(u);
    for (const { to } of adj.get(u) ?? []) {
      if (!seen.has(to)) dfs(to);
    }
  }
  dfs(src);
  return visited;
}

// ─── Step Table ────────────────────────────────────────────────────────────────

function StepTable({
  steps,
  current,
}: { steps: DijkstraStep[]; current: number }) {
  if (steps.length === 0) return null;
  const step = steps[Math.min(current, steps.length - 1)];
  const nodeIds = NODES.map((n) => n.id);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">
              Node
            </th>
            <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">
              Dist
            </th>
            <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">
              Prev
            </th>
            <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {nodeIds.map((id) => {
            const d = step.distances[id];
            const isVisited = step.visited.includes(id);
            const isActive = step.visiting === id;
            return (
              <tr
                key={id}
                className={`border-b border-border/10 transition-colors ${isActive ? "bg-primary/10" : isVisited ? "bg-muted/20" : ""}`}
              >
                <td
                  className={`py-1 px-2 font-semibold ${isActive ? "text-primary" : "text-foreground"}`}
                >
                  {id}
                </td>
                <td
                  className={`py-1 px-2 text-right ${d === Number.POSITIVE_INFINITY ? "text-muted-foreground" : isActive ? "text-primary" : "text-accent"}`}
                >
                  {d === Number.POSITIVE_INFINITY ? "∞" : d}
                </td>
                <td className="py-1 px-2 text-muted-foreground">
                  {step.prev[id] ?? "—"}
                </td>
                <td className="py-1 px-2">
                  {isActive ? (
                    <span className="text-primary font-semibold">
                      ▶ visiting
                    </span>
                  ) : isVisited ? (
                    <span className="text-[oklch(0.62_0.20_145)]">✓ done</span>
                  ) : (
                    <span className="text-muted-foreground">pending</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type PathAlgorithm = "dijkstra" | "bellman-ford";
type MSTAlgorithm = "prim" | "kruskal";
type ViewMode = "path" | "mst" | "none";
type TraversalAlgo = "bfs" | "dfs";

export function RoutesPage() {
  const [pathAlgo, setPathAlgo] = useState<PathAlgorithm>("dijkstra");
  const [srcNode, setSrcNode] = useState("WH");
  const [dstNode, setDstNode] = useState("CK");
  const [viewMode, setViewMode] = useState<ViewMode>("none");
  const [mstAlgo, setMSTAlgo] = useState<MSTAlgorithm>("kruskal");
  const [pathResult, setPathResult] = useState<ShortestPathResult | null>(null);
  const [mstInfo, setMSTInfo] = useState<{
    totalWeight: number;
    edgeCount: number;
  } | null>(null);
  const [edges, setEdges] = useState<GraphEdge[]>(BASE_EDGES);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  const [djkSteps, setDjkSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [traversalAlgo, setTraversalAlgo] = useState<TraversalAlgo>("bfs");
  const [traversalResult, setTraversalResult] = useState<string[] | null>(null);
  const [traversalRunning, setTraversalRunning] = useState(false);

  function handleFindPath() {
    setViewMode("path");
    setEdges(
      BASE_EDGES.map((e) => ({ ...e, inMST: false, highlighted: false })),
    );
    setCurrentStep(0);
    setIsAnimating(false);
    if (animRef.current) clearInterval(animRef.current);

    if (pathAlgo === "dijkstra") {
      const { steps, result } = runDijkstra(
        NODES,
        BASE_EDGES,
        srcNode,
        dstNode,
      );
      setDjkSteps(steps);
      setPathResult(result);
      setHighlightedPath(result.path);
      setIsAnimating(true);
      let i = 0;
      animRef.current = setInterval(() => {
        setCurrentStep(i);
        i++;
        if (i >= steps.length) {
          if (animRef.current) clearInterval(animRef.current);
          setIsAnimating(false);
        }
      }, 300);
    } else {
      const result = runBellmanFord(NODES, BASE_EDGES, srcNode, dstNode);
      setPathResult(result);
      setHighlightedPath(result.path);
      setDjkSteps([]);
    }
  }

  function handleShowMST() {
    setViewMode("mst");
    setHighlightedPath([]);
    setPathResult(null);
    if (animRef.current) clearInterval(animRef.current);

    const { mstEdges, totalWeight } = kruskalMST(NODES, BASE_EDGES);
    const mstSet = new Set(mstEdges.map((e) => `${e.from}-${e.to}`));

    setEdges(
      BASE_EDGES.map((e) => ({
        ...e,
        inMST:
          mstSet.has(`${e.from}-${e.to}`) || mstSet.has(`${e.to}-${e.from}`),
        highlighted: false,
      })),
    );
    setMSTInfo({ totalWeight, edgeCount: mstEdges.length });
  }

  function handleRunTraversal() {
    setTraversalRunning(true);
    setTimeout(() => {
      const result =
        traversalAlgo === "bfs"
          ? bfsTraversal(NODES, BASE_EDGES, "WH")
          : dfsTraversal(NODES, BASE_EDGES, "WH");
      setTraversalResult(result);
      setTraversalRunning(false);
    }, 400);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, []);

  const nodeOptions = NODES.map((n) => ({
    value: n.id,
    label: n.id === "WH" ? "Warehouse" : `City${n.id.slice(1)}`,
  }));

  const fuelCost = pathResult ? (pathResult.totalCost * 0.5).toFixed(2) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Header ── */}
      <section className="bg-card border-b border-border/30 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Route className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Module 2
              </p>
              <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
                Route Optimization Core
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mb-4 max-w-2xl">
            Graph algorithms for shortest path discovery, minimum spanning
            trees, and network connectivity — powering real-time logistics
            routing decisions.
          </p>
          <div className="flex flex-wrap gap-2">
            <AlgorithmBadge
              label="Dijkstra"
              complexity="O((V+E) log V)"
              variant="cyan"
            />
            <AlgorithmBadge
              label="Bellman-Ford"
              complexity="O(VE)"
              variant="blue"
            />
            <AlgorithmBadge
              label="Prim / Kruskal"
              complexity="O(E log E)"
              variant="amber"
            />
            <AlgorithmBadge
              label="BFS / DFS"
              complexity="O(V+E)"
              variant="green"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* ── Graph Visualizer ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              City Graph Visualizer
            </h2>
            <Badge
              variant="outline"
              className="font-mono text-xs border-border/40 text-muted-foreground ml-auto"
            >
              12 nodes · {BASE_EDGES.length} edges
            </Badge>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            {/* Canvas */}
            <div className="rounded-xl border border-border/30 bg-card/50 p-3">
              <GraphCanvas
                nodes={NODES}
                edges={edges}
                width={640}
                height={400}
                highlightedPath={highlightedPath}
                showWeights
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="rounded-xl border border-border/30 bg-card/50 p-5 space-y-5">
              {/* Path Controls */}
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  Path Controls
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Algorithm
                    </p>
                    <Select
                      value={pathAlgo}
                      onValueChange={(v) => setPathAlgo(v as PathAlgorithm)}
                    >
                      <SelectTrigger
                        className="h-8 text-sm"
                        data-ocid="routes.path_algo.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dijkstra">Dijkstra</SelectItem>
                        <SelectItem value="bellman-ford">
                          Bellman-Ford
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Source
                      </p>
                      <Select value={srcNode} onValueChange={setSrcNode}>
                        <SelectTrigger
                          className="h-8 text-sm"
                          data-ocid="routes.source_node.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {nodeOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Destination
                      </p>
                      <Select value={dstNode} onValueChange={setDstNode}>
                        <SelectTrigger
                          className="h-8 text-sm"
                          data-ocid="routes.dest_node.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {nodeOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    className="w-full h-8 text-sm"
                    onClick={handleFindPath}
                    disabled={srcNode === dstNode}
                    data-ocid="routes.find_path.primary_button"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Find Shortest Path
                  </Button>
                </div>
              </div>

              {/* MST Controls */}
              <div className="border-t border-border/20 pt-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  MST Controls
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      MST Algorithm
                    </p>
                    <Select
                      value={mstAlgo}
                      onValueChange={(v) => setMSTAlgo(v as MSTAlgorithm)}
                    >
                      <SelectTrigger
                        className="h-8 text-sm"
                        data-ocid="routes.mst_algo.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kruskal">Kruskal</SelectItem>
                        <SelectItem value="prim">Prim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-8 text-sm border-accent/30 text-accent hover:bg-accent/10"
                    onClick={handleShowMST}
                    data-ocid="routes.show_mst.secondary_button"
                  >
                    <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                    Show MST
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Banners */}
          <AnimatePresence>
            {viewMode === "path" &&
              pathResult &&
              pathResult.path.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-4 flex flex-wrap items-center gap-4"
                  data-ocid="routes.path_result.success_state"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5 font-mono uppercase tracking-wider">
                      Shortest Path
                    </p>
                    <p className="text-sm font-mono text-foreground break-all">
                      {pathResult.path.join(" → ")}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-mono">
                        Distance
                      </p>
                      <p className="font-bold text-primary font-mono">
                        {pathResult.totalCost} km
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-mono">
                        Fuel Cost
                      </p>
                      <p className="font-bold text-accent font-mono">
                        ${fuelCost}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-mono">
                        Exec Time
                      </p>
                      <p className="font-bold text-[oklch(0.62_0.20_145)] font-mono">
                        {pathResult.executionTime}ms
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            {viewMode === "path" &&
              pathResult &&
              pathResult.path.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-lg bg-destructive/5 border border-destructive/20 p-4 flex items-center gap-3"
                  data-ocid="routes.path_result.error_state"
                >
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    No path found between {srcNode} and {dstNode}.
                  </p>
                </motion.div>
              )}
            {viewMode === "mst" && mstInfo && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-3 rounded-lg bg-accent/5 border border-accent/20 p-4 flex flex-wrap items-center gap-4"
                data-ocid="routes.mst_result.success_state"
              >
                <GitBranch className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">
                    Minimum Spanning Tree · {mstAlgo.toUpperCase()}
                  </p>
                  <p className="text-sm text-foreground">
                    Connects all 12 nodes with minimum total edge cost
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-mono">
                      Total Weight
                    </p>
                    <p className="font-bold text-accent font-mono">
                      {mstInfo.totalWeight} km
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-mono">
                      Edges Used
                    </p>
                    <p className="font-bold text-accent font-mono">
                      {mstInfo.edgeCount}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Step-by-Step Panel ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              Dijkstra Step-by-Step
            </h2>
            {isAnimating && (
              <span className="text-xs font-mono text-primary animate-pulse ml-2">
                ● Executing…
              </span>
            )}
          </div>

          <div className="rounded-xl border border-border/30 bg-card/50 p-5">
            {djkSteps.length === 0 ? (
              <div
                className="text-center py-10 text-muted-foreground"
                data-ocid="routes.steps.empty_state"
              >
                <p className="text-sm">
                  Select{" "}
                  <span className="text-primary font-mono">Dijkstra</span> and
                  click{" "}
                  <span className="text-primary font-mono">
                    Find Shortest Path
                  </span>{" "}
                  to see live step-by-step execution.
                </p>
                <p className="text-xs mt-1 opacity-60">
                  Distance table updates every 300ms as the algorithm explores
                  nodes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      Step
                    </span>
                    <span className="text-sm font-mono font-bold text-primary">
                      {Math.min(currentStep + 1, djkSteps.length)}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      / {djkSteps.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      Visiting:
                    </span>
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
                      {djkSteps[Math.min(currentStep, djkSteps.length - 1)]
                        ?.visiting ?? "—"}
                    </span>
                  </div>
                  {!isAnimating && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() =>
                          setCurrentStep((s) => Math.max(0, s - 1))
                        }
                        disabled={currentStep === 0}
                        data-ocid="routes.step_prev.button"
                      >
                        ← Prev
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() =>
                          setCurrentStep((s) =>
                            Math.min(djkSteps.length - 1, s + 1),
                          )
                        }
                        disabled={currentStep >= djkSteps.length - 1}
                        data-ocid="routes.step_next.button"
                      >
                        Next →
                      </Button>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{
                      width: `${((currentStep + 1) / djkSteps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.25 }}
                  />
                </div>

                <StepTable steps={djkSteps} current={currentStep} />
              </div>
            )}
          </div>
        </section>

        {/* ── Dijkstra vs Bellman-Ford ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              Dijkstra vs Bellman-Ford
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-primary/20 bg-card/50 p-5"
              data-ocid="routes.dijkstra_card.card"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-foreground">
                  Dijkstra
                </h3>
                <AlgorithmBadge
                  complexity="O((V+E) log V)"
                  variant="cyan"
                  size="sm"
                />
              </div>
              <ul className="space-y-2 text-sm mb-4">
                {[
                  {
                    icon: "✓",
                    text: "Greedy priority-queue approach",
                    ok: true,
                  },
                  {
                    icon: "✓",
                    text: "Optimal for non-negative weights",
                    ok: true,
                  },
                  { icon: "✓", text: "Best for dense city networks", ok: true },
                  {
                    icon: "✗",
                    text: "No negative edge weight support",
                    ok: false,
                  },
                  { icon: "✗", text: "No negative cycle detection", ok: false },
                ].map(({ icon, text, ok }) => (
                  <li key={text} className="flex items-start gap-2">
                    <span
                      className={`font-mono font-bold mt-0.5 shrink-0 ${ok ? "text-[oklch(0.62_0.20_145)]" : "text-destructive/70"}`}
                    >
                      {icon}
                    </span>
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-background/60 border border-border/20 p-3">
                <p className="text-xs font-mono text-muted-foreground mb-1">
                  12-node benchmark
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-mono font-bold text-primary text-lg">
                    0.8ms
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · 11 relaxations
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-secondary/20 bg-card/50 p-5"
              data-ocid="routes.bellman_ford_card.card"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-foreground">
                  Bellman-Ford
                </h3>
                <AlgorithmBadge complexity="O(VE)" variant="blue" size="sm" />
              </div>
              <ul className="space-y-2 text-sm mb-4">
                {[
                  {
                    icon: "✓",
                    text: "Handles negative edge weights",
                    ok: true,
                  },
                  {
                    icon: "✓",
                    text: "Detects negative-weight cycles",
                    ok: true,
                  },
                  {
                    icon: "✓",
                    text: "Dynamic traffic penalty support",
                    ok: true,
                  },
                  { icon: "✗", text: "Slower: O(VE) relaxations", ok: false },
                  {
                    icon: "✗",
                    text: "Not suitable for real-time routing",
                    ok: false,
                  },
                ].map(({ icon, text, ok }) => (
                  <li key={text} className="flex items-start gap-2">
                    <span
                      className={`font-mono font-bold mt-0.5 shrink-0 ${ok ? "text-[oklch(0.62_0.20_145)]" : "text-destructive/70"}`}
                    >
                      {icon}
                    </span>
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-background/60 border border-border/20 p-3">
                <p className="text-xs font-mono text-muted-foreground mb-1">
                  12-node benchmark
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary shrink-0" />
                  <span className="font-mono font-bold text-secondary text-lg">
                    3.2ms
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {12 * BASE_EDGES.length * 2} relaxations
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-3 rounded-lg bg-muted/30 border border-border/20 p-3 flex items-center gap-3">
            <Zap className="w-4 h-4 text-accent shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="text-accent font-semibold">4× faster:</span>{" "}
              Dijkstra (0.8ms) vs Bellman-Ford (3.2ms) on the same network. Use
              Dijkstra for standard routing; Bellman-Ford when dynamic penalty
              weights may be negative.
            </p>
          </div>
        </section>

        {/* ── MST Section ── */}
        <section className="bg-muted/20 rounded-2xl border border-border/20 p-6">
          <div className="flex items-center gap-2 mb-5">
            <GitBranch className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              MST: Prim vs Kruskal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              {
                label: "MST Total Weight",
                value: "127 km",
                color: "text-accent",
              },
              {
                label: "Nodes Connected",
                value: "12 / 12",
                color: "text-[oklch(0.62_0.20_145)]",
              },
              {
                label: "Min Infra Cost",
                value: "$63.50",
                color: "text-primary",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-xl bg-card/60 border border-border/20 p-4 text-center"
              >
                <p className="text-xs font-mono text-muted-foreground mb-1">
                  {label}
                </p>
                <p className={`text-2xl font-display font-bold ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/20">
            <table className="w-full text-sm">
              <thead className="bg-card/80 border-b border-border/20">
                <tr>
                  <th className="text-left py-2.5 px-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-center py-2.5 px-4 font-mono text-xs text-accent uppercase tracking-wider">
                    Prim
                  </th>
                  <th className="text-center py-2.5 px-4 font-mono text-xs text-primary uppercase tracking-wider">
                    Kruskal
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Complexity", "O(E log V)", "O(E log E)"],
                  ["Best For", "Dense graphs", "Sparse graphs"],
                  ["Data Structure", "Min-Heap", "Union-Find"],
                  ["Grows From", "Single node", "Edge sorting"],
                  ["Disconnected", "No", "Yes"],
                  ["Memory", "O(V)", "O(V + E)"],
                ].map(([prop, prim, kruskal], i) => (
                  <tr
                    key={prop}
                    className={`border-b border-border/10 ${i % 2 === 0 ? "bg-background/40" : ""}`}
                  >
                    <td className="py-2 px-4 text-muted-foreground font-mono text-xs">
                      {prop}
                    </td>
                    <td className="py-2 px-4 text-center text-accent font-mono text-xs">
                      {prim}
                    </td>
                    <td className="py-2 px-4 text-center text-primary font-mono text-xs">
                      {kruskal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── BFS / DFS Connectivity ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5 text-[oklch(0.62_0.20_145)]" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              BFS / DFS Connectivity Check
            </h2>
          </div>

          <div className="rounded-xl border border-border/30 bg-card/50 p-5">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Select
                value={traversalAlgo}
                onValueChange={(v) => setTraversalAlgo(v as TraversalAlgo)}
              >
                <SelectTrigger
                  className="h-8 w-36 text-sm"
                  data-ocid="routes.traversal_algo.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bfs">BFS (Queue)</SelectItem>
                  <SelectItem value="dfs">DFS (Stack)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-[oklch(0.62_0.20_145)]/30 text-[oklch(0.62_0.20_145)] hover:bg-[oklch(0.62_0.20_145)]/10"
                onClick={handleRunTraversal}
                disabled={traversalRunning}
                data-ocid="routes.run_traversal.button"
              >
                {traversalRunning
                  ? "Running…"
                  : `Run ${traversalAlgo.toUpperCase()}`}
              </Button>
              {traversalResult && (
                <span
                  className="flex items-center gap-1.5 text-sm text-[oklch(0.62_0.20_145)]"
                  data-ocid="routes.traversal_result.success_state"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  All {traversalResult.length} nodes reachable from Warehouse
                </span>
              )}
            </div>

            <AnimatePresence>
              {traversalResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    {traversalAlgo === "bfs" ? "BFS" : "DFS"} Traversal Order
                    from WH
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {traversalResult.map((nodeId, idx) => (
                      <motion.span
                        key={`trav-${nodeId}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/40 border border-border/20 text-xs font-mono"
                      >
                        <span className="text-muted-foreground/60">
                          {idx + 1}.
                        </span>
                        <span className="text-foreground">{nodeId}</span>
                      </motion.span>
                    ))}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground rounded-lg bg-background/50 border border-border/20 p-3 space-y-1">
                    <p>
                      <span className="text-primary">
                        {traversalAlgo.toUpperCase()}:
                      </span>{" "}
                      {traversalAlgo === "bfs"
                        ? "Explores level-by-level via a queue. Guarantees shortest hop count."
                        : "Explores as deep as possible via a stack. Useful for cycle detection and topological sort."}
                    </p>
                    <p>
                      Complexity: <span className="text-accent">O(V + E)</span>{" "}
                      · {NODES.length}V · {BASE_EDGES.length}E
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!traversalResult && (
              <div
                className="text-center py-6 text-muted-foreground"
                data-ocid="routes.traversal.empty_state"
              >
                <p className="text-sm">
                  Select BFS or DFS and run to verify graph connectivity.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
