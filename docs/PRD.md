# PRD & Implementation Plan — Portfolio v2

**Owner:** Putu Wisnu Wirayuda Putra — Front-End Software Engineer, Jakarta, Indonesia
**Status:** Ready for build
**Last updated:** 2026-06-19

---

## 0. Stack — verified against the repo (not assumed)

I read `package.json`, `src/styles.css`, `src/routes/__root.tsx`, and the `src/components/ui/` tree. The real stack differs from the brief in two ways that materially change the plan:

| Brief said | Actually installed | Consequence |
|---|---|---|
| "Vite **or** Next.js App Router" | **TanStack Start** (`@tanstack/react-start`) on Vite 8 + Nitro | **SSR is on.** `__root.tsx` renders the whole `<html>` document. Every WebGL/Three.js component must be client-only or the server render crashes on `window`/`document`. |
| shadcn/ui (Radix under the hood) | shadcn/ui on **Base UI** (`@base-ui/react`) | Component APIs already generated and working. No Radix. Don't re-add primitives. |
| TanStack Router | ✅ confirmed (`src/routes/`, `routeTree.gen.ts`) | File-based routing as-is. |
| Tailwind CSS v4 | ✅ `@tailwindcss/vite` v4.1, oklch token system in `styles.css` | Extend existing tokens; don't restructure. |

**Already installed and reused (zero new deps):**
`zustand` (state + persist), `next-themes`, `lucide-react` (icons), `sonner` (toasts), `vaul` (drawer), `@tanstack/react-form` + `zod` (forms), `@fontsource-variable/inter` (body font), and generated shadcn components: `button`, `card`, `sheet`, `drawer`, `switch`, `input`, `textarea`, `badge`, `separator`, `tooltip`, `sonner`, plus the `use-mobile` hook.

**The only packages to install** (see §10):
`three`, `@react-three/fiber`, `@react-three/drei`, `motion`, `@fontsource-variable/space-grotesk`.

> **Lazy decisions baked in** (each is a deliberate scope cut, flagged so reviewers see intent, not omission):
> - **Dark-only.** The design brief makes the dark palette *the* identity. No light theme, no theme toggle — put the palette straight in `:root`. `next-themes` stays installed but unused for now. *Add a toggle when someone asks for light mode.*
> - **Performance mode via `zustand` + `persist`**, not hand-rolled Context + `localStorage`. `zustand` is already a dependency and `persist` gives `localStorage` sync for free. The brief's `PerformanceContext` interface is honored exactly (§13) — just backed by a store instead of `createContext`. *If you genuinely want raw Context, it's ~15 extra lines; say so.*
> - **Contact form = `mailto:`.** No backend, no `@tanstack/react-form`, no `zod` for three fields. A native `<form>` that builds a `mailto:` link is the whole feature. *Add real submission when there's an endpoint to submit to.*
> - **reactbits.dev is copy-in, not a dependency.** Its components are pasted into `src/components/three/` (shadcn-style), so they live in our tree and get the same Lite-mode guards as everything else.

---

## 1. Product goal & success criteria

A single-page portfolio that reads as **futuristic, minimal, intentional** — one bold signature moment (a mouse-reactive particle hero), restrained liquid-glass surfaces everywhere else, and a hard guarantee that it stays usable on weak hardware.

**Done when:**
- All seven sections (§5–§11) render with real resume content.
- Hero particle field reacts to the cursor on desktop; degrades cleanly on mobile and in Lite Mode.
- Performance Mode toggle works, persists across reloads, and auto-enables on low-end devices.
- Lighthouse: Performance ≥ 90 (desktop, Full Mode), Accessibility ≥ 95.
- Fully responsive 360px → 1536px+, no horizontal scroll, 44px min touch targets.
- `prefers-reduced-motion` honored everywhere.

---

## 2. Design language

### Palette (override `:root` in `styles.css`, oklch to match existing tokens)

