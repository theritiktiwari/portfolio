# Ritik Tiwari | Software Engineer

[![Project Status: Active](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React Doctor](https://www.react.doctor/share/badge?p=portfolio&s=99&w=4&f=1)](https://www.react.doctor/share?p=portfolio&s=99&w=4&f=1)
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
├── .agents/
│   └── skills/			   # Skills for AI agents
│
├── .husky/
│   ├── commit-msg         # Commit message hook (enforces conventional commits)
│   └── pre-commit         # Pre-commit hook (runs lint-staged)
│
├── .vscode/
│   ├── extensions.json    # Recommended VS Code extensions
│   └── settings.json      # VS Code workspace settings
│
├── public/                # Static assets (favicon, resume, OG image)
├── src/
│   ├── components/        # React islands & Astro components
│   │   ├── modal/         # Certificate viewer dialog
│   │   ├── sections/      # Home page sections (About, Experience, Projects…)
│   │   └── ui/            # shadcn/ui primitives
│   │
│   ├── content/           # Achievements, blog, education, experience, projects
│   ├── constants/         # Images, nav links, social links
│   ├── hooks/             # custom react hooks
│   ├── layouts/           # Base HTML shell with SEO meta + analytics
│   ├── lib/               # Utilities
│   ├── pages/             # File-based routing
│   └── styles/            # Global CSS + Tailwind imports
│
├── .editorconfig          # Editor settings
├── .gitignore             # Git ignore rules
├── .lintstagedrc.js       # Lint-staged configuration
├── .npmrc                 # Enforces pnpm
├── .nvmrc                 # Enforces Node version
├── .prettierignore        # Prettier ignore rules
├── .prettierrc.js         # Prettier configuration
├── astro.config.ts        # Astro configuration
├── commitlint.config.js   # Commitlint configuration
├── components.json        # Components configuration
├── eslint.config.mjs      # ESLint configuration
├── LICENSE                # License file
├── package.json           # Package configuration
├── pnpm-lock.json         # Package lockfile
├── pnpm-workspace.yaml    # pnpm workspace configuration
├── README.md              # Project documentation
├── skills-lock.json       # AI agent skills lockfile
└── tsconfig.json          # TypeScript configuration
```

---

## License

Source code is available under the [MIT License](./LICENSE) for reference and learning.  
**Design, written content, and all media assets are not licensed for reuse.**  
See [`LICENSE`](./LICENSE) for the full terms.
