"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

import { usePerformanceMode } from "@/hooks/use-performance-mode";

/** Wraps a motion.div. In Lite Mode (or with prefers-reduced-motion), it strips
 * transforms / stagger / spring and degrades to an opacity-only fade on mount. */
export function MotionWrapper({ children, ...props }: HTMLMotionProps<"div">) {
  const { isLiteMode } = usePerformanceMode();
  const reduce = useReducedMotion();

  if (isLiteMode || reduce) {
    return (
      <motion.div
        {...props}
        initial={{ opacity: 0 }}
        whileInView={undefined}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return <motion.div {...props}>{children}</motion.div>;
}