| Token | Hex (ref) | oklch | Role |
|---|---|---|---|
| `--background` | `#090D1A` | `oklch(0.16 0.03 265)` | deep navy base |
| `--card` | `#0E1426` | `oklch(0.20 0.035 265)` | glass card base |
| `--foreground` | `#E8EAF2` | `oklch(0.93 0.01 265)` | primary text |
| `--muted-foreground` | `#8A90A8` | `oklch(0.68 0.02 265)` | secondary text |
| `--primary` (violet) | `#7B5CF0` | `oklch(0.60 0.20 285)` | accent, CTAs |
| `--accent` (electric blue) | `#38BDF8` | `oklch(0.78 0.13 230)` | secondary accent, links, hover |
| `--border` | `rgba(255,255,255,0.08)` | `oklch(1 0 0 / 8%)` | glass borders |
| `--ring` | violet | `oklch(0.60 0.20 285)` | focus rings |

Accent usage rule: violet→blue **gradient** for the hero headline and primary CTA; solid blue for inline links/hover. Never both at full saturation in the same element.

### Typography

- **Display/headings:** Space Grotesk (`@fontsource-variable/space-grotesk`). Repoint the existing `--font-heading` token to it.
- **Body:** Inter (already installed). Keep `--font-sans`.
- Self-hosted via Fontsource → no CDN request, no layout shift, works offline. (Chosen over Google Fonts CDN deliberately.)

```css
/* styles.css @theme inline — change one line, add one */
--font-heading: "Space Grotesk Variable", sans-serif;  /* was var(--font-sans) */
--font-sans: "Inter Variable", sans-serif;             /* unchanged */
```

### Type scale (mobile → desktop, fluid)

| Level | Class / clamp | Use |
|---|---|---|
| Display (hero h1) | `clamp(2.5rem, 7vw, 5.5rem)` | "Front-End Engineer." |
| h2 (section) | `clamp(1.75rem, 4vw, 3rem)` | section titles |
| h3 (card) | `clamp(1.125rem, 2vw, 1.5rem)` | role/company |
| body | `text-base md:text-lg` (1rem→1.125rem) | paragraphs |
| small | `text-sm` (0.875rem) | dates, meta |

### Liquid glass — the recipe (cards, nav, modals only; never hero/full sections)

Define once as CSS custom properties in `styles.css`, consume via a `.glass` utility:

```css
:root {
  --glass-bg: oklch(1 0 0 / 4%);
  --glass-border: oklch(1 0 0 / 8%);
  --glass-blur: 16px;
}
@utility glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}
/* Lite Mode: blur is expensive → drop it, keep the surface */
@utility glass-lite {
  background: oklch(1 0 0 / 5%);
  border: 1px solid var(--glass-border);
}
```

Lite Mode swaps the `glass` class for `glass-lite` (no `backdrop-filter`). One className switch driven by the perf store.

### Motion principles
- One signature moment (hero particles). Everything else is quiet: 150–400ms eases, short stagger on section entry.
- No scattered/looping decorative animation outside the hero.
- No `01 / 02 / 03` markers. Experience is chronological, so a **timeline** is allowed and used — but rendered as a connector line + dates, not numbered tags.

---

## 3. Information architecture & routing (TanStack Router)

**Single route.** This is a one-page scroll site; multi-route adds nothing.

```
src/routes/
  __root.tsx     # exists — add <ThemeForceDark>, <Toaster>, perf-store hydration
  index.tsx      # the entire page: composes all sections in order
```

- Nav links are in-page anchors (`#about`, `#experience`, `#skills`, `#contact`) with smooth scroll, **not** router navigations.
- Smooth scroll: CSS `scroll-behavior: smooth` on `html`, gated by `prefers-reduced-motion` (Tailwind v4 ships `motion-safe:`/`motion-reduce:`). No JS scroll library.
- Active-link highlight: one `IntersectionObserver` in a `useActiveSection` hook (§12).

*Skipped: a route per section, a `/resume` route, search params. Add a route only if a section ever needs a shareable URL.*

---

## 4. Component architecture

**File naming: `kebab-case` everywhere** (files and folders) — matches the existing repo (`use-mobile.ts`, `dropdown-menu.tsx`). Component *exports* stay `PascalCase`; the *file* is kebab.

