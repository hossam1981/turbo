---
name: 3d-image-slider
description: Interactive 3D carousel (drag + auto spin) using drag-container and spin-container, JS init() for item positions, applyTranform for camera rotation, and spin/spinRevert keyframes. Use when adding a hero slider, gallery, or service cards that rotate in 3D with mouse/touch drag. Based on "3D Carousel With Mouse & Touch Interactions" (cssscript.com).
---

# 3D Image Slider (Drag + Auto Spin)

Reusable pattern: items on a ring in 3D; **drag** rotates the camera (drag-container), **auto spin** animates the carousel (spin-container). Item positions are set in JS with `rotateY(i * 360/n) translateZ(radius)`.

## 1. HTML structure

```html
<section class="slider-3d-banner">
  <div class="slider-3d-scene">
    <div id="drag-container">
      <div id="spin-container">
        <div class="slider-3d-item slider-3d-card">
          <img src="1.jpg" alt="" />
          <div class="slider-3d-card-body">
            <h5 class="slider-3d-card-title">Title</h5>
            <p class="slider-3d-card-text">Description.</p>
          </div>
        </div>
        <!-- more .slider-3d-item.slider-3d-card -->
      </div>
    </div>
  </div>
  <p class="slider-3d-hint">Drag or swipe to rotate</p>
</section>
```

- **drag-container:** Gets `transform: rotateX(-tY) rotateY(tX)` from JS (camera).
- **spin-container:** Fixed size (one card); holds items; has CSS animation `spin` or `spinRevert`.
- **Items:** Direct children of spin-container; transform set in JS: `rotateY(i * 360/n deg) translateZ(radius px)`.

## 2. CSS

**Banner:** No `overflow: hidden` on the banner (it flattens 3D). Use `overflow: visible` or clip elsewhere.

```css
.slider-3d-banner {
  position: relative;
  width: 100%;
  height: 560px;
  overflow: visible;
  background: linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%);
}
```

**Scene:** Perspective and flex center; no overflow hidden.

```css
.slider-3d-scene {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  -webkit-perspective: 1000px;
  transform-style: preserve-3d;
  cursor: grab;
}
.slider-3d-scene:active { cursor: grabbing; }
```

**drag-container:** Transform applied by JS. Initial tilt in CSS.

```css
#drag-container {
  position: relative;
  display: flex;
  margin: auto;
  transform-style: preserve-3d;
  transform: rotateX(-10deg);
}
```

**spin-container:** One-card size; same initial tilt; animation runs here.

```css
#spin-container {
  position: relative;
  display: flex;
  margin: auto;
  width: 336px;
  height: 357px;
  transform-style: preserve-3d;
  transform: rotateX(-10deg);
}
```

**Items:** Absolute, full size of spin-container; **transform set in JS** (no nth-child in CSS).

```css
#drag-container .slider-3d-item {
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  transition: transform 1s;
}
```

**Keyframes:** Only `rotateY` so spin doesn’t override drag tilt.

```css
@keyframes spin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}
@keyframes spinRevert {
  from { transform: rotateY(360deg); }
  to { transform: rotateY(0deg); }
}
```

**Card glow (border/shadow):** Soft white halo so cards “pop” off the background; stronger on hover (reference style).

```css
.slider-3d-card {
  box-shadow: 0 0 8px #fff, 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s ease;
}
#drag-container .slider-3d-item:hover .slider-3d-card {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.95), 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
```

**Dark mode:** Softer white glow so it reads on dark backgrounds.

```css
[data-theme="dark"] .slider-3d-card {
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.35), 0 1px 0 var(--divider), 0 6px 14px rgba(0, 0, 0, 0.35);
}
[data-theme="dark"] #drag-container .slider-3d-item:hover .slider-3d-card {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 0 1px 0 var(--divider), 0 6px 14px rgba(0, 0, 0, 0.35);
}
```

Card layout (image + body, title overlay, etc.) lives on `.slider-3d-card` and children; adapt to your design.

## 3. JavaScript

- **init(delayTime):** For each item: `transform = "rotateY(" + (i * 360/n) + "deg) translateZ(" + radius + "px)"`; optional staggered `transitionDelay`.
- **applyTranform(obj):** Clamp `tY` to 0–180; set `obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)"` (obj = drag-container).
- **playSpin(yes):** `ospin.style.animationPlayState = yes ? "running" : "paused"`.
- **Variables:** `tX`, `tY` (e.g. initial `tY = 10`), `desX`, `desY`, `sX`, `sY`, `nX`, `nY`.
- **Auto spin:** If `autoRotate` and not `prefers-reduced-motion`, set `ospin.style.animation = "spinRevert 60s infinite linear"` (or `spin` for opposite direction).
- **Pointer down** on scene: record `sX`, `sY`; attach **pointermove**: `desX = nX - sX`, `desY = nY - sY`, `tX += desX*0.1`, `tY += desY*0.1`, `applyTranform(odrag)`, then `sX = nX`, `sY = nY`.
- **Pointer up:** Start interval: `desX *= 0.95`, `desY *= 0.95`, update `tX`/`tY`, `applyTranform(odrag)`, `playSpin(false)`; when `|desX|` and `|desY|` &lt; 0.5, clear interval and `playSpin(true)`.

Reference implementation: `script/slider-3d.js` in this project.

## 4. Files

| Purpose       | Files |
|---------------|--------|
| Markup        | Section HTML (e.g. index.html) |
| Styles        | `slider-3d.css` (and theme-dark.css for dark mode) |
| Behaviour     | `slider-3d.js` |

## 5. Checklist

- [ ] Structure: `#drag-container` > `#spin-container` > `.slider-3d-item` (no extra wrap).
- [ ] Banner/scene: no `overflow: hidden` on 3D ancestor; scene has `perspective` and flex center.
- [ ] init(): each item gets `rotateY(i * 360/n) translateZ(radius)`.
- [ ] applyTranform(drag-container): `rotateX(-tY) rotateY(tX)`; tY clamped 0–180.
- [ ] spin/spinRevert keyframes use only `rotateY`.
- [ ] Card glow: `0 0 8px #fff` (and depth shadows); hover `0 0 15px`; dark mode use softer white rgba.
- [ ] Respect `prefers-reduced-motion` (e.g. no auto spin when reduced).

## 6. Reference

- "3D Carousel With Mouse & Touch Interactions" (cssscript.com): drag-container + spin-container, init() for item positions, applyTranform on drag, inertia on pointer up.
