"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { CanvasStage } from "@/components/three/canvas-stage";
import { CloudFallback } from "@/components/three/fallbacks/cloud-fallback";
import { ModelFallback } from "@/components/three/fallbacks/model-fallback";
import { IMAGES, MODELS } from "@/lib/constants";
import { lazy } from "react";

const ModelCanvas = lazy(() =>
  import("@/components/three/model-canvas").then((m) => ({
    default: m.ModelCanvas,
  })),
);

export function TechStack() {
  return (
    <Section id="stack">
      <SectionHeader
        index="05"
        eyebrow="Toolkit"
        title="The stack I build with"
      />
      <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <CanvasStage
          fallback={
            <ModelFallback
              image={IMAGES.TECH_STACK}
              alt="Tech Stack 3D Model Fallback"
            />
          }
          className="mx-auto aspect-square w-full"
        >
          <ModelCanvas
            url={MODELS.TECH_STACK}
            autoRotateSpeed={0.5}
            margin={1.15}
          />
        </CanvasStage>
        <div className="lg:pl-4">
          <CloudFallback />
        </div>
      </div>
    </Section>
  );
}
