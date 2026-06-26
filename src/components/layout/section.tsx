import { ClipText } from "@/components/editorial/clip-text";
import { IndexNumeral } from "@/components/editorial/index-numeral";
import { MonoLabel } from "@/components/editorial/mono-label";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 px-5 py-24 md:px-10 md:py-32 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}

/** Editorial section header: index + mono eyebrow on one line, big heading below. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <IndexNumeral
        value={index}
        className="absolute -top-8 -right-2 md:-top-16"
      />
      <div className="flex items-center gap-3">
        <MonoLabel>{`(${index})`}</MonoLabel>
        <span aria-hidden className="h-px w-10 bg-border" />
        <MonoLabel>{eyebrow}</MonoLabel>
      </div>
      <h2 className="mt-4 max-w-4xl font-heading text-4xl leading-[0.95] font-bold tracking-tight md:text-6xl">
        <span className="block overflow-hidden pb-1">
          <ClipText>{title}</ClipText>
        </span>
      </h2>
    </div>
  );
}
