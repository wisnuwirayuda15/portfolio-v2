# PRD & Implementation Plan — Portfolio v2 (Editorial Redesign)

**Owner:** Putu Wisnu Wirayuda Putra — Front-End Software Engineer, Jakarta, Indonesia
**Status:** Redesign — supersedes v1 (dark/centered/particle direction)
**Last updated:** 2026-06-19

> **Why this rewrite.** v1 read as a generic AI-template: centered hero, particle background, uniform chip cards, thin content. v2 commits to a **light editorial / brutalist** system (refs: Cognify, Robot Art Exhibition) — oversized display type that breaks the grid, asymmetric layout with hairline rules and large index numerals, paper-and-ink palette, and **3D-heavy** interactive objects as focal points. It also adds the sections a real portfolio needs: **Featured Projects, Stats band, Tech Stack showcase, Process/Services**.

---

## 0. Stack — verified against the repo (unchanged from v1)

| Brief assumed | Actually installed | Consequence |
|---|---|---|
| Vite **or** Next.js | **TanStack Start** (`@tanstack/react-start`) on Vite 8 + Nitro | **SSR is on.** `__root.tsx` renders the `<html>` shell. All WebGL must be client-only or SSR crashes on `window`. |
| shadcn on Radix | shadcn on **Base UI** (`@base-ui/react`) | Primitives already generated in `src/components/ui/`. Reuse; don't re-add. |
| TanStack Router | ✅ `src/routes/`, `routeTree.gen.ts` | File-based routing as-is. |
| Tailwind v4 | ✅ oklch token system in `styles.css` | Re-skin tokens (dark→light); keep structure. |

**Reused (no new deps):** `zustand` (+persist), `lucide-react`, `sonner`, `vaul`, `@tanstack/react-form`+`zod`, `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`, `three`/`@react-three/fiber`/`@react-three/drei`, `motion`, and generated shadcn components.

**Reused from v1 build (infrastructure survives the re-skin):** `perf-store.ts`, `use-performance-mode.ts`, `use-scrolled.ts`, `use-active-section.ts`, `motion-wrapper.tsx`, `reveal.tsx`, `section.tsx`, the lazy/client-only/Lite-gated canvas pattern in `hero-canvas.tsx`. The visual layer (palette, typography, section layouts) and 3D content get reworked; the plumbing stays.

**The only new package:** `@fontsource/space-mono` (editorial label/caption/index voice).

> **Pivot from v1 (each deliberate, flagged):**
> - **Light, not dark.** Palette flips to warm paper + ink. `next-themes` stays unused; light goes straight in `:root`, drop `<html className="dark">`.
> - **Hairline-ruled flat panels replace liquid glass** as the primary surface. Glass is demoted to nav-on-scroll + mobile drawer only. The Performance-Mode "glass→solid" rule still applies there.
> - **`mailto:` contact form** stays (no backend). *Add real submission when an endpoint exists.*
> - **CSS 3D where WebGL isn't needed.** Project-card tilt = CSS `transform`, not a WebGL canvas — WebGL is reserved for the hero object, tech-stack cloud, and ambient geometry. Lazy: don't spin a renderer for a hover tilt.

---

## 1. Product goal & success criteria

A single-page **engineer's portfolio** that reads as **editorial, intentional, human-crafted** — paper-and-ink with oversized type, asymmetric composition, and bold interactive 3D objects as the signature. It must showcase *work* (projects), prove *impact* (stats), and stay usable on weak hardware.

**Done when:**
- All sections (§5) render with real content from `resume.ts` (projects/stats/process included).
- Hero 3D object is drag-rotatable + mouse-reactive on desktop; every 3D scene degrades to a static fallback on mobile and in Lite Mode.
- 3D scenes mount only when scrolled into view and pause off-screen (no idle GPU burn).
- Performance Mode persists and auto-enables on weak devices.
- Lighthouse: Performance ≥ 90 (desktop, Full Mode), Accessibility ≥ 95.
- Responsive 360px → 1536px+, no horizontal scroll, 44px min touch targets.
- `prefers-reduced-motion` honored everywhere.

---

## 2. Design language — light editorial / brutalist

