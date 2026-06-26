import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PerformanceState {
  isLiteMode: boolean;
  /** true once the user has explicitly toggled; until then auto-detect may set Lite */
  userHasChosen: boolean;
  setIsLiteMode: (v: boolean) => void;
  toggle: () => void;
}

export const usePerfStore = create<PerformanceState>()(
  persist(
    (set) => ({
      isLiteMode: false,
      userHasChosen: false,
      setIsLiteMode: (v) => set({ isLiteMode: v, userHasChosen: true }),
      toggle: () =>
        set((s) => ({ isLiteMode: !s.isLiteMode, userHasChosen: true })),
    }),
    { name: "portfolio-lite-mode" },
  ),
);

/** Heuristic: default to Lite on weak hardware / reduced-motion. Call once on mount. */
export function autoDetectLite(): boolean {
  if (typeof window === "undefined") return false; // SSR guard
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const lowMem = (deviceMemory ?? 8) <= 2;
  return reduce || fewCores || lowMem;
}
