import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Experience } from "@/components/sections/experience";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";
import { Grain } from "@/components/grain";
import { MouseFollower } from "@/components/mouse-follower";
import { ScrollCue } from "@/components/scroll-cue";
import { SectionProgress } from "@/components/section-progress";
import { SplashScreen } from "@/components/splash-screen";
import { contentQuery } from "@/lib/content";
import { autoDetectLite, usePerfStore } from "@/lib/perf-store";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Home,
});

function Home() {
  useEffect(() => {
    const { userHasChosen } = usePerfStore.getState();
    if (!userHasChosen && autoDetectLite()) {
      usePerfStore.setState({ isLiteMode: true });
    }
  }, []);

  // Warm the 3D bundle + GLB cache after first paint so models appear fast.
  useEffect(() => {
    const warm = () =>
      import("@/components/three/model-canvas").then((m) => m.preloadModels());
    if ("requestIdleCallback" in window) {
      const id = (window as Window).requestIdleCallback(warm);
      return () => (window as Window).cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <SplashScreen />
      <Grain />
      <MouseFollower />
      <SectionProgress />
      <ScrollCue />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Projects />
        <About />
        <TechStack />
        <Experience />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
