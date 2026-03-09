#!/usr/bin/env python3
"""
AI background removal using rembg (U2-Net). Preserves subject edges and details.
Requires: pip install "rembg[cpu]"
First run downloads the model (~200MB) and may take 1–2 minutes.
"""
from rembg import remove
from PIL import Image
import sys
import os

def main():
    if len(sys.argv) < 2:
        print("Usage: python remove_bg_ai.py <image> [output.png]")
        print("  If output omitted, saves as <name>-nobg.png next to input.")
        sys.exit(1)
    path = sys.argv[1]
    if not os.path.isfile(path):
        print("File not found:", path)
        sys.exit(1)
    out = sys.argv[2] if len(sys.argv) > 2 else None
    if not out:
        base, ext = os.path.splitext(path)
        out = base + "-nobg.png"
    img = Image.open(path)
    result = remove(img)
    result.save(out)
    print("Saved:", out)

if __name__ == "__main__":
    main()
