---
name: ai-background-removal
description: Removes image backgrounds using AI (rembg) for clean, sharp edges. Use when creating transparent hero/slider/logo assets or when threshold or flood-fill methods cut into the subject or leave halos.
---

# AI Background Removal (rembg)

Reusable pattern for extracting subjects from images with clean edges. Prefer this over color-threshold or flood-fill when the subject is dark on a dark background (e.g. black car on black) or when previous methods remove parts of the subject or leave white halos.

## 1. Setup

- **Install:** `pip install "rembg[cpu]"` (or `rembg[gpu]` for NVIDIA). First run downloads the U2-Net model (~176MB).
- **Script:** Keep a small script (e.g. `scripts/remove_bg_ai.py`) that calls `rembg.remove()` and saves PNG with alpha.

## 2. Script usage

```python
from rembg import remove
from PIL import Image
img = Image.open(path)
result = remove(img)
result.save(output_path)
```

- **CLI-style:** `python scripts/remove_bg_ai.py <input> [output]`. If output omitted, save as `<name>-nobg.png` next to input.
- **Backup:** Before overwriting an existing asset (e.g. `hero-car.png`), copy it to a backup path so the user can revert.

## 3. When to use

- **Hero car:** Run on full hero image → save as car-only layer (e.g. `hero-car.png`). Use same file for light and dark hero, or copy to `hero-car-dark.png` if both layers should match.
- **Slider / cards:** Run on each car/product image → save as `*-light.png` (light theme) or `*-dark.png` (dark theme). Wire in HTML with two `<img>` tags and CSS that shows one per theme (e.g. `.slider-car-light` / `.slider-car-dark` and `[data-theme="dark"] .slider-car-light { display: none }`).
- **Logos:** Same flow for light/dark logo variants.

## 4. Project conventions (this repo)

- **Backup before overwrite:** e.g. `cp media/hero-car.png media/hero-car-backup-before-rembg.png` before replacing.
- **Reversibility:** Document in the skill or in chat where the backup is and how to restore (copy backup over the new file).
- **Media rule:** Do not delete originals in `media/` before the user has verified; back up or overwrite only after a good run.

## 5. Fallback (no AI)

If rembg cannot be installed (e.g. build failures), use **flood-fill from image edges**: only make transparent pixels that are (a) dark below a threshold and (b) connected to the image border. That preserves a dark subject in the center. See `scripts/make_transparent_floodfill.py` for reference.

## Quick checklist

- [ ] Install `rembg[cpu]` (or gpu); first run will download model.
- [ ] Back up existing asset if overwriting (e.g. hero-car, slider image).
- [ ] Run script: input = source image, output = target PNG (e.g. hero-car.png, *-light.png).
- [ ] For dark hero/slider: use same AI output or copy to dark asset name; no HTML change if paths already correct.
- [ ] Tell user to hard-refresh; optionally add cache-buster query (e.g. `?v=2`) on the image URL if needed.