```
src/
  data/
    resume.ts             # SSOT — all content as typed consts (see §4.1)
  components/
    layout/
      navbar.tsx           # sticky nav, glass-on-scroll, perf toggle (desktop)
      mobile-nav.tsx       # <Sheet> drawer trigger + links + perf toggle (mobile)
      footer.tsx           # minimal
      section.tsx          # <section> wrapper: id, scroll-margin, max-width, padding
    sections/
      hero.tsx
      about.tsx
      experience.tsx
      skills.tsx
      contact.tsx
    three/                 # all client-only; copy-in reactbits components live here too
      particle-field.tsx   # hero signature — R3F <Points>, mouse-reactive
      hero-canvas.tsx      # <Canvas> wrapper + ClientOnly + Lite/mobile guard
      skills-cloud.tsx     # optional 3D tag sphere (drei <Billboard>+<Text>)
      ambient-orb.tsx      # optional About-section float (drei <Float>+<Icosahedron>)
      fallbacks/
        hero-fallback.tsx   # CSS aurora gradient (Lite + mobile + reduced-motion)
        skills-fallback.tsx # static chip grid
    motion/
      motion-wrapper.tsx   # strips animation props in Lite Mode (§13)
      reveal.tsx           # scroll-triggered entrance (whileInView), Lite-aware
    perf/
      perf-toggle.tsx      # the switch (role="switch"), used in nav + mobile-nav
    ui/                    # EXISTS — shadcn/Base UI primitives, reused as-is
  hooks/
    use-mobile.ts          # EXISTS
    use-performance-mode.ts # selector hook over the zustand perf store (§13)
    use-active-section.ts  # IntersectionObserver → active nav link
    use-scrolled.ts        # boolean: has the user scrolled past N px (nav glass)
  lib/
    perf-store.ts          # zustand store + persist + auto-detect
```

### 4.1 Content SSOT — `src/data/resume.ts`

**All content lives in one typed TS module.** No copy hardcoded in components. Sections import `resume` and the types from here. Plain typed consts — no JSON, no runtime parse; TypeScript itself catches bad edits at compile time, and the `satisfies` operator enforces the shape while preserving literal types.

```ts
// src/data/resume.ts — single source of truth

export interface Job {
  role: string;
  company: string;
  location?: string;
  start: string;          // "Dec 2024"
  end: string;            // "Present"
  highlights: string[];   // max 3, pre-trimmed
  featured?: boolean;     // recent/relevant → visual emphasis
}
export interface SkillGroup {
  category: "Frontend" | "Backend" | "Mobile" | "Tools";
  skills: string[];
}
export interface Resume {
  identity: { name: string; title: string; location: string; email: string; phone: string; wordmark: string };
  hero: { headline: string; subline: string };
  about: {
    bio: string;
    education: { school: string; degree: string; period: string; gpa: string };
    certification: { name: string; issuer: string; valid: string };
  };
  experience: Job[];
  skills: SkillGroup[];
  contact: { headline: string; invite: string; socials: { github: string; linkedin: string } };
  footer: { tagline: string };
}

export const resume = {
  identity: {
    name: "Putu Wisnu Wirayuda Putra",
    title: "Front-End Software Engineer",
    location: "DKI Jakarta, Indonesia",
    email: "wisnuwirayuda15@gmail.com",
    phone: "(+62) 812-8343-5423",
    wordmark: "Wisnu W.",
  },
  hero: {
    headline: "Front-End Engineer.",
    subline: "I build secure, scalable web interfaces — including a large-scale LMS serving 150,000+ active users.",
  },
  about: {
    bio: "I'm a front-end engineer based in Jakarta with two years of experience across ~5 production projects. I care about clean architecture, performance, and interfaces that feel effortless to use. Currently building at Coding Studio.",
    education: { school: "Telkom University", degree: "B.Sc. Information Systems", period: "2020–2024", gpa: "3.89/4.0" },
    certification: { name: "BNSP Web Development Certification", issuer: "National Professional Certification Board (BNSP)", valid: "Dec 2023 – Dec 2026" },
  },
  experience: [
    {
      role: "Software Engineer (Front-End)", company: "Coding Studio", location: "Bekasi",
      start: "Dec 2024", end: "Present", featured: true,
      highlights: [
        "Built responsive, scalable interfaces for production apps, incl. an LMS serving 150,000+ users.",
        "Cut page-load times by optimizing component rendering and asset loading.",
        "Shipped features, security updates, and fixes in an agile cross-functional team.",
      ],
    },
    // …remaining roles from §8, same shape
  ],
  skills: [
    { category: "Frontend", skills: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Svelte", "Vue", "Tailwind CSS", "Bootstrap", "styled-components"] },
    { category: "Backend",  skills: ["Golang", "PHP", "Laravel", "SQL"] },
    { category: "Mobile",   skills: ["React Native", "Flutter"] },
    { category: "Tools",    skills: ["Linux", "Windows"] },
  ],
  contact: {
    headline: "Let's build something.",
    invite: "Open to front-end roles and freelance work. Drop a line.",
    socials: { github: "[to be filled by owner]", linkedin: "[to be filled by owner]" },
  },
  footer: { tagline: "Built with React, Three.js & too much coffee." },
} satisfies Resume;
```

