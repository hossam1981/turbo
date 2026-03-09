/**
 * One-off script: generate hero-dark.png from hero.png for dark-mode use.
 * Replaces light grey/off-white background with dark grey; keeps car and curves visible.
 */

const sharp = require('sharp');
const path = require('path');

const MEDIA = path.join(__dirname, '..', 'media');
const HERO_SRC = path.join(MEDIA, 'hero.png');
const HERO_DARK = path.join(MEDIA, 'hero-dark.png');

/* Right/center: lighter dark grey so car and curves stay visible */
const DARK_BG_R = 0x38;
const DARK_BG_G = 0x39;
const DARK_BG_B = 0x3d;

/* Left side (text area): darker grey for better contrast with white text */
const LEFT_DARK_R = 0x1c;
const LEFT_DARK_G = 0x1d;
const LEFT_DARK_B = 0x20;

async function main() {
  const image = sharp(HERO_SRC);
  const meta = await image.metadata();
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  const channels = meta.channels || 4;
  const width = meta.width;
  const len = data.length;

  for (let i = 0; i < len; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const spread = max - min;

    if (luminance >= 0.72 && luminance <= 0.84 && spread < 38) {
      const px = (i / channels) % width;
      const leftFraction = 0.55;
      if (px < width * leftFraction) {
        data[i] = LEFT_DARK_R;
        data[i + 1] = LEFT_DARK_G;
        data[i + 2] = LEFT_DARK_B;
      } else {
        data[i] = DARK_BG_R;
        data[i + 1] = DARK_BG_G;
        data[i + 2] = DARK_BG_B;
      }
    }
  }

  await sharp(data, {
    raw: {
      width: meta.width,
      height: meta.height,
      channels: channels,
    },
  })
    .png()
    .toFile(HERO_DARK);

  console.log('Written:', HERO_DARK);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
