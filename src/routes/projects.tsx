import { createFileRoute } from "@tanstack/react-router";

import { MonoLabel } from "@/components/editorial/mono-label";
import { Grain } from "@/components/grain";
import { Footer } from "@/components/layout/footer";
import { NAV_LINKS, Navbar } from "@/components/layout/navbar";
import { Reveal } from "@/components/motion/reveal";
import { MouseFollower } from "@/components/mouse-follower";
import { ProjectCard } from "@/components/project-card";
import { contentQuery, usePortfolioContent } from "@/lib/content";

// Hash links must be absolute off the landing page.
const LANDING_LINKS = NAV_LINKS.map((l) => ({ ...l, href: `/${l.href}` }));

export const Route = createFileRoute("/projects")({
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  head: () => ({
    meta: [{ title: "All Projects — Putu Wisnu Wirayuda Putra" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = usePortfolioContent();

  return (
    <>
      <Grain />
      <MouseFollower />
      <Navbar links={LANDING_LINKS} homeHref="/" />
      <main className="relative px-5 pt-28 pb-8 md:px-10 md:pt-36 lg:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex items-center gap-3">
            <MonoLabel>(Index)</MonoLabel>
            <span aria-hidden className="h-px w-10 bg-border" />
            <MonoLabel>
              {String(projects.length).padStart(2, "0")} projects
            </MonoLabel>
          </div>
          <h1 className="mt-4 font-heading text-5xl leading-[0.95] font-bold tracking-tight md:text-7xl">
            All projects.
          </h1>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal
                key={project.title}
                delay={Math.min(i, 3) * 0.05}
                className={project.featured ? "md:col-span-2" : undefined}
              >
                <ProjectCard project={project} featured={project.featured} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