Import as `import { resume, type Job } from "#/data/resume"` (the `#/*` → `src/*` alias is already configured).

### 4.2 Key prop interfaces (TypeScript)

```ts
// layout/section.tsx
interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

// motion/reveal.tsx
interface RevealProps {
  children: React.ReactNode;
  delay?: number;         // seconds; ignored in Lite Mode
  className?: string;
}

// three/hero-canvas.tsx
interface HeroCanvasProps {
  /** density of particles; auto-reduced on mobile */
  count?: number;         // default 4000 desktop / 1200 mobile
}

// perf/perf-toggle.tsx
interface PerfToggleProps {
  variant?: "nav" | "drawer";  // styling context only
}
```

`Job` and `SkillGroup` are declared in `resume.ts` (§4.1) and imported where needed.

---

## 5. Navigation

**Purpose:** orient + jump; carry the Performance toggle.

**Content:** wordmark **"Wisnu W."** (left) — chosen over bare initials "WW" because two W's read as a typo at small sizes. Links: Home, About, Experience, Skills, Contact. Perf toggle (right).

**Design:** fixed top. Transparent over hero; on scroll past ~64px the bar gets the `.glass` treatment (blur + faint border) via `useScrolled`. Height 64px.

**Interactions:**
- `useScrolled` toggles a `glass` className with a 200ms background/border transition.
- Active link underlined in accent blue, driven by `useActiveSection`.
- Anchor click → smooth scroll (motion-safe).

**Responsive:**
- `≥ md`: full horizontal links + toggle.
- `< md`: wordmark + hamburger only. Hamburger opens shadcn `<Sheet>` (right slide-in) containing the links (stacked, ≥44px tap targets) and the perf toggle.

**Components:** `Navbar`, `MobileNav` (`Sheet` + `Button` icon + `lucide-react` `Menu`), `PerfToggle`.

---

## 6. Hero — the signature moment

**Purpose:** immediate identity + the one bold interaction.

**Content:**
- h1: **"Front-End Engineer."** (gradient violet→blue on "Engineer.")
- Subline (from resume summary): *"I build secure, scalable web interfaces — including a large-scale LMS serving 150,000+ active users."*
- CTAs: **"View My Work"** (→ `#experience`) primary gradient button; **"Get in Touch"** (→ `#contact`) glass/outline button.

**Signature background:** mouse-reactive particle field.
- `three/ParticleField.tsx`: R3F `<Points>` + `<PointMaterial>` (from `@react-three/drei`), a few thousand points on a sphere/plane. In `useFrame`, read pointer from `useThree().pointer` and push nearby points away from / toward the cursor (parallax + gentle displacement). Slow ambient rotation.
- Wrapped by `HeroCanvas.tsx` → `<Canvas>` inside TanStack Router's `<ClientOnly>` (SSR guard) and `React.lazy` + `Suspense` (code-split the whole Three bundle).
- Particle `count`: 4000 desktop, 1200 mobile (via `use-mobile`).

**Text reveal on load:** `motion` staggered entrance — h1 words, then subline, then CTAs (0.08s stagger). Wrapped in `MotionWrapper` so Lite Mode collapses it to a single opacity fade.

