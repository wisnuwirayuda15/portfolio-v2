import { cn } from "@/lib/utils";
import { HoverChars } from "./hover-chars";

/** Large faint background section numeral — each digit darkens on hover. */
export function IndexNumeral({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <HoverChars
      text={value}
      className={cn(
        "select-none font-heading text-[10rem] leading-none font-bold md:text-[14rem]",
        className,
      )}
      charClassName="text-foreground/[0.05] hover:text-foreground/30"
    />
  );
}
