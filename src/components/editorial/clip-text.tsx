"use client";

import { motion, useReducedMotion } from "motion/react";

import { useInView } from "@/hooks/use-in-view";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { cn } from "@/lib/utils";

interface ClipTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Heading line that reveals with an upward clip. Self-contained: the OUTER
 * static span is observed (never transformed) so the IntersectionObserver is
 * reliable, while the inner span does the translate. Lite/reduced → instant. */
export function ClipText({ children, className, delay = 0 }: ClipTextProps) {
  const { isLiteMode } = usePerformanceMode();
  const reduce = useReducedMotion();
  const lite = isLiteMode || reduce;
  const [ref, inView] = useInView<HTMLSpanElement>({
    rootMargin: "0px 0px -8% 0px",
    once: true,
  });

  if (lite) {
    return (
      <span className={cn("inline-block overflow-hidden align-bottom", className)}>
        <span className="inline-block">{children}</span>
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn("inline-block overflow-hidden align-bottom", className)}
    >
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : undefined}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
