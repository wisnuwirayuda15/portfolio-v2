"use client";

import { useEffect, useState } from "react";

import { resume } from "@/data/resume";
import { cn } from "@/lib/utils";

/** Full-screen loading splash with a determinate-ish progress bar, then fades. */
export function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const DURATION = 1100;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / DURATION);
      // ease-out cubic
      setProgress(Math.round((1 - (1 - p) ** 3) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else raf = window.setTimeout(() => setDone(true), 220) as unknown as number;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(raf);
    };
  }, []);

  return (
    <div
      aria-hidden={done}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        done ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div className="w-[min(78vw,340px)]">
        <div className="flex items-end justify-between">
          <span className="font-heading text-2xl font-bold tracking-tight">
            {resume.identity.wordmark}
          </span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {progress}%
          </span>
        </div>
        <div className="mt-3 h-px w-full overflow-hidden bg-border">
          <div
            className="h-full bg-foreground"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
          {resume.identity.title} — Portfolio
        </p>
      </div>
    </div>
  );
}
