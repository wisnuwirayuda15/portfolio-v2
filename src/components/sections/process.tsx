"use client";

import { resume } from "@/data/resume";
import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

export function Process() {
  return (
    <Section id="process">
      <SectionHeader index="07" eyebrow="How I Work" title="From idea to shipped" />

      <div className="mt-14 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {resume.process.map((step, i) => (
          <Reveal key={step.index} delay={i * 0.06}>
            <div className="h-full bg-background p-6 md:p-8">
              <span className="font-heading text-5xl font-bold text-foreground/15">
                {step.index}
              </span>
              <h3 className="mt-4 font-heading text-xl font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
