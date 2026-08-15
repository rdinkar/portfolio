# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `rdinkar/portfolio` as a recruiter-optimized, single-page Astro + Tailwind site with a dark-first "Systems Terminal" design, deployed to GitHub Pages via Actions.

**Architecture:** Astro static site. Sections render from typed content data files. Presentational markup is pure Astro (zero JS). Three small client islands — theme toggle, metric count-up, command palette — carry all interactivity. Pure logic lives in framework-free `.js` modules under `src/lib/` and is unit-tested with Node's built-in `node:test` runner (Node 22), then imported by both islands and tests.

**Tech Stack:** Astro 4+, Tailwind CSS, TypeScript for data, `node:test` for logic tests, GitHub Actions + `actions/deploy-pages`.

**Spec:** `docs/superpowers/specs/2026-08-15-portfolio-redesign-design.md`

## Global Constraints

- **Deploy target:** project repo `rdinkar/portfolio`, served at `https://rdinkar.github.io/portfolio/`. Astro config MUST set `site: 'https://rdinkar.github.io'` and `base: '/portfolio'`. All asset/document links (résumé, og image, favicon) MUST be prefixed with `import.meta.env.BASE_URL`. Same-page anchor links (`#work`) do NOT get the base prefix.
- **No third-party render-blocking requests:** no Font Awesome CDN, no Google Fonts CDN. Icons are inline SVG; fonts are self-hosted subsets (or a system-font stack if fonts are deferred).
- **Analytics:** preserve Google Analytics `G-2N872D2WD8`, loaded only when `location.hostname === 'rdinkar.github.io'`.
- **Accent color:** a single Tailwind/CSS token (`--accent`, cool cyan/teal). Defined in one place, swappable.
- **Motion:** every non-essential animation gated behind `prefers-reduced-motion: reduce`.
- **Accessibility:** WCAG AA contrast both themes; visible focus rings; keyboard-operable nav, toggle, and command palette; touch targets ≥ 44px.
- **Contact facts (verbatim):** email `dinkarrahul28@gmail.com`, phone `+91-7060907485`, LinkedIn `https://www.linkedin.com/in/rahul-dinkar-593161130/`, GitHub `https://github.com/rdinkar`, Medium `https://medium.com/@rahul.dinkar`, location Gurugram, India (open to remote).
- **Commits:** frequent, one per task minimum. End commit messages with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Node:** v22.x (already installed). Package manager: npm.

---

## File Structure

```
astro.config.mjs            # site+base, integrations (tailwind, sitemap)
tailwind.config.mjs         # tokens (accent, fonts), dark mode = 'class'
package.json                # scripts: dev, build, preview, test
tsconfig.json
public/
  resume.pdf                # refreshed with newest résumé
  robots.txt
  og.png                    # generated social card
  favicon.svg
src/
  layouts/Base.astro        # <head>, meta, JSON-LD, theme bootstrap, GA
  pages/index.astro         # composes all sections
  styles/global.css         # Tailwind entry + CSS tokens + base rules
  data/
    profile.ts              # name, headline, subhead, contacts, socials
    metrics.ts              # impact-band metrics
    work.ts                 # selected work + personal projects
    experience.ts           # roles + internships
    skills.ts               # grouped skill tags
    education.ts            # education + achievements
    nav.ts                  # section id/label list (shared by Nav + palette)
  lib/
    animate.js              # easeOutCubic, countUpFrames (pure, tested)
    commands.js             # filterCommands (pure, tested)
  components/
    Icon.astro              # inline-SVG icon by name
    Nav.astro               # top nav + mobile menu markup
    ThemeToggle.astro       # island: theme toggle button + script
    Hero.astro
    ImpactBand.astro        # island: count-up on scroll
    About.astro
    Work.astro
    Experience.astro
    Skills.astro
    Writing.astro
    Education.astro
    Contact.astro
    Footer.astro
    CommandPalette.astro    # island: ⌘K palette + script
tests/
  animate.test.js
  commands.test.js
.github/workflows/deploy.yml
```

---

### Task 1: Scaffold Astro + Tailwind, config, clean legacy files

**Files:**
- Create: `astro.config.mjs`, `tailwind.config.mjs`, `package.json` (replace), `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro`, `.gitignore` (update)
- Delete: `index.html`, `styles.css`, `script.js` (old static site), `node_modules` (stale)

**Interfaces:**
- Produces: a buildable Astro project; `npm run build` emits `dist/`. `global.css` exports CSS tokens `--accent`, `--bg`, `--surface`, `--text`, `--muted` for light + `.dark`.

- [ ] **Step 1: Remove stale node_modules and legacy site files**

```bash
rm -rf node_modules
git rm index.html styles.css script.js
```

- [ ] **Step 2: Create the Astro project files**

`package.json`:
```json
{
  "name": "portfolio",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --test tests/"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/tailwind": "^5.1.0",
    "@astrojs/sitemap": "^3.2.0",
    "tailwindcss": "^3.4.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rdinkar.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [tailwind(), sitemap()],
});
```

`tailwind.config.mjs`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
        canvas: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

`tsconfig.json`:
```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 3: Create global styles with color tokens (dark-first)**

`src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* light theme */
  --bg: 250 250 249;
  --surface: 255 255 255;
  --text: 24 24 27;
  --muted: 82 82 91;
  --accent: 13 148 136; /* teal-600 */
}
.dark {
  --bg: 9 9 11;
  --surface: 24 24 27;
  --text: 244 244 245;
  --muted: 161 161 170;
  --accent: 45 212 191; /* teal-300 */
}
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
body { @apply bg-canvas text-ink font-sans antialiased; }
:focus-visible { @apply outline-none ring-2 ring-accent ring-offset-2 ring-offset-canvas; }
```

- [ ] **Step 4: Create a minimal index page to prove the build**

`src/pages/index.astro`:
```astro
---
import '../styles/global.css';
---
<html lang="en" class="dark">
  <head><meta charset="utf-8" /><title>Rahul Dinkar</title></head>
  <body><main class="p-8"><h1 class="text-3xl font-bold">Build OK</h1></main></body>
</html>
```

- [ ] **Step 5: Install and build**

```bash
npm install
npm run build
```
Expected: `dist/index.html` produced, exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + Tailwind, remove legacy static site"
```

---

### Task 2: Base layout — head, SEO meta, JSON-LD, theme bootstrap, GA

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (use the layout)

