---
title: "Lessons From Shipping Production Monorepos"
description: "After shipping multiple production systems in pnpm workspaces — spanning web, mobile, APIs, CLIs and shared packages — here are the lessons I wish I had before starting."
pubDate: 2025-12-23T12:00:00+05:30
author: "Ritik Tiwari"
heroImage: ../../assets/blog/monorepo-lessons.avif
tags: ["monorepo", "pnpm", "typescript", "software-architecture", "devops", "turborepo"]
featured: true
draft: false
---

Monorepos that actually work in production are very different from the toy examples you usually see online.

After shipping multiple production systems using pnpm workspaces — including multi-app platforms spanning web clients, backend APIs, CLIs, shared packages and AI services — I've learned the hard way where monorepos shine, and where they hurt.

This is the advice I'd give myself before starting.

## Why a Monorepo at All?

The pitch is compelling:

- Shared types
- Shared utilities
- Atomic cross-package changes
- Unified CI/CD
- Consistent tooling

And those benefits are real. But so are the tradeoffs. Monorepos shift complexity left — you deal with integration problems upfront instead of discovering them months later. That is often worth it.

## The Dependency Graph Becomes Your Mental Model

In a single-package app, you import a file. In a monorepo, you import a package.

That package has:

- Build artifacts
- Types
- Dependencies
- Peer dependencies
- Versioning concerns

Forgetting this causes broken builds. **A lot.** Use recursive builds or filtered builds deliberately:

```bash
pnpm -r build
```

or

```bash
pnpm --filter "./packages/*" run build
```

Shared packages should build first. Bake that into local development and CI.

## Package Boundaries Matter More Than Folder Structure

A monorepo is not: "One repository with lots of folders." It's a dependency graph.

Bad package boundaries:

```bash
packages/
  shared/
  utils/
  helpers/
  common/
```

Those become junk drawers.

Better:

```bash
packages/
  ui/
  config/
  sdk/
  domain/
  logger/
```

Organize around responsibilities, not vague reuse. That scales much better.

## TypeScript Path Aliases Are a Footgun

Everyone wants:

```ts
@/components/Button
```

Across package boundaries, this causes subtle pain. Especially with:

- Tests
- Editors
- Build tooling
- Package publishing

Keep aliases local.

Example:

```json
{
	"compilerOptions": {
		"paths": {
			"@ui/*": ["./src/*"]
		}
	}
}
```

Consumers should import packages:

```ts
import { Button } from "@your-scope/ui";
```

not internal alias paths. That distinction matters.

## Peer Dependencies Will Bite You

One thing `pnpm` does very well — it exposes bad dependency assumptions. Reusable packages often accidentally put framework dependencies in `dependencies` instead of `peerDependencies`.

Bad:

```json
{
	"dependencies": {
		"react": "^18"
	}
}
```

Better:

```json
{
	"peerDependencies": {
		"react": "^18"
	}
}
```

This prevents duplicate framework installs and weird runtime bugs. I learned this one painfully.

## Circular Dependencies Hide Until They Hurt

Monorepos make circular dependencies easier than you think.

Example:

```text
app -> ui -> utils -> app
```

Now your dependency graph is lying. Use tooling to catch it early:

- Madge
- dependency-cruiser
- Turborepo graph inspection

Circular imports get expensive later.

## Consider Turborepo Early

Manual filter chains work until they don't. Turborepo solves problems you'll eventually hit:

- Task pipelines
- Caching
- Incremental builds
- Affected-only rebuilds

Example:

```json
{
	"pipeline": {
		"build": {
			"dependsOn": ["^build"]
		}
	}
}
```

That `^build` dependency chain is gold. If I were starting over, I'd likely adopt it from day one.

## Shared Configs Should Be Packages

Don't copy-paste:

- ESLint configs
- TypeScript configs
- Prettier rules

Package them.

Example:

```bash
packages/
  eslint-config/
  tsconfig/
```

Then consume them everywhere. Drift is sneaky. Centralization helps.

## Version Internal Packages Early

Even if packages are private.

Versioning forces:

- Clear interfaces
- Better change discipline
- Safer refactors

And if you later adopt Changesets or publishing, you're ready. I wish I had done this earlier.

## CI Is Where Monorepos Become Real

A monorepo isn't validated by local dev. It's validated by CI. At minimum:

- Cache dependencies
- Cache builds
- Run affected tasks only
- Build packages before apps

Otherwise CI becomes painfully slow. And developers stop trusting it.

## What I'd Do Differently

If I started over:

1. Start with stronger package boundaries
2. Adopt Turborepo earlier
3. Treat peer dependencies seriously from day one
4. Package shared configs immediately
5. Add circular dependency detection early

All five would have saved me days. Maybe weeks.

## When I Would _Not_ Use a Monorepo

I wouldn't force one for:

- Tiny projects
- One-off prototypes
- Small teams with one deployable
- Products with no shared code

Sometimes a single repo should just stay simple. Monorepos are leverage — but not free leverage.

## My Personal Bias

If I were choosing by default:

| Monorepo is usually worth it for... | I'd think twice for...    |
| ----------------------------------- | ------------------------- |
| Multi-app platforms                 | Small single-service apps |
| Shared SDKs + APIs                  | Throwaway prototypes      |
| Web + mobile products               | Tiny teams                |
| Platform engineering                | Simple CRUD MVPs          |
| Internal tooling ecosystems         | One deployable product    |

Context always matters.

## Final Thoughts

Monorepos compound leverage — and complexity. If done poorly, they become dependency spaghetti. If done well, they make multi-app development feel like one system. I'd still choose a monorepo again. Just with much better boundaries.

Happy building 🚀
