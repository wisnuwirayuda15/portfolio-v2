"use client";

import * as React from "react";
import { animate, useMotionValue } from "motion/react";

import { useInView } from "@/hooks/use-in-view";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
}

/** Counts 0 → value when scrolled into view (IntersectionObserver). Lite → instant. */
export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const { isLiteMode } = usePerformanceMode();
  const [ref, inView] = useInView<HTMLSpanElement>({
    rootMargin: "0px 0px -15% 0px",
    once: true,
  });
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (isLiteMode) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, isLiteMode, value, mv]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
