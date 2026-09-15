// One-off/regenerable pipeline for derived assets: responsive image variants.
// Run with `npm run generate:assets` whenever the source photos change.
//
// The Manrope font (assets/manrope-variable.woff2) is not derived here: it's
// the variable-weight WOFF2 (latin subset, weights 200-800) copied straight
// from the @fontsource-variable/manrope npm package — see assets/manrope-OFL.txt
// for its license. To update it: `npm pack @fontsource-variable/manrope`,
// extract, and copy files/manrope-latin-wght-normal.woff2 over it.
import { access, readdir } from "node:fs/promises";
import sharp from "sharp";

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
  "home-hero",
  "banos-hero",
  "banos-platos",
  "banos-muebles",
  "banos-griferia",
  "banos-ceramica",
  "banos-showroom",
  "azulejos-hero",
  "azulejos-suelos",
  "azulejos-revestimientos",
  "azulejos-exterior",
  "azulejos-formatos",
  "cocinas-hero",
  "cocinas-mobiliario",
  "cocinas-encimeras",
  "cocinas-electrodomesticos",
  "cocinas-montaje",
  "ventanas-hero",
  "ventanas-pvc",
  "ventanas-aluminio",
  "ventanas-correderas",
  "ventanas-instalacion",
];
// Full-bleed hero-style images get an extra, larger variant for big screens.
const extraWidths = {
  "banos-hero": [2400],
  "azulejos-hero": [2400],
  "cocinas-hero": [2400],
  "ventanas-hero": [2400],
};
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

// Brand logos (assets/logos/, see the README there): each raw file the user
// drops in — svg/png/jpg/webp, any colors, with or without a transparent
// background — is turned into assets/logos/<slug>-mono.png, a flat white
// cutout on a transparent background. That's what dark.css's screen-reader-
// free grayscale/invert trick can't reliably do by itself: a real logo is
// rarely a clean black-mark-on-white bitmap, so this reads the actual
// pixels instead of guessing from CSS. scripts/generate-pages.mjs looks for
// this exact "-mono.png" file per brand.
const logosDir = "assets/logos";
let logoFiles;
try {
  logoFiles = await readdir(logosDir);
} catch {
  logoFiles = [];
}
for (const file of logoFiles) {
  const match = file.match(/^(.+)\.(svg|png|jpe?g|webp)$/i);
  if (!match || match[1].endsWith("-mono")) continue;
  const slug = match[1];
  const src = `${logosDir}/${file}`;
  const out = `${logosDir}/${slug}-mono.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixelCount = width * height;
  let hasTransparency = false;
  let totalLuminance = 0;
  for (let i = 0; i < pixelCount; i++) {
    const o = i * channels;
    const a = data[o + 3];
    if (a < 250) hasTransparency = true;
    totalLuminance += (0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]) * (a / 255);
  }
  const avgLuminance = totalLuminance / pixelCount;
  const monoPixels = Buffer.alloc(pixelCount * 4);
  for (let i = 0; i < pixelCount; i++) {
    const o = i * channels;
    const a = data[o + 3];
    let alpha;
    if (hasTransparency) {
      // Real transparency: keep it as-is. The mark is painted pure white
      // below regardless of its original color, so this alone is enough.
      alpha = a;
    } else {
      const luminance = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
      // Opaque source: figure out ink vs. background from the page's own
      // average brightness, then turn the ink into alpha (dark-on-light
      // logos need inverting; light-on-dark ones already read correctly).
      alpha = Math.round(avgLuminance >= 128 ? 255 - luminance : luminance);
    }
    const oo = i * 4;
    monoPixels[oo] = monoPixels[oo + 1] = monoPixels[oo + 2] = 255;
    monoPixels[oo + 3] = alpha;
  }
  await sharp(monoPixels, { raw: { width, height, channels: 4 } }).png().toFile(out);
  console.log(out);
}