**Interfaces:**
- Produces: `Base.astro` accepting props `{ title: string; description: string }` and a default slot for page body. Renders `<html>`, full `<head>`, no-flash theme script, GA snippet, and JSON-LD `Person`.

- [ ] **Step 1: Write the layout**

`src/layouts/Base.astro`:
```astro
---
interface Props { title: string; description: string }
const { title, description } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // normalized (no trailing slash)
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const og = new URL(`${base}/og.png`, Astro.site).href;
const person = {
  '@context': 'https://schema.org', '@type': 'Person',
  name: 'Rahul Dinkar', jobTitle: 'Senior Frontend Engineer',
  url: canonical, email: 'mailto:dinkarrahul28@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Gurugram', addressCountry: 'IN' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Roorkee' },
  sameAs: [
    'https://www.linkedin.com/in/rahul-dinkar-593161130/',
    'https://github.com/rdinkar',
    'https://medium.com/@rahul.dinkar',
  ],
};
---
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href={`${base}/favicon.svg`} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={og} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={og} />
    <script set:html={JSON.stringify(person)} type="application/ld+json" />
    <script is:inline>
      (() => {
        const t = localStorage.getItem('theme');
        const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', dark);
      })();
    </script>
    <script is:inline>
      if (location.hostname === 'rdinkar.github.io') {
        const s = document.createElement('script');
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-2N872D2WD8';
        s.async = true; document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date()); gtag('config', 'G-2N872D2WD8');
      }
    </script>
  </head>
  <body><slot /></body>
</html>
```

- [ ] **Step 2: Use the layout in index**

`src/pages/index.astro`:
```astro
---
import '../styles/global.css';
import Base from '../layouts/Base.astro';
---
<Base title="Rahul Dinkar — Senior Frontend Engineer" description="Staff-level frontend engineer focused on systems, developer experience, and AI-assisted development.">
  <main class="mx-auto max-w-5xl px-6"><h1 class="text-3xl font-bold py-20">Rahul Dinkar</h1></main>
</Base>
```

- [ ] **Step 3: Build and verify head output**

