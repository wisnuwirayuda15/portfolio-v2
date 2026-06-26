"use client";

import { ClipText } from "@/components/editorial/clip-text";
import { MonoLabel } from "@/components/editorial/mono-label";
import { ResumeDialog } from "@/components/resume-dialog";
import { CanvasStage } from "@/components/three/canvas-stage";
import { ModelFallback } from "@/components/three/fallbacks/model-fallback";
import { Button } from "@/components/ui/button";
import { resume } from "@/data/resume";
import { MODELS } from "@/lib/constants";
import { lazy } from "react";

const ModelCanvas = lazy(() =>
  import("@/components/three/model-canvas").then((m) => ({
    default: m.ModelCanvas,
  })),
);

const LINES = ["Building the", "interfaces of", "tomorrow."];

export function Hero() {
  const { title, location } = resume.identity;

  return (
    <section
      id="home"
      className="relative flex min-h-[92dvh] items-center overflow-hidden px-5 pt-28 pb-12 md:min-h-dvh md:px-10 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* headline + meta */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="flex items-center gap-3">
            <MonoLabel>{title}</MonoLabel>
            <span aria-hidden className="h-px w-10 bg-border" />
            <MonoLabel>{location}</MonoLabel>
          </div>

          <h1 className="mt-5 font-heading text-[clamp(2.75rem,9vw,8rem)] leading-[0.92] font-bold tracking-[-0.03em]">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <ClipText delay={0.1 + i * 0.12}>{line}</ClipText>
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-md text-base text-muted-foreground md:text-lg">
            {resume.hero.subline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href="#work" />}
              className="rounded-full"
            >
              View Work ↗
            </Button>
            <Button
              size="lg"
              variant="ghost"
              nativeButton={false}
              render={<a href="#contact" />}
              className="rounded-full"
            >
              Get in Touch
            </Button>
            <ResumeDialog />
          </div>

          <div className="mt-12 flex items-center gap-3">
            <span className="size-2 animate-pulse rounded-full bg-accent-blue" />
            <MonoLabel>Available for work — ©2026</MonoLabel>
          </div>
        </div>

        {/* 3D object */}
        <div className="lg:col-span-5 xl:col-span-4">
          <CanvasStage
            fallback={<ModelFallback />}
            className="mx-auto aspect-square w-full"
          >
            <ModelCanvas
              url={MODELS.FIGURE}
              autoRotateSpeed={0.5}
              margin={0.9}
            />
          </CanvasStage>
        </div>
      </div>
    </section>
  );
}