The north stars are **Cognify** (huge clean grotesque, generous white space, asymmetric image row) and **Robot Art Exhibition** (cream paper, hairline-ruled multi-column panels, giant background numeral, vertical labels, mono captions, editorial marks like `©2026` / `®` / `+`).

### What makes it *not* look AI-generated
- **Type breaks the grid.** The hero headline runs oversized and can bleed past the content margin. Tight tracking, mixed weights.
- **Asymmetry over centering.** Off-center focal points, content hung on a 12-col grid with intentional empty cells.
- **Hairline rules + index numerals.** 1px ink/14% rules divide editorial panels; large faint `01–06` numerals and vertical `writing-mode` labels mark sections.
- **Mono micro-typography.** Captions, stats, dates, `©2026`, availability status — all in Space Mono, uppercase, letter-spaced.
- **Paper grain.** A faint fixed noise overlay over the background (dropped in Lite Mode).
- **Near-monochrome.** Ink on paper; black-block inversion is the main emphasis (black pill buttons, like Cognify). One electric accent, used *sparingly*.

### Palette (oklch, light — set in `:root`, drop `.dark`)

| Token | Ref | oklch | Role |
|---|---|---|---|
| `--background` (paper) | `#F4F2EC` | `oklch(0.96 0.006 90)` | warm off-white base |
| `--paper-2` (raised panel) | `#EAE7DD` | `oklch(0.93 0.008 90)` | panels, cards |
| `--foreground` (ink) | `#14130F` | `oklch(0.18 0.004 70)` | text, black blocks |
| `--muted-foreground` | `#6B6A63` | `oklch(0.50 0.005 80)` | captions, secondary |
| `--primary` (ink) | `#14130F` | `oklch(0.18 0.004 70)` | black pill buttons |
| `--primary-foreground` | paper | `oklch(0.96 0.006 90)` | button text |
| `--border` / `--rule` | — | `oklch(0.18 0.004 70 / 14%)` | hairline rules |
| `--accent-blue` (electric) | `#2B59FF` | `oklch(0.55 0.21 262)` | links, focus, active — sparing only |
| `--ring` | accent | `oklch(0.55 0.21 262)` | focus rings |

shadcn semantic tokens remap: `--card → paper-2`, `--accent` (hover surface) → `ink/5%`, `--secondary → paper-2`, `--muted → paper-2`. Keep names so generated components adapt with no edits.

### Typography
- **Display:** Space Grotesk (have it). Huge — `clamp(2.75rem, 9vw, 8rem)`, tracking tight (`-0.03em`), line-height ~0.95. Can break the content margin.
- **Body:** Inter (have it). `text-base md:text-lg`, relaxed leading.
- **Mono / editorial:** **Space Mono** (NEW, `@fontsource/space-mono`, 400/700). Uppercase, `tracking-[0.15em]`, small — for labels, indices, stats captions, dates, `©2026`, "AVAILABLE FOR WORK".
- Expose `--font-mono: "Space Mono", monospace` in the `@theme` block; repoint `--font-heading` stays Space Grotesk.

### Surfaces & detailing
- **Editorial panel:** `bg-transparent` or `--paper-2`, separated by `border`/hairline rules — *not* glass.
- **Glass (demoted):** only nav-on-scroll + mobile drawer; `glass`/`glass-lite` utilities from v1 retained for those two spots.
- **Index numeral:** absolutely-positioned Space Grotesk numeral at ~`12rem`, `ink/6%`, behind section content.
- **Vertical label:** `[writing-mode:vertical-rl]` mono caption on a section's edge.
- **Marks:** `©2026`, `®`, `+`, `↗` used as editorial punctuation (mono).

### Motion principles
- Orchestrated, restrained. Entrance: text **clip-reveal** (translateY + `clip-path` wipe) and **line-rule draw-in**; stats **count-up**; images **scale-from-95% + clip**.
- Hero 3D: continuous slow auto-rotate + drag + mouse parallax. Other 3D: `frameloop="demand"` (renders only on interaction/in-view).
- No looping decorative motion outside 3D. Honor reduced-motion (= Lite for motion).
- No `01/02/03` *as gimmick* — but indices are genuine editorial structure here, so they're used as section/project markers intentionally.

