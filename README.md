# UI Foundation

A small, framework-independent design foundation for the megaalive projects.

**Vanilla HTML, CSS, and JavaScript. Zero runtime dependencies.** Inspired by the clarity, restraint, and calm motion of [Arc Library](https://github.com/kuratlielia/arc-library), but independently implemented with ordinary CSS and browser APIs.

## Start here

Serve the directory with any static HTTP server (the demo uses ES modules and should not be opened via `file://`):

```sh
python3 -m http.server 8080
# http://localhost:8080/
```

No `npm install`, bundler, transpiler, CDN, or browser framework is required. Node.js (20+) is optional and only used to run checks:

```sh
node --test tests/foundation.test.mjs
```

## Layout

| Path | Purpose |
| --- | --- |
| `foundation/tokens.css` | Semantic light, dark, high-contrast, and accent tokens |
| `foundation/base.css` | Accessible element baseline and typography |
| `foundation/components.css` | Buttons, fields, cards, tabs, tables, notices, dialog, status, etc. |
| `foundation/profiles.css` | Studio, Console, and Workspace density profiles |
| `foundation/foundation.js` | Optional tiny theme/density state helpers; no component runtime |
| `demo/` | Living component catalog, distinct from the distributable foundation |
| `docs/ADOPTION.md` | Integrating into plain HTML, Tsodin, Odin Primes, Nota Station, or MonTraIn |
| `docs/DESIGN.md` | Contracts, accessibility, and contribution policy |
| `AGENTS.md` | Rules for AI coding agents |

## Use in an app

Copy the `foundation/` directory into your app and link the files in this order:

```html
<link rel="stylesheet" href="./foundation/tokens.css">
<link rel="stylesheet" href="./foundation/base.css">
<link rel="stylesheet" href="./foundation/components.css">
<link rel="stylesheet" href="./foundation/profiles.css">
<script type="module" src="./foundation/foundation.js"></script>
```

Then use ordinary elements and opt-in classes:

```html
<main data-ui-profile="console">
  <section class="ui-card">
    <h2>Source status</h2>
    <p class="ui-muted">Verified from current data, not a mock claim.</p>
    <button class="ui-button ui-button--primary" type="button">Refresh</button>
  </section>
</main>
```

Everything has plain HTML fallbacks. The JavaScript file is **optional** and manages appearance preferences only; application behaviors remain owned by the consuming project.

## Compatibility and constraints

- Light, dark, and high-contrast themes; honors OS preference when no choice is stored.
- Keyboard focus indicators, semantic HTML, minimum sensible touch targets, and reduced-motion mode.
- Three density profiles: `studio` (expressive), `console` (data-dense), `workspace` (precision tools).
- `ui-` class and `--ui-` token namespace to limit CSS collisions.
- No automatic global CSS injection, analytics, fonts, network requests, or JS framework.
- Intended for evergreen browsers. Static CSS still works without JavaScript.
- Consumer apps **pin a commit or vendor a reviewed version**; do not load unversioned `main` from a CDN.

## Project rollout

1. Validate this catalog and its visual/accessibility behavior.
2. Pilot the shared primitives on Odin Primes Drag, **without altering its data/provenance logic**.
3. Adopt only agreed tokens/components in Tsodin.
4. Integrate carefully with Nota Station and MonTraIn; preserve domain-specific density, keyboard behavior, controls, and operational displays.

This repository does not change any consuming repository automatically.

## License and inspiration

MIT. Arc Library is a design reference; no Arc source code or proprietary component assets are vendored here. See [docs/DESIGN.md](docs/DESIGN.md).
