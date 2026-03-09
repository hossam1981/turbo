"""
Generate separate hero layers from media/hero.png:
- media/hero-car.png
- media/hero-bg.png
- media/hero-car-mask.png

Then derive dark variants from those clean layers:
- media/hero-car-dark.png
- media/hero-bg-dark.png
- media/hero-car-mask-dark.png
"""

from pathlib import Path
import shutil
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "media"


def separate_layers(source_name: str, suffix: str = "") -> None:
    src = MEDIA / source_name
    car_out = MEDIA / f"hero-car{suffix}.png"
    bg_out = MEDIA / f"hero-bg{suffix}.png"
    mask_out = MEDIA / f"hero-car-mask{suffix}.png"

    img = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Could not read source image: {src}")

    h, w = img.shape[:2]

    # GrabCut priors tuned for the hero composition.
    mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    mask[:, : int(w * 0.42)] = cv2.GC_BGD
    mask[:, int(w * 0.60) :] = cv2.GC_PR_FGD
    mask[int(h * 0.10) : int(h * 0.95), int(w * 0.52) :] = cv2.GC_PR_FGD

    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgd_model, fgd_model, 2, cv2.GC_INIT_WITH_MASK)

    fg_mask = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

    # Clean small artifacts and keep right-side components (car area).
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_OPEN, kernel, iterations=1)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(fg_mask, connectivity=8)
    clean = np.zeros_like(fg_mask)
    for i in range(1, num_labels):
        x, y, ww, hh, area = stats[i]
        if area < 500:
            continue
        if x + ww < int(w * 0.45):
            continue
        clean[labels == i] = 255
    fg_mask = clean

    # Feather alpha for softer edge compositing.
    alpha = cv2.GaussianBlur(fg_mask, (0, 0), sigmaX=1.2, sigmaY=1.2)

    # Export transparent car.
    b, g, r = cv2.split(img)
    car_rgba = cv2.merge((b, g, r, alpha))
    cv2.imwrite(str(car_out), car_rgba)

    # Reconstruct background and smooth removed region.
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))
    mask_d = cv2.dilate(fg_mask, k, iterations=1)
    inpaint = cv2.inpaint(img, mask_d, 7, cv2.INPAINT_TELEA)
    blurred = cv2.GaussianBlur(inpaint, (0, 0), sigmaX=14, sigmaY=14)

    blend_alpha = cv2.GaussianBlur(mask_d, (0, 0), sigmaX=18, sigmaY=18).astype(np.float32) / 255.0
    blend_alpha = blend_alpha[..., None]
    bg = inpaint.astype(np.float32) * (1.0 - blend_alpha) + blurred.astype(np.float32) * blend_alpha
    bg = np.clip(bg, 0, 255).astype(np.uint8)

    cv2.imwrite(str(bg_out), bg)
    cv2.imwrite(str(mask_out), fg_mask)

    print(f"Written: {car_out}")
    print(f"Written: {bg_out}")
    print(f"Written: {mask_out}")


def build_dark_background() -> None:
    bg_src = MEDIA / "hero-bg.png"
    bg_dark = MEDIA / "hero-bg-dark.png"
    car_src = MEDIA / "hero-car.png"
    car_dark = MEDIA / "hero-car-dark.png"
    mask_src = MEDIA / "hero-car-mask.png"
    mask_dark = MEDIA / "hero-car-mask-dark.png"

    img = cv2.imread(str(bg_src), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Could not read source image: {bg_src}")

    h, w = img.shape[:2]
    out = img.copy()

    # Material-like dark targets:
    # - left side near elevated surface for text contrast
    # - right side lighter elevated tone to preserve curves + car separation
    right_dark = np.array([0x2E, 0x30, 0x35], dtype=np.float32)
    left_dark = np.array([0x1F, 0x21, 0x26], dtype=np.float32)
    left_fraction = 0.55

    for y in range(h):
        for x in range(w):
            b, g, r = out[y, x]
            max_c = max(int(r), int(g), int(b))
            min_c = min(int(r), int(g), int(b))
            luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            spread = max_c - min_c

            # Blend low-saturation background tones toward dark targets.
            # This keeps curve detail because we preserve part of original luminance.
            if luminance >= 0.56 and spread < 44:
                # Smoothly blend between left and right tone targets near the split.
                split_x = w * left_fraction
                transition_half = w * 0.08  # ~16% wide blend band
                t = (x - (split_x - transition_half)) / (2.0 * transition_half)
                t = max(0.0, min(1.0, t))
                # smoothstep
                t = t * t * (3.0 - 2.0 * t)
                target = left_dark * (1.0 - t) + right_dark * t

                # Brighter pixels get stronger darkening, with smooth extra push on left.
                alpha = 0.28 + (luminance - 0.56) * 0.9
                alpha += 0.08 * (1.0 - t)
                alpha = max(0.0, min(0.78, alpha))

                src = np.array([b, g, r], dtype=np.float32)
                mixed = src * (1.0 - alpha) + target * alpha
                out[y, x] = np.clip(mixed, 0, 255).astype(np.uint8)

    cv2.imwrite(str(bg_dark), out)
    shutil.copyfile(car_src, car_dark)
    shutil.copyfile(mask_src, mask_dark)
    print(f"Written: {bg_dark}")
    print(f"Written: {car_dark}")
    print(f"Written: {mask_dark}")


if __name__ == "__main__":
    separate_layers("hero.png", "")
    build_dark_background()