---

## 3. Information architecture & routing (TanStack Router)

**Single route** (`src/routes/index.tsx`) — one-page scroll. Nav links are in-page anchors with motion-safe smooth scroll; active link tracked by `use-active-section`. No multi-route.

Section order (top → bottom):

| # | Section | id | New? |
|---|---|---|---|
| — | Navigation | — | reworked |
| 01 | Hero | `home` | reworked |
| 02 | Stats / Impact band | `stats` | **new** |
| 03 | Featured Projects | `work` | **new** |
| 04 | About | `about` | reworked |
| 05 | Tech Stack | `stack` | reworked (was Skills) |
| 06 | Experience | `experience` | reworked |
| 07 | Process / Services | `process` | **new** |
| 08 | Contact | `contact` | reworked |
| — | Footer | — | reworked |

Nav links: Work, About, Stack, Experience, Contact (Hero=logo, Process reachable via scroll).

---

## 4. Component architecture (kebab-case files, PascalCase exports)

```
src/
  data/
    resume.ts              # SSOT — add `projects`, `stats`, `process` (§4.1)
  components/
    layout/
      navbar.tsx           # editorial nav: wordmark + © + mono links + status dot + perf toggle
      mobile-nav.tsx       # Sheet drawer (glass)
      footer.tsx           # big background wordmark, © , links
      section.tsx          # <section> + SectionHeading + IndexNumeral + VerticalLabel helpers
    editorial/             # NEW — the brutalist building blocks
      rule.tsx             # hairline divider (animatable draw-in)
      index-numeral.tsx    # large faint background number
      vertical-label.tsx   # writing-mode vertical mono caption
      mono-label.tsx       # uppercase letter-spaced mono caption / ©2026 / status
      clip-text.tsx        # heading with clip-path reveal on view
      count-up.tsx         # number that counts up on view (Lite → instant)
    sections/
      hero.tsx             # oversized headline (grid-breaking) + 3D object + mono meta
      stats.tsx            # ruled big-number band, count-up
      projects.tsx         # asymmetric project grid (CSS-3D tilt cards) + featured
      about.tsx            # editorial 2-col + ambient 3D + ruled education/cert
      tech-stack.tsx       # interactive 3D tag cloud + editorial fallback grid
      experience.tsx       # editorial ruled list (role/company/dates grid)
      process.tsx          # numbered editorial steps (services)
      contact.tsx          # editorial form + info
    three/                 # all client-only, lazy, in-view-gated, Lite/mobile-fallback
      canvas-stage.tsx     # NEW shared wrapper: ClientOnly + in-view mount + frameloop + fallback
      hero-object.tsx      # drag-rotate sculptural form (knot/distorted icosa, matcap)
      tag-cloud.tsx        # 3D skill sphere (drei Billboard + Text, fibonacci dist)
      ambient-geo.tsx      # slow floating geometry for About
      fallbacks/
        hero-fallback.tsx
        cloud-fallback.tsx
    motion/
      motion-wrapper.tsx   # (exists) strips animation in Lite Mode
      reveal.tsx           # (exists) scroll reveal, Lite-aware
    perf/
      perf-toggle.tsx      # (exists) Base UI Switch, role=switch
    glass-card.tsx         # (exists) demoted — used only by nav/drawer now
  hooks/
    use-mobile.ts          # exists
    use-performance-mode.ts# exists
    use-active-section.ts  # exists
    use-scrolled.ts        # exists
    use-in-view.ts         # NEW — IntersectionObserver boolean, gates canvas mount
  lib/
    perf-store.ts          # exists
```

### 4.1 SSOT additions (`src/data/resume.ts`)

Add to the existing typed `resume` object:

```ts
export interface Project {
  index: string;            // "01"
  title: string;
  blurb: string;
  role: string;
  year: string;
  stack: string[];
  featured?: boolean;
  image?: string;           // /public path; [owner to supply]
  href?: string;            // live/case-study link; optional
}
export interface Stat { value: string; label: string; }        // "150,000+" / "ACTIVE USERS"
export interface ProcessStep { index: string; title: string; body: string; }

// resume.projects: Project[]   — seed from real work, mark gaps [owner]
// resume.stats: Stat[]         — 150,000+ users · 2 yrs · 5+ projects · 60+ mentored
// resume.process: ProcessStep[]— Discover → Build → Optimize → Ship (or Services)
```

