# Portfolio Redesign — Design Spec

**Date:** 2026-08-15
**Owner:** Rahul Dinkar
**Status:** Approved for planning

## 1. Objective

Redesign the personal portfolio at `rdinkar.github.io` to be **recruiter-optimized**
and to reflect Rahul's current positioning: a **staff-level frontend engineer focused
on systems, tooling, developer experience, and AI-assisted development** — a shift away
from the current "Senior Software Engineer / Frontend Specialist" framing.

Success criteria:

- Top 3 impact points, role, and stack are visible within the first viewport (≈8-second
  recruiter scan).
- One-page, project-first, with measurable outcomes and working links.
- Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO.
- Mobile-first, fully keyboard-navigable, WCAG AA contrast, `prefers-reduced-motion`
  respected.
- Ships live on GitHub Pages via GitHub Actions.

## 2. Design direction

**"Systems Terminal," tuned for editorial readability.**

- **Theme:** dark-first with a light toggle. Persisted to `localStorage`; initial value
  respects `prefers-color-scheme`. No flash of wrong theme (inline head script sets the
  class before paint).
- **Color:** near-black canvas (`~#0a0b0d`) + slightly elevated surfaces, off-white text,
  a **single restrained accent = cool signal cyan/teal**. Neutral grays elsewhere.
  Accent defined as a CSS/Tailwind token so it can be swapped in one place.
- **Typography:** variable sans for headings (Inter or Geist), **mono accent**
  (JetBrains Mono / Geist Mono) for metrics, section numbers (`01 / 02 …`), and stack
  tags. Fluid sizing via `clamp()`. Fonts self-hosted (subset) for performance and to
  avoid third-party requests.
- **Motion:** scroll-reveal (IntersectionObserver), metric count-up, subtle hover states.
  All motion gated behind `prefers-reduced-motion: reduce`.
- **Signature interaction:** a `⌘K` / `Ctrl-K` **command palette** for navigation
  (jump to section, download résumé, copy email, open GitHub/LinkedIn/Medium). Reinforces
  the DevEx narrative. Complemented by scroll-spy active nav, smooth anchor scroll, and a
  mobile menu.
- **No photo** — type-only identity.

## 3. Information architecture (single page)

1. **Hero** — headline *"I build the systems and tooling that help teams move faster."*;
   subhead *Staff-level Frontend Engineer · Systems & Developer Experience · Gurugram,
   open to remote*; CTAs (View work / Download résumé / Email); GitHub · LinkedIn · Medium;
   theme toggle; `⌘K` hint.
2. **Impact band** — animated count-up metrics:
   - **95%** faster dataset onboarding (~5 days → 3–4 hrs)
   - **39 → 3** CI jobs (infra ~4h40m → ~12 min)
   - **10s → 4s** initial bundle load
   - **30–40%** faster deploys
3. **About** — tightened profile: builds systems/tooling that help teams move faster; got
   AI coding agents into everyday development; opened the codebase to non-engineers (tests,
   coverage, custom ESLint, documented "why"); cares about performance and clean
   architecture; mentors and improves how the team works.
4. **Selected work** — problem → approach → impact cards with real stack tags:
   - **AI coding agents & issue→PR automation** — agent rules, reusable skills, `AGENTS.md`
     capturing product/domain context; automated pipeline that takes a task from issue to
     PR (picks up task, makes fix, runs tests, opens PR, reports back); custom skills
     (ship-pr, figma-to-code, babysit-pr). *Stack: AI coding agents, AGENTS.md, GitHub
     Actions.*
   - **CI/CD overhaul & Vite monorepo** — Run-All checks 39 → 3 jobs; infra ~4h40m → ~12
     min; deploys 30–40% faster via smart lint caching + dependency reuse; moved app into a
     full-stack monorepo on Vite (~40% faster deploys). *Stack: GitHub Actions, Vite,
     monorepo.*
   - **Tuxedo v2.0 design system** — modular system running alongside the legacy library
     for gradual migration; scoped-CSS theming/isolation; later shadcn/ui-based prototype.
     *Stack: React, TypeScript, scoped CSS, shadcn/ui.*
   - **Unified dataset onboarding framework** — onboarding ~5 days → 3–4 hrs; standardized
     API contracts with design + backend; reusable components. *Stack: React, TypeScript.*
   - **Screener & analytics rework** — backend-driven filters, configurable columns,
     real-time tagging, saved/shareable views (Notion-style); chat interface + visual query
     builder for no-code data slicing; scalable state management. *Stack: React, React
     Query, TypeScript, AG Grid.*
   - **Performance modernization** — 10s → 4s via Webpack chunking, route-based code
     splitting, caching, library trimming; dead-code detection plugin; Node/AG Grid/Vite
     upgrades. *Stack: Webpack, Vite.*
   - **Lighter personal projects** (secondary cards, live demo + code links):
     - Calendar Puzzle Game — drag-and-drop puzzle. Code:
       `github.com/rdinkar/calendar-puzzle`, Demo: `rdinkar.github.io/calendar-puzzle/`.
     - Task Management App — multi-card task board. Code:
       `github.com/rdinkar/task-management`, Demo: `rdinkar.github.io/task-management`.
