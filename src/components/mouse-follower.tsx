"use client";

import { useEffect, useRef } from "react";

import { usePerformanceMode } from "@/hooks/use-performance-mode";

/** A ring + dot that trail the cursor. Pointer-only (hidden on touch),
 * disabled in Lite Mode. `mix-blend-difference` keeps it visible on any shade. */
export function MouseFollower() {
  const { isLiteMode } = usePerformanceMode();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLiteMode || typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return; // touch device

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isLiteMode]);

  if (isLiteMode) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] hidden mix-blend-difference md:block"
    >
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div className="size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 will-change-transform">
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </div>
  );
}
