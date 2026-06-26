import { resume } from "@/data/resume";
import { MonoLabel } from "@/components/editorial/mono-label";
import { HoverChars } from "@/components/editorial/hover-chars";

export function Footer() {
  const year = new Date().getFullYear();
  const { name, email } = resume.identity;

  return (
    <footer className="relative overflow-hidden border-t border-border px-5 pt-16 pb-10 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-heading text-2xl font-bold tracking-tight">
              Let's work together.
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-block font-mono text-sm text-muted-foreground transition-colors hover:text-accent-blue"
            >
              {email}
            </a>
          </div>
          <a
            href="#home"
            className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            Back to top ↑
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <MonoLabel>© {year} {name}</MonoLabel>
          <MonoLabel>{resume.footer.tagline}</MonoLabel>
        </div>

        {/* giant faint wordmark — each letter darkens on hover */}
        <HoverChars
          text="WISNU"
          className="mt-6 block font-heading text-[22vw] leading-[0.8] font-bold tracking-tighter select-none"
          charClassName="text-foreground/[0.04] hover:text-foreground/25"
        />
      </div>
    </footer>
  );
}