> **Content note:** the résumé lists no named projects. I'll seed `projects` with the **LMS (150k users)** as the featured entry plus 2–3 derived/placeholder slots, each flagged `[owner: add title/image/link]`. Images go in `/public`; until supplied, cards render a generated monochrome gradient/numeral placeholder (no broken images).

### 4.2 Key new interfaces

```ts
// three/canvas-stage.tsx — the performance heart of "3D-heavy"
interface CanvasStageProps {
  children: React.ReactNode;       // the R3F scene
  fallback: React.ReactNode;       // static node for Lite/mobile/SSR/out-of-view
  interactive?: boolean;           // true → frameloop "always" (hero); false → "demand"
  className?: string;
}
// Behavior: ClientOnly + mounted-gate + useInView gate + useIsMobile + isLiteMode.
// Renders <Canvas> ONLY when (mounted && inView && !mobile && !lite); else fallback.
// Unmounts when scrolled far out of view → frees the GL context.

// editorial/count-up.tsx
interface CountUpProps { value: number; suffix?: string; className?: string; }
```

---

## 5. Sections — purpose · content · layout · 3D/motion · responsive

### Navigation
- **Content:** wordmark `Wisnu W.` + mono `©2026`; links (Work, About, Stack, Experience, Contact) in mono uppercase; a mono `● AVAILABLE FOR WORK` status; Perf toggle; mobile hamburger.
- **Layout:** transparent over hero; on scroll past 64px gets glass + bottom hairline rule. Links right, wordmark left.
- **Responsive:** `<md` collapses to hamburger → `Sheet` drawer (glass) with stacked links + status + toggle. `≥md` full bar.

### 01 · Hero
- **Content:** mono eyebrow `FRONT-END ENGINEER — JAKARTA ©2026`; oversized headline that **breaks the grid**, e.g. `BUILDING THE / INTERFACES OF / TOMORROW` (Space Grotesk, clamp to ~8rem); one-line value prop (Inter); CTAs: black pill **`View Work ↗`** (→ `#work`) + ghost **`Get in Touch`** (→ `#contact`); scroll cue + index `01`.
- **3D:** `hero-object.tsx` — a drag-rotatable sculptural form (knurled `TorusKnot` or distorted `Icosahedron` with a chrome/clay **matcap** for the editorial B&W look), slow auto-rotate + mouse parallax, offset to the right third (asymmetric). `interactive` canvas.
- **Fallback:** `hero-fallback.tsx` — static monochrome render/PNG of the object (or a CSS gradient blob), shown on mobile/Lite.
- **Layout:** headline hung on the left 8 cols, 3D object on right 4–5 cols overlapping; mono meta pinned bottom-left; hairline rule under the section.
- **Responsive:** mobile → headline scales down but stays bold, 3D becomes a constrained static image above/below text, CTAs full-width; hero height `min(92dvh,760px)` mobile.

### 02 · Stats / Impact band
- **Content:** 4 stats from `resume.stats` — `150,000+ ACTIVE USERS`, `2 YRS EXPERIENCE`, `~5 PRODUCTION PROJECTS`, `60+ STUDENTS MENTORED`.
- **Layout:** single ruled row, 4 cells split by vertical hairline rules; big Space Grotesk numbers (count-up on view), mono caption beneath each.
- **Motion:** `count-up` + rule draw-in. Lite → static numbers.
- **Responsive:** 4-col → 2×2 on `<md` → stacked on `<sm`, rules adapt.

### 03 · Featured Projects (the centerpiece)
- **Content:** `resume.projects` — featured LMS card large, others in an asymmetric grid; each shows index `0X`, title, blurb, role, year, stack tags (mono), optional `↗` link, image/placeholder.
- **Layout:** editorial asymmetric grid — one large featured tile spanning, others varied heights (Cognify-style image row energy). Hairline rules + index numerals.
- **3D/Motion:** **CSS-3D tilt** on hover (`transform: perspective rotateX/rotateY` tracking pointer) — cheap, no WebGL. Image clip-reveal on view; hover lifts + reveals "View ↗". (CSS-3D keeps this performant despite "3D-heavy".)
- **Responsive:** grid → single column stack `<md`, tilt disabled on touch.

