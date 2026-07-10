"use client";

import { ArrowUpRight } from "lucide-react";

import { MonoLabel } from "@/components/editorial/mono-label";
import type { Project } from "@/data/resume";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

function Thumb({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-foreground">
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-full w-full items-end p-5"
          style={{
            background:
              "radial-gradient(circle at 75% 15%, #3a3933 0%, #1c1b16 50%, #0c0b08 100%)",
          }}
        >
          <span className="font-heading text-[6rem] leading-none font-bold text-background/15">
            {project.index}
          </span>
        </div>
      )}
    </div>
  );
}

export function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured?: boolean;
}) {
  const tilt = useTilt();
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: mouse-move drives a decorative CSS tilt; the link inside is the interactive element
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMove}
      onMouseLeave={tilt.onLeave}
      className={cn(
        "group/card transition-transform duration-300 ease-out [transform-style:preserve-3d]",
        featured && "md:col-span-2",
      )}
    >
      <a
        href={project.href ?? "#contact"}
        target={project.href ? "_blank" : undefined}
        rel={project.href ? "noreferrer" : undefined}
        className={cn(
          "block",
          featured && "md:grid md:grid-cols-2 md:items-center md:gap-8",
        )}
      >
        <Thumb project={project} />
        <div className={cn("pt-5", featured && "md:pt-0")}>
          <div className="flex items-center justify-between">
            <MonoLabel>{`(${project.index})`}</MonoLabel>
            <MonoLabel>{project.year}</MonoLabel>
          </div>
          <h3
            className={cn(
              "mt-3 font-heading font-bold tracking-tight",
              featured ? "text-3xl md:text-5xl" : "text-2xl",
            )}
          >
            <span className="inline-flex items-center gap-2">
              {project.title}
              <ArrowUpRight className="size-5 -translate-y-px opacity-0 transition-opacity group-hover/card:opacity-100" />
            </span>
          </h3>
          <p
            className={cn(
              "mt-3 text-muted-foreground",
              featured ? "max-w-lg text-base md:text-lg" : "text-sm",
            )}
          >
            {project.blurb}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
            {project.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-xs tracking-wider text-foreground/70 uppercase"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3">
            <MonoLabel className="text-foreground/50">{project.role}</MonoLabel>
          </div>
        </div>
      </a>
    </div>
  );
}
