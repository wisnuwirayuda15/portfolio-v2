"use client";

import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { usePortfolioContent } from "@/lib/content";

export function Projects() {
  const { projects } = usePortfolioContent();
  // Projects arrive pre-sorted (featured first, then sort order);
  // the landing page shows only the top two.
  const shown = projects.slice(0, 2);

  return (
    <Section id="work">
      <SectionHeader index="03" eyebrow="Selected Work" title="Featured projects" />
      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
        {shown.map((project, i) => (
          <Reveal
            key={project.title}
            delay={i * 0.05}
            className={project.featured ? "md:col-span-2" : undefined}
          >
            <ProjectCard project={project} featured={project.featured} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-14 border-y border-border">
        <Link
          to="/projects"
          preload="intent"
          className="group flex min-h-12 items-center justify-between py-4 transition-colors hover:text-accent-blue"
        >
          <span className="font-mono text-xs tracking-[0.18em] uppercase">
            View all projects ({projects.length})
          </span>
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </Section>
  );
}
