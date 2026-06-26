"use client";

import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

/** Animated mouse-scroll hint pinned to the bottom; fades out once scrolling. */
export function ScrollCue() {
  const scrolled = useScrolled(40);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 transition-opacity duration-300",
        scrolled ? "opacity-0" : "opacity-100",
      )}
    >
      <span className="flex h-9 w-5 items-start justify-center rounded-full border border-foreground/40 p-1.5">
        <span className="size-1 rounded-full bg-foreground/70 animate-[scroll-wheel_1.6s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
        Scroll
      </span>
    </div>
  );
}
