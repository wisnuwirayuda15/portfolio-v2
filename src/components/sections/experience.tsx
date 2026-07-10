"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { MonoLabel } from "@/components/editorial/mono-label";
import { usePortfolioContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Experience() {
  const { experience } = usePortfolioContent();
  return (
    <Section id="experience">
      <SectionHeader index="06" eyebrow="Track Record" title="Where I've worked" />

      <div className="mt-14 border-t border-border">
        {experience.map((job) => (
          <Reveal key={`${job.company}-${job.role}`}>
            <article className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <MonoLabel>
                  {job.start} — {job.end}
                </MonoLabel>
                {job.location && (
                  <div className="mt-1">
                    <MonoLabel className="text-foreground/45">{job.location}</MonoLabel>
                  </div>
                )}
              </div>

              <div className="md:col-span-9">
                <div className="flex flex-wrap items-center gap-3">
                  <h3
                    className={cn(
                      "font-heading text-xl font-bold tracking-tight md:text-2xl",
                      job.featured && "text-2xl md:text-3xl",
                    )}
                  >
                    {job.role}
                  </h3>
                  {job.featured && (
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 animate-pulse rounded-full bg-accent-blue" />
                      <MonoLabel className="text-accent-blue">Current</MonoLabel>
                    </span>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground">{job.company}</p>
                <ul className="mt-4 space-y-2">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-foreground/80">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/40" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