5. **Experience** — timeline:
   - **Senior Frontend Engineer (SDE-3)** — Synaptic Inc, Gurugram · **April 2021 – Present**.
     Subtle mono caption showing progression **SDE-1 → SDE-2 → SDE-3**.
   - **Associate Software Engineer** — Innoplexus Consulting Services, Pune · June 2019 –
     April 2021 (React/Redux boilerplate reduction, caching/retries, internal charting
     library).
   - **Internships:** Software Engineer — Innoplexus (May–Jul 2018); Lead Frontend —
     Docconsult Services LLP, Jaipur (Jun–Aug 2017). (Compact treatment.)
6. **Skills** — grouped tags, no skill bars:
   - **Frontend:** ReactJS, React Native, Redux, React Query, D3.js, Webpack, Vite
   - **Languages:** TypeScript, JavaScript
   - **AI & Automation:** AI coding agents, agent rules & skills, AGENTS.md, automated
     task-to-PR pipelines
   - **Tools & Platforms:** Git, CI/CD (GitHub Actions), testing & coverage, custom ESLint,
     AG Grid, shadcn/ui, JIRA, Agile/Scrum
   - **Leadership:** technical direction, cross-team work, mentoring, developer experience
7. **Writing** — Medium callout linking `medium.com/@rahul.dinkar`.
8. **Education & Achievements:**
   - B.Tech, IIT Roorkee (2015–2019).
   - 2nd place, Synaptic Hackathon 2023 (social-network insights prototype).
   - Star Player of the Team, Jan 2025 (technical leadership & system-level impact).
   - Published blog on state-management architecture in Synaptic Engineering.
9. **Contact + footer** — email `dinkarrahul28@gmail.com`, phone `+91-7060907485`,
   LinkedIn (`rahul-dinkar-593161130`), GitHub (`rdinkar`), location Gurugram (open to
   remote), résumé download. Footer with dynamic year + rights.

## 4. Content source of truth

All copy above is derived from the two résumés and the current site. Content is stored in
typed data structures (TS/JSON, or MDX collections for work items) so sections render from
data and are trivial to edit. Metrics use the figures in §3. The résumé PDF served for
download is the **newest** one (`resume.pdf` in repo root, refreshed from the latest file).

## 5. Technical architecture

- **Framework:** Astro + Tailwind CSS. Page composed from Astro components
  (`Hero`, `ImpactBand`, `About`, `Work`, `Experience`, `Skills`, `Writing`, `Education`,
  `Contact`, `Footer`, `Nav`, `CommandPalette`, `ThemeToggle`).
- **Interactivity as islands only:** theme toggle, command palette, metric count-up,
  scroll-spy. Everything else static HTML/CSS → near-zero JS shipped.
- **Structure (indicative):**
  - `src/pages/index.astro` — composes sections
  - `src/components/*` — section + UI components
  - `src/data/*` — content (profile, work, experience, skills, education)
  - `src/layouts/Base.astro` — head, meta, JSON-LD, theme bootstrap script
  - `src/styles/` — Tailwind entry + tokens
  - `public/` — `resume.pdf`, favicon, `og.png`, `robots.txt`
- **Analytics:** preserve existing Google Analytics (`G-2N872D2WD8`), still gated to load
  only on the `rdinkar.github.io` host.

## 6. SEO

- Per-page `<title>`, meta description, canonical URL.
- Open Graph + Twitter Card tags; a generated `og.png` (type-based, on-brand).
- **JSON-LD `Person`** schema (name, jobTitle, url, sameAs → LinkedIn/GitHub/Medium,
  alumniOf IIT Roorkee).
- `sitemap.xml` (Astro sitemap integration) + `robots.txt`.
- Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), one `h1`, logical heading
  order, descriptive link text and alt attributes.

## 7. Performance & accessibility

- Static output, self-hosted subset fonts, no render-blocking third-party CSS/JS (replace
  the current Font Awesome CDN + Google Fonts CDN with inlined SVG icons and self-hosted
  fonts).
- Lighthouse target ≥ 95 in all four categories.
- WCAG AA contrast in both themes; visible focus rings; full keyboard operability
  (command palette, nav, toggles); `prefers-reduced-motion` disables non-essential motion;
  touch targets ≥ 44px.

## 8. Deployment

- Convert `rdinkar.github.io` from serving raw HTML to an **Astro build via GitHub
  Actions** deploying to GitHub Pages (`actions/deploy-pages`). `base: '/'` (user site,
  served at root).
- Résumé PDF remains at a stable path for the download link.
- Verify the live site post-deploy (build succeeds, links work, résumé downloads,
  analytics loads only on prod host).

## 9. Out of scope (YAGNI)

- CMS / blog engine (Medium remains the blog; only a callout here).
- Contact form / backend (mailto + links only).
- Headshot/illustration, i18n, multi-page case studies.

## 10. Open questions

None blocking. Accent color is a token and can be tuned during implementation review.
