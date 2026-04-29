// ─── Delivery & Logistics Types ──────────────────────────────────────────────

export interface DeliveryRequest {
  id: string;
  packageWeight: number; // kg
  deadline: number; // Unix timestamp
  customerPriority: "VIP" | "HIGH" | "MEDIUM" | "LOW";
  distance: number; // km from warehouse
  value: number; // monetary value
  destination: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "DELAYED";
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number; // kg
  fuelCost: number; // per km
  currentLoad: number;
  assignedDeliveries: string[];
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
}

// ─── Graph Types ──────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "warehouse" | "hub" | "destination";
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  label?: string;
  highlighted?: boolean;
  inMST?: boolean;
}

export interface ShortestPathResult {
  path: string[];
  totalCost: number;
  algorithm: "dijkstra" | "bellman-ford" | "floyd-warshall";
  executionTime: number;
}

// ─── Sorting Types ────────────────────────────────────────────────────────────

export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export type SortAlgorithm = "merge" | "quick" | "heap" | "bubble";

export interface SortResult {
  algorithm: SortAlgorithm;
  steps: SortStep[];
  comparisons: number;
  swaps: number;
  executionTime: number;
}

// ─── Knapsack / DP Types ──────────────────────────────────────────────────────

export interface KnapsackItem {
  id: string;
  name: string;
  weight: number;
  value: number;
  selected?: boolean;
}

export interface DPResult {
  table: number[][];
  selectedItems: KnapsackItem[];
  totalValue: number;
  totalWeight: number;
  executionTime: number;
}

// ─── Performance Types ────────────────────────────────────────────────────────

export interface PerformanceDataPoint {
  n: number;
  time: number;
  label: string;
}

export interface AlgorithmComplexity {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  best: string;
  worst: string;
  stable: boolean;
  useCase: string;
  color: string;
}

// ─── Code Module Types ────────────────────────────────────────────────────────

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
  complexity: string;
  module: string;
}
