# Ritik Tiwari | Software Engineer

[![Project Status: Active](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React Doctor](https://www.react.doctor/share/badge?p=portfolio&s=100)](https://www.react.doctor/share?p=portfolio&s=100)
[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-95%2B-success?style=flat-square&logo=lighthouse)](https://ritiktiwari.com)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-BC52EE?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen?logo=node.js)](https://nodejs.org/en)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D10.27.0-F69220?logo=pnpm)](https://pnpm.io)

The third iteration of [ritiktiwari.com](https://ritiktiwari.com). Migrated from Next.js to Astro to ship zero runtime JavaScript by default and achieve maximum Lighthouse scores across all categories.

---

## Tech Stack

| Layer      | Technology                                                                   |
| ---------- | ---------------------------------------------------------------------------- |
| Framework  | [Astro 5](https://astro.build/) — Island Architecture                        |
| UI         | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)                       |
| Blog       | Astro Content Collections + MDX                                              |
| Linting    | ESLint (typescript-eslint) + Prettier                                        |
| Git Hooks  | Husky + commitlint (Conventional Commits)                                    |
| Deployment | [Vercel](https://vercel.com/)                                                |

---

## Why Astro?

After two iterations with Next.js, the portfolio was still shipping a full React runtime even though almost nothing needed client-side hydration. Migrating to Astro allowed:

- **Zero-JS by default** — React only loads for interactive islands (theme toggle, modals, smooth scroll)
- **Faster TTI** — Static HTML is served immediately, no hydration waterfall
- **Content Collections** — Type-safe MDX for the blog with built-in frontmatter validation
- **Automated Sitemap** — via `@astrojs/sitemap` at build time

---

## Project Structure

```
portfolio/
├── src/
│   ├── assets/                # Static assets
│   ├── components/            # React islands & Astro components
│   │   ├── modal/             # Certificate viewer dialog
│   │   ├── sections/          # Home page sections (About, Experience, Projects…)
│   │   └── ui/                # shadcn/ui primitives
│   ├── constants/             # Images, nav links, social links
│   ├── content/               # Achievements, blog, education, experience, projects
│   ├── hooks/                 # custom react hooks
│   ├── layouts/               # Base HTML shell with SEO meta + analytics
│   ├── lib/                   # Utilities
│   ├── pages/                 # File-based routing
│   ├── styles/                # Global CSS + Tailwind imports
│   └── content.config.ts      # Blog content configuration
│
├── astro.config.ts            # Astro configuration
├── components.json            # Components configuration
├── LICENSE                    # License file
└── package.json               # Package configuration
```

---

## License

Source code is available under the [MIT License](./LICENSE) for reference and learning.  
**Design, written content, and all media assets are not licensed for reuse.**  
See [`LICENSE`](./LICENSE) for the full terms.

---

## Repo Activity

![Activity](https://repobeats.axiom.co/api/embed/47d5aca41b6fc1f8365425a2e57f8cb8657dfb90.svg "Analytics image")
