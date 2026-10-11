# Adopting UI Foundation

UI Foundation is **not** a site builder. It provides shared visual rules and reusable, semantic HTML primitives. Each application remains the owner of its screens, logic, navigation, and accessibility.

## Integration contract

Vendor a reviewed commit of the \`foundation/\` directory. Keep its files together and include styles in the following order:

\`\`\`html
<link rel="stylesheet" href="./foundation/tokens.css">
<link rel="stylesheet" href="./foundation/base.css">
<link rel="stylesheet" href="./foundation/components.css">
<link rel="stylesheet" href="./foundation/profiles.css">
\`\`\`

Wrap the UI you want to style with \`class="ui-root"\`. Set \`data-ui-profile\` on the same element or a descendant. All component classes start with \`ui-\`, and all CSS variables start with \`--ui-\`. These names are part of the public v0.1 contract.

\`\`\`html
<main class="ui-root" data-ui-profile="console">
  <article class="ui-card">
    <span class="ui-micro">Last checked</span>
    <strong class="ui-metric__value ui-mono">10:42:01</strong>
    <p class="ui-muted">Verified sample from the application</p>
    <button type="button" class="ui-button ui-button--primary">Refresh</button>
  </article>
</main>
\`\`\`

Set theme and accent on \`document.documentElement\` if your app already manages preferences:

\`\`\`js
document.documentElement.dataset.theme = "dark"; // light | dark | contrast
document.documentElement.dataset.accent = "blue"; // blue | violet | jade | amber
\`\`\`

Or use the **optional** appearance helper:

\`\`\`html
<script type="module">
  import { initAppearance } from "./foundation/foundation.js";
  const appearance = initAppearance({
    surface: document.querySelector(".ui-root")
  });
  // One place to update all components:
  // appearance.set({ theme: "dark", profile: "console", accent: "blue" });
</script>
\`\`\`

The helper saves appearance preferences in local storage where permitted and honors \`prefers-color-scheme\` for the \`system\` option. It has no effect on application data.

### Deployment checklist

- Pin a version/commit of the foundation (do not use the unversioned \`main\` branch as a live CDN).
- Do **not** replace application-specific keyboard shortcuts, graph controls, transport bars, editors, or charts automatically.
- Ensure every displayed state, time, and number originates from **real app data**. The catalog contains explicitly labeled sample values.
- Validate light, dark, contrast, mobile, keyboard, and reduced-motion modes.
- Preserve component semantics: native \`button\`, \`label\`, \`select\`, \`dialog\`, table headers, and \`aria-*\`.
- For highly interactive widgets, your application implements the interaction; foundation supplies CSS only.
- If the consuming application uses a strict CSP, keep CSS/JS as separate static files; the demo's inline styles are not part of the distribution.

## Pilot applications

### Odin Primes Drag

Suggested first adopter. Replace isolated card, navigation, status, and table styling on **one** static page. Keep source links, CI provenance, numeric formatting, and all benchmark data validation unchanged.

Use \`data-ui-profile="console"\`, and use a project override stylesheet for accent and unusual benchmark visualizations.

### Tsodin

Keep Blue Glassy Soft as an intentional product identity. Map selected Tsodin colors to semantic \`--ui-*\` tokens, then add shared controls in a separate isolated area. Do not replace the Observatory orbit, X-Ray selection semantics, trace viewer, or compiler status rules.

Use \`studio\` for public pages and \`console\` for data-intensive sections as appropriate.

### Nota Station

The tracker is a dense musical workstation with custom keyboard and audio interactions. Keep its canonical \`styles/tokens.css\`, transport, playhead, track grid, and high-contrast theme as the source of truth. Adopt only primitives that do not interfere with those controls.

Use \`workspace\` inside specifically scoped regions, not as a blanket restyle.

### MonTraIn

Operator-facing monitoring must remain readable under load. Treat graphs, zoom, fullscreen, live/waiting status, and mobile behavior as invariants. Adopt buttons, surfaces, forms, and dialogs on a single admin page first.

Use \`console\`, static or reduced animations, and ensure status words remain visible alongside color.

## Framework adapters

CSS is ordinary CSS. Blazor, Razor, Laravel, Svelte, or React can produce the same HTML classes without including any foundation runtime. React-specific component wrappers are deliberately out of scope.

## Updating an app

1. Record the pinned foundation commit in the consumer's documentation.
2. Review the foundation diff for semantic token or selector changes.
3. Copy the selected four CSS files (and optional JS) into the consumer.
4. Run the consumer's unit, integration, and visual tests.
5. Keep the old version ready for rollback.

Never automatically inject unreviewed styles into production applications.
