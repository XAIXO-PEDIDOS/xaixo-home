import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const page = (name) => resolve(root, `${name}.html`);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page("index"),
        azulejos: page("azulejos"),
        cocinas: page("cocinas"),
        banos: page("banos"),
        ventanas: page("ventanas"),
        avisoLegal: page("aviso-legal"),
        politicaPrivacidad: page("politica-privacidad"),
        cookies: page("cookies"),
      },
    },
  },
});
