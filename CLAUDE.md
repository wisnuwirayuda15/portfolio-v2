# CLAUDE.md

Build guidance for portfolio-v2. Full spec in [docs/PRD.md](docs/PRD.md). This file is the always-loaded rules + design system.

**Direction: light editorial / brutalist, 3D-heavy** (refs: Cognify, Robot Art Exhibition). Paper-and-ink, oversized grid-breaking type, asymmetric layout with hairline rules + index numerals, interactive 3D objects as focal points. This supersedes the v1 dark/centered/particle direction.

## Stack (verified, do not swap)

- **TanStack Start** (`@tanstack/react-start`) on **Vite 8 + Nitro** — SSR ON. `src/routes/__root.tsx` renders the `<html>` shell.
- **TanStack Router** — file-based, `src/routes/`, `routeTree.gen.ts` (generated; `bun run generate-routes`).
- **shadcn/ui on Base UI** (`@base-ui/react`), NOT Radix. Components generated in `src/components/ui/` — reuse, don't re-add. Base UI buttons rendering an `<a>` need `nativeButton={false}`.
- **Tailwind CSS v4**, **TypeScript** (`verbatimModuleSyntax` → use `import type`; `noUnusedLocals/Parameters` on), **Biome**, **Vitest**.
- **State:** `zustand`+persist. **Forms:** `@tanstack/react-form`+`zod`. **Icons:** `lucide-react` (no brand icons — Github/Linkedin missing; use `ArrowUpRight`). **Toasts:** `sonner`. **Drawer:** `vaul`. **3D:** `three`+`@react-three/fiber`+`@react-three/drei`. **Motion:** `motion` (`motion/react`).
- **Fonts:** Inter (body) + Space Grotesk (display) installed; **Space Mono** (`@fontsource/space-mono`) for editorial labels.

## Package manager: bun only

```bash
bun install · bun run dev (port 3000) · bun run build · bun run check · bun run generate-routes
bun add <pkg> · bun add -d <pkg>
```
Never `pnpm`/`npm`.

## Conventions

- **File naming: `kebab-case`** (files + folders). Component **exports PascalCase**. Hooks `use-*.ts` → `useThing`.
- **Imports:** `@/*` or `#/*` → `src/*`.
- Match surrounding style; let Biome format. No reflexive `useMemo`/`useCallback` — React Compiler is on.

## Content is data

Never hardcode content in components. Two sources:

- **Supabase** (project `omgywqbxxvcfshpoxerh`) owns `projects`, `stats`, `tech_stacks` (skills), `experience`, `socials`, and the resume Drive file id. Consumed via `src/lib/content.ts` — `contentQuery` + `usePortfolioContent()`; public routes `ensureQueryData` in their loader so it's SSR-dehydrated. Edited at `/admin` (email+password, single account, signups disabled; RLS = public read, writes pinned to the admin email). Env: `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` (`.env`, see `.env.example`). Project images upload to the public `project-images` Storage bucket.
- **`src/data/resume.ts`** stays the typed source (`satisfies Resume`) for static copy (identity/hero/about/process/contact copy/footer) **and** the baked-in fallback for the DB-backed slices when Supabase is unreachable — keep its shapes in sync with the row mapping in `content.ts`.

Render a monochrome placeholder when a project image is missing (never a broken `<img>`).

## SSR rule (critical)

WebGL touches `window` → SSR crashes. **All Three.js / `<Canvas>` is client-only:** route everything through `three/canvas-stage.tsx` (ClientOnly + mounted-gate + in-view gate + Lite/mobile fallback). Guard any `window`/`localStorage`/`matchMedia` with `typeof window === "undefined"` or run in an effect.

## 3D strategy (it's "3D-heavy" — keep it performant)

All scenes go through **`canvas-stage.tsx`**, which:
- mounts a `<Canvas>` only when `mounted && inView && !mobile && !isLiteMode`, else renders the static `fallback`; **unmounts** when scrolled far out of view (frees the GL context — browsers cap ~8–16).
- uses `frameloop="demand"` for non-hero scenes (render on interaction only); hero uses `"always"` (auto-rotates).
- caps `dpr={[1,1.5]}`, code-splits each scene via `React.lazy`.
- **CSS 3D (transform), not WebGL, for project-card tilt** — no renderer for hover.

3D inventory: hero object (interactive, matcap), tech-stack tag cloud (interactive), about ambient geometry (demand), project tilt (CSS-3D). Every scene has a Lite/mobile/reduced-motion fallback.

## Performance Mode (core feature)