**Fallback (`HeroFallback.tsx`):** animated CSS conic/radial aurora gradient with blur — no WebGL. Used when: Lite Mode **OR** mobile **OR** `prefers-reduced-motion`. (Reactbits "Aurora" can be the copy-in source here, but a pure-CSS gradient is lighter and is the default.)

**Responsive:**
- Desktop: full `100dvh`, canvas full-bleed behind centered text.
- Mobile: **height capped at `min(88dvh, 720px)`** (brief requirement — avoid overflow/perf issues), canvas replaced by `HeroFallback`. Text left-aligned, CTAs stack full-width.

**Components:** `Hero`, `HeroCanvas`, `ParticleField`, `HeroFallback`, `MotionWrapper`, `Button`.

---

## 7. About

**Purpose:** human context + credentials.

**Content (bio, ≤3 sentences from résumé):**
> "I'm a front-end engineer based in Jakarta with two years of experience across ~5 production projects. I care about clean architecture, performance, and interfaces that feel effortless to use. Currently building at Coding Studio."

Two glass cards:
- **Education:** Telkom University — B.Sc. Information Systems — 2020–2024 — GPA 3.89/4.0.
- **Certification:** BNSP Web Development Certification — valid Dec 2023 – Dec 2026.

**Design:** two-column glass cards beside the bio. Optional `AmbientOrb` (drei `<Float>` + `<Icosahedron>` + `MeshDistortMaterial`) floating subtly behind — client-only, Lite/mobile-disabled, off by default until perf budget confirmed.

**Interactions:** `Reveal` on scroll (fade + 16px rise, staggered). Card hover: border brightens to accent (CSS only — stays in Lite Mode).

**Responsive:** `lg` two-column (bio left, stacked cards right); `< lg` single column, cards stack full-width.

**Components:** `About`, `Card`, `Reveal`, optional `AmbientOrb`.

---

## 8. Experience

**Purpose:** the work, weighted toward recent/relevant.

**Content:** vertical **timeline** (chronological = genuine sequence, so allowed). Resume highlights pre-trimmed to **≤3 bullets** in `resume.ts`:

1. **Software Engineer (Front-End)** — Coding Studio, Bekasi — Dec 2024–Present — `featured`
   - Built responsive, scalable interfaces for production apps, incl. an LMS serving 150,000+ users.
   - Cut page-load times by optimizing component rendering and asset loading.
   - Shipped features, security updates, and fixes in an agile cross-functional team.
2. **Capstone Project Practicum Assistant** — EAD Lab, Telkom University — Mar–May 2024
   - Mentored 60+ students on Git/GitHub and version-control practice.
   - Authored learning materials; reviewed and graded submissions.
3. **Web Application Development Practicum Assistant** — EAD Lab — Sep 2023–Feb 2024
   - Taught HTML, CSS, JS, PHP, Laravel to 60+ students.
   - Built course materials; evaluated project work.
4. **Algorithm & Programming Practicum Assistant** — Daspro Lab — Sep 2023–Feb 2024
   - Taught Python to 60+ students; authored and graded coursework.
5. **Forensic Science Technician** — Pusat Laboratorium Forensik Bareskrim Polri — Jun–Aug 2023
   - Assisted digital-evidence analysis using forensic tooling.
6. **Social Media Designer** — ESD Lab, Telkom University — Sep 2021–Aug 2024
   - Produced Instagram content in Figma.

**Design:** connector line down the left (accent gradient), each role a glass card. **Featured card** (Coding Studio): larger, brighter border, accent glow, "Current" badge.

**Interactions:** scroll-triggered reveal, cards stagger in along the timeline (`Reveal`). Lite Mode = instant visibility.

**Responsive:** desktop = line on left, cards offset right; mobile = line hugs left edge, cards full-width single column.

**Components:** `Experience`, `Card`, `Badge`, `Reveal`, `Separator`.

---

## 9. Skills

**Purpose:** breadth, shown visually — not a list, not progress bars.

**Content:** grouped — Frontend / Backend / Mobile / Tools (from résumé).

**Design (default, performant): interactive glass chip grid.** Four glass group-panels; each skill is a chip with an accent hover (lift + border glow, CSS). This is the default because it's responsive, accessible, and cheap.