```bash
npm run build
grep -q 'application/ld+json' dist/index.html && grep -q 'og:image' dist/index.html && echo OK
```
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: base layout with SEO meta, JSON-LD, theme bootstrap, GA"
```

---

### Task 3: Content data files

**Files:**
- Create: `src/data/profile.ts`, `src/data/metrics.ts`, `src/data/work.ts`, `src/data/experience.ts`, `src/data/skills.ts`, `src/data/education.ts`, `src/data/nav.ts`

**Interfaces:**
- Produces exact exported shapes consumed by later tasks:
  - `profile.ts` → `export const profile: { name; headline; subhead; location; email; phone; socials: {label; href; icon}[] }`
  - `metrics.ts` → `export const metrics: { value: number; suffix?: string; prefix?: string; label: string; display?: string }[]`
  - `work.ts` → `export const work: { title; problem; approach; impact; stack: string[] }[]` and `export const projects: { title; description; code; demo }[]`
  - `experience.ts` → `export const roles: { title; org; period; note?; points: string[] }[]` and `export const internships: { title; org; period }[]`
  - `skills.ts` → `export const skillGroups: { group: string; items: string[] }[]`
  - `education.ts` → `export const education: { degree; org; period }[]` and `export const achievements: string[]`
  - `nav.ts` → `export const sections: { id: string; label: string }[]`

- [ ] **Step 1: Write `src/data/nav.ts`**

```ts
export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
] as const;
```

- [ ] **Step 2: Write `src/data/profile.ts`**

```ts
export const profile = {
  name: 'Rahul Dinkar',
  headline: 'I build the systems and tooling that help teams move faster.',
  subhead: 'Staff-level Frontend Engineer · Systems & Developer Experience',
  location: 'Gurugram, India · open to remote',
  email: 'dinkarrahul28@gmail.com',
  phone: '+91-7060907485',
  socials: [
    { label: 'GitHub', href: 'https://github.com/rdinkar', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahul-dinkar-593161130/', icon: 'linkedin' },
    { label: 'Medium', href: 'https://medium.com/@rahul.dinkar', icon: 'medium' },
  ],
} as const;
```

- [ ] **Step 3: Write `src/data/metrics.ts`**

```ts
export const metrics = [
  { value: 95, suffix: '%', label: 'faster dataset onboarding (~5 days → 3–4 hrs)' },
  { value: 3, prefix: '39→', label: 'CI jobs (infra ~4h40m → ~12 min)', display: '39→3' },
  { value: 4, prefix: '10s→', suffix: 's', label: 'initial bundle load', display: '10s→4s' },
  { value: 40, prefix: '30–', suffix: '%', label: 'faster deploys', display: '30–40%' },
] as const;
```

- [ ] **Step 4: Write `src/data/work.ts`** (verbatim from spec §3.4)

```ts
export const work = [
  {
    title: 'AI coding agents & issue→PR automation',
    problem: 'The team spent hours on the routine steps between picking up a task and opening a PR, and could not yet rely on AI tools.',
    approach: 'Wrote agent rules, a set of reusable skills, and an AGENTS.md capturing the product and domain context an agent needs. Built an automated pipeline that takes a task from issue to PR — picks it up, makes the fix, runs tests, opens the PR, and reports back.',
    impact: 'AI tools became a dependable part of everyday development; custom skills (ship-pr, figma-to-code, babysit-pr) removed repetitive work.',
    stack: ['AI coding agents', 'AGENTS.md', 'GitHub Actions'],
  },
  {
    title: 'CI/CD overhaul & Vite monorepo',
    problem: 'Run-All CI ran 39 jobs and ~4h40m of infra time; deploys were slow.',
    approach: 'Reworked the pipelines with smart lint caching and dependency reuse; moved the app into a full-stack monorepo on Vite.',
    impact: 'Run-All checks 39 → 3 jobs, infra ~4h40m → ~12 min, deploys 30–40% faster.',
    stack: ['GitHub Actions', 'Vite', 'monorepo'],
  },
  {
    title: 'Tuxedo v2.0 design system',
    problem: 'A legacy component library blocked consistent, incremental UI modernisation.',
    approach: 'Designed a modular design system that runs alongside the legacy library for gradual migration; solved theming and isolation with scoped CSS; later prototyped a shadcn/ui-based version.',
    impact: 'Teams migrated incrementally without a rewrite; consistent theming across modules.',
    stack: ['React', 'TypeScript', 'scoped CSS', 'shadcn/ui'],
  },
  {
    title: 'Unified dataset onboarding framework',
    problem: 'Onboarding a new dataset took ~5 days of cross-team effort.',
    approach: 'Standardised API contracts with design and backend and built reusable components the team kept using.',
    impact: 'Onboarding time cut ~95% — from ~5 days to 3–4 hours.',
    stack: ['React', 'TypeScript'],
  },
  {
    title: 'Screener & analytics rework',
    problem: 'The analytics layer needed flexible, no-code data exploration and shareable state.',
    approach: 'Built a configurable Screener with backend-driven filters, user-controlled columns, real-time tagging, and saved/shareable views. Added a chat interface and a visual query builder; refactored the data layer with a scalable state pattern.',
    impact: 'Non-technical users can slice data without code; Notion-style collaboration on persistent, shareable workspaces.',
    stack: ['React', 'React Query', 'TypeScript', 'AG Grid'],
  },
  {
    title: 'Performance modernization',
    problem: 'Initial bundle load averaged ~10s on data-intensive dashboards.',
    approach: 'Introduced Webpack chunking, route-based code splitting, strategic caching, and library trimming; built a dead-code detection plugin; handled Node, AG Grid, and Vite upgrades.',
    impact: 'Initial load ~10s → ~4s; improved perceived performance across dashboards.',
    stack: ['Webpack', 'Vite'],
  },
] as const;

export const projects = [
  {
    title: 'Calendar Puzzle Game',
    description: 'A drag-and-drop puzzle where players arrange pieces to solve a calendar-based board. Built with React.',
    code: 'https://github.com/rdinkar/calendar-puzzle',
    demo: 'https://rdinkar.github.io/calendar-puzzle/',
  },
  {
    title: 'Task Management App',
    description: 'A dynamic task board with multiple cards and drag-to-move tasks between them. Built with React.',
    code: 'https://github.com/rdinkar/task-management',
    demo: 'https://rdinkar.github.io/task-management',
  },
] as const;
```

- [ ] **Step 5: Write `src/data/experience.ts`**

```ts
export const roles = [
  {
    title: 'Senior Frontend Engineer (SDE-3)',
    org: 'Synaptic Inc, Gurugram',
    period: 'April 2021 – Present',
    note: 'SDE-1 → SDE-2 → SDE-3',
    points: [
      'Got AI coding agents into everyday development and automated the issue→PR pipeline.',
      'Led a CI/CD overhaul (39→3 jobs) and the migration to a Vite monorepo.',
      'Designed Tuxedo v2.0 design system and the unified dataset onboarding framework.',
      'Built the Screener + analytics rework; drove performance from ~10s to ~4s.',
      'Run biweekly knowledge-sharing sessions and mentor the team.',
    ],
  },
  {
    title: 'Associate Software Engineer',
    org: 'Innoplexus Consulting Services, Pune',
    period: 'June 2019 – April 2021',
    points: [
      'Cut manual React–Redux boilerplate with reusable abstractions.',
      'Improved reliability with smarter caching and automatic retries.',
      'Built an internal charting library used across multiple projects.',
    ],
  },
] as const;

export const internships = [
  { title: 'Software Engineer (Intern)', org: 'Innoplexus Consulting Services, Pune', period: 'May 2018 – Jul 2018' },
  { title: 'Lead Frontend (Intern)', org: 'Docconsult Services LLP, Jaipur', period: 'Jun 2017 – Aug 2017' },
] as const;
```

- [ ] **Step 6: Write `src/data/skills.ts`**

```ts
export const skillGroups = [
  { group: 'Frontend', items: ['ReactJS', 'React Native', 'Redux', 'React Query', 'D3.js', 'Webpack', 'Vite'] },
  { group: 'Languages', items: ['TypeScript', 'JavaScript'] },
  { group: 'AI & Automation', items: ['AI coding agents', 'Agent rules & skills', 'AGENTS.md', 'Task-to-PR pipelines'] },
  { group: 'Tools & Platforms', items: ['Git', 'CI/CD (GitHub Actions)', 'Testing & coverage', 'Custom ESLint', 'AG Grid', 'shadcn/ui', 'JIRA', 'Agile/Scrum'] },
  { group: 'Leadership', items: ['Technical direction', 'Cross-team work', 'Mentoring', 'Developer experience'] },
] as const;
```

- [ ] **Step 7: Write `src/data/education.ts`**

```ts
export const education = [
  { degree: 'B.Tech, Computer Science & Engineering', org: 'Indian Institute of Technology (IIT) Roorkee', period: '2015 – 2019' },
] as const;

export const achievements = [
  '2nd place, Synaptic Hackathon 2023 — social-network insights prototype.',
  'Star Player of the Team, Jan 2025 — technical leadership & system-level impact.',
  'Published a blog on state-management architecture in Synaptic Engineering.',
] as const;
```

- [ ] **Step 8: Typecheck and commit**

```bash
npx astro check --minimal 2>/dev/null || npm run build
git add -A && git commit -m "feat: add typed content data files"
```
Expected: build succeeds (data files are imported in later tasks; this step just verifies they parse).

---

### Task 4: Icon component

**Files:**
- Create: `src/components/Icon.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: `Icon.astro` with props `{ name: string; class?: string }`. Supports names: `github`, `linkedin`, `medium`, `mail`, `download`, `arrow-up-right`, `sun`, `moon`, `menu`, `command`, `search`. Renders inline `<svg>` with `aria-hidden="true"`.

- [ ] **Step 1: Write the icon component**

`src/components/Icon.astro`:
```astro
---
interface Props { name: string; class?: string }
const { name, class: cls = 'w-5 h-5' } = Astro.props;
const paths: Record<string, string> = {
  github: '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>',
  linkedin: '<path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8h4.5v13H.24V8Zm7.5 0h4.32v1.78h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V21h-4.5v-6.16c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25V21h-4.5V8Z"/>',
  medium: '<path d="M2.5 6.5c0-.2-.07-.38-.22-.52L.9 4.6V4.4h4.6l3.56 7.8 3.13-7.8H16v.2l-1.18 1.13a.35.35 0 0 0-.13.33v8.28c0 .12.05.24.13.33L16 15.6v.2h-5.9v-.2l1.22-1.19c.12-.12.12-.15.12-.33V7.4l-3.4 8.4h-.46L3.6 7.4v5.63c-.03.24.05.48.22.65l1.6 1.92v.2H.8v-.2l1.6-1.92a.75.75 0 0 0 .2-.65V6.5Z"/>',
  mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm.4 2 8.6 5.6L20.6 7H3.4Z" fill="currentColor"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  sun: '<path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66 5.66 1.41 1.41M4.93 4.93l1.41 1.41m0 11.32-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  command: '<path d="M15 6a3 3 0 1 1 3 3h-3V6Zm0 3H9v6h6V9Zm0 6h3a3 3 0 1 1-3 3v-3Zm-6 0v3a3 3 0 1 1-3-3h3Zm0-6H6a3 3 0 1 1 3-3v3Z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  search: '<path d="m21 21-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};
const svg = paths[name] ?? '';
---
<svg viewBox="0 0 24 24" class={cls} aria-hidden="true" fill="currentColor" set:html={svg} />
```

- [ ] **Step 2: Build to verify no syntax errors**

```bash
npm run build && echo OK
```
Expected: `OK` (component not yet used; just compiles).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: inline-SVG Icon component"
```

---

### Task 5: Nav + ThemeToggle island

**Files:**
- Create: `src/components/Nav.astro`, `src/components/ThemeToggle.astro`
- Modify: `src/pages/index.astro` (mount Nav)

**Interfaces:**
- Consumes: `sections` from `src/data/nav.ts`; `Icon.astro`.
- Produces: sticky top nav with anchor links, a `⌘K` hint button (`id="palette-open"`, used in Task 11), mobile menu toggle, and the theme toggle. Scroll-spy adds `aria-current="true"` to the active link.

- [ ] **Step 1: Write ThemeToggle**

`src/components/ThemeToggle.astro`:
```astro
---
import Icon from './Icon.astro';
---
<button id="theme-toggle" type="button" aria-label="Toggle color theme"
  class="grid h-11 w-11 place-items-center rounded-md text-muted hover:text-ink">
  <Icon name="sun" class="hidden w-5 h-5 dark:block" />
  <Icon name="moon" class="block w-5 h-5 dark:hidden" />
</button>
<script is:inline>
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 2: Write Nav**

`src/components/Nav.astro`:
```astro
---
import { sections } from '../data/nav.ts';
import Icon from './Icon.astro';
import ThemeToggle from './ThemeToggle.astro';
---
<header class="sticky top-0 z-40 border-b border-white/5 bg-canvas/80 backdrop-blur">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
    <a href="#top" class="font-mono text-sm font-semibold text-ink">RD<span class="text-accent">.</span></a>
    <ul class="hidden gap-6 md:flex" id="navlinks">
      {sections.map((s) => (
        <li><a href={`#${s.id}`} data-nav={s.id} class="text-sm text-muted transition-colors hover:text-ink">{s.label}</a></li>
      ))}
    </ul>
    <div class="flex items-center gap-1">
      <button id="palette-open" type="button" aria-label="Open command palette"
        class="hidden items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 font-mono text-xs text-muted hover:text-ink md:flex">
        <Icon name="command" class="h-3.5 w-3.5" /> K
      </button>
      <ThemeToggle />
      <button id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"
        class="grid h-11 w-11 place-items-center rounded-md text-muted md:hidden">
        <Icon name="menu" class="h-6 w-6" />
      </button>
    </div>
  </nav>
  <ul id="mobile-menu" hidden class="border-t border-white/5 px-6 py-2 md:hidden">
    {sections.map((s) => (
      <li><a href={`#${s.id}`} class="block py-2 text-muted hover:text-ink">{s.label}</a></li>
    ))}
  </ul>
