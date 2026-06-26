"use client";

import { PerfToggle } from "@/components/perf/perf-toggle";
import { resume } from "@/data/resume";
import { useActiveSection } from "@/hooks/use-active-section";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

const IDS = NAV_LINKS.map((l) => l.href.slice(1));

export function Navbar() {
  const scrolled = useScrolled();
  const active = useActiveSection(IDS);
  const { isLiteMode } = usePerformanceMode();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <nav
        className={cn(
          "flex items-center justify-between gap-6 transition-all duration-300 ease-out",
          scrolled ?
            cn(
              "mt-3 h-14 w-[calc(100%-1.5rem)] max-w-4xl rounded-full border px-4 shadow-lg shadow-foreground/5 md:px-6",
              "border-border",
              isLiteMode ? "glass-lite" : "glass",
            )
          : "h-16 w-full max-w-[1400px] border-b border-transparent px-5 md:px-10 lg:px-16",
        )}
      >
        <a href="#home" className="flex items-center gap-2">
          <img
            src="/logo.webp"
            alt="logo"
            className="size-7 shrink-0 object-contain"
          />
          <span className="font-heading text-lg font-bold tracking-tight">
            {resume.identity.wordmark}
          </span>
          <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground">
            ©2026
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-2 font-mono text-xs tracking-widest uppercase transition-colors",
                  isActive ? "text-foreground" : (
                    "text-muted-foreground hover:text-foreground"
                  ),
                )}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <PerfToggle />
          </div>
          <div className="md:hidden">
            <MobileNav links={NAV_LINKS} />
          </div>
        </div>
      </nav>
    </header>
  );
}
