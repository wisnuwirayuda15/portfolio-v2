"use client";

import { Suspense, useEffect, useState } from "react";

import { useInView } from "@/hooks/use-in-view";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { cn } from "@/lib/utils";
import { ModelLoader } from "./fallbacks/model-loader";

interface CanvasStageProps {
  /** the R3F scene element — should be a React.lazy component that renders its own <Canvas> */
  children: React.ReactNode;
  /** static node shown for SSR / before first reveal / Lite Mode / Suspense */
  fallback: React.ReactNode;
  className?: string;
}

/** Performance gate for every WebGL scene: mounts the canvas the first time it
 * scrolls near the viewport (and not in Lite Mode), then KEEPS it mounted so
 * rotation/animation state survives scrolling away and back. Mounts on mobile
 * too, as long as Lite Mode is off (auto-enabled on weak hardware). */
export function CanvasStage({ children, fallback, className }: CanvasStageProps) {
  const [host, inView] = useInView<HTMLDivElement>("800px");
  const { isLiteMode } = usePerformanceMode();
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setMounted(true), []);

  // latch: once shown, stay shown (don't unmount on scroll → no state reset)
  useEffect(() => {
    if (mounted && inView && !isLiteMode) setRevealed(true);
  }, [mounted, inView, isLiteMode]);

  const show = mounted && !isLiteMode && revealed;

  return (
    <div ref={host} className={cn("relative", className)}>
      {show ? <Suspense fallback={<ModelLoader />}>{children}</Suspense> : fallback}
    </div>
  );
}
