# UI Foundation — agent instructions

- Code, comments, commits, and documentation in English. Chat replies may use Indonesian.
- Keep **vanilla HTML/CSS/ES modules**. No React, Tailwind, CSS frameworks, animation libraries, build tools, CDN packages, or remote fonts.
- Do not copy code/assets from the Arc Library or its paid offerings. Its restrained visual philosophy is a reference only.
- Public CSS variables must use \`--ui-\`; public component classes must use \`ui-\`. Scope selectors through \`.ui-root\` except semantic tokens on \`:root\`.
- All interactive controls require valid HTML semantics and a keyboard-accessible state. Use native controls whenever possible.
- Avoid arbitrary colors, radii, shadows, spacing, and animation durations inside components. Prefer documented semantic tokens.
- Do not add business logic or API requests to \`foundation/foundation.js\`: it only manages appearance.
- \`index.html\` and \`demo/\` are demonstration material. Never imply their sample data is live.
- Honor \`prefers-reduced-motion\`; support mobile, light/dark/high-contrast, and keyboard navigation.
- Avoid CSS overrides that depend on a consumer application's DOM structure.
- Do not edit consuming project repositories or enable publishing from this private repository without explicit authorization.
- Keep commits small and natural. Prefer direct changes on main for this repository, once tests pass, rather than accumulating branches/PRs.
- Run \`node --test tests/foundation.test.mjs\` and \`node --check foundation/foundation.js\` / \`node --check demo/demo.js\` before reporting success.
