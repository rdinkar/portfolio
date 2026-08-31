# Rahul Dinkar — Portfolio

Personal portfolio site for Rahul Dinkar, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

Live at: [https://rdinkar.github.io/portfolio/](https://rdinkar.github.io/portfolio/)

## Tech Stack

- [Astro](https://astro.build) — static site generator
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- `@astrojs/sitemap` — sitemap generation

## Local Development

```bash
npm install       # install dependencies
npm run dev       # start the local dev server
npm run build     # build the production site to dist/
npm test          # run the test suite
```

## Deployment

The site auto-deploys to [https://rdinkar.github.io/portfolio/](https://rdinkar.github.io/portfolio/) via the GitHub Actions workflow in `.github/workflows/deploy.yml` on every push to `main`.

> **One-time repo setup:** for the workflow to publish successfully, the repository's GitHub Pages source must be set to **"GitHub Actions"** (build type `workflow`) under Settings → Pages → Source — this only needs to be done once.