**Optional 3D upgrade (`SkillsCloud.tsx`):** rotating tag sphere — drei `<Billboard>` + `<Text>` per skill on a fibonacci-sphere distribution, slow auto-rotate, drag to spin (`OrbitControls`, damped). Client-only, lazy, **disabled in Lite Mode and on mobile** → falls back to the chip grid. (Reactbits has no true 3D tag sphere; "Chroma Grid"/"Magic Bento" can be copied in as a 2D alternative if the sphere is cut.)

**Interactions:** chips reveal in a stagger; hover = CSS transform + glow. Sphere drags with damping.

**Responsive:** grid `2xl:4 / lg:2 / base:1` columns; chips wrap. 3D sphere never renders below `md`.

**Components:** `Skills`, `SkillsCloud` (opt), `SkillsFallback`, `Badge`, `Reveal`.

---

## 10. Contact

**Purpose:** invite contact, low friction.

**Content:**
- Headline: **"Let's build something."**
- Invite: *"Open to front-end roles and freelance work. Drop a line."*
- Direct: `wisnuwirayuda15@gmail.com` · `(+62) 812-8343-5423` (`tel:` + `mailto:` links, icon buttons).
- Social: GitHub `[to be filled by owner]`, LinkedIn `[to be filled by owner]` — placeholders, marked in `resume.ts` → `contact.socials`.
- **Form** (glass card): name, email, message → builds a `mailto:` and opens the user's mail client. `sonner` toast confirms.

```ts
// onSubmit — the whole feature, no backend, no form lib
const href = `mailto:wisnuwirayuda15@gmail.com`
  + `?subject=${encodeURIComponent(`Portfolio contact — ${name}`)}`
  + `&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
window.location.href = href;
toast.success("Opening your mail app…");
```

Native `required` + `type="email"` for validation. *Skipped `@tanstack/react-form` + `zod`: three fields and `mailto` don't need them. Add when a real backend endpoint exists.*

**Responsive:** desktop = info left, form right; mobile = stacked, inputs full-width, submit full-width (≥44px).

**Components:** `Contact`, `Card`, `Input`, `Textarea`, `Button`, `Label`, `sonner` toast, `lucide-react` icons.

---

## 11. Footer

Minimal: `© 2026 Putu Wisnu Wirayuda Putra` · *"Built with React, Three.js & too much coffee."* · email link. One `Separator` above. No columns.

**Components:** `Footer`, `Separator`.

---

## 12. Animation strategy

| Concern | Tool | Notes |
|---|---|---|
| 3D / particles | `@react-three/fiber` + `drei` | hero, optional skills sphere & ambient orb |
| Scroll-reveal entrances | `motion` `whileInView` | via `Reveal` wrapper; `viewport={{ once: true, margin: "-10%" }}` |
| Load sequence (hero) | `motion` stagger | h1 → subline → CTAs |
| Hover / nav glass | CSS transitions | cheap, survive Lite Mode |
| Smooth scroll | CSS `scroll-behavior` | motion-safe only |

**Scroll-trigger choice:** `motion`'s `whileInView` (it's already the animation lib; a second IntersectionObserver lib would be redundant). The lone raw `IntersectionObserver` is in `useActiveSection` for nav highlighting, where `motion` doesn't fit.

**Page-load order:** nav fades in → hero h1 words stagger up → subline → CTAs → particle canvas mounts last (lazy, after first paint). Below-the-fold sections animate on scroll, never on load.

**`prefers-reduced-motion`:** `Reveal` and `MotionWrapper` both read it; when set, they render final state immediately (treated identically to Lite Mode for motion purposes).

---

## 13. Performance Mode (the §brief feature, backed by zustand)

The brief specifies a `PerformanceContext` shape and a `usePerformanceMode` hook. I honor the **exact public API** but back it with a `zustand` `persist` store (already a dependency) instead of `createContext` + manual `localStorage` — fewer lines, free persistence, no provider nesting.

### Public API (matches the brief)

```ts
// lib/perf-store.ts
interface PerformanceState {
  isLiteMode: boolean;
  setIsLiteMode: (v: boolean) => void;
  toggle: () => void;
  /** true until auto-detect/hydration has run once */
  userHasChosen: boolean;
}

