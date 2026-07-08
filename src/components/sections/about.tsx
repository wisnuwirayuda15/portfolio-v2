"use client";

import { IndexNumeral } from "@/components/editorial/index-numeral";
import { MonoLabel } from "@/components/editorial/mono-label";
import { Rule } from "@/components/editorial/rule";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CanvasStage } from "@/components/three/canvas-stage";
import { ModelFallback } from "@/components/three/fallbacks/model-fallback";
import { resume } from "@/data/resume";
import { IMAGES, MODELS } from "@/lib/constants";
import { lazy } from "react";

const ModelCanvas = lazy(() =>
  import("@/components/three/model-canvas").then((m) => ({
    default: m.ModelCanvas,
  })),
);

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <MonoLabel>{label}</MonoLabel>
      <span className="text-right text-sm text-foreground md:text-base">
        {value}
      </span>
    </div>
  );
}

export function About() {
  const { bio, education, certification } = resume.about;

  return (
    <Section id="about">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <MonoLabel>(04)</MonoLabel>
            <span aria-hidden className="h-px w-10 bg-border" />
            <MonoLabel>About</MonoLabel>
          </div>
          <Reveal>
            <p className="mt-6 font-heading text-2xl leading-snug font-medium tracking-tight md:text-4xl">
              {bio}
            </p>
          </Reveal>

          <div className="mt-10">
            <Rule />
            <FactRow label="Education" value={`${education.school}`} />
            <Rule />
            <FactRow label="Degree" value={education.degree} />
            <Rule />
            <FactRow
              label="Period · GPA"
              value={`${education.period} · ${education.gpa}`}
            />
            <Rule />
            <FactRow label="Certification" value={certification.name} />
            <Rule />
            <FactRow
              label="Issuer · Valid"
              value={`${certification.issuer} · ${certification.valid}`}
            />
            <Rule />
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <IndexNumeral value="04" className="absolute -top-10 right-0" />
          <CanvasStage
            fallback={
              <ModelFallback
                image={IMAGES.ABOUT}
                alt="About 3D Model Fallback"
              />
            }
            className="aspect-square w-full lg:sticky lg:top-28"
          >
            <ModelCanvas url={MODELS.ABOUT} autoRotateSpeed={0.6} />
          </CanvasStage>
        </div>
      </div>
    </Section>
  );
}
