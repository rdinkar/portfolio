export const metrics = [
  { value: 95, suffix: '%', label: 'faster dataset onboarding (~5 days → 3–4 hrs)' },
  { value: 3, prefix: '39→', label: 'CI jobs (infra ~4h40m → ~12 min)', display: '39→3' },
  { value: 4, prefix: '10s→', suffix: 's', label: 'initial bundle load', display: '10s→4s' },
  { value: 40, prefix: '30–', suffix: '%', label: 'faster deploys', display: '30–40%' },
] as const;
