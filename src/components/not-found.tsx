import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { MonoLabel } from "@/components/editorial/mono-label";
import { Grain } from "@/components/grain";
import { Button } from "@/components/ui/button";
import { resume } from "@/data/resume";

/** Editorial 404 — giant faint numeral, hairline rules, black pill home. */
export function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-5 md:px-10 lg:px-16">
      <Grain />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-6 -translate-y-1/2 font-heading text-[clamp(14rem,42vw,36rem)] leading-none font-bold text-foreground/[0.05] select-none"
      >
        404
      </span>

      <div className="relative mx-auto w-full max-w-[1400px]">
        <div className="flex items-center gap-3">
          <MonoLabel>(404)</MonoLabel>
          <span aria-hidden className="h-px w-10 bg-border" />
          <MonoLabel>Page not found</MonoLabel>
        </div>

        <h1 className="mt-5 max-w-3xl font-heading text-5xl leading-[0.95] font-bold tracking-tight md:text-8xl">
          Lost the plot.
        </h1>
        <p className="mt-6 max-w-md text-muted-foreground">
          This page doesn't exist — it may have moved, or never was. The work,
          however, is very much real.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link to="/" />}
            className="rounded-full"
          >
            Back home
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link to="/projects" />}
            className="rounded-full"
          >
            View projects <ArrowUpRight className="size-4" />
          </Button>
        </div>

        <div className="mt-16 border-t border-border pt-4">
          <MonoLabel>©2026 — {resume.identity.name}</MonoLabel>
        </div>
      </div>
    </main>
  );
}
