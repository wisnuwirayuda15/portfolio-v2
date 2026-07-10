"use client";

import { usePerformanceMode } from "@/hooks/use-performance-mode";

/** Faint fixed paper-grain overlay; removed in Lite Mode. */
export function Grain() {
  const { isLiteMode } = usePerformanceMode();
  if (isLiteMode) return null;
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-multiply"
    />
  );
}
