"use client";

import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

/** Frosted glass surface. Drops backdrop-blur in Lite Mode (glass → glass-lite). */
export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isLiteMode } = usePerformanceMode();
  return (
    <div
      className={cn(
        "rounded-3xl p-6",
        isLiteMode ? "glass-lite" : "glass",
        className,
      )}
    >
      {children}
    </div>
  );
}
