# Xaixo Home — código fuente

Exportación de la versión publicada en:

https://xaixo-home-espacios.javixaixo.chatgpt.site/

La web es un proyecto estático estándar (HTML, CSS y JavaScript) multipágina, preparado con Vite para poder ejecutarlo y alojarlo fuera de `chatgpt.site`. No depende de ninguna función propietaria de ChatGPT Sites.

Páginas: `index.html` (home), 4 páginas de categoría de producto — `azulejos.html`, `cocinas.html`, `banos.html`, `ventanas.html` — y 3 páginas legales — `aviso-legal.html`, `politica-privacidad.html`, `cookies.html` —, cada una con su propio `<title>`/meta description. Todas comparten cabecera, pie con datos de contacto (`id="contacto"`) y botón flotante de WhatsApp. La home además incluye un JSON-LD `HomeAndConstructionBusiness` en el `<head>`.

Xaixo Home vende y asesora sobre materiales (azulejos, cocinas, baños, ventanas); **solo instala cocinas y ventanas**, azulejos y baños se sirven listos para el instalador del cliente.

Todo el sitio usa la misma plantilla editorial oscura (`dark.css`, clase `body.dark-page`): las 4 páginas de categoría, generadas por `scripts/generate-pages.mjs` (array `DARK_PAGES`) — hero a pantalla completa con parallax y cifra destacada, frase-declaración, 4 bloques de producto con foto sticky alternando lado (cifra, texto, marcas y "Ver la galería"), cinta de marcas en movimiento, "Así lo hacemos" en 3 pasos y un cierre con foto de fondo, dirección, horario, teléfono y doble CTA (`cocinas.html` añade además una sección `#simulador` placeholder antes del cierre); la home (`index.html`), que mantiene su propio hero con parallax, manifiesto y selector "¿Qué necesitas?" (estos tres, definidos en `styles.css`, solo reciben de `dark.css` los colores del tema oscuro); y las 3 páginas legales. La sección "Proyectos" de la home está comentada en el HTML (con un `<!-- TODO -->`) hasta tener obras reales de Xaixo Home que mostrar. Las cifras destacadas (ej. "+400 referencias") y las fotografías generadas por IA están marcadas con `<!-- TODO -->` en el HTML: son de muestra/IA, pendientes de datos y fotografías reales de Xaixo Home.

Todas las páginas comparten cabecera, menú móvil, pie con datos de contacto (`id="contacto"`) y botón flotante de WhatsApp, extraídos de `index.html` (comentarios `SHARED-*`). La home además incluye un JSON-LD `HomeAndConstructionBusiness` en el `<head>`.

## Requisitos

- Node.js 20.19 o superior, o Node.js 22.12 o superior.
- npm.

## Ejecutar en local

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local, normalmente `http://localhost:5173/`.