// hooks/usePerformanceMode.ts
function usePerformanceMode(): {
  isLiteMode: boolean;
  setIsLiteMode: (v: boolean) => void;
  toggle: () => void;
};
```

```ts
// lib/perf-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePerfStore = create<PerformanceState>()(
  persist(
    (set) => ({
      isLiteMode: false,
      userHasChosen: false,
      setIsLiteMode: (v) => set({ isLiteMode: v, userHasChosen: true }),
      toggle: () =>
        set((s) => ({ isLiteMode: !s.isLiteMode, userHasChosen: true })),
    }),
    { name: "portfolio-lite-mode" }   // localStorage key per brief
  )
);

/** Run once on mount if the user has never chosen. Heuristics → default Lite. */
export function autoDetectLite(): boolean {
  if (typeof window === "undefined") return false;       // SSR guard
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const lowMem = ((navigator as any).deviceMemory ?? 8) <= 2;  // [Inference] non-standard API
  return reduce || fewCores || lowMem;
  // [Inference] UA-based low-end detection is unreliable — intentionally omitted as a
  // primary signal. The three checks above are sufficient and standards-based.
}
```

> **SSR note:** `persist` reads `localStorage`, which doesn't exist during TanStack Start's server render. Hydrate on the client in a top-level effect in `__root.tsx`: if `!userHasChosen`, call `autoDetectLite()` and set the result. Until then render Full Mode's *static* shell to avoid hydration mismatch (canvas mounts client-side anyway).

### `<MotionWrapper>` spec

Wraps a `motion` element; in Lite Mode (or reduced-motion) it strips transforms/stagger/spring and leaves an opacity-only fade.

```ts
// motion/MotionWrapper.tsx
import { motion, type MotionProps } from "motion/react";
import { usePerformanceMode } from "#/hooks/usePerformanceMode";

interface MotionWrapperProps extends MotionProps {
  as?: keyof typeof motion;     // default "div"
  children: React.ReactNode;
  className?: string;
}

