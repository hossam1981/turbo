---
name: theme-toggle
description: Implements dark/light mode with a neumorphic pill toggle (track + sliding circle + label). Use when adding or refining a theme switcher, dark mode, or a custom toggle button that matches this pattern.
---

# Theme Toggle (Dark/Light) + Neumorphic Button

Reusable pattern for theme switching and a 3D-style toggle UI. Copy this approach into any HTML/CSS/JS project.

## 1. Theme system (data-theme)

- **State:** Store on `<html>`: `data-theme="light"` or `data-theme="dark"`.
- **Persistence:** `localStorage` key e.g. `theme`; read on load, write on change.
- **No flash:** In `<head>`, run a small inline script (before CSS) that reads `localStorage` (and optionally `prefers-color-scheme`) and sets `document.documentElement.setAttribute('data-theme', theme)`.
- **Dark styles:** One stylesheet (e.g. `theme-dark.css`) with selectors like `[data-theme="dark"] .selector { ... }`. Use CSS variables for surfaces and text (e.g. `--surface-0`, `--on-surface-high`) so one place controls the palette.

## 2. Toggle markup (pill)

Single control: a **wrapper** (track) + **label** (LIGHT/DARK text) + **button** (circle with icon). The circle moves left/right for state; the label stays on the opposite side.

```html
<span class="theme-toggle-wrap">
  <span class="theme-toggle-label" aria-hidden="true">LIGHT</span>
  <button type="button" class="theme-toggle" aria-label="Switch to dark mode" title="Switch to dark mode">
    <i class="fas fa-moon theme-toggle-icon" aria-hidden="true"></i>
  </button>
</span>
```

- **Light state:** label left, circle right. **Dark state:** add class `is-dark` on the wrapper; circle left, label right (use flex order or absolute positioning for the circle).
- **Icon:** Moon when theme is light (click to go dark), sun when theme is dark (click to go light). Swap class e.g. `fa-moon` / `fa-sun` in JS.

## 3. Toggle CSS (neumorphic, high contrast)

- **Track (wrapper):** Pill shape (`border-radius: 999px`), fixed or min width/height. **Recessed** look: `box-shadow: inset 4px 4px 10px rgba(0,0,0,…), inset -4px -4px 10px rgba(255,255,255,…)`.
- **Circle (button):** `position: absolute`, same height as track, `top: 0; bottom: 0; margin: auto 0` for vertical center. **Raised** look: `box-shadow: 4px 4px 10px rgba(0,0,0,…), -3px -3px 8px rgba(255,255,255,…)`. Light mode: light gray track + lighter circle. Dark mode: dark track + slightly lighter circle; override in `[data-theme="dark"] .theme-toggle-wrap` and `[data-theme="dark"] .theme-toggle-wrap .theme-toggle`.
- **Slide:** Transition `left` and `right` on the button (e.g. `right: 6px` for light, `left: 6px` for dark). Label padding can transition so text doesn’t overlap the circle.
- **Contain everything:** Wrapper `overflow: hidden`; label and button fully inside. Policy/secondary pages: use a class (e.g. `theme-toggle-policy`) and set `float: none` on the wrapper so it sits inline with a "Home" button in a flex row.
- **No highlight on click:** `outline: none`, `-webkit-tap-highlight-color: transparent` on the button. Optional: `@media (prefers-reduced-motion)` to disable slide transition.

## 4. Toggle JavaScript

- **getTheme():** `document.documentElement.getAttribute('data-theme') || 'light'`.
- **setTheme(theme):** set `data-theme` on documentElement, `localStorage.setItem('theme', theme)`, then `updateToggleUI()`.
- **updateToggleUI():** For each `.theme-toggle-wrap`: set class `is-dark` when theme is dark; set `.theme-toggle-label` text to `'DARK'` or `'LIGHT'`; set icon to sun (dark) or moon (light). For each `.theme-toggle` update `aria-label` and `title`.
- **Click:** Toggle theme (flip light ↔ dark) and call `setTheme(next)`.
- **Init:** On DOMContentLoaded, run `updateToggleUI()` and add click listeners to all `.theme-toggle` buttons.

## 5. Where to place the toggle

- **Navbar:** Pill in the main bar; on mobile, a second pill in the bar next to the hamburger (visible without opening the menu). Use `w3-hide-large` / `w3-hide-small` (or equivalent) to show one pill per breakpoint.
- **Other pages (e.g. policy):** Same pill markup in a flex row with e.g. a "Home" link; include the same theme CSS and JS. Ensure generic dark-mode button rules don't override the pill (exclude `.theme-toggle` from broad `[data-theme="dark"] button` styles).

## 6. Files to add or touch

| Purpose | Typical files |
|--------|----------------|
| Dark overrides | `theme-dark.css` (or one dark-mode stylesheet) |
| Toggle layout + neumorphic | `navbar.css` or shared `theme-toggle.css` |
| Theme logic + toggle UI | `theme.js` (one script, loaded on all pages) |
| Early theme | Inline script in `<head>` on every page that supports theme |
| Markup | Navbar + any "Home + toggle" row on other pages |

## Quick checklist for a new project

- [ ] Inline script in head sets `data-theme` from localStorage (and optional `prefers-color-scheme`).
- [ ] Link dark-mode stylesheet; use `[data-theme="dark"]` and variables.
- [ ] Markup: wrapper + label + button; button has `.theme-toggle` and icon.
- [ ] CSS: pill track (inset shadow), circle (outer shadow), slide via left/right transition; wrapper overflow hidden; policy/inline variant with float none.
- [ ] JS: getTheme, setTheme, updateToggleUI (is-dark, label text, icon, aria-label), click handler, init on DOMContentLoaded.
- [ ] No focus ring on click (outline + tap-highlight); optional reduced-motion for animation.
