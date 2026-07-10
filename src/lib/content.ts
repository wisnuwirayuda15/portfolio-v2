import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { Job, Project, SkillGroup, Social, Stat } from "#/data/resume";
import { resume } from "#/data/resume";
import { getContentClient } from "#/lib/supabase/content-client";

export interface PortfolioContent {
	stats: Stat[];
	projects: Project[];
	skills: SkillGroup[];
	experience: Job[];
	socials: Social[];
	resumeFileId: string;
}

/** Baked-in fallback so the site renders fully even when Supabase is down. */
const staticContent: PortfolioContent = {
	stats: resume.stats,
	projects: resume.projects,
	skills: resume.skills,
	experience: resume.experience,
	socials: resume.contact.socials,
	resumeFileId: resume.identity.resumeFileId,
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

async function fetchPortfolioContent(): Promise<PortfolioContent> {
	const client = getContentClient();
	if (!client) return staticContent;

	try {
		const [stats, projects, skills, experience, socials, settings] =
			await Promise.all([
				client.from("stats").select("*").order("sort_order"),
				client
					.from("projects")
					.select("*")
					.order("featured", { ascending: false })
					.order("sort_order"),
				client.from("tech_stacks").select("*").order("sort_order"),
				client.from("experience").select("*").order("sort_order"),
				client.from("socials").select("*").order("sort_order"),
				client.from("site_settings").select("*").eq("id", 1).maybeSingle(),
			]);

		// Per-slice fallback: a failed query falls back to static data,
		// an empty table is respected as intentionally empty.
		return {
			stats: stats.data
				? stats.data.map((r) => ({
						value: r.value,
						suffix: r.suffix ?? undefined,
						label: r.label,
					}))
				: staticContent.stats,
			projects: projects.data
				? projects.data.map((r, i) => ({
						index: pad(i),
						title: r.title,
						blurb: r.blurb,
						role: r.role,
						year: r.year,
						stack: r.stack,
						featured: r.featured,
						image: r.image_url ?? undefined,
						href: r.href ?? undefined,
					}))
				: staticContent.projects,
			skills: skills.data
				? skills.data.map((r) => ({ category: r.category, skills: r.skills }))
				: staticContent.skills,
			experience: experience.data
				? experience.data.map((r) => ({
						role: r.role,
						company: r.company,
						location: r.location ?? undefined,
						start: r.start_date,
						end: r.end_date,
						highlights: r.highlights,
						featured: r.featured,
					}))
				: staticContent.experience,
			socials: socials.data
				? socials.data.map((r) => ({
						name: r.name,
						url: r.url,
						iconSvg: r.icon_svg,
					}))
				: staticContent.socials,
			resumeFileId: settings.data?.resume_file_id ?? staticContent.resumeFileId,
		};
	} catch {
		return staticContent;
	}
}

export const contentQuery = queryOptions({
	queryKey: ["portfolio-content"],
	queryFn: fetchPortfolioContent,
	staleTime: 5 * 60_000,
});

export function usePortfolioContent() {
	return useSuspenseQuery(contentQuery).data;
}
