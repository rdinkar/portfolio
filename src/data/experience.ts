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
