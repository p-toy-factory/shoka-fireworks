# shoka-fireworks

Add a firework effect to clicks on a web page.

See the [documentation site and online demo](https://shoka-fireworks.pages.dev/)
for the interactive color playground, live firework preview, and API reference.

## Install

```sh
npm install shoka-fireworks
```

## Usage

```ts
import { fireworks } from "shoka-fireworks";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cleanup = fireworks({
  shouldPlayAnimation: () => !reducedMotion.matches,
});

// When unmounting or disabling the effect, call cleanup() to stop animations and remove listeners.
```

Run this code in the browser once `document.body` is ready, for example inside a
component's mount hook. Each call returns its own cleanup function.

The library does not check Reduced Motion automatically. `shouldPlayAnimation`
checks the preference on every click; when Reduced Motion is enabled, it returns
`false` so no new fireworks are triggered. Fireworks already in flight finish
playing naturally. To stop all animations immediately and remove the effect,
call `cleanup()` when unmounting a component or disabling the effect.

## API

`fireworks(config?: FireworkConfig): () => void`

| Option | Type | Default | Behavior |
| --- | --- | --- | --- |
| `colors?` | `string[]` | The 4 default pastel colors | CSS color strings for firework particles. Must include at least 1 color. |
| `shouldPlayAnimation?` | `(event: MouseEvent) => boolean` | `() => true` | Triggered on every click. Return `false` to skip the firework for that click without interrupting active animations. |

An empty `colors` array throws a `RangeError`.

The cleanup function stops all animations, removes the canvas, and detaches the
click and resize listeners.

## Local development

Use Node.js `>=24.18.0 <25` and pnpm `>=11.9.0` (`pnpm@12.11.2` is specified by
the project). Install dependencies from the repository root:

```sh
pnpm install
```

Available root commands:

```sh
pnpm build
pnpm check
pnpm format
pnpm test:docs
```

Start the docs development server with `pnpm --filter docs dev`. Build and preview
the docs site with `pnpm --filter docs build` and `pnpm --filter docs preview`.
The docs build writes the static site to `docs/dist/`; deploy that directory at
the domain root. Each language has its own generated HTML page, so the
documentation and initial example work without JavaScript. The playground
requires JavaScript.

To run the docs browser tests, install Chromium once with
`pnpm --filter docs exec playwright install chromium`. Playwright builds the docs
and starts a preview server on `127.0.0.1:4173`; keep that port free. Tests cover
desktop and mobile Chromium, all five language routes, navigation, the color
playground, preview controls, and Reduced Motion warnings. Use
`pnpm --filter docs test:ui` for interactive debugging or
`pnpm --filter docs exec playwright show-report` to open the HTML report. Failed
tests save screenshots and traces in `docs/test-results/`. In Linux CI, install
browser system dependencies with
`pnpm --filter docs exec playwright install --with-deps chromium`.

## Credits

This library’s fireworks effect is adapted from
[Hexo Theme Shoka](https://github.com/amehime/hexo-theme-shoka).
Thank you to the original author, 霜月琉璃. See
[Third-party notices](THIRD-PARTY-NOTICES.md) for attribution and license details.
