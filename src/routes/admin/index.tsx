import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ArrowUpRight, LogOut } from "lucide-react";

import { ExperiencePanel } from "@/components/admin/experience-panel";
import { ProjectsPanel } from "@/components/admin/projects-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { SocialsPanel } from "@/components/admin/socials-panel";
import { StatsPanel } from "@/components/admin/stats-panel";
import { TechStacksPanel } from "@/components/admin/tech-stacks-panel";
import { MonoLabel } from "@/components/editorial/mono-label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserFn } from "@/lib/supabase/auth";
import { getBrowserClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const user = await getUserFn();
    if (!user) throw redirect({ to: "/admin/login" });
    return { user };
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" },
      { title: "Admin — Portfolio" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { value: "projects", label: "Projects", panel: <ProjectsPanel /> },
  { value: "stats", label: "Stats", panel: <StatsPanel /> },
  { value: "tech", label: "Tech", panel: <TechStacksPanel /> },
  { value: "experience", label: "Experience", panel: <ExperiencePanel /> },
  { value: "socials", label: "Socials", panel: <SocialsPanel /> },
  { value: "settings", label: "Settings", panel: <SettingsPanel /> },
];

function AdminPage() {
  const { user } = Route.useRouteContext();
  const router = useRouter();
  const navigate = useNavigate();

  const signOut = async () => {
    await getBrowserClient().auth.signOut();
    await router.invalidate();
    navigate({ to: "/admin/login" });
  };

  return (
    <main className="min-h-screen px-5 py-10 md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <MonoLabel>Portfolio</MonoLabel>
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight">
              Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <MonoLabel>{user.email}</MonoLabel>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link to="/" />}
            >
              View site <ArrowUpRight className="size-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-3.5" /> Sign out
            </Button>
          </div>
        </header>

        <Tabs defaultValue="projects" className="mt-8">
          <TabsList
            variant="line"
            className="w-full justify-start overflow-x-auto"
          >
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.panel}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
