import { cn } from "@/lib/utils";
import type { GraphEdge, GraphNode } from "@/types";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  highlightedPath?: string[];
  className?: string;
  showWeights?: boolean;
}

const NODE_RADIUS = 22;

const nodeColors = {
  warehouse: {
    fill: "oklch(0.63 0.30 200 / 0.2)",
    stroke: "oklch(0.63 0.30 200)",
    text: "oklch(0.63 0.30 200)",
  },
  hub: {
    fill: "oklch(0.55 0.26 252 / 0.2)",
    stroke: "oklch(0.55 0.26 252)",
    text: "oklch(0.55 0.26 252)",
  },
  destination: {
    fill: "oklch(0.68 0.22 60 / 0.15)",
    stroke: "oklch(0.68 0.22 60)",
    text: "oklch(0.68 0.22 60)",
  },
};

export function GraphCanvas({
  nodes,
  edges,
  width = 600,
  height = 400,
  highlightedPath = [],
  className,
  showWeights = true,
}: GraphCanvasProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const isEdgeInPath = (edge: GraphEdge) => {
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      if (
        (highlightedPath[i] === edge.from &&
          highlightedPath[i + 1] === edge.to) ||
        (highlightedPath[i] === edge.to && highlightedPath[i + 1] === edge.from)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-background/50 border border-border/30",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ maxHeight: height }}
      >
        <defs>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-amber">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.40 0.018 262)" />
          </marker>
          <marker
            id="arrow-highlight"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.63 0.30 200)" />
          </marker>
        </defs>

        <title>Logistics Graph Visualization</title>
        {/* Grid background */}
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="oklch(0.26 0.025 262 / 0.3)"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Edges */}
        {edges.map((edge, idx: number) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;

          const inPath = isEdgeInPath(edge);
          const isMST = edge.inMST;

          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;

          return (
            <g key={`edge-${edge.from}-${edge.to}-${idx}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={
                  inPath
                    ? "oklch(0.63 0.30 200)"
                    : isMST
                      ? "oklch(0.62 0.20 145)"
                      : edge.highlighted
                        ? "oklch(0.68 0.22 60)"
                        : "oklch(0.30 0.025 262)"
                }
                strokeWidth={inPath || isMST ? 2.5 : 1.5}
                strokeDasharray={inPath ? undefined : "4 2"}
                filter={inPath ? "url(#glow-cyan)" : undefined}
                markerEnd={inPath ? "url(#arrow-highlight)" : "url(#arrow)"}
                opacity={inPath || isMST ? 1 : 0.6}
              />
              {showWeights && (
                <text
                  x={mx}
                  y={my - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fill={
                    inPath ? "oklch(0.63 0.30 200)" : "oklch(0.55 0.018 262)"
                  }
                  fontWeight={inPath ? "700" : "400"}
                >
                  {edge.label ?? edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const colors = nodeColors[node.type];
          const inPath = highlightedPath.includes(node.id);

          return (
            <g key={node.id} filter={inPath ? "url(#glow-cyan)" : undefined}>
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                fill={inPath ? "oklch(0.63 0.30 200 / 0.25)" : colors.fill}
                stroke={inPath ? "oklch(0.63 0.30 200)" : colors.stroke}
                strokeWidth={inPath ? 2.5 : 1.5}
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
                fill={inPath ? "oklch(0.93 0.012 262)" : colors.text}
              >
                {node.label.length > 4
                  ? node.label.substring(0, 4)
                  : node.label}
              </text>
              <text
                x={node.x}
                y={node.y + NODE_RADIUS + 14}
                textAnchor="middle"
                fontSize="9"
                fontFamily="DM Sans, sans-serif"
                fill="oklch(0.55 0.018 262)"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex gap-3 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-primary inline-block" /> Path
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[oklch(0.62_0.20_145)] inline-block" />{" "}
          MST
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-0.5 bg-border/60 inline-block"
            style={{ borderStyle: "dashed" }}
          />{" "}
          Edge
        </span>
      </div>
    </div>
  );
}
