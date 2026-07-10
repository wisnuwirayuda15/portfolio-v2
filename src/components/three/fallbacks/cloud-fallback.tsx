import { MonoLabel } from "@/components/editorial/mono-label";
import { usePortfolioContent } from "@/lib/content";

/** Editorial ruled grid of skills by category — the 3D tag-cloud fallback
 * (mobile / Lite) and the always-on legend beside the cloud on desktop. */
export function CloudFallback() {
  const { skills } = usePortfolioContent();
  return (
    <div className="grid h-full grid-cols-1 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2">
      {skills.map((group) => (
        <div key={group.category} className="bg-background p-5">
          <MonoLabel>{group.category}</MonoLabel>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {group.skills.map((s) => (
              <span
                key={s}
                className="text-sm text-foreground/80 transition-colors hover:text-accent-blue"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
