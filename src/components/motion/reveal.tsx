"use client";

import { motion, useReducedMotion } from "motion/react";

import { useInView } from "@/hooks/use-in-view";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // seconds; ignored in Lite Mode
  className?: string;
}

/** Scroll-triggered entrance (fade + rise), driven by IntersectionObserver.
 * Lite Mode / reduced-motion → opacity-only. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { isLiteMode } = usePerformanceMode();
  const reduce = useReducedMotion();
  const lite = isLiteMode || reduce;
  const [ref, inView] = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -10% 0px",
    once: true,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={lite ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: lite ? 0.2 : 0.5,
        delay: lite ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
