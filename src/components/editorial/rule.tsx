"use client";

import { motion, useReducedMotion } from "motion/react";

import { useInView } from "@/hooks/use-in-view";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { cn } from "@/lib/utils";

/** Hairline rule that draws in on scroll (IntersectionObserver). Lite → static. */
export function Rule({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  const { isLiteMode } = usePerformanceMode();
  const reduce = useReducedMotion();
  const lite = isLiteMode || reduce;
  const [ref, inView] = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -5% 0px",
    once: true,
  });
  const base = cn("bg-border", vertical ? "w-px" : "h-px w-full", className);

  if (lite) return <div aria-hidden className={base} />;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={base}
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
      animate={inView ? { scaleX: 1, scaleY: 1 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: vertical ? "top" : "left" }}
    />
  );
}
