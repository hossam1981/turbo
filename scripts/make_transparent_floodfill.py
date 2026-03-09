#!/usr/bin/env python3
"""
Make background transparent by flood-filling from image corners.
Only pixels connected to the border (and dark enough) become transparent.
This preserves the subject (e.g. black car) in the center.
"""
from PIL import Image
import numpy as np
import sys

def flood_fill_background(rgb, threshold=35):
    """Return boolean mask True = background (to make transparent)."""
    h, w = rgb.shape[:2]
    dark = (rgb[:,:,0] <= threshold) & (rgb[:,:,1] <= threshold) & (rgb[:,:,2] <= threshold)
    # Start from all edge pixels that are dark
    from collections import deque
    q = deque()
    seen = np.zeros((h, w), dtype=bool)
    for x in range(w):
        if dark[0, x]: q.append((0, x)); seen[0, x] = True
        if dark[h-1, x]: q.append((h-1, x)); seen[h-1, x] = True
    for y in range(h):
        if dark[y, 0]: q.append((y, 0)); seen[y, 0] = True
        if dark[y, w-1]: q.append((y, w-1)); seen[y, w-1] = True
    while q:
        y, x = q.popleft()
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and dark[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    return seen

def main():
    if len(sys.argv) < 2:
        print("Usage: python make_transparent_floodfill.py <image> [threshold=35]")
        sys.exit(1)
    path = sys.argv[1]
    threshold = int(sys.argv[2]) if len(sys.argv) > 2 else 35
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    rgb = arr[:, :, :3]
    bg_mask = flood_fill_background(rgb, threshold=threshold)
    arr[bg_mask, 3] = 0
    out = path.replace(".png", "-light.png") if path.endswith(".png") else path + "-light.png"
    Image.fromarray(arr).save(out)
    print("Saved:", out, "| background pixels removed (flood from edges, dark <=", threshold, ")")

if __name__ == "__main__":
    main()