## Generar la versión de producción

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`. Para comprobarlo localmente:

```bash
npm run preview
```

## Estructura

```text
xaixo-home-codigo-completo/
├── assets/
│   ├── home-hero.webp (+ variantes -800/-1200/-1600.webp)
│   ├── logo.png (+ logo-source.png)
│   ├── manrope-variable.woff2
│   └── manrope-OFL.txt
├── scripts/
│   ├── generate-assets.mjs
│   └── generate-pages.mjs
├── app.js
├── aviso-legal.html
├── azulejos.html
├── banos.html
├── build.mjs
├── cocinas.html
├── cookies.html
├── dark.css
├── index.html
├── package.json
├── package-lock.json
├── politica-privacidad.html
├── README.md
├── styles.css
├── vite.config.js
└── ventanas.html
```

## Archivos principales

- `index.html`: estructura completa de la HOME (plantilla oscura, ver arriba), incluye el JSON-LD `HomeAndConstructionBusiness` en el `<head>`.
- `azulejos.html`, `cocinas.html`, `banos.html`, `ventanas.html`: las 4 páginas de categoría, todas con la plantilla oscura editorial (ver arriba).
- `aviso-legal.html`, `politica-privacidad.html`, `cookies.html`: páginas legales con texto base estándar y plantilla oscura. Marcadas con `<!-- TODO -->` donde falta el nombre fiscal y el CIF reales.
- `vite.config.js`: declara las 8 páginas como entradas de `build.rollupOptions.input` para que `vite build` las genere todas.
- `styles.css`: diseño, responsive, animaciones, cabecera, menú, footer, botón de WhatsApp, estados interactivos y el sistema `.reveal`/`.motion` (scroll reveal). También el CSS propio de la home (hero con parallax, manifiesto, selector de espacios, proyectos) y de las páginas legales, en su capa de layout; los colores del tema oscuro de estos elementos viven en `dark.css`.
- `dark.css`: el tema oscuro de todo el sitio (clase `body.dark-page`) — los componentes de la plantilla editorial de las páginas de categoría (hero a pantalla completa, bloques de producto con foto sticky, cinta de marcas, proceso, simulador y CTA con foto de fondo) y los colores oscuros de la home, el menú móvil, el pie y las páginas legales. Se carga junto a `styles.css`, que sigue aportando la cabecera, el menú, el pie y el botón de WhatsApp compartidos.
- `app.js`: animación del hero ligada al scroll, selector de ambientes, parallax genérico (`data-px`, usado por la plantilla oscura), swipe táctil, menú fullscreen, ampliación de proyectos, reveals y cursor contextual (`data-cursor`). Se carga como módulo de Vite; las funciones específicas de cada página se autodetectan y no se ejecutan en el resto.
- `build.mjs`: genera la versión de producción con Vite.
- `scripts/generate-assets.mjs`: regenera las variantes responsive de las imágenes (`npm run generate:assets`); convierte automáticamente a WebP cualquier fuente `.png`/`.jpg` que aún no tenga su `.webp` **comprobando el contenido real del archivo con `sharp`, no la extensión** (alguna fuente ha llegado con extensión `.webp` conteniendo en realidad un PNG). No toca la fuente: `assets/manrope-variable.woff2` es la fuente variable (subset latin, pesos 200-800) copiada tal cual del paquete `@fontsource-variable/manrope` — ver el comentario al inicio del script para cómo actualizarla.
- `scripts/generate-pages.mjs`: regenera las 4 páginas de categoría (array `DARK_PAGES`) y las 3 páginas legales (`npm run generate:pages`) a partir del header, el pie de página, el botón de WhatsApp y el menú móvil de `index.html` (delimitados por los comentarios `SHARED-*`, fuente única de verdad) y de los textos definidos en el propio script. Cada entrada de `DARK_PAGES` puede marcar una imagen con `aiImage: true` para que el HTML generado incluya el TODO de "imagen generada por IA".
- `assets/`: fotografías optimizadas (con variantes responsive para `srcset`), logo y la fuente variable Manrope (`manrope-variable.woff2`, pesos 200-800, con su licencia OFL en `manrope-OFL.txt`) usados por la web.

## Imágenes y derechos

Todas las fotografías de `assets/` (`home-hero`, `banos-*`, `azulejos-*`, `cocinas-*`, `ventanas-*`) son imágenes generadas por IA (confirmado por metadatos XMP `photoshop:Credit="Made with Google AI"` / `DigitalSourceType="trainedAlgorithmicMedia"` en varias de ellas), usadas como referencia de estilo mientras no hay fotografía propia. Cada uso en el HTML lleva un comentario `<!-- TODO: imagen generada por IA... -->` salvo las 6 de `banos-*` de la tanda anterior a esta convención, que de momento no lo llevan pero probablemente son de la misma naturaleza.

Antes de publicar esta web como página comercial definitiva, todas estas imágenes deben sustituirse por fotografías propias de Xaixo Home, imágenes de stock con licencia comercial o imágenes cuya autorización se haya obtenido.

## Publicación fuera de ChatGPT

Puedes subir el contenido generado dentro de `dist/` a cualquier alojamiento estático, por ejemplo Netlify, Vercel, Cloudflare Pages o un servidor web convencional. No se necesita base de datos ni backend para esta versión.

Los enlaces de secciones todavía no desarrolladas apuntan deliberadamente a la web actual de Xaixo Home. Se han conservado sin cambios para que esta exportación coincida con la versión publicada.
