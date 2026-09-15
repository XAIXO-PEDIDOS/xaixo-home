# Logos de marca

Deja aquí el logo tal cual lo tengas — cualquier color, con o sin fondo
transparente, en `.svg`, `.png`, `.jpg` o `.webp` — nombrado
`<nombre-en-minúsculas-con-guiones>.<extensión>` (quitando acentos y
sustituyendo espacios por guiones; así deriva el nombre `scripts/generate-pages.mjs`
a partir del nombre de la marca). Archivos esperados ahora mismo:

- Azulejos: `navarti`, `halcon-ceramicas`, `ktl`, `vilar-albaro`,
  `tercocer`, `alaplana`, `benesol`
- Cocinas: `nobilia`
- Ventanas: `replus`

Dos pasos después de añadir o cambiar un archivo:

1. `npm run generate:assets` — lee los píxeles reales del logo y genera
   `<nombre>-mono.png`: un recorte blanco sobre fondo transparente,
   funcione el original con fondo blanco (marca oscura sobre claro) o ya
   venga en claro sobre oscuro. Este es el archivo que se sirve; el
   original puede conservarse o borrarse.
2. `npm run generate:pages` — regenera las páginas de categoría; cada una
   comprueba en ese momento (no en el navegador) si existe el
   `-mono.png` de cada marca y usa el logo si lo hay, o el nombre como
   texto si no.
