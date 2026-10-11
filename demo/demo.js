import { initAppearance } from "../foundation/foundation.js";

const surface = document.getElementById("showcase");
const appearance = initAppearance({ surface });
const themeSelect = document.getElementById("theme-select");
const profileControls = [...document.querySelectorAll("[data-profile]")];
const accentControls = [...document.querySelectorAll("[data-accent-choice]")];

function syncAppearance() {
  const { theme, accent, profile } = appearance.get();
  themeSelect.value = theme;
  for (const button of profileControls) {
    const active = button.dataset.profile === profile;
    button.setAttribute("aria-pressed", String(active));
  }
  for (const button of accentControls) {
    const active = button.dataset.accentChoice === accent;
    button.setAttribute("aria-pressed", String(active));
  }
  document.getElementById("active-profile").textContent = profile;
}

surface.addEventListener("ui:appearancechange", syncAppearance);
syncAppearance();
themeSelect.addEventListener("change", () => appearance.set({ theme: themeSelect.value }));
for (const button of profileControls) {
  button.addEventListener("click", () => appearance.set({ profile: button.dataset.profile }));
}
for (const button of accentControls) {
  button.addEventListener("click", () => appearance.set({ accent: button.dataset.accentChoice }));
}

function activateTab(tab) {
  const list = tab.closest('[role="tablist"]');
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(item.getAttribute("aria-controls"));
    if (panel) panel.hidden = !selected;
  }
}

for (const list of document.querySelectorAll('[role="tablist"]')) {
  list.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && list.contains(tab)) activateTab(tab);
  });
  list.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...list.querySelectorAll('[role="tab"]:not([disabled])')];
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    activateTab(tabs[next]);
  });
}

const dialog = document.getElementById("example-dialog");
document.querySelector('[data-open-dialog]').addEventListener("click", () => dialog.showModal());

const toastArea = document.getElementById("toast-area");
let toastTimer = 0;
function toast(message) {
  window.clearTimeout(toastTimer);
  toastArea.replaceChildren();
  const note = document.createElement("div");
  note.className = "ui-toast";
  note.textContent = message;
  toastArea.append(note);
  toastTimer = window.setTimeout(() => toastArea.replaceChildren(), 4300);
}
document.querySelector('[data-show-toast]').addEventListener("click", () => {
  toast("Changes saved locally. This is an interactive component example.");
});
document.getElementById("demo-form").addEventListener("submit", (event) => {
  event.preventDefault();
  toast("Demo form validated. No data was transmitted.");
});

document.querySelector('[data-copy-code]').addEventListener("click", async (event) => {
  const text = document.getElementById("usage-code").textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    toast("Usage snippet copied.");
  } catch {
    toast("Clipboard unavailable. Select and copy the snippet manually.");
  }
});

const menuButton = document.getElementById("menu-button");
const sidebar = document.getElementById("sidebar");
function closeMenu() {
  sidebar.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const open = sidebar.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
  if (open) sidebar.querySelector('a[href^="#"]')?.focus();
});
sidebar.addEventListener("click", (event) => {
  if (event.target.closest('a[href^="#"]')) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (sidebar.classList.contains("is-open") &&
      !sidebar.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
