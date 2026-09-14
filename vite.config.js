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
        cocinas: page("cocinas"),
        banos: page("banos"),
        salon: page("salon"),
        exterior: page("exterior"),
        viviendaCompleta: page("vivienda-completa"),
      },
    },
  },
});