### 04 · About
- **Content:** big editorial statement (1 line, Space Grotesk), bio paragraph (Inter); education + certification as **ruled list rows** (not cards): label left, detail right, hairline between.
- **3D:** `ambient-geo.tsx` — slow floating monochrome geometry, `frameloop="demand"`, behind/beside the text. Lite/mobile → static.
- **Layout:** asymmetric 2-col; vertical label `ABOUT` on the edge; index `04`.
- **Responsive:** single column `<lg`; 3D → small static accent.

### 05 · Tech Stack
- **Content:** grouped Frontend / Backend / Mobile / Tools from `resume.skills`.
- **3D:** `tag-cloud.tsx` — interactive draggable 3D sphere of skill labels (drei `Billboard` + `Text`, fibonacci distribution, damped `OrbitControls`, auto-spin). `interactive` canvas, but in-view-gated.
- **Fallback / Lite / mobile:** `cloud-fallback.tsx` — editorial ruled grid of categories with mono skill lists + hover.
- **Layout:** cloud on one side, category legend (ruled list) on the other; index `05`.
- **Responsive:** `<md` → fallback grid always (no 3D sphere on small screens).

### 06 · Experience
- **Content:** `resume.experience` as an **editorial ruled list**, not glass cards. Each row: left = role + company (Space Grotesk) and ≤3 mono highlights; right = dates + location (mono); hairline rule between rows. Featured (Coding Studio) row emphasized (heavier weight + `● CURRENT`).
- **Motion:** rows clip-reveal + rule draw-in on scroll.
- **Layout:** full-width ruled list, generous vertical rhythm; index `06`.
- **Responsive:** date column moves above role on `<sm`.

### 07 · Process / Services
- **Content:** 3–4 numbered steps from `resume.process` (e.g. `01 Discover · 02 Build · 03 Optimize · 04 Ship`), each a short title + 1–2 lines. Doubles as "how I work / what I offer."
- **Layout:** numbered editorial columns/rows with big mono indices and hairline separators.
- **Motion:** staggered reveal.
- **Responsive:** columns → stacked rows `<md`.

### 08 · Contact
- **Content:** oversized `LET'S BUILD / SOMETHING.`; mono invite + `● AVAILABLE FOR WORK`; email + phone (mono, `mailto:`/`tel:`); GitHub/LinkedIn `[owner]` (shown "coming soon" until set); form (name/email/message → `mailto:` + sonner toast).
- **Layout:** editorial 2-col (statement+info left, form right); form fields are **underlined inputs** (hairline bottom rule, not boxed) for the editorial feel; black pill submit.
- **Responsive:** stacked `<lg`, full-width fields/submit.

### Footer
- **Content:** giant faint background wordmark `WISNU`; `© 2026 Putu Wisnu Wirayuda Putra`; tagline; nav + social links (mono); "back to top ↑".
- **Layout:** minimal, one top hairline rule.

---

## 6. 3D strategy — making "3D-heavy" performant

Multiple WebGL canvases are the main risk. Mitigations, all enforced by `canvas-stage.tsx`:

1. **In-view gating.** `use-in-view` (IntersectionObserver) mounts a scene only when its section is near the viewport and **unmounts** it when far away → frees the GL context (browsers cap ~8–16 contexts).
2. **`frameloop="demand"`** for non-hero scenes — they render on interaction/prop change only, not every frame. Hero uses `frameloop="always"` (it auto-rotates).
3. **Capped `dpr={[1, 1.5]}`** and modest geometry; one shared matcap texture for the hero.
4. **CSS-3D, not WebGL, for project-card tilt** — no renderer for hover effects.
5. **Code-split** every scene (`React.lazy`); the `three`/drei bundle never loads in Lite Mode or on mobile.
6. **Lite/mobile/SSR/reduced-motion → static fallbacks** for every scene.

