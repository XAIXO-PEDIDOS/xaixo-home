# Xaixo Home — código fuente

Exportación de la versión publicada en:

https://xaixo-home-espacios.javixaixo.chatgpt.site/

La web es un proyecto estático estándar (HTML, CSS y JavaScript) multipágina, preparado con Vite para poder ejecutarlo y alojarlo fuera de `chatgpt.site`. No depende de ninguna función propietaria de ChatGPT Sites.

Páginas: `index.html` (home), 5 páginas de espacio — `cocinas.html`, `banos.html`, `salon.html`, `exterior.html`, `vivienda-completa.html` — y 3 páginas legales — `aviso-legal.html`, `politica-privacidad.html`, `cookies.html` —, cada una con su propio `<title>`/meta description. Todas comparten cabecera, pie con datos de contacto (`id="contacto"`) y botón flotante de WhatsApp. La home además incluye un JSON-LD `HomeAndConstructionBusiness` en el `<head>`.

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
├── banos.html
├── build.mjs
├── cocinas.html
├── cookies.html
├── exterior.html
├── image-sources.json
├── index.html
├── package.json
├── package-lock.json
├── politica-privacidad.html
├── README.md
├── salon.html
├── styles.css
├── vite.config.js
└── vivienda-completa.html
```

## Archivos principales

- `index.html`: estructura completa de la HOME, incluye el JSON-LD `HomeAndConstructionBusiness` en el `<head>`.
- `cocinas.html`, `banos.html`, `salon.html`, `exterior.html`, `vivienda-completa.html`: páginas de cada espacio (hero, intro, qué incluye, cómo trabajamos, galería y CTA). `cocinas.html` incluye además el contenedor `#simulador`, pendiente del simulador de presupuesto.
- `aviso-legal.html`, `politica-privacidad.html`, `cookies.html`: páginas legales con texto base estándar. Marcadas con `<!-- TODO -->` donde falta el nombre fiscal y el CIF reales.
- `vite.config.js`: declara las 9 páginas como entradas de `build.rollupOptions.input` para que `vite build` las genere todas.
- `styles.css`: diseño, responsive, animaciones, menú, hero, footer, botón de WhatsApp y estados interactivos.
- `app.js`: animación del hero ligada al scroll, selector de ambientes, swipe táctil, menú fullscreen, ampliación de proyectos, reveals y cursor contextual. Se carga como módulo de Vite; las funciones específicas de la home se autodetectan y no se ejecutan en el resto de páginas.
- `build.mjs`: genera la versión de producción con Vite y copia `image-sources.json` a `dist/`.
- `scripts/generate-assets.mjs`: regenera `manrope.woff2`, las variantes responsive de las imágenes y `assets/logo.png` (`npm run generate:assets`) cuando cambian los archivos fuente en `assets/`.
- `scripts/generate-pages.mjs`: regenera las 5 páginas de espacio y las 3 páginas legales (`npm run generate:pages`) a partir del header, el pie de página, el botón de WhatsApp y el menú móvil de `index.html` (delimitados por los comentarios `SHARED-*`, fuente única de verdad) y de los textos definidos en el propio script.
- `assets/`: fotografías optimizadas (con variantes de 800/1200/1600px para `srcset`), logo y fuente Manrope (WOFF2 con fallback TTF) usados por la web.
- `image-sources.json`: procedencia y situación de derechos de las imágenes de inspiración.

## Imágenes y derechos

Las imágenes incluidas permiten reproducir exactamente la versión visual actual, pero son referencias temporales de inspiración procedentes de un proyecto de Dom Arquitectura, con fotografías acreditadas a Jordi Anguera. No se encontró una licencia de reutilización comercial.

Antes de publicar esta web como página comercial definitiva, deben sustituirse por fotografías propias de Xaixo Home, imágenes de stock con licencia comercial o imágenes cuya autorización se haya obtenido. La correspondencia completa está documentada en `image-sources.json`.

## Publicación fuera de ChatGPT

Puedes subir el contenido generado dentro de `dist/` a cualquier alojamiento estático, por ejemplo Netlify, Vercel, Cloudflare Pages o un servidor web convencional. No se necesita base de datos ni backend para esta versión.

Los enlaces de secciones todavía no desarrolladas apuntan deliberadamente a la web actual de Xaixo Home. Se han conservado sin cambios para que esta exportación coincida con la versión publicada.
