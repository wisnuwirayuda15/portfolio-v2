"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MonoLabel } from "@/components/editorial/mono-label";
import { PerfToggle } from "@/components/perf/perf-toggle";

export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 gap-0 p-0">
        <SheetTitle className="px-6 pt-6">
          <MonoLabel>Menu</MonoLabel>
        </SheetTitle>
        <nav className="flex flex-col p-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center border-b border-border font-heading text-lg font-medium transition-colors hover:text-accent-blue"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-6">
          <PerfToggle variant="drawer" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
