import { copyFile } from "node:fs/promises";
import { build } from "vite";

await build();

await copyFile("image-sources.json", "dist/image-sources.json");
