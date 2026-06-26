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

  return (
    <span
      ref={ref}
      className={cn("inline-block overflow-hidden align-bottom", className)}
    >
      <motion.span
        className="inline-block"
        initial={lite ? false : { y: "110%" }}
        animate={lite || inView ? { y: "0%" } : undefined}
        transition={
          lite ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}
