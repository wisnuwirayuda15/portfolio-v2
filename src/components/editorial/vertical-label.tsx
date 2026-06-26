import { cn } from "@/lib/utils";

/** Rotated mono caption pinned to a section edge. */
export function VerticalLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase [writing-mode:vertical-rl]",
        className,
      )}
    >
      {children}
    </span>
  );
}
