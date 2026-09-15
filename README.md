# Xaixo Home — código fuente

Exportación de la versión publicada en:

https://xaixo-home-espacios.javixaixo.chatgpt.site/

La web es un proyecto estático estándar (HTML, CSS y JavaScript) multipágina, preparado con Vite para poder ejecutarlo y alojarlo fuera de `chatgpt.site`. No depende de ninguna función propietaria de ChatGPT Sites.

Páginas: `index.html` (home), 4 páginas de categoría de producto — `azulejos.html`, `cocinas.html`, `banos.html`, `ventanas.html` — y 3 páginas legales — `aviso-legal.html`, `politica-privacidad.html`, `cookies.html` —, cada una con su propio `<title>`/meta description. Todas comparten cabecera, pie con datos de contacto (`id="contacto"`) y botón flotante de WhatsApp. La home además incluye un JSON-LD `HomeAndConstructionBusiness` en el `<head>`.

Xaixo Home vende y asesora sobre materiales (azulejos, cocinas, baños, ventanas); **solo instala cocinas y ventanas**, azulejos y baños se sirven listos para el instalador del cliente.

Las páginas de categoría usan dos plantillas distintas, ambas generadas por `scripts/generate-pages.mjs`:
- **Plantilla clara** (`azulejos.html`, `cocinas.html`, `ventanas.html`, array `PAGES`): hero, tarjetas de producto, franja de marcas (placeholder), "Cómo trabajamos" (`PROCESS_STEPS_INSTALL`/`PROCESS_STEPS_MATERIALS` según el flag `installs`), inspiración y doble CTA. Estilos en `styles.css`.
- **Plantilla oscura editorial** (`banos.html`, array `DARK_PAGES`): hero a pantalla completa con parallax, bloques de producto con foto sticky alternando lado, cinta de marcas en movimiento, "Así lo hacemos" y CTA final con foto de fondo, dirección y teléfono. Estilos en `dark.css` (pensada para reutilizarse en `azulejos`/`cocinas`/`ventanas` cuando tengan su propia fotografía). Las cifras destacadas (ej. "+400 referencias") están marcadas con `<!-- TODO -->`: son de muestra, pendientes de un dato real de Xaixo Home.

Ambas plantillas comparten cabecera, menú móvil, pie con datos de contacto (`id="contacto"`) y botón flotante de WhatsApp, extraídos de `index.html` (comentarios `SHARED-*`). La home además incluye un JSON-LD `HomeAndConstructionBusiness` en el `<head>`.

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
│   ├── bathroom.webp (+ variantes -800.webp)
│   ├── exterior.webp (+ variantes -800/-1200.webp)
│   ├── hero.webp (+ variantes -800/-1200/-1600.webp)
│   ├── house.webp (+ variantes -800/-1200.webp)
│   ├── kitchen.webp (+ variantes -800/-1200.webp)
│   ├── living.webp (+ variantes -800/-1200.webp)
│   ├── logo.png (+ logo-source.png)
│   ├── manrope.ttf
│   └── manrope.woff2
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
├── image-sources.json
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

- `index.html`: estructura completa de la HOME, incluye el JSON-LD `HomeAndConstructionBusiness` en el `<head>`.
- `azulejos.html`, `cocinas.html`, `ventanas.html`: páginas de categoría con la plantilla clara (hero, intro, tarjetas de producto, marcas, cómo trabajamos, inspiración y doble CTA). `cocinas.html` incluye además el contenedor `#simulador`, pendiente del simulador de presupuesto.
- `banos.html`: página de categoría con la plantilla oscura editorial (ver arriba). No usa `#incluye`/tarjetas ni la sección de inspiración de la plantilla clara.
- `aviso-legal.html`, `politica-privacidad.html`, `cookies.html`: páginas legales con texto base estándar. Marcadas con `<!-- TODO -->` donde falta el nombre fiscal y el CIF reales.
- `vite.config.js`: declara las 8 páginas como entradas de `build.rollupOptions.input` para que `vite build` las genere todas.
- `styles.css`: diseño, responsive, animaciones, menú, hero, footer, botón de WhatsApp, estados interactivos y el sistema `.reveal`/`.motion` (scroll reveal) que reutiliza `dark.css`.
- `dark.css`: componentes de la plantilla oscura editorial (hero a pantalla completa, bloques de producto con foto sticky, cinta de marcas, proceso y CTA con foto de fondo). Se carga junto a `styles.css`, que sigue aportando la cabecera, el menú, el pie y el botón de WhatsApp compartidos.
- `app.js`: animación del hero ligada al scroll, selector de ambientes, parallax genérico (`data-px`, usado por la plantilla oscura), swipe táctil, menú fullscreen, ampliación de proyectos, reveals y cursor contextual (`data-cursor`). Se carga como módulo de Vite; las funciones específicas de cada página se autodetectan y no se ejecutan en el resto.
- `build.mjs`: genera la versión de producción con Vite y copia `image-sources.json` a `dist/`.
- `scripts/generate-assets.mjs`: regenera `manrope.woff2` y las variantes responsive de las imágenes (`npm run generate:assets`); convierte automáticamente a WebP cualquier fuente `.png`/`.jpg` que aún no tenga su `.webp`.
- `scripts/generate-pages.mjs`: regenera las 4 páginas de categoría (arrays `PAGES` y `DARK_PAGES`, una plantilla cada uno) y las 3 páginas legales (`npm run generate:pages`) a partir del header, el pie de página, el botón de WhatsApp y el menú móvil de `index.html` (delimitados por los comentarios `SHARED-*`, fuente única de verdad) y de los textos definidos en el propio script.
- `assets/`: fotografías optimizadas (con variantes responsive para `srcset`), logo y fuente Manrope (WOFF2 con fallback TTF) usados por la web.
- `image-sources.json`: procedencia y situación de derechos de las imágenes de inspiración de stock (no aplica a las fotografías propias de `banos-*`).

## Imágenes y derechos

Las imágenes incluidas permiten reproducir exactamente la versión visual actual, pero son referencias temporales de inspiración procedentes de un proyecto de Dom Arquitectura, con fotografías acreditadas a Jordi Anguera. No se encontró una licencia de reutilización comercial.

Antes de publicar esta web como página comercial definitiva, deben sustituirse por fotografías propias de Xaixo Home, imágenes de stock con licencia comercial o imágenes cuya autorización se haya obtenido. La correspondencia completa está documentada en `image-sources.json`.

## Publicación fuera de ChatGPT

Puedes subir el contenido generado dentro de `dist/` a cualquier alojamiento estático, por ejemplo Netlify, Vercel, Cloudflare Pages o un servidor web convencional. No se necesita base de datos ni backend para esta versión.

Los enlaces de secciones todavía no desarrolladas apuntan deliberadamente a la web actual de Xaixo Home. Se han conservado sin cambios para que esta exportación coincida con la versión publicada.
