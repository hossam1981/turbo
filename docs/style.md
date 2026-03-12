# Book Now button: pulse + ring animation

Short reference for reusing or re-implementing this effect.

## 1. HTML (wrapper + two ring spans + button)

Wrap the button in a link or div with `btn-book-wrapper`. Inside it: two spans (one per color), then the button with `btn-book-animate`.

```html
<a href="#book" class="btn-book-wrapper">
  <span class="btn-book-ping" aria-hidden="true"></span>
  <span class="btn-book-ping btn-book-ping-teal" aria-hidden="true"></span>
  <button class="btn btn-book ... btn-book-animate" name="book-now">Book Now</button>
</a>
```

- Wrapper: `position: relative`, `display: inline-block`.
- Ring spans: `position: absolute`, `inset: 0`, `pointer-events: none`, `z-index: 0`.
- Button: `position: relative`, `z-index: 1` so it stays above the rings.

## 2. Button pulse (opacity)

One keyframe: opacity 1 → 0.85 → 1. Apply to the button with `btn-book-animate`.

```css
@keyframes btn-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.btn-book-animate { animation: btn-pulse 2s ease-in-out infinite; }
```

## 3. Ring “ping” from all angles (two colors)

Rings expand from the button in all directions using **box-shadow spread** (no scale). Transparent background on the span; only the shadow is visible.

- Start: `box-shadow: 0 0 0 0 rgba(r,g,b, 0.7);`
- End: `box-shadow: 0 0 0 22px rgba(r,g,b, 0);`

One keyframe per color; second ring uses `animation-delay: 0.75s` so they alternate.

```css
@keyframes btn-ping-ring-emerald {
  0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.75); }
  70%, 100% { box-shadow: 0 0 0 22px rgba(52, 211, 153, 0); }
}
@keyframes btn-ping-ring-teal {
  0% { box-shadow: 0 0 0 0 rgba(58, 150, 190, 0.6); }
  70%, 100% { box-shadow: 0 0 0 22px rgba(58, 150, 190, 0); }
}
.btn-book-ping {
  position: absolute; inset: 0; border-radius: 4px;
  background: transparent;
  animation: btn-ping-ring-emerald 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  pointer-events: none; z-index: 0;
}
.btn-book-ping-teal {
  same as .btn-book-ping but animation: btn-ping-ring-teal; animation-delay: 0.75s;
}
```

## 4. Where it lives

- CSS: [style/btn_slider.css](../style/btn_slider.css) (keyframes + `.btn-book-wrapper`, `.btn-book-ping`, `.btn-book-ping-teal`, `.btn-book-animate`).
- HTML: Book Now button in [index.html](../index.html) hero section.

## Call Us button: gradient + border + shadow (light/dark)

Same idea as the SMS/Customer reference: light gradient, 2px border, shadow, 300ms transition. Dark mode uses `prefers-color-scheme: dark` and darker borders.

**HTML:** `<a href="tel:..." class="btn btn-call-us"><i class="fas fa-phone"></i> CALL US</a>`

**CSS** (lives in [style/btn_slider.css](../style/btn_slider.css)):

```css
/* Call Us button: gradient, border, shadow (light/dark mode) */
.btn-call-us {
    background: linear-gradient(to bottom right, #eff6ff, #dbeafe);
    color: #1f2937;
    border: 2px solid #93c5fd;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}
.btn-call-us:hover {
    background: linear-gradient(to bottom right, #dbeafe, #bfdbfe);
    border-color: #60a5fa;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
@media (prefers-color-scheme: dark) {
    .btn-call-us {
        border-color: #2563eb;
    }
    .btn-call-us:hover {
        border-color: #3b82f6;
    }
}
```

- **Light:** Gradient blue-50→100 (#eff6ff→#dbeafe), border blue-300 (#93c5fd), hover gradient blue-100→200, border blue-400 (#60a5fa), shadow-xl / hover shadow-2xl.
- **Dark:** Border blue-600 (#2563eb), hover blue-500 (#3b82f6); gradient unchanged for contrast.

---

## 5. To reuse on another button

- Add the wrapper and two `<span class="btn-book-ping">` / `<span class="btn-book-ping btn-book-ping-teal">` around the button.
- Add `btn-book-animate` to the button.
- Reuse the same CSS or duplicate the keyframes and classes under new names (e.g. `.cta-wrapper`, `.cta-ping`, `.cta-ping-teal`, `.cta-animate`).

---

## Hero assets & Figma

Hero images live in [media/](../media/): **hero.png** (light) and **hero-dark.png** (dark-mode). Use the light hero on light backgrounds and the dark hero on dark sections or when `prefers-color-scheme: dark`.

**Adding both to Figma:**

1. **Upload:** In your Figma file, drag and drop `hero.png` and `hero-dark.png` from the project’s `media/` folder onto the canvas, or use **Place image** (right-click frame → **Place image**).
2. **Naming:** Rename the image frames to e.g. “Hero – Light” and “Hero – Dark” so light/dark variants are clear.
3. **Usage:** Reference these frames in your design system or handoff; use the light hero in light UI and the dark hero in dark UI or dark sections.

To regenerate **hero-dark.png** from **hero.png** (e.g. after changing the hero): run `node scripts/generate-hero-dark.js`.