3D inventory: hero object (interactive), tech-stack tag cloud (interactive), about ambient geometry (demand), project tilt (CSS-3D). That's a 3D presence in 4 sections while only ~2 run a live render loop at once.

---

## 7. Performance Mode (carries over from v1, extended)

`zustand`+`persist` store (`portfolio-lite-mode`), `usePerformanceMode()` → `{ isLiteMode, setIsLiteMode, toggle }`, auto-detect on first load (`prefers-reduced-motion` ∥ `hardwareConcurrency≤4` ∥ `deviceMemory≤2`). `<MotionWrapper>` strips transforms→opacity in Lite. Toggle on Base UI `Switch` (`role="switch"`, `aria-checked`, `aria-label`).

**Lite Mode in v2:** all `canvas-stage` scenes → static fallback; paper-grain overlay removed; clip-reveals/count-up → instant; rule draw-ins → static; nav glass → solid. Content, layout, hover (CSS), and hairline rules stay.

---

## 8. Animation tooling
| Concern | Tool |
|---|---|
| 3D objects / cloud / ambient | `@react-three/fiber` + `@react-three/drei` |
| Clip-reveals, rule draw-in, count-up, stagger | `motion` (`motion/react`, `whileInView`) via `Reveal`/`MotionWrapper` |
| Project-card tilt, hover | CSS transforms/transitions |
| Smooth scroll | CSS `scroll-behavior`, motion-safe |
| Active nav link | `use-active-section` (IntersectionObserver) |

Page-load order: nav → hero eyebrow → headline clip-reveal (line by line) → value prop → CTAs → 3D object mounts last. Below-fold animates on scroll.

---

## 9. Responsive
Tailwind v4 defaults (`sm640 md768 lg1024 xl1280 2xl1536`). Editorial grids collapse to single column `<md`. 3D canvases never render `<md` (fallback instead). 44px min touch targets. No horizontal scroll at 360px (oversized headlines use `clamp` + `overflow-hidden` on the hero so grid-breaking type never creates a scrollbar). Per-section behavior in §5.

---

## 10. Accessibility
Visible focus rings (`--ring` electric blue) on all interactive elements; `aria-label` on icon-only buttons; perf toggle `role="switch"`+`aria-checked`+`aria-label`; reduced-motion = Lite for motion; semantic landmarks (`<nav>/<main>/<section aria-labelledby>/<footer>`); form `<Label>`s (underlined inputs keep visible labels); ink-on-paper contrast ≥ 7:1, accent-blue-on-paper ≥ 4.5:1. Drag-only 3D (tag cloud) is decorative — its content (skills) is also in the fallback grid, which is what assistive tech and keyboard users get.

---

## 11. Packages to install
```bash
bun add @fontsource/space-mono
```
Everything else (three, r3f, drei, motion, space-grotesk) already installed. No reactbits dependency (copy-in if needed). No new 3D libs — matcaps ship with drei.

---

## 12. Build order
1. **Re-skin tokens:** light palette in `styles.css` `:root`, drop `<html className="dark">`, add `--font-mono`/Space Mono import, paper-grain overlay, demote glass. Update Toaster to light.
2. **Editorial primitives:** `rule`, `index-numeral`, `vertical-label`, `mono-label`, `clip-text`, `count-up`; extend `section.tsx`.
3. **SSOT:** add `projects`, `stats`, `process` to `resume.ts`.
4. **3D core:** `use-in-view`, `canvas-stage.tsx` (refactor `hero-canvas` into it).
5. **Sections top→bottom:** nav → hero (+`hero-object`) → stats → projects (CSS-3D) → about (+`ambient-geo`) → tech-stack (+`tag-cloud`) → experience → process → contact → footer.
6. **QA:** Lite Mode + reduced-motion + mobile fallbacks for every 3D scene; responsive sweep; Lighthouse; verify no horizontal scroll from grid-breaking type.

---

### Open items for the owner
- **Project content + images** — titles, blurbs, links, and `/public` images for Featured Projects (LMS seeded; rest placeholdered).
- **GitHub + LinkedIn URLs** (`resume.ts → contact.socials`).
- Confirm the single accent color (default electric blue `#2B59FF`) — or go fully monochrome.