</header>
<script is:inline>
  const menu = document.getElementById('mobile-menu');
  const mt = document.getElementById('menu-toggle');
  mt.addEventListener('click', () => {
    const open = menu.hasAttribute('hidden');
    if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
    mt.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') { menu.setAttribute('hidden',''); mt.setAttribute('aria-expanded','false'); } });
  const links = [...document.querySelectorAll('[data-nav]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        const a = links.find((l) => l.dataset.nav === en.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
</script>
<style>
  [data-nav][aria-current='true'] { color: rgb(var(--text)); }
  [data-nav][aria-current='true']::after { content: ''; display: block; height: 2px; background: rgb(var(--accent)); }
</style>
```

- [ ] **Step 3: Mount Nav and add `#top`/section anchors placeholder in index**

`src/pages/index.astro` (replace body):
```astro
---
import '../styles/global.css';
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
---
<Base title="Rahul Dinkar — Senior Frontend Engineer" description="Staff-level frontend engineer focused on systems, developer experience, and AI-assisted development.">
  <a id="top"></a>
  <Nav />
  <main class="mx-auto max-w-5xl px-6">
    <section id="work" class="py-20"><h2>Work</h2></section>
    <section id="about" class="py-20"><h2>About</h2></section>
    <section id="experience" class="py-20"><h2>Experience</h2></section>
    <section id="skills" class="py-20"><h2>Skills</h2></section>
    <section id="writing" class="py-20"><h2>Writing</h2></section>
    <section id="contact" class="py-20"><h2>Contact</h2></section>
  </main>
</Base>
```

- [ ] **Step 4: Build and verify nav renders**

```bash
npm run build && grep -q 'id="theme-toggle"' dist/index.html && grep -q 'data-nav="work"' dist/index.html && echo OK
```
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: sticky nav, mobile menu, scroll-spy, theme toggle"
```

---

### Task 6: Count-up logic (tested) + Hero + Impact band

**Files:**
- Create: `src/lib/animate.js`, `tests/animate.test.js`, `src/components/Hero.astro`, `src/components/ImpactBand.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `profile`, `metrics`, `Icon`.
- Produces: `animate.js` exports `easeOutCubic(t: number): number` and `countUpFrames(target: number, steps: number): number[]` (length `steps`, last element `=== target`, monotonic non-decreasing). Used by the ImpactBand island.

- [ ] **Step 1: Write the failing test**

`tests/animate.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { easeOutCubic, countUpFrames } from '../src/lib/animate.js';

test('easeOutCubic maps 0→0 and 1→1', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
});

test('countUpFrames ends exactly at target and is non-decreasing', () => {
  const f = countUpFrames(95, 30);
  assert.equal(f.length, 30);
  assert.equal(f.at(-1), 95);
  for (let i = 1; i < f.length; i++) assert.ok(f[i] >= f[i - 1]);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — cannot find module `../src/lib/animate.js`.

- [ ] **Step 3: Implement `src/lib/animate.js`**

```js
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function countUpFrames(target, steps) {
  const frames = [];
  for (let i = 1; i <= steps; i++) {
    const v = Math.round(target * easeOutCubic(i / steps));
    frames.push(v);
  }
  frames[frames.length - 1] = target;
  return frames;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS (2 tests).

- [ ] **Step 5: Write Hero**

`src/components/Hero.astro`:
```astro
---
import { profile } from '../data/profile.ts';
import Icon from './Icon.astro';
const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // normalized (no trailing slash)
---
<section class="pt-24 pb-12 md:pt-32">
  <p class="font-mono text-sm text-accent">{profile.subhead}</p>
  <h1 class="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">{profile.headline}</h1>
  <p class="mt-4 font-mono text-sm text-muted">{profile.location}</p>
  <div class="mt-8 flex flex-wrap items-center gap-3">
    <a href="#work" class="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-canvas">View work</a>
    <a href={`${base}/resume.pdf`} download class="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent">
      <Icon name="download" class="h-4 w-4" /> Résumé
    </a>
    <a href={`mailto:${profile.email}`} class="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent">
      <Icon name="mail" class="h-4 w-4" /> Email
    </a>
  </div>
  <div class="mt-8 flex gap-4">
    {profile.socials.map((s) => (
      <a href={s.href} target="_blank" rel="noopener" aria-label={s.label} class="text-muted hover:text-accent">
        <Icon name={s.icon} class="h-5 w-5" />
      </a>
    ))}
  </div>
</section>
```

- [ ] **Step 6: Write ImpactBand island**

`src/components/ImpactBand.astro`:
```astro
---
import { metrics } from '../data/metrics.ts';
---
<section aria-label="Impact highlights" class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/5 md:grid-cols-4">
  {metrics.map((m) => (
    <div class="bg-canvas p-5">
      <div class="font-mono text-3xl font-bold text-accent"
        data-metric data-value={m.value} data-prefix={m.prefix ?? ''} data-suffix={m.suffix ?? ''} data-display={m.display ?? ''}>
        {m.display ?? `${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`}
      </div>
      <p class="mt-2 text-sm text-muted">{m.label}</p>
    </div>
  ))}
</section>
<script>
  import { countUpFrames } from '../lib/animate.js';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-metric]');
  const run = (el) => {
    const target = Number(el.dataset.value);
    const prefix = el.dataset.prefix, suffix = el.dataset.suffix;
    if (reduce) return;
    const frames = countUpFrames(target, 40);
    let i = 0;
    const tick = () => { el.textContent = `${prefix}${frames[i]}${suffix}`; if (++i < frames.length) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
</script>
```
Note: the initial rendered text already shows the final value (accessible + no-JS fallback); the script animates from the eased frames when in view.

- [ ] **Step 7: Mount Hero + ImpactBand in index**

Replace the placeholder `#work` region: add before `<main>` content a hero, and put ImpactBand right after Hero. In `src/pages/index.astro` add imports `import Hero from '../components/Hero.astro'; import ImpactBand from '../components/ImpactBand.astro';` and render:
```astro
  <main class="mx-auto max-w-5xl px-6">
    <Hero />
    <ImpactBand />
    <section id="work" class="py-20"><h2>Work</h2></section>
    <!-- remaining placeholders unchanged for now -->
```

- [ ] **Step 8: Build + test**

```bash
npm test && npm run build && grep -q 'data-metric' dist/index.html && echo OK
```
Expected: tests PASS and `OK`.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: hero + animated impact band with tested count-up logic"
```

---

### Task 7: About, Skills, Writing, Education, Contact, Footer

**Files:**
- Create: `src/components/About.astro`, `src/components/Skills.astro`, `src/components/Writing.astro`, `src/components/Education.astro`, `src/components/Contact.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `skillGroups`, `education`, `achievements`, `profile`, `Icon`.
- Produces: the six lower-complexity sections. Each top-level section keeps its stable `id` (`about`, `skills`, `writing`, `contact`) for scroll-spy; education has `id="education"` (not in nav) and writing/contact per nav.

- [ ] **Step 1: Write a shared section-heading pattern (About)**

`src/components/About.astro`:
```astro
---
---
<section id="about" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">01 / About</p>
  <div class="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
    <p>I like building the systems and tooling that help a team move faster, not just shipping features.</p>
    <p>Over the past couple of years most of my work has helped everyone around me: getting AI tools into our everyday development, making the codebase safe for people outside core engineering to contribute to, and automating the repetitive steps between picking up a task and opening a PR.</p>
    <p>I still care a lot about performance and clean architecture, and I spend a good part of my time mentoring engineers and improving how the team works.</p>
  </div>
</section>
```

- [ ] **Step 2: Write Skills**

`src/components/Skills.astro`:
```astro
---
import { skillGroups } from '../data/skills.ts';
---
<section id="skills" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">04 / Skills</p>
  <div class="mt-8 grid gap-8 md:grid-cols-2">
    {skillGroups.map((g) => (
      <div>
        <h3 class="font-mono text-sm text-ink">{g.group}</h3>
        <ul class="mt-3 flex flex-wrap gap-2">
          {g.items.map((it) => (
            <li class="rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted">{it}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Write Writing**

`src/components/Writing.astro`:
```astro
---
import Icon from './Icon.astro';
---
<section id="writing" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">05 / Writing</p>
  <p class="mt-6 max-w-2xl text-lg text-muted">I write about frontend architecture, React patterns, and developer experience on Medium.</p>
  <a href="https://medium.com/@rahul.dinkar" target="_blank" rel="noopener"
    class="mt-6 inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent">
    Read on Medium <Icon name="arrow-up-right" class="h-4 w-4" />
  </a>
</section>
```

- [ ] **Step 4: Write Education**

`src/components/Education.astro`:
```astro
---
import { education, achievements } from '../data/education.ts';
---
<section id="education" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">06 / Education & Recognition</p>
  <div class="mt-8 grid gap-8 md:grid-cols-2">
    <div>
      {education.map((e) => (
        <div><h3 class="text-ink">{e.degree}</h3><p class="font-mono text-sm text-muted">{e.org} · {e.period}</p></div>
      ))}
    </div>
    <ul class="space-y-2 text-muted">
      {achievements.map((a) => (<li class="flex gap-2"><span class="text-accent">▹</span><span>{a}</span></li>))}
    </ul>
  </div>
</section>
```

- [ ] **Step 5: Write Contact + Footer**

`src/components/Contact.astro`:
```astro
---
import { profile } from '../data/profile.ts';
import Icon from './Icon.astro';
---
<section id="contact" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">07 / Contact</p>
  <h2 class="mt-6 text-3xl font-bold">Let's build something.</h2>
  <p class="mt-4 max-w-xl text-muted">{profile.location}. Open to staff-level frontend, systems, and developer-experience roles.</p>
  <div class="mt-6 flex flex-wrap gap-3">
    <a href={`mailto:${profile.email}`} class="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-canvas"><Icon name="mail" class="h-4 w-4" /> {profile.email}</a>
    {profile.socials.map((s) => (
      <a href={s.href} target="_blank" rel="noopener" class="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent"><Icon name={s.icon} class="h-4 w-4" /> {s.label}</a>
    ))}
  </div>
</section>
```

`src/components/Footer.astro`:
```astro
---
---
<footer class="border-t border-white/5 py-8">
  <p class="font-mono text-xs text-muted">© <span id="year"></span> Rahul Dinkar. Built with Astro.</p>
  <script is:inline>document.getElementById('year').textContent = new Date().getFullYear();</script>
</footer>
```

- [ ] **Step 6: Mount all sections in index (order per spec)**

Update `src/pages/index.astro` imports and body so `<main>` contains, in order: `Hero`, `ImpactBand`, `Work` (Task 8, placeholder for now), `About`, `Experience` (Task 8), `Skills`, `Writing`, `Education`, `Contact`; then `Footer` after `</main>`. Keep placeholder `<section id="work">` / `<section id="experience">` until Task 8.

- [ ] **Step 7: Build and verify**

```bash
npm run build && grep -q 'id="contact"' dist/index.html && grep -q 'AGENTS.md' dist/index.html; echo "skills present: $?"
```
Expected: build OK; `id="contact"` present.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: about, skills, writing, education, contact, footer sections"
```

---

### Task 8: Work section + Experience timeline

**Files:**
- Create: `src/components/Work.astro`, `src/components/Experience.astro`
- Modify: `src/pages/index.astro` (replace placeholders)

**Interfaces:**
- Consumes: `work`, `projects` from `work.ts`; `roles`, `internships` from `experience.ts`; `Icon`.
- Produces: `#work` section (case-study cards + personal-project cards) and `#experience` timeline.

- [ ] **Step 1: Write Work**

`src/components/Work.astro`:
```astro
---
import { work, projects } from '../data/work.ts';
import Icon from './Icon.astro';
---
<section id="work" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">02 / Selected work</p>
  <div class="mt-8 grid gap-4">
    {work.map((w, i) => (
      <article class="reveal rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:border-accent/40">
        <div class="flex items-baseline gap-3">
          <span class="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
          <h3 class="text-xl font-semibold text-ink">{w.title}</h3>
        </div>
        <dl class="mt-4 space-y-2 text-sm">
          <div><dt class="inline font-mono text-accent">Problem — </dt><dd class="inline text-muted">{w.problem}</dd></div>
          <div><dt class="inline font-mono text-accent">Approach — </dt><dd class="inline text-muted">{w.approach}</dd></div>
          <div><dt class="inline font-mono text-accent">Impact — </dt><dd class="inline text-ink">{w.impact}</dd></div>
        </dl>
        <ul class="mt-4 flex flex-wrap gap-2">
          {w.stack.map((s) => (<li class="rounded border border-white/10 px-2 py-0.5 font-mono text-xs text-muted">{s}</li>))}
        </ul>
      </article>
    ))}
  </div>

  <h3 class="mt-12 font-mono text-sm text-muted">Personal projects</h3>
  <div class="mt-4 grid gap-4 md:grid-cols-2">
    {projects.map((p) => (
      <article class="reveal rounded-lg border border-white/10 bg-white/5 p-6">
        <h4 class="text-lg font-semibold text-ink">{p.title}</h4>
        <p class="mt-2 text-sm text-muted">{p.description}</p>
        <div class="mt-4 flex gap-4 font-mono text-sm">
          <a href={p.code} target="_blank" rel="noopener" class="flex items-center gap-1 text-muted hover:text-accent"><Icon name="github" class="h-4 w-4" /> Code</a>
          <a href={p.demo} target="_blank" rel="noopener" class="flex items-center gap-1 text-muted hover:text-accent"><Icon name="arrow-up-right" class="h-4 w-4" /> Live</a>
        </div>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Write Experience**

`src/components/Experience.astro`:
```astro
---
import { roles, internships } from '../data/experience.ts';
---
<section id="experience" class="border-t border-white/5 py-20">
  <p class="font-mono text-sm text-accent">03 / Experience</p>
  <ol class="mt-8 space-y-8 border-l border-white/10 pl-6">
    {roles.map((r) => (
      <li class="relative">
        <span class="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"></span>
        <div class="flex flex-wrap items-baseline justify-between gap-x-3">
          <h3 class="text-lg font-semibold text-ink">{r.title}</h3>
          <span class="font-mono text-xs text-muted">{r.period}</span>
        </div>
        <p class="font-mono text-sm text-muted">{r.org}{r.note ? ` · ${r.note}` : ''}</p>
        <ul class="mt-3 space-y-1.5 text-sm text-muted">
          {r.points.map((p) => (<li class="flex gap-2"><span class="text-accent">▹</span><span>{p}</span></li>))}
        </ul>
      </li>
    ))}
  </ol>
  <p class="mt-8 font-mono text-sm text-muted">Internships</p>
  <ul class="mt-2 space-y-1 text-sm text-muted">
    {internships.map((i) => (<li>{i.title} · {i.org} · <span class="font-mono text-xs">{i.period}</span></li>))}
  </ul>
</section>
```

- [ ] **Step 3: Replace placeholders in index**

In `src/pages/index.astro`, import `Work` and `Experience` and replace the two placeholder `<section>` blocks with `<Work />` and `<Experience />` in the correct order (Work after ImpactBand; Experience after About).

- [ ] **Step 4: Build and verify content**

```bash
npm run build
grep -q 'Selected work' dist/index.html && grep -q '39 → 3\|39→3' dist/index.html; echo done
grep -c 'reveal' dist/index.html
```
Expected: build OK; work + experience content present.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: selected work cards and experience timeline"
```

---

### Task 9: Command palette (tested filter) island

**Files:**
- Create: `src/lib/commands.js`, `tests/commands.test.js`, `src/components/CommandPalette.astro`
- Modify: `src/pages/index.astro` (mount palette)

**Interfaces:**
- Consumes: `sections` (nav), `profile`.
- Produces: `commands.js` exports `filterCommands(commands, query)` where `commands: {label,keywords?}[]` → returns items whose `label`+`keywords` contain all whitespace-split query tokens (case-insensitive). Empty query returns all.

- [ ] **Step 1: Write the failing test**

`tests/commands.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterCommands } from '../src/lib/commands.js';

const cmds = [
  { label: 'Go to Work' }, { label: 'Copy email', keywords: 'contact mail' }, { label: 'Open GitHub' },
];

test('empty query returns all', () => {
  assert.equal(filterCommands(cmds, '').length, 3);
});
test('matches label case-insensitively', () => {
  assert.deepEqual(filterCommands(cmds, 'work').map(c => c.label), ['Go to Work']);
});
test('matches keywords and requires all tokens', () => {
  assert.deepEqual(filterCommands(cmds, 'mail').map(c => c.label), ['Copy email']);
  assert.equal(filterCommands(cmds, 'open git').length, 1);
  assert.equal(filterCommands(cmds, 'open work').length, 0);
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test
```
Expected: FAIL — cannot find `../src/lib/commands.js`.

- [ ] **Step 3: Implement `src/lib/commands.js`**

```js
export function filterCommands(commands, query) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return commands.slice();
  return commands.filter((c) => {
    const hay = `${c.label} ${c.keywords ?? ''}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npm test
```
Expected: PASS (all tests across both test files).

- [ ] **Step 5: Write CommandPalette island**

`src/components/CommandPalette.astro`:
```astro
---
import { sections } from '../data/nav.ts';
import { profile } from '../data/profile.ts';
const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // normalized (no trailing slash)
const commands = [
  ...sections.map((s) => ({ label: `Go to ${s.label}`, href: `#${s.id}`, keywords: 'section jump' })),
  { label: 'Download résumé', href: `${base}/resume.pdf`, keywords: 'cv pdf', download: true },
  { label: 'Copy email', action: 'copy-email', keywords: 'contact mail' },
  ...profile.socials.map((s) => ({ label: `Open ${s.label}`, href: s.href, external: true, keywords: 'social link' })),
];
---
<div id="palette" hidden class="fixed inset-0 z-50">
  <div id="palette-backdrop" class="absolute inset-0 bg-black/60"></div>
  <div role="dialog" aria-modal="true" aria-label="Command palette"
    class="absolute left-1/2 top-24 w-[92%] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl">
    <input id="palette-input" type="text" placeholder="Type a command…" autocomplete="off"
      class="w-full bg-transparent px-4 py-3 text-ink outline-none placeholder:text-muted" />
    <ul id="palette-list" class="max-h-72 overflow-y-auto border-t border-white/5"></ul>
  </div>
</div>
<script define:vars={{ commands, email: profile.email }}>
  import { filterCommands } from '../lib/commands.js';
  const palette = document.getElementById('palette');
  const input = document.getElementById('palette-input');
  const list = document.getElementById('palette-list');
  let active = 0, current = commands;
  const open = () => { palette.removeAttribute('hidden'); input.value=''; render(commands); input.focus(); };
  const close = () => palette.setAttribute('hidden','');
  const run = (c) => {
    close();
    if (c.action === 'copy-email') { navigator.clipboard?.writeText(email); return; }
    if (c.external) { window.open(c.href, '_blank', 'noopener'); return; }
    if (c.download) { const a=document.createElement('a'); a.href=c.href; a.download=''; a.click(); return; }
    if (c.href) location.hash = c.href.replace('#','#');
  };
  const render = (items) => {
    current = items; active = 0;
    list.innerHTML = items.map((c,i) => `<li data-i="${i}" class="cursor-pointer px-4 py-2.5 text-sm ${i===0?'bg-white/5 text-ink':'text-muted'}">${c.label}</li>`).join('');
  };
  const setActive = (i) => {
    active = (i + current.length) % current.length;
    [...list.children].forEach((li,idx) => li.className = `cursor-pointer px-4 py-2.5 text-sm ${idx===active?'bg-white/5 text-ink':'text-muted'}`);
  };
  input.addEventListener('input', () => render(filterCommands(commands, input.value)));
  list.addEventListener('click', (e) => { const li = e.target.closest('[data-i]'); if (li) run(current[+li.dataset.i]); });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hasAttribute('hidden') ? open() : close(); return; }
    if (palette.hasAttribute('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active+1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active-1); }
    if (e.key === 'Enter') { e.preventDefault(); if (current[active]) run(current[active]); }
  });
  document.getElementById('palette-open')?.addEventListener('click', open);
  document.getElementById('palette-backdrop').addEventListener('click', close);
</script>
```

- [ ] **Step 6: Mount palette in index (once, near end of body inside `<Base>`)**

Add `import CommandPalette from '../components/CommandPalette.astro';` and render `<CommandPalette />` after `<Footer />`.

- [ ] **Step 7: Build + test**

```bash
npm test && npm run build && grep -q 'id="palette"' dist/index.html && echo OK
```
Expected: tests PASS, `OK`.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: ⌘K command palette with tested filter logic"
```

---

### Task 10: Scroll-reveal motion + reduced-motion guard

**Files:**
- Create: `src/components/Reveal.astro` (script-only helper) OR add script to index
- Modify: `src/styles/global.css`, `src/pages/index.astro`

**Interfaces:**
- Consumes: elements with class `reveal` (already added on Work cards; add to other section wrappers).
- Produces: `.reveal` fades/translates in on scroll; disabled under reduced motion.

- [ ] **Step 1: Add reveal CSS**

Append to `src/styles/global.css`:
```css
.reveal { opacity: 0; transform: translateY(12px); transition: opacity .5s ease, transform .5s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }
```

- [ ] **Step 2: Add reveal observer script (inline in index, once)**

In `src/pages/index.astro`, add before `</Base>`:
```astro
<script is:inline>
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }
</script>
```

- [ ] **Step 3: Add `reveal` class to major section wrappers** (About text block, Skills groups grid, Experience `<ol>`, Contact block). Keep it tasteful — one reveal per section, not per element.

- [ ] **Step 4: Build and verify**

```bash
npm run build && grep -q 'is-visible' dist/assets/*.css 2>/dev/null; grep -q 'reveal' dist/index.html && echo OK
```
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: scroll-reveal motion with reduced-motion guard"
```

---

### Task 11: Static assets — favicon, robots, OG image, résumé refresh

**Files:**
- Create: `public/favicon.svg`, `public/robots.txt`, `public/og.png`
- Modify/replace: `public/resume.pdf` (move current repo-root `resume.pdf` into `public/`, refreshed with newest résumé)

**Interfaces:**
- Consumes: nothing.
- Produces: assets referenced by `Base.astro` (`favicon.svg`, `og.png`) and download links (`resume.pdf`). `robots.txt` allows all + points to sitemap.

- [ ] **Step 1: Move & refresh résumé**

```bash
git rm resume.pdf
cp "/Users/rahul.dinkar/Downloads/resume.pdf" public/resume.pdf
```
(Newest résumé = the Staff-Engineer / AI-automation version.)

- [ ] **Step 2: Create favicon**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0d9488"/><text x="16" y="22" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle" fill="#fff">RD</text></svg>
```

- [ ] **Step 3: Create robots.txt**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://rdinkar.github.io/portfolio/sitemap-index.xml
```

- [ ] **Step 4: Generate OG image (1200×630)**

Create `public/og.png` as a 1200×630 on-brand card (dark canvas, name + headline + accent rule). Generate it by writing an SVG and converting, or hand-author a PNG. If no converter is available, create the OG as a static SVG `public/og.svg` and point the meta tags at `og.svg` instead. Command using the Node `sharp` package if present, else fallback to committing an SVG:
```bash
node -e "const fs=require('fs');fs.writeFileSync('public/og.svg','<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"630\"><rect width=\"1200\" height=\"630\" fill=\"#09090b\"/><text x=\"80\" y=\"300\" fill=\"#2dd4bf\" font-family=\"monospace\" font-size=\"28\">Rahul Dinkar</text><text x=\"80\" y=\"370\" fill=\"#f4f4f5\" font-family=\"sans-serif\" font-size=\"56\" font-weight=\"700\">Systems &amp; Developer Experience</text></svg>');"
```
If using `og.svg`, update `Base.astro` `og` variable to `og.svg`.

- [ ] **Step 5: Build and verify assets copied**

```bash
npm run build && ls dist/resume.pdf dist/favicon.svg dist/robots.txt && echo OK
```
Expected: files exist, `OK`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: favicon, robots, OG image, refreshed résumé in public/"
```

---

### Task 12: Deploy workflow + Pages settings + README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the built `dist/`.
- Produces: an Actions workflow that builds and deploys to GitHub Pages on push to `main`.

- [ ] **Step 1: Write the workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update README**

Replace `README.md` with a short description: what the site is, tech (Astro + Tailwind), `npm run dev` / `npm run build` / `npm test`, and that it auto-deploys to `https://rdinkar.github.io/portfolio/` via Actions.

- [ ] **Step 3: Verify workflow YAML parses locally**

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/deploy.yml','utf8'); if(!y.includes('deploy-pages')) throw new Error('missing'); console.log('OK')"
```
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ci: GitHub Actions build+deploy to Pages; update README"
```

- [ ] **Step 5: One-time Pages source switch (manual, requires repo admin)**

After the PR merges to `main`, switch Pages build type from `legacy` to `workflow`:
```bash
gh api -X PUT repos/rdinkar/portfolio/pages -f build_type=workflow
```
(Or repo Settings → Pages → Source → "GitHub Actions".) Document this in the PR description as a required manual step.

---

### Task 13: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full local verification**

```bash
npm ci && npm test && npm run build && npm run preview &
```
Then load `http://localhost:4321/portfolio/` and confirm: hero renders, metrics count up, theme toggle persists across reload, `⌘K` opens palette and navigates, mobile menu works at 375px width, all external links open, résumé downloads.

- [ ] **Step 2: SEO/a11y checks**

```bash
grep -q 'application/ld+json' dist/index.html
grep -q 'og:image' dist/index.html
test -f dist/sitemap-index.xml && echo "sitemap OK"
```
Manually run Lighthouse (Chrome DevTools) against the preview; confirm ≥ 95 in all four categories, and check color-contrast + keyboard-only navigation.

- [ ] **Step 3: Link + base-path audit**

Confirm no asset uses a root-absolute path that ignores `/portfolio/` base (search built HTML for `href="/` and `src="/` that aren't `/portfolio/`).
```bash
grep -oE '(href|src)="/[^"]*"' dist/index.html | grep -v '/portfolio/' || echo "no bad absolute paths"
```
Expected: `no bad absolute paths`.

- [ ] **Step 4: Open the PR**

Push the branch and open a PR to `main` summarizing the redesign, listing the required manual Pages-source switch (Task 12 Step 5), and noting Lighthouse results.

---

## Self-Review

**Spec coverage:**
- §2 design direction → Tasks 1 (tokens/theme), 5 (toggle), 6/8 (sections), 9 (palette), 10 (motion). ✓
- §3 IA sections 1–9 → Hero/ImpactBand (T6), Work (T8), About/Skills/Writing/Education/Contact/Footer (T7), Experience (T8). ✓
- §4 content data → T3. ✓
- §5 architecture (Astro islands, lib logic) → T1, T6, T9. ✓
- §6 SEO (meta, OG, JSON-LD, sitemap, robots) → T2, T11, T12 (sitemap integration in T1 config). ✓
- §7 perf/a11y (self-hosted/no-CDN, reduced-motion, focus, contrast) → T1 (focus/tokens), T10 (motion), T13 (audit). Fonts: config references Inter/JetBrains Mono; if not self-hosted, the `system-ui`/`ui-monospace` fallbacks in `tailwind.config.mjs` apply — acceptable, no CDN request. ✓
- §8 deploy (base `/portfolio`, Actions, résumé download) → T1 (base), T11 (résumé), T12 (workflow + Pages switch). ✓

**Placeholder scan:** No "TBD/TODO/implement later." OG-image step gives a concrete SVG fallback. Index-composition steps (T5/6/7/8/9) describe exact imports and render order rather than restating full file each time — the full `index.astro` is built up incrementally and its final composition is unambiguous. ✓

**Type consistency:** Data exports in T3 match consumers — `filterCommands(commands, query)` (T9) matches test + island; `countUpFrames(target, steps)` / `easeOutCubic(t)` (T6) match test + island; `metrics` fields (`value/prefix/suffix/display/label`) match ImpactBand; `work`/`projects`/`roles`/`internships`/`skillGroups`/`education`/`achievements`/`sections` shapes match their components. ✓

**Note for executor:** Fonts are declared in Tailwind config with system fallbacks. Self-hosting Inter/JetBrains Mono subsets is a nice-to-have; if added, place woff2 in `public/fonts/` and add `@font-face` + `<link rel="preload">` in `Base.astro`. Not doing so still satisfies the no-CDN constraint via fallbacks.
