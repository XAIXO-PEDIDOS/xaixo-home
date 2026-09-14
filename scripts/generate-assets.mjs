// One-off/regenerable pipeline for derived assets: WOFF2 font + responsive image variants.
// Run with `npm run generate:assets` whenever assets/manrope.ttf or the source photos change.
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { compress } from "wawoff2";

const ttf = await readFile("assets/manrope.ttf");
const woff2 = await compress(ttf);
await writeFile("assets/manrope.woff2", woff2);
console.log(`assets/manrope.woff2 (${woff2.length} bytes)`);

const widths = [800, 1200, 1600];
const images = ["hero", "kitchen", "bathroom", "living", "exterior", "house"];

for (const name of images) {
  const source = `assets/${name}.webp`;
  const { width: nativeWidth } = await sharp(source).metadata();
  for (const width of widths) {
    if (width >= nativeWidth) continue; // never upscale past the source
    const out = `assets/${name}-${width}.webp`;
    await sharp(source).resize({ width }).webp({ quality: 82 }).toFile(out);
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
