"use client";

import { ClipText } from "@/components/editorial/clip-text";
import { MonoLabel } from "@/components/editorial/mono-label";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CanvasStage } from "@/components/three/canvas-stage";
import { ModelFallback } from "@/components/three/fallbacks/model-fallback";
import { Button } from "@/components/ui/button";
import { resume } from "@/data/resume";
import { MODELS } from "@/lib/constants";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";
import { lazy } from "react";
import { toast } from "sonner";

const ModelCanvas = lazy(() =>
  import("@/components/three/model-canvas").then((m) => ({
    default: m.ModelCanvas,
  })),
);

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mpzgoerv";

const fieldClass =
  "w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent-blue";

function FieldError({ errors }: { errors: Array<string | undefined> }) {
  const msg = errors.find(Boolean);
  if (!msg) return null;
  return <p className="mt-1 font-mono text-xs text-destructive">{msg}</p>;
}

export function Contact() {
  const { email } = resume.identity;
  const { invite, socials } = resume.contact;

  const form = useForm({
    defaultValues: { name: "", email: "", message: "" },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(value),
        });
        if (res.ok) {
          toast.success("Thanks — I'll be in touch soon.");
          form.reset();
        } else {
          toast.error("Couldn't send. Email me directly instead.");
        }
      } catch {
        toast.error("Network error. Email me directly instead.");
      }
    },
  });

  const socialEntries = [
    { label: "GitHub", value: socials.github, Icon: GithubIcon },
    { label: "LinkedIn", value: socials.linkedin, Icon: LinkedinIcon },
  ].filter((s) => !s.value.startsWith("["));

  return (
    <Section id="contact">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="flex items-center gap-3">
            <MonoLabel>(08)</MonoLabel>
            <span aria-hidden className="h-px w-10 bg-border" />
            <MonoLabel>Contact</MonoLabel>
          </div>
          <h2 className="mt-5 font-heading text-5xl leading-[0.92] font-bold tracking-tight md:text-7xl">
            <span className="block overflow-hidden pb-1">
              <ClipText>Let's build</ClipText>
            </span>
            <span className="block overflow-hidden pb-1">
              <ClipText delay={0.1}>something.</ClipText>
            </span>
          </h2>

          <div className="mt-6 flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-accent-blue" />
            <MonoLabel>Available for work</MonoLabel>
          </div>
          <p className="mt-4 max-w-sm text-muted-foreground">{invite}</p>

          <div className="mt-10 space-y-px">
            <a
              href={`mailto:${email}`}
              className="flex min-h-11 items-center gap-3 border-b border-border text-foreground transition-colors hover:text-accent-blue"
            >
              <Mail className="size-4" />
              <span className="font-mono text-sm">{email}</span>
            </a>
            {socialEntries.map((s) => (
              <a
                key={s.label}
                href={s.value}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-3 border-b border-border text-foreground transition-colors hover:text-accent-blue"
              >
                <s.Icon className="size-4" />
                <span className="font-mono text-sm">{s.label}</span>
              </a>
            ))}
          </div>

          <CanvasStage
            fallback={<ModelFallback />}
            className="mt-12 aspect-square w-full max-w-[320px]"
          >
            <ModelCanvas url={MODELS.CUBE} autoRotateSpeed={0.8} margin={1} />
          </CanvasStage>
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Please enter your name" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="mb-1 block">
                    <MonoLabel>Name</MonoLabel>
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your name"
                    className={fieldClass}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? undefined : (
                    "Enter a valid email"
                  ),
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="mb-1 block">
                    <MonoLabel>Email</MonoLabel>
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            <form.Field
              name="message"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length < 10 ?
                    "Tell me a bit more (10+ characters)"
                  : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="mb-1 block">
                    <MonoLabel>Message</MonoLabel>
                  </label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="What's on your mind?"
                    className={`${fieldClass} resize-none`}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit}
                  className="self-start rounded-full"
                >
                  {isSubmitting ? "Sending…" : "Send message ↗"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
