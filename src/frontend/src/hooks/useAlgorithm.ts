import { useCallback, useRef, useState } from "react";

export type AlgorithmStatus = "idle" | "running" | "complete" | "paused";

export interface AlgorithmState<T> {
  status: AlgorithmStatus;
  steps: T[];
  currentStep: number;
  result: T | null;
  executionTime: number;
  comparisons: number;
}

export function useAlgorithm<T>() {
  const [state, setState] = useState<AlgorithmState<T>>({
    status: "idle",
    steps: [],
    currentStep: 0,
    result: null,
    executionTime: 0,
    comparisons: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef(300);

  const setSpeed = useCallback((ms: number) => {
    speedRef.current = ms;
  }, []);

  const start = useCallback(
    (steps: T[], executionTime = 0, comparisons = 0) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState({
        status: "running",
        steps,
        currentStep: 0,
        result: steps[steps.length - 1] ?? null,
        executionTime,
        comparisons,
      });

      let idx = 0;
      intervalRef.current = setInterval(() => {
        idx++;
        if (idx >= steps.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setState((prev) => ({
            ...prev,
            status: "complete",
            currentStep: steps.length - 1,
          }));
          return;
        }
        setState((prev) => ({ ...prev, currentStep: idx }));
      }, speedRef.current);
    },
    [],
  );

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({ ...prev, status: "paused" }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "paused") return prev;
      let idx = prev.currentStep;
      intervalRef.current = setInterval(() => {
        idx++;
        if (idx >= prev.steps.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setState((p) => ({
            ...p,
            status: "complete",
            currentStep: prev.steps.length - 1,
          }));
          return;
        }
        setState((p) => ({ ...p, currentStep: idx }));
      }, speedRef.current);
      return { ...prev, status: "running" };
    });
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState({
      status: "idle",
      steps: [],
      currentStep: 0,
      result: null,
      executionTime: 0,
      comparisons: 0,
    });
  }, []);

  const stepForward = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep < prev.steps.length - 1) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      }
      return { ...prev, status: "complete" };
    });
  }, []);

  const stepBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep > 0) {
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
  }, []);

  return {
    state,
    start,
    pause,
    resume,
    reset,
    stepForward,
    stepBack,
    setSpeed,
  };
}

// ─── Sorting Helpers ──────────────────────────────────────────────────────────

export interface ArrayStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export function generateMergeSortSteps(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const sorted: number[] = [];
  const a = [...arr];

  function merge(array: number[], l: number, m: number, r: number) {
    const left = array.slice(l, m + 1);
    const right = array.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...array],
        comparing: [l + i, m + 1 + j],
        swapping: [],
        sorted: [...sorted],
      });
      if (left[i] <= right[j]) {
        array[k++] = left[i++];
      } else {
        array[k++] = right[j++];
      }
    }
    while (i < left.length) array[k++] = left[i++];
    while (j < right.length) array[k++] = right[j++];
    for (let x = l; x <= r; x++) sorted.push(x);
  }

  function mergeSort(array: number[], l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(array, l, m);
    mergeSort(array, m + 1, r);
    merge(array, l, m, r);
  }

  mergeSort(a, 0, a.length - 1);
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: a.map((_, i) => i),
  });
  return steps;
}

export function generateQuickSortSteps(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const sorted: number[] = [];
  const a = [...arr];

  function quickSort(array: number[], low: number, high: number) {
    if (low < high) {
      const pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: [],
          sorted: [...sorted],
        });
        if (array[j] < pivot) {
          i++;
          const tmp = array[i];
          array[i] = array[j];
          array[j] = tmp;
          steps.push({
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
          });
        }
      }
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      sorted.push(i + 1);
      quickSort(array, low, i);
      quickSort(array, i + 2, high);
    }
  }

  quickSort(a, 0, a.length - 1);
  steps.push({
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: a.map((_, i) => i),
  });
  return steps;
}
