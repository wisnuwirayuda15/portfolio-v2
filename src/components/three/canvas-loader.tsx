"use client";

import { Html, useProgress } from "@react-three/drei";

/** Animated ring-progress shown inside the canvas while the GLB loads.
 * Reads real load progress from drei's loading manager. */
export function CanvasLoader() {
  const { progress } = useProgress();
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);

  return (
    <Html center>
      <div className="flex flex-col items-center gap-2" aria-hidden>
        <svg width="42" height="42" viewBox="0 0 42 42" className="-rotate-90">
          <circle
            cx="21"
            cy="21"
            r={r}
            fill="none"
            strokeWidth="2"
            className="stroke-foreground/15"
          />
          <circle
            cx="21"
            cy="21"
            r={r}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-foreground/70 transition-[stroke-dashoffset] duration-200"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="font-mono text-[0.6rem] tabular-nums tracking-widest text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}
