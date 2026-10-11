/**
 * Minimal appearance state for UI Foundation.
 * Nothing runs on import. No component framework or network dependency.
 */
export const THEMES = Object.freeze(["system", "light", "dark", "contrast"]);
export const ACCENTS = Object.freeze(["blue", "violet", "jade", "amber"]);
export const PROFILES = Object.freeze(["studio", "console", "workspace"]);

const KEY = "megaalive.ui-foundation.appearance.v1";

function isAllowed(values, value) {
  return typeof value === "string" && values.includes(value);
}

export function initAppearance({
  root = document.documentElement,
  surface = document.querySelector(".ui-root"),
  storage
} = {}) {
  if (storage === undefined) {
    try { storage = typeof window !== "undefined" ? window.localStorage : null; }
    catch { storage = null; }
  }
  if (!root || !surface) throw new Error("UI Foundation requires root and .ui-root surface");

  const defaults = { theme: "system", accent: "blue", profile: "studio" };
  let stored = {};
  try {
    const raw = storage?.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) stored = parsed;
  } catch {
    // Sandboxed browsers may deny storage. The UI must still render.
  }

  let state = {
    theme: isAllowed(THEMES, stored.theme) ? stored.theme : defaults.theme,
    accent: isAllowed(ACCENTS, stored.accent) ? stored.accent : defaults.accent,
    profile: isAllowed(PROFILES, stored.profile) ? stored.profile : defaults.profile
  };

  const media = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  function apply() {
    const resolvedTheme = state.theme === "system"
      ? (media?.matches ? "dark" : "light")
      : state.theme;
    root.dataset.theme = resolvedTheme;
    root.dataset.accent = state.accent;
    surface.dataset.uiProfile = state.profile;
    surface.dispatchEvent(new CustomEvent("ui:appearancechange", {
      bubbles: true,
      detail: { ...state, resolvedTheme }
    }));
    return { ...state, resolvedTheme };
  }

  const onSystemChange = () => {
    if (state.theme === "system") apply();
  };
  media?.addEventListener?.("change", onSystemChange);

  function set(next) {
    if (!next || typeof next !== "object") return get();
    state = {
      theme: isAllowed(THEMES, next.theme) ? next.theme : state.theme,
      accent: isAllowed(ACCENTS, next.accent) ? next.accent : state.accent,
      profile: isAllowed(PROFILES, next.profile) ? next.profile : state.profile
    };
    try { storage?.setItem(KEY, JSON.stringify(state)); } catch { /* optional */ }
    return apply();
  }

  function get() {
    return { ...state, resolvedTheme: root.dataset.theme };
  }

  apply();
  return {
    get,
    set,
    destroy() { media?.removeEventListener?.("change", onSystemChange); }
  };
}
