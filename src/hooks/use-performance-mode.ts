import { usePerfStore } from "@/lib/perf-store";

export function usePerformanceMode() {
  const isLiteMode = usePerfStore((s) => s.isLiteMode);
  const setIsLiteMode = usePerfStore((s) => s.setIsLiteMode);
  const toggle = usePerfStore((s) => s.toggle);
  return { isLiteMode, setIsLiteMode, toggle };
}
