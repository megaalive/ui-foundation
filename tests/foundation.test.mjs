import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { THEMES, ACCENTS, PROFILES, initAppearance } from "../foundation/foundation.js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(rootDir, path), "utf8");

test("distributed resources are local and require no network runtime", () => {
  const readme = read("README.md");
  const page = read("index.html");
  const styles = ["foundation/tokens.css", "foundation/base.css", "foundation/components.css", "foundation/profiles.css"];
  for (const path of styles) {
    const css = read(path);
    assert.ok(css.length > 100, path);
    assert.doesNotMatch(css, /@import\b|url\(\s*["']?\s*https?:/i, path);
    assert.ok(page.includes('href="./' + path + '"'), path);
  }
  assert.ok(page.includes('src="./demo/demo.js"'));
  assert.ok(read("foundation/foundation.js").includes("export function initAppearance"));
  assert.ok(readme.includes("Zero runtime dependencies"));
  assert.doesNotMatch(page, /<script[^>]+src=["']https?:/i);
});

test("semantic theme, accent, profile, and accessibility guardrails exist", () => {
  const tokens = read("foundation/tokens.css");
  const profiles = read("foundation/profiles.css");
  const components = read("foundation/components.css");
  const base = read("foundation/base.css");
  for (const attribute of [
    ':root[data-theme="dark"]', ':root[data-theme="contrast"]',
    ':root[data-accent="violet"]', ':root[data-accent="jade"]',
    ':root[data-accent="amber"]', "prefers-reduced-motion"
  ]) assert.ok(tokens.includes(attribute), attribute);
  for (const profile of PROFILES) assert.ok(profiles.includes('data-ui-profile="' + profile + '"'), profile);
  for (const name of ["button","card","badge","field","input","tabs","tab","table","dialog","notice","progress","switch"]) {
    assert.ok(components.includes(".ui-" + name), name);
  }
  assert.ok(base.includes(":focus-visible"), "visible keyboard focus");
  assert.ok(components.includes("prefers-reduced-motion"));
  assert.ok(components.includes("aria-selected"), "selected tab presentation");
});

test("showcase IDs, labels, local references, and accessible tab panels resolve", () => {
  const page = read("index.html");
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, "HTML IDs must be unique");
  const defined = new Set(ids);
  for (const expr of [/\bfor="([^"]+)"/g, /\baria-controls="([^"]+)"/g,
                      /\baria-labelledby="([^"]+)"/g, /\baria-describedby="([^"]+)"/g]) {
    for (const [, references] of page.matchAll(expr)) {
      for (const reference of references.split(/\s+/)) {
        assert.ok(defined.has(reference), "Missing element ID: " + reference);
      }
    }
  }
  for (const [, target] of page.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(defined.has(target), "Missing local anchor " + target);
  }
  assert.ok(page.includes('role="tablist"'));
  assert.ok(page.includes('role="tabpanel"'));
  assert.ok(page.includes('aria-selected="true"'));
  assert.ok(page.includes("<dialog "));
  assert.ok(page.includes('method="dialog"'));
  assert.ok(page.includes('role="status"'));
  assert.ok(page.includes("Illustrative"), "sample metrics must disclose their nature");
  assert.doesNotMatch(page, /\bonclick\s*=/i, "use listeners, not inline handlers");
});

function environment({ dark = false, value = null, errorOnStorage = false } = {}) {
  const events = [];
  const mediaListeners = new Set();
  const values = new Map();
  if (value != null) values.set("megaalive.ui-foundation.appearance.v1", value);
  const storage = {
    getItem(key) {
      if (errorOnStorage) throw Error("Storage blocked");
      return values.get(key) ?? null;
    },
    setItem(key, contents) {
      if (errorOnStorage) throw Error("Storage blocked");
      values.set(key, contents);
    }
  };
  const media = {
    matches: dark,
    addEventListener(name, listener) {
      assert.equal(name, "change");
      mediaListeners.add(listener);
    },
    removeEventListener(name, listener) {
      assert.equal(name, "change");
      mediaListeners.delete(listener);
    }
  };
  const root = { dataset: {} };
  const surface = {
    dataset: {},
    dispatchEvent(event) { events.push(event); return true; }
  };
  return {
    root, surface, storage, events, media, mediaListeners, values,
    changeOS(nextDark) {
      media.matches = nextDark;
      for (const listener of mediaListeners) listener({ matches: nextDark });
    }
  };
}

function withBrowserStubs(env, fn) {
  const oldWindow = globalThis.window;
  const oldCustomEvent = globalThis.CustomEvent;
  globalThis.window = { matchMedia: () => env.media };
  globalThis.CustomEvent = class {
    constructor(type, opts) {
      this.type = type;
      this.detail = opts.detail;
      this.bubbles = opts.bubbles;
    }
  };
  try { return fn(); } finally {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
    if (oldCustomEvent === undefined) delete globalThis.CustomEvent;
    else globalThis.CustomEvent = oldCustomEvent;
  }
}

test("appearance applies valid preferences, persists, and follows OS changes", () => {
  const env = environment();
  withBrowserStubs(env, () => {
    const appearance = initAppearance(env);
    assert.deepEqual([...THEMES], ["system", "light", "dark", "contrast"]);
    assert.deepEqual([...ACCENTS], ["blue", "violet", "jade", "amber"]);
    assert.equal(env.root.dataset.theme, "light");
    assert.equal(env.surface.dataset.uiProfile, "studio");
    assert.equal(env.events.at(-1).type, "ui:appearancechange");

    const changed = appearance.set({ theme: "dark", profile: "console", accent: "jade" });
    assert.equal(changed.resolvedTheme, "dark");
    assert.equal(env.root.dataset.theme, "dark");
    assert.equal(env.root.dataset.accent, "jade");
    assert.equal(env.surface.dataset.uiProfile, "console");
    assert.equal(JSON.parse(env.values.values().next().value).profile, "console");

    appearance.set({ theme: "invalid", profile: "__proto__", accent: "network" });
    assert.equal(env.root.dataset.theme, "dark");
    assert.equal(env.root.dataset.accent, "jade");
    assert.equal(env.surface.dataset.uiProfile, "console");

    const eventCount = env.events.length;
    env.changeOS(true);
    assert.equal(env.events.length, eventCount, "fixed themes do not reapply on system change");

    appearance.set({ theme: "system" });
    assert.equal(env.root.dataset.theme, "dark");
    env.changeOS(false);
    assert.equal(env.root.dataset.theme, "light");
    appearance.destroy();
    const countAfterDestroy = env.events.length;
    env.changeOS(true);
    assert.equal(env.events.length, countAfterDestroy);
  });
});

test("appearance handles corrupt settings and unavailable localStorage", () => {
  const damaged = environment({ value: '{"theme":"broken","accent":"violet","profile":"nowhere"}' });
  withBrowserStubs(damaged, () => {
    const appearance = initAppearance(damaged);
    assert.equal(appearance.get().theme, "system");
    assert.equal(appearance.get().accent, "violet");
    assert.equal(appearance.get().profile, "studio");
    appearance.destroy();
  });
  const blocked = environment({ dark: true, errorOnStorage: true });
  withBrowserStubs(blocked, () => {
    const appearance = initAppearance(blocked);
    assert.equal(appearance.get().resolvedTheme, "dark");
    assert.equal(appearance.set({ theme: "contrast" }).resolvedTheme, "contrast");
    appearance.destroy();
  });
});