`zustand`+persist store `src/lib/perf-store.ts` (localStorage `portfolio-lite-mode`), `use-performance-mode.ts` → `{ isLiteMode, setIsLiteMode, toggle }`. Auto-detect on first load → Lite if ANY: `prefers-reduced-motion`, `hardwareConcurrency≤4`, `deviceMemory≤2`. **Treat reduced-motion as Lite for all motion.**

In Lite Mode: all canvas-stage scenes → static fallback; paper-grain overlay removed; clip-reveals/count-up → instant; rule draw-ins static; nav glass → solid. Content, layout, CSS hover, hairline rules stay. `<MotionWrapper>` strips transforms→opacity. Toggle = Base UI `Switch`, `role="switch"` + `aria-checked` + `aria-label="Toggle lite mode"`, 44px target, `Zap`/`Sparkles` icons.

## Design system — light editorial

**Light, not dark.** Palette in `:root` (no `.dark`, drop `<html className="dark">`). Near-monochrome ink-on-paper; black-block inversion is the main emphasis (black pill buttons); ONE electric-blue accent used sparingly (links/focus/active).

### Color tokens (oklch, `:root`)
| Token | oklch | Role |
|---|---|---|
| `--background` (paper) | `oklch(0.96 0.006 90)` | warm off-white |
| `--paper-2` | `oklch(0.93 0.008 90)` | panels/cards |
| `--foreground` (ink) | `oklch(0.18 0.004 70)` | text, black blocks |
| `--muted-foreground` | `oklch(0.50 0.005 80)` | captions |
| `--primary` | `oklch(0.18 0.004 70)` | black pill buttons |
| `--primary-foreground` | `oklch(0.96 0.006 90)` | button text |
| `--border` / `--rule` | `oklch(0.18 0.004 70 / 14%)` | hairline rules |
| `--accent-blue` | `oklch(0.55 0.21 262)` | links/focus/active — sparing |
| `--ring` | `oklch(0.55 0.21 262)` | focus |

Remap shadcn tokens: `--card→paper-2`, `--secondary/--muted→paper-2`, `--accent→ink/5%`. Keep names so generated components adapt unedited.

### Typography
- **Display:** Space Grotesk — huge `clamp(2.75rem,9vw,8rem)`, tracking `-0.03em`, line-height ~0.95, may break the content margin.
- **Body:** Inter.
- **Mono:** Space Mono — uppercase, `tracking-[0.15em]`, small; labels, indices (`01`–`08`), stat captions, dates, `©2026`, `● AVAILABLE FOR WORK`. Expose `--font-mono`.

### Editorial detailing (this is what makes it not look AI-generated)
- Type breaks the grid; asymmetry over centering.
- 1px `--rule` hairlines divide panels (animatable draw-in).
- Large faint background index numerals (`ink/6%`); `[writing-mode:vertical-rl]` mono section labels.
- Editorial marks: `©2026`, `®`, `+`, `↗`.
- Faint fixed paper-grain noise overlay (dropped in Lite Mode).
- Surfaces = ruled flat panels, **not glass**.

### Glass (demoted)
`glass`/`glass-lite` utilities retained but used **only** for nav-on-scroll + mobile drawer. Lite swaps `glass→glass-lite` (no blur). Not a general surface.

### Motion
Restrained, orchestrated. Clip-path text reveals, rule draw-in, count-up, image scale+clip. Hero 3D auto-rotates + drag + parallax; other 3D `frameloop="demand"`. Reduced-motion = Lite. Indices are genuine editorial structure (allowed), not gimmick.

## Sections (top→bottom)
Nav · 01 Hero (3D object) · 02 Stats band (count-up) · 03 Featured Projects (CSS-3D tilt) · 04 About (ambient 3D) · 05 Tech Stack (3D tag cloud) · 06 Experience (editorial ruled list) · 07 Process/Services · 08 Contact (underlined-input form) · Footer.

## Responsive
Tailwind defaults. Editorial grids → single column `<md`. 3D never renders `<md` (fallback). 44px touch targets. No horizontal scroll at 360px (hero `overflow-hidden` so grid-breaking type can't scroll the page).

## Accessibility (non-negotiable)
Visible focus rings everywhere; `aria-label` on icon buttons; reduced-motion = Lite; semantic landmarks; `<Label>`s on inputs; ink-on-paper ≥7:1. Drag-only 3D is decorative — its info also lives in the fallback grid (what keyboard/AT users get).

## Scope discipline (deliberate cuts — don't "fix" unasked)
- Light-only, no theme toggle.
- Contact form = `mailto:` (no backend, no form lib).
- CSS-3D for tilt; WebGL only where it earns it.
- Project images owner-supplied; placeholders until then.
- reactbits = copy-in, not a dep.
