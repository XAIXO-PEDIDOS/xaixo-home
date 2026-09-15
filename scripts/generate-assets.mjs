// One-off/regenerable pipeline for derived assets: WOFF2 font + responsive image variants.
// Run with `npm run generate:assets` whenever assets/manrope.ttf or the source photos change.
import { access, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { compress } from "wawoff2";

const ttf = await readFile("assets/manrope.ttf");
const woff2 = await compress(ttf);
await writeFile("assets/manrope.woff2", woff2);
console.log(`assets/manrope.woff2 (${woff2.length} bytes)`);

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// Every entry needs an assets/<name>.webp. If it isn't there yet, it's
// converted once from a raw assets/<name>.{png,jpg,jpeg} source (kept
// alongside it or removed afterwards — the .webp is what's regenerated from
// here on). Widths are only ever generated below the native resolution, so a
// low-res source simply yields fewer (or no) variants rather than upscaling.
const widths = [800, 1200, 1600];
const images = [
  "hero",
  "kitchen",
  "bathroom",
  "living",
  "exterior",
  "house",
  "banos-hero",
  "banos-platos",
  "banos-muebles",
  "banos-griferia",
  "banos-ceramica",
  "banos-showroom",
];
// Full-bleed hero-style images get an extra, larger variant for big screens.
const extraWidths = { "banos-hero": [2400] };
const rawExtensions = ["png", "jpg", "jpeg"];

for (const name of images) {
  const webpSource = `assets/${name}.webp`;
  if (!(await fileExists(webpSource))) {
    let rawSource;
    for (const ext of rawExtensions) {
      const candidate = `assets/${name}.${ext}`;
      if (await fileExists(candidate)) {
        rawSource = candidate;
        break;
      }
    }
    if (!rawSource) throw new Error(`No source image found for "${name}" (need assets/${name}.webp/.png/.jpg)`);
    await sharp(rawSource).webp({ quality: 84 }).toFile(webpSource);
    console.log(`${webpSource} (converted from ${rawSource})`);
  }
  const { width: nativeWidth } = await sharp(webpSource).metadata();
  const targetWidths = [...widths, ...(extraWidths[name] ?? [])];
  for (const width of targetWidths) {
    if (width >= nativeWidth) continue; // never upscale past the source
    const out = `assets/${name}-${width}.webp`;
    await sharp(webpSource).resize({ width }).webp({ quality: 82 }).toFile(out);
    console.log(out);
  }
}

// Header logo: resized to ~4x its largest on-screen width (140px) for retina sharpness,
// palette-encoded since it's a single-color mark on a transparent background.
await sharp("assets/logo-source.png")
  .resize({ width: 560 })
  .png({ palette: true, compressionLevel: 9 })
  .toFile("assets/logo.png");
console.log("assets/logo.png");
