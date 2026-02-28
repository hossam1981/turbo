/**
 * Optimize images in media/: resize, compress. Minify img1.svg.
 * Backup media/ before running. Reversible: restore from media-backup-YYYYMMDD/
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MEDIA_DIR = path.join(__dirname, '..', 'media');
const MAX_EDGE = 1600;
const MAX_EDGE_HERO = 1920;
const JPEG_QUALITY = 82;
const HERO_PARALLAX = ['hero.png', 'parallax-1.jpg', 'parallax-2.webp', 'contact-us.jpeg'];

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath, ext);
  if (['.html', '.ico'].includes(ext)) return;

  const isHero = HERO_PARALLAX.some((f) => filePath.endsWith(f));
  const maxEdge = isHero ? MAX_EDGE_HERO : MAX_EDGE;

  try {
    const meta = await sharp(filePath).metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    if (w === 0 || h === 0) return;

    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const newW = Math.round(w * scale);
    const newH = Math.round(h * scale);

    const tmpPath = filePath + '.tmp';
    let pipe = sharp(filePath).resize(newW, newH, {
      fit: 'inside',
      withoutEnlargement: true,
    });
    if (ext === '.webp') {
      await pipe.webp({ quality: 85 }).toFile(tmpPath);
    } else if (ext === '.png') {
      await pipe.png({ compressionLevel: 9, effort: 10 }).toFile(tmpPath);
    } else {
      await pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpPath);
    }

    fs.renameSync(filePath + '.tmp', filePath);
    console.log('OK', path.basename(filePath));
  } catch (err) {
    console.error('Skip', filePath, err.message);
  }
}

async function main() {
  const files = fs.readdirSync(MEDIA_DIR);
  const raster = files.filter(
    (f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f) &&
      !/Yelp|\.html$/i.test(f)
  );

  for (const f of raster) {
    await optimizeImage(path.join(MEDIA_DIR, f));
  }

  // Minify SVG
  const svgPath = path.join(MEDIA_DIR, 'img1.svg');
  if (fs.existsSync(svgPath)) {
    try {
      const { optimize } = require('svgo');
      const svg = fs.readFileSync(svgPath, 'utf8');
      const out = optimize(svg, { path: svgPath });
      fs.writeFileSync(svgPath, out.data);
      console.log('OK img1.svg (minified)');
    } catch (e) {
      console.error('Skip img1.svg', e.message);
    }
  }

  console.log('Done. To reverse: restore media/ from media-backup-YYYYMMDD/');
}

main();