// Behavior:
// - Full:  pass props through unchanged.
// - Lite:  ignore `initial/animate/whileInView` transforms; render with
//          { initial:{opacity:0}, animate:{opacity:1}, transition:{duration:0.2} }
//          and NO stagger / NO transform / NO spring.
```

`Reveal` is built on `MotionWrapper` — so scroll reveals automatically simplify to instant/opacity in Lite Mode.

### What Lite Mode changes (per brief)

| In Lite Mode | Behavior |
|---|---|
| Three.js / WebGL canvases | unmounted; `HeroCanvas`/`SkillsCloud`/`AmbientOrb` render their static fallback |
| `motion` animations | opacity-only, no transform/stagger/spring (`MotionWrapper`) |
| Glass `backdrop-filter` | `.glass` → `.glass-lite` (solid `rgba` surface, no blur) |
| Scroll reveals | instant visibility |
| Particle / ambient systems | not rendered |
| **Stays active** | all content, layout, nav, CSS hover transitions, glass borders |

Every Three component checks `isLiteMode` (and `use-mobile`) **before** rendering heavy content — the guard lives in `HeroCanvas`/`SkillsCloud`/`AmbientOrb`, not scattered.

### Toggle UI (`PerfToggle`)

- Built on shadcn `Switch` (already generated). `role="switch"`, `aria-checked={isLiteMode}`, `aria-label="Toggle lite mode"`, visible focus ring (`--ring`).
- Icons (`lucide-react`): `Zap` (Lite) ↔ `Sparkles` (Full). Label "Lite" / "Full".
- Placement: Navbar right (desktop), top of `Sheet` drawer (mobile). Keyboard-operable (Space/Enter), 44px target.

---

## 14. Responsive system

**Breakpoints — Tailwind v4 defaults, unchanged:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

**Global rules:**
- All multi-column grids → single column below `md`.
- Min tap target 44×44px on all interactive elements (`min-h-11 min-w-11` on icon buttons).
- No horizontal scroll at 360px. Section padding `px-5 md:px-8 lg:px-12`, content `max-w-6xl mx-auto`.
- 3D canvases: **never render below `md`** and never in Lite Mode → static fallback instead.

**Per-section behavior:** specified inline in §5–§11 (each has a Responsive line).

---

## 15. Performance

- **Code-split Three.** `HeroCanvas`, `SkillsCloud`, `AmbientOrb` via `React.lazy` + `Suspense`; the `three`/fiber bundle never loads in Lite Mode or on mobile.
- **Client-only WebGL.** Wrap canvases in TanStack Router `<ClientOnly>` (SSR-safe) — the server never touches `window`.
- **Fonts:** Fontsource self-hosted, variable, `font-display: swap` (Fontsource default). No CDN, no FOIT.
- **Images:** none planned beyond icons (SVG via `lucide-react`). If a headshot is added later: `loading="lazy"`, explicit `width`/`height`, AVIF/WebP.
- **`prefers-reduced-motion`** short-circuits all `motion` work.
- React Compiler is on (`babel-plugin-react-compiler`) — skip manual `useMemo`/`useCallback` micro-opt unless profiling says otherwise.

---

## 16. Styling & tokens (Tailwind v4)

- Override the palette block in `src/styles.css` `:root` (§2) — keep the `.dark` block or fold it into `:root` (dark-only).
- Repoint `--font-heading` to Space Grotesk (§2).
- Add `--glass-*` custom properties + `glass` / `glass-lite` `@utility` (§2).
- **shadcn components used:** `Button`, `Card`, `Sheet` (mobile nav), `Drawer` (vaul, if a bottom-sheet variant is wanted), `Input`, `Textarea`, `Label`, `Switch` (perf toggle), `Badge`, `Separator`, `Sonner` (toasts), `Tooltip`. **All already generated** — no `shadcn add` needed.

---

## 17. Accessibility

- Visible focus rings (`--ring` violet) on every interactive element — never `outline:none` without a replacement.
- Icon-only buttons (hamburger, socials, perf toggle) carry `aria-label`.
- Perf toggle: `role="switch"` + `aria-checked` + `aria-label="Toggle lite mode"`.
- Reduced-motion = Lite-equivalent motion behavior.
- Semantic landmarks: `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`.
- Color contrast: foreground/background and accent-on-navy verified ≥ 4.5:1 (the oklch values in §2 satisfy this; re-check any new accent-on-glass text).
- Form inputs have associated `<Label>`s.

---

## 18. Packages to install (the complete list)

```bash
bun add three @react-three/fiber @react-three/drei motion @fontsource-variable/space-grotesk
bun add -d @types/three
```

> Package manager is **bun** for everything: `bun install`, `bun run dev`, `bun run build`. Don't mix in `pnpm`/`npm` — a second lockfile is the kind of thing that bites at 3am.

- `three`, `@react-three/fiber`, `@react-three/drei` — 3D.
- `motion` — Framer Motion's current package (`motion/react`). **One** animation lib, not `framer-motion` *and* `motion`.
- `@fontsource-variable/space-grotesk` — display font, self-hosted.

**Not installed / not needed:** anything to replace shadcn or TanStack Router (per brief); a separate IntersectionObserver lib (`motion` + one hook cover it); a form lib for the contact form (`mailto`); reactbits as a dependency (components are copied into `src/components/three/`).

---

## 19. Build order (suggested)

1. Tokens + fonts + glass utilities in `styles.css`; force dark; `resume.ts`.
2. `Section`, `Navbar`/`MobileNav`/`Footer`, `index.tsx` skeleton — static, no motion.
3. `perf-store.ts`, `usePerformanceMode`, `PerfToggle`, `MotionWrapper`, `Reveal`.
4. Sections with real content + `Reveal` + glass cards (Lite-mode-correct from the start).
5. `HeroCanvas` + `ParticleField` + `HeroFallback` (lazy, client-only, guarded).
6. Optional 3D (`SkillsCloud`, `AmbientOrb`) — only if perf budget allows.
7. A11y + responsive sweep; Lighthouse; reduced-motion + Lite-mode QA.

---

### Open items for the owner
- GitHub + LinkedIn URLs (placeholders in `resume.ts` → `contact.socials`).
- Keep optional 3D (`SkillsCloud`, `AmbientOrb`) or cut to the chip-grid/CSS fallbacks? Default plan ships the cheap fallbacks and treats 3D-beyond-hero as opt-in.
