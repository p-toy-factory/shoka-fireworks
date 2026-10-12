# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Project Overview

`shoka-fireworks` is a TypeScript library that adds a firework effect to browser clicks. The repository also contains an Astro static documentation site with an interactive playground and Playwright browser tests.

The docs routes are `/` (English), `/zh-CN/` (Simplified Chinese), `/zh-TW/` (Traditional Chinese), `/ja/` (Japanese), and `/ko/` (Korean). Shared Astro components render the documentation at build time; typed dictionaries provide static and runtime translations. Keep public API identifiers and section anchors consistent across languages. Language switching uses a native disclosure dropdown with ordinary page links and resets the playground. The dropdown works without JavaScript; JavaScript preserves the section anchor and adds Escape, outside-click, and focus-leave dismissal.

## Setup and Commands

Use Node.js `>=24.18.0 <25` and pnpm `>=11.9.0` (`pnpm@12.11.2` is specified by the project).

Install dependencies from the repository root:

```sh
pnpm install
```

Available root commands:

```sh
pnpm build       # Build the TypeScript library into dist/
pnpm check       # Run Biome checks
pnpm format      # Format files with Biome
pnpm test:docs   # Run documentation browser tests
```

For the docs site, run `pnpm --filter docs dev` to start the development server, `pnpm --filter docs build` to type-check and build it with Astro, and `pnpm --filter docs preview` to preview the build. Deploy `docs/dist/` at the domain root.

To run the docs browser tests, install Chromium once with `pnpm --filter docs exec playwright install chromium`, then run `pnpm test:docs`. The Playwright configuration builds the docs and serves the preview on `127.0.0.1:4173`; keep that port free. Tests run on desktop and mobile Chromium. In Linux CI, install system dependencies with `pnpm --filter docs exec playwright install --with-deps chromium`.

## Code Style

- Use tabs for indentation and double quotes in JavaScript and TypeScript; Biome configuration is in `biome.json`.
- Keep TypeScript strict and preserve the configured module settings in the relevant `tsconfig.json`.
- Run `pnpm check` after code changes. Use `pnpm format` when formatting is needed.
- Biome checks Astro frontmatter but cannot resolve template references. Its unused import/variable rules and import organization are disabled only for `.astro` files; `astro check` validates those components during the docs build.

## Testing

The library build is checked with `pnpm build`. The docs browser suite is run with `pnpm test:docs`; its coverage includes navigation, palette editing and validation, copying code, preview controls, keyboard activation, Reduced Motion warnings, all five language routes, language switching, and static content without JavaScript. See `README.md` for interactive debugging and Playwright report commands.

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

Format: `<type>[optional scope]: <description>`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`, `build`

Examples:

- `feat: add user login`
- `fix(auth): handle expired token`
- `feat!: drop Node 14 support` (breaking change)

## Maintenance

When code changes cause descriptions in this file (commands, directory structure, conventions, etc.) to become inaccurate, update `AGENTS.md` and relevant agent documentation to stay consistent.
