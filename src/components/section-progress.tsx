"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

const IDS = SECTIONS.map((s) => s.id);

/** Fixed segmented indicator on the right edge marking the current section. */
export function SectionProgress() {
  const active = useActiveSection(IDS);

  return (
    <nav
      aria-label="Section progress"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2"
          >
            <span
              className={cn(
                "font-mono text-[0.6rem] tracking-widest uppercase transition-opacity duration-200",
                isActive
                  ? "text-foreground opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100",
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive
                  ? "w-8 bg-foreground"
                  : "w-4 bg-foreground/30 group-hover:bg-foreground/60",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
