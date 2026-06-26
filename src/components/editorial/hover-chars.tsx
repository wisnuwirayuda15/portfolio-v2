import { cn } from "@/lib/utils";

/** Renders text as individual characters that each darken on hover.
 * Decorative — the whole thing is aria-hidden. */
export function HoverChars({
  text,
  className,
  charClassName,
}: {
  text: string;
  className?: string;
  /** per-character classes — include the base + hover colors */
  charClassName?: string;
}) {
  return (
    <span aria-hidden className={className}>
      {text.split("").map((ch, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative text
          key={i}
          className={cn(
            "inline-block transition-colors duration-200",
            charClassName,
          )}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
