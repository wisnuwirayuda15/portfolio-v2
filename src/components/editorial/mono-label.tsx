import { cn } from "@/lib/utils";

/** Uppercase, letter-spaced Space Mono caption — the editorial micro-voice. */
export function MonoLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
