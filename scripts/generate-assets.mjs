// One-off/regenerable pipeline for derived assets: responsive image variants.
// Run with `npm run generate:assets` whenever the source photos change.
//
// The Manrope font (assets/manrope-variable.woff2) is not derived here: it's
// the variable-weight WOFF2 (latin subset, weights 200-800) copied straight
// from the @fontsource-variable/manrope npm package — see assets/manrope-OFL.txt
// for its license. To update it: `npm pack @fontsource-variable/manrope`,
// extract, and copy files/manrope-latin-wght-normal.woff2 over it.
import { access, mkdir, readdir, writeFile } from "node:fs/promises";
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
  "azulejos-outlet-1",
  "azulejos-outlet-2",
  "azulejos-outlet-3",
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

// Open Graph / Twitter card images: a 1200x630 crop of each hero photo (the
// standard OG size). `attention` picks the most "interesting" region of the
// frame automatically rather than hardcoding a crop per photo. JPEG, not
// WebP, since some link-preview crawlers still don't render WebP previews.
// These live under public/, not assets/: they're referenced by an absolute
// URL inside a <meta content> value in scripts/generate-pages.mjs, which
// Vite's HTML plugin never rewrites (unlike <img src> or <link href>), so a
// build wouldn't otherwise copy or fingerprint them.
await mkdir("public/og", { recursive: true });
const ogSources = ["home-hero", "azulejos-hero", "cocinas-hero", "banos-hero", "ventanas-hero"];
for (const name of ogSources) {
  const out = `public/og/${name}.jpg`;
  await sharp(`assets/${name}.webp`)
    .resize({ width: 1200, height: 630, fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82 })
    .toFile(out);
  console.log(out);
}

// Favicon + app icons: assets/logo.png is a white mark on a transparent
// background, so it needs the brand's dark background composited behind it
// to be visible as an icon. The logo is a wide wordmark, not a square mark,
// so it's scaled to fit within the icon with some padding rather than
// filling it edge to edge.
const ICON_BG = { r: 0x1c, g: 0x18, b: 0x15, alpha: 1 };
async function iconBuffer(size) {
  const mark = await sharp("assets/logo.png")
    .resize({ width: Math.round(size * 0.72) })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: ICON_BG } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
}

// Minimal single-file ICO container: a directory of PNG-compressed frames.
// Supported by every browser since IE11/Vista, so no need for a bitmap
// encoder or an extra dependency just for the classic favicon.ico.
function buildIco(frames) {
  const dirSize = 6 + 16 * frames.length;
  const dir = Buffer.alloc(dirSize);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(frames.length, 4);
  let offset = dirSize;
  frames.forEach(({ size, buffer }, i) => {
    const entry = dir.subarray(6 + i * 16, 6 + i * 16 + 16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
  });
  return Buffer.concat([dir, ...frames.map((f) => f.buffer)]);
}

const icoSizes = [16, 32, 48];
const icoFrames = await Promise.all(icoSizes.map(async (size) => ({ size, buffer: await iconBuffer(size) })));
await mkdir("public", { recursive: true });
await writeFile("public/favicon.ico", buildIco(icoFrames));
console.log("public/favicon.ico");

await sharp(await iconBuffer(180)).toFile("assets/apple-touch-icon.png");
console.log("assets/apple-touch-icon.png");
await sharp(await iconBuffer(512)).toFile("assets/icon-512.png");
console.log("assets/icon-512.png");

// Brand logos (assets/logos/, see the README there): each raw file the user
// drops in — svg/png/jpg/webp, any colors, with or without a transparent
// background — is turned into assets/logos/<slug>-mono.png, a flat white
// cutout on a transparent background, cropped to its real content box (no
// transparent margins) and normalized to the same height. That's what
// dark.css's grayscale/invert trick alone can't do reliably: a real logo is
// rarely a clean black-mark-on-white bitmap with no padding baked in, so
// this reads the actual pixels instead of guessing from CSS.
// scripts/generate-pages.mjs looks for this exact "-mono.png" file per
// brand; dark.css displays it at half this height (2x export, for retina).
const LOGO_HEIGHT = 80;
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

  // Crop to the real content box (drop transparent margins baked into the
  // source canvas) so every logo fills its own bounding box the same way,
  // then normalize to a shared height — otherwise a logo exported on a
  // generously padded canvas would end up tiny next to a tightly cropped
  // one even though the marks themselves are a similar size.
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (monoPixels[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  let pipeline = sharp(monoPixels, { raw: { width, height, channels: 4 } });
  if (maxX >= 0) pipeline = pipeline.extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 });
  await pipeline.resize({ height: LOGO_HEIGHT }).png().toFile(out);
  console.log(out);
}
