# Design and maintenance contract

## Philosophy

A unified family, not cloned screens.

Arc Library influenced the preference for quiet motion, generous rhythm, restrained surfaces, coherent tokens, and independently owned code. UI Foundation is its own vanilla implementation. No Arc component code, images, fonts, licensed Pro components, or generated registry code is copied into this repository.

## Stable v0.1 surfaces

- Semantic colors: \`--ui-bg\`, \`--ui-surface\`, \`--ui-ink\`, \`--ui-line\`, \`--ui-accent\`, \`--ui-positive\`, \`--ui-warning\`, \`--ui-negative\`, and their documented variants.
- Structural tokens: \`--ui-space-*\`, \`--ui-radius-*\`, \`--ui-control-height\`, \`--ui-panel-padding\`.
- Components are opt-in and prefixed with \`ui-\`.
- \`data-theme\` on \`html\` supports \`light\`, \`dark\`, and \`contrast\`.
- \`data-accent\` on \`html\` supports \`blue\` (implicit default), \`violet\`, \`jade\`, \`amber\`.
- \`data-ui-profile\` on the \`.ui-root\` container supports \`studio\`, \`console\`, \`workspace\`.
- JavaScript exports \`initAppearance\`, \`THEMES\`, \`ACCENTS\`, and \`PROFILES\`. It does not autostart.

An application MAY override semantic tokens for its brand, but SHOULD NOT restyle shared components by targeting broad selectors or \`!important\`.

## Accessibility and state

- Native semantics first; real buttons instead of clickable divs.
- Inputs require names and visible labels. Tables require properly scoped headers.
- Keyboard-only navigation must expose a visible focus indication.
- High-contrast theme uses strengthened outlines and legible text.
- \`prefers-reduced-motion\` disables decorative motion.
- Status communicates with text/labels as well as color; no color-only meaning.
- Minimum default touch height is about 44px in Studio; denser profiles are for precision tools and should not be applied to primary mobile navigation.
- The optional appearance helper emits \`ui:appearancechange\` on the \`.ui-root\` surface whenever the resolved appearance changes.
- Mobile navigation, tab selection, and dialog behavior belong to the catalog demonstration, not to the shared runtime.

## Data and trust

The component catalog is illustrative. Numbers, graph points, times, and statuses in \`index.html\` are NOT production signals.

A consuming application must preserve provenance, timestamp context, and fail-closed data handling for benchmarks, runtime monitoring, and other factual displays. Styling cannot turn absent or stale data into a success badge.

The foundation never fetches data, transmits telemetry, creates user accounts, or supplies authentication logic.

## Performance

Zero runtime dependencies. No remote assets. No design framework. No fonts fetched automatically. Small CSS layers and an optional appearance helper. Prefer native HTML dialog, progress, checkbox, and select over emulations.

Do not add blur-heavy effects to dense scrolling grids or charts by default. The catalog may decorate a static header but consumer apps must profile their own use.

## Repository boundaries

This repository publishes **shared styling primitives**, not final decisions about the look or layout of any other project. Adoption is deliberate and scoped. Tests should cover keyboard focus, mobile overflow, reduced motion, color contrast, and no loss of product semantics.

## Licensing

MIT. The UI is inspired by the [Arc Library](https://github.com/kuratlielia/arc-library) design direction, which has an MIT-licensed public source repository. The foundation contains an independent implementation and does not include Arc's source/assets. If future work copies any substantial MIT-licensed source from Arc, retain its copyright and license notice in the corresponding source distribution.
