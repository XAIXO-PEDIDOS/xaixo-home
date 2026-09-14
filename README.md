# Xaixo Home — código fuente

Exportación de la versión publicada en:

https://xaixo-home-espacios.javixaixo.chatgpt.site/

La web es un proyecto estático estándar (HTML, CSS y JavaScript), preparado con Vite para poder ejecutarlo y alojarlo fuera de `chatgpt.site`. No depende de ninguna función propietaria de ChatGPT Sites.

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
│   ├── manrope.ttf
│   └── manrope.woff2
├── scripts/
│   └── generate-assets.mjs
├── app.js
├── build.mjs
├── image-sources.json
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── styles.css
```

## Archivos principales

- `index.html`: estructura completa de la HOME.
- `styles.css`: diseño, responsive, animaciones, menú, hero y estados interactivos.
- `app.js`: animación del hero ligada al scroll, selector de ambientes, swipe táctil, menú fullscreen, ampliación de proyectos, reveals y cursor contextual. Se carga como módulo de Vite.
- `build.mjs`: genera la versión de producción con Vite y copia `image-sources.json` a `dist/`.
- `scripts/generate-assets.mjs`: regenera `manrope.woff2` y las variantes responsive de las imágenes (`npm run generate:assets`) cuando cambian los archivos fuente en `assets/`.
- `assets/`: fotografías optimizadas (con variantes de 800/1200/1600px para `srcset`) y fuente Manrope (WOFF2 con fallback TTF) usada por la web.
- `image-sources.json`: procedencia y situación de derechos de las imágenes de inspiración.

## Imágenes y derechos

Las imágenes incluidas permiten reproducir exactamente la versión visual actual, pero son referencias temporales de inspiración procedentes de un proyecto de Dom Arquitectura, con fotografías acreditadas a Jordi Anguera. No se encontró una licencia de reutilización comercial.

Antes de publicar esta web como página comercial definitiva, deben sustituirse por fotografías propias de Xaixo Home, imágenes de stock con licencia comercial o imágenes cuya autorización se haya obtenido. La correspondencia completa está documentada en `image-sources.json`.

## Publicación fuera de ChatGPT

Puedes subir el contenido generado dentro de `dist/` a cualquier alojamiento estático, por ejemplo Netlify, Vercel, Cloudflare Pages o un servidor web convencional. No se necesita base de datos ni backend para esta versión.

Los enlaces de secciones todavía no desarrolladas apuntan deliberadamente a la web actual de Xaixo Home. Se han conservado sin cambios para que esta exportación coincida con la versión publicada.
