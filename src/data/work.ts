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
