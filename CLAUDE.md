# CLAUDE.md

Build guidance for portfolio-v2. Full spec lives in [docs/PRD.md](docs/PRD.md) — this file is the always-loaded rules + design system.

## Stack (verified, do not swap)

- **TanStack Start** (`@tanstack/react-start`) on **Vite 8 + Nitro** — SSR is ON. `src/routes/__root.tsx` renders the full `<html>` shell.
- **TanStack Router** — file-based, `src/routes/`, `routeTree.gen.ts` (generated, don't hand-edit). Run `bun run generate-routes` after adding routes.
- **shadcn/ui on Base UI** (`@base-ui/react`) — NOT Radix. Components already generated in `src/components/ui/`. Reuse them; don't re-add primitives.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — oklch token system in `src/styles.css`.
- **TypeScript**, **Biome** (lint/format), **Vitest**.
- **State:** `zustand` (+ `persist`). **Forms:** `@tanstack/react-form` + `zod`. **Icons:** `lucide-react`. **Toasts:** `sonner`. **Drawer:** `vaul`. **Body font:** `@fontsource-variable/inter`.

## Package manager: bun (only)

```bash
bun install
bun run dev          # vite dev, port 3000
bun run build
bun run check        # biome
bun run generate-routes
bun add <pkg>        # bun add -d <pkg> for dev deps
```

Never use `pnpm` or `npm` here — one lockfile, bun's.

## Conventions

- **File naming: `kebab-case`** for every file and folder (`mobile-nav.tsx`, `use-performance-mode.ts`, `hero-canvas.tsx`). Matches existing `use-mobile.ts`, `dropdown-menu.tsx`.
- **Component exports: `PascalCase`** (`export function MobileNav()`), file stays kebab.
- **Hooks:** `use-*.ts`, export `useThing`.
- **Imports:** use the `#/*` alias → `src/*` (configured in `package.json` `imports`). E.g. `import { portfolio } from "#/data/portfolio.schema"`.
- Match surrounding code style; let Biome format. Don't add `useMemo`/`useCallback` by reflex — React Compiler is on (`babel-plugin-react-compiler`).

## Content is data — single source of truth

**ALL copy/content lives in `src/data/resume.ts`** as typed consts. Never hardcode résumé text, names, dates, or skills in components.

- `src/data/resume.ts` — exports `resume` (typed with `satisfies Resume`) plus the `Job`, `SkillGroup`, `Resume` types. Plain TS consts, no JSON, no runtime parse — TypeScript catches bad edits at compile time.
- Components import from it: `import { resume, type Job } from "#/data/resume"`.

## SSR rule (the one that bites)

WebGL/Three.js touches `window`/`document` — the server render will crash. **All Three.js/`<Canvas>` components must be client-only:** wrap in TanStack Router `<ClientOnly>` + `React.lazy` + `<Suspense>`. Same for any `localStorage`/`matchMedia` access — guard with `typeof window === "undefined"` or run in an effect.

## Performance Mode (core feature)

A user toggle + auto-detect that strips heavy effects on weak hardware. Backed by a `zustand` `persist` store (`src/lib/perf-store.ts`, localStorage key `"portfolio-lite-mode"`), exposed via `use-performance-mode.ts` → `{ isLiteMode, setIsLiteMode, toggle }`.

Auto-detect (only if user never chose) defaults to Lite when ANY: `prefers-reduced-motion: reduce`, `navigator.hardwareConcurrency <= 4`, or `navigator.deviceMemory <= 2`.

**Treat `prefers-reduced-motion` as equivalent to Lite Mode for all motion.**

| In Lite Mode | Behavior |
|---|---|
| Three.js / WebGL | unmounted → static fallback (`hero-fallback.tsx`, `skills-fallback.tsx`) |
| `motion` animations | opacity-only, no transform / stagger / spring (via `<MotionWrapper>`) |
| Glass `backdrop-filter` | `.glass` → `.glass-lite` (solid surface, no blur) |
| Scroll reveals | instant visibility |
| Particle / ambient systems | not rendered |

Three components check `isLiteMode` (and `use-mobile`) **before** rendering heavy content — guard lives in the canvas wrapper, not scattered. `<MotionWrapper>` (`src/components/motion/motion-wrapper.tsx`) strips animation props in Lite Mode; `Reveal` is built on it.

Toggle (`perf-toggle.tsx`, on shadcn `Switch`): `role="switch"`, `aria-checked`, `aria-label="Toggle lite mode"`, visible focus ring, ≥44px target, `Zap`(Lite)/`Sparkles`(Full) icons.

## Design system

**Dark-only.** Palette goes straight in `:root` of `styles.css`. No theme toggle (`next-themes` installed but unused). Don't add light mode unless asked.

### Color tokens (oklch, in `:root`)

| Token | Ref | oklch | Role |
|---|---|---|---|
| `--background` | `#090D1A` | `oklch(0.16 0.03 265)` | deep navy base |
| `--card` | `#0E1426` | `oklch(0.20 0.035 265)` | glass card base |
| `--foreground` | `#E8EAF2` | `oklch(0.93 0.01 265)` | primary text |
| `--muted-foreground` | `#8A90A8` | `oklch(0.68 0.02 265)` | secondary text |
| `--primary` (violet) | `#7B5CF0` | `oklch(0.60 0.20 285)` | accent, CTAs |
| `--accent` (blue) | `#38BDF8` | `oklch(0.78 0.13 230)` | links, hover |
| `--border` | — | `oklch(1 0 0 / 8%)` | glass borders |
| `--ring` | violet | `oklch(0.60 0.20 285)` | focus rings |

Accent rule: violet→blue **gradient** only on hero headline + primary CTA. Solid blue for inline links/hover. Never both at full saturation in one element.

### Typography

- **Headings:** Space Grotesk → repoint `--font-heading: "Space Grotesk Variable", sans-serif`.
- **Body:** Inter (`--font-sans`, unchanged).
- Both self-hosted via Fontsource. No CDN, no Google Fonts.

Fluid scale: h1 `clamp(2.5rem, 7vw, 5.5rem)` · h2 `clamp(1.75rem, 4vw, 3rem)` · h3 `clamp(1.125rem, 2vw, 1.5rem)` · body `text-base md:text-lg`.

### Liquid glass (cards, nav, modals ONLY — never hero/full sections, use sparingly)

```css
:root { --glass-bg: oklch(1 0 0 / 4%); --glass-border: oklch(1 0 0 / 8%); --glass-blur: 16px; }
@utility glass      { background: var(--glass-bg); border: 1px solid var(--glass-border);
                      backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur)); }
@utility glass-lite { background: oklch(1 0 0 / 5%); border: 1px solid var(--glass-border); }  /* no blur */
```

Lite Mode swaps `glass` → `glass-lite`.

### Motion principles

- ONE signature moment: mouse-reactive particle hero. Everything else quiet (150–400ms eases, short stagger on entry).
- No decorative looping animation outside the hero. No scattered motion.
- No `01 / 02 / 03` section markers. Experience uses a timeline (genuine sequence) — connector line + dates, not numbered tags.
- Scroll reveals: `motion` `whileInView`, `viewport={{ once: true }}`, via the `Reveal` wrapper.

## Animation tooling

| Concern | Tool |
|---|---|
| 3D / particles | `@react-three/fiber` + `@react-three/drei` |
| Scroll reveals + load sequence | `motion` (`motion/react`) — the only animation lib; don't add `framer-motion` too |
| Hover / nav glass | CSS transitions (survive Lite Mode) |
| Smooth scroll | CSS `scroll-behavior`, motion-safe only |
| Active nav link | one raw `IntersectionObserver` in `use-active-section.ts` |

## Responsive

Tailwind v4 default breakpoints (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`). Multi-column grids stack to single column `< md`. Min tap target 44×44px (`min-h-11 min-w-11`). No horizontal scroll at 360px. **3D canvases never render below `md`** → static fallback. Hero height capped `min(88dvh, 720px)` on mobile.

## Accessibility (non-negotiable)

- Visible focus rings (`--ring`) on every interactive element. Never bare `outline: none`.
- `aria-label` on all icon-only buttons (hamburger, socials, perf toggle).
- Reduced-motion = Lite-equivalent motion.
- Semantic landmarks: `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`. Form inputs have `<Label>`s.
- Contrast ≥ 4.5:1.

## Scope discipline (deliberate cuts — don't "fix" unasked)

- Dark-only, no theme toggle.
- Contact form = `mailto:` link (native `<form>`, no form lib, no backend).
- reactbits.dev components are **copied into** `src/components/three/`, not installed as a dep.
- Optional 3D (skills sphere, ambient orb) ships behind CSS/static fallbacks by default — opt-in only.
