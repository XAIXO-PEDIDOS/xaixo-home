# Xaixo Home — código fuente

Exportación de la versión publicada en:

https://xaixo-home-espacios.javixaixo.chatgpt.site/

La web es un proyecto estático estándar (HTML, CSS y JavaScript) multipágina, preparado con Vite para poder ejecutarlo y alojarlo fuera de `chatgpt.site`. No depende de ninguna función propietaria de ChatGPT Sites.

Páginas: `index.html` (home), 4 páginas de categoría de producto — `azulejos.html`, `cocinas.html`, `banos.html`, `ventanas.html` — y 3 páginas legales — `aviso-legal.html`, `politica-privacidad.html`, `cookies.html` —, cada una con su propio `<title>`/meta description. Todas comparten cabecera, pie con datos de contacto (`id="contacto"`) y botón flotante de WhatsApp. La home además incluye un JSON-LD `HomeAndConstructionBusiness` en el `<head>`.

Xaixo Home vende y asesora sobre materiales (azulejos, cocinas, baños, ventanas); **solo instala cocinas y ventanas**, azulejos y baños se sirven listos para el instalador del cliente.

Las 4 páginas de categoría comparten una única plantilla oscura editorial, generada por `scripts/generate-pages.mjs` (array `DARK_PAGES`): hero a pantalla completa con parallax y cifra destacada, frase-declaración, 4 bloques de producto con foto sticky alternando lado (cifra, texto, marcas y "Ver la galería"), cinta de marcas en movimiento, "Así lo hacemos" en 3 pasos y un cierre con foto de fondo, dirección, horario, teléfono y doble CTA. `cocinas.html` añade además una sección `#simulador` (placeholder, pendiente del simulador de presupuesto) antes del cierre. Estilos en `dark.css`; los botones y la cifra de cada bloque son datos por página, no está grabado el texto en la plantilla. Las cifras destacadas (ej. "+400 referencias") y las 15 fotografías generadas por IA de `azulejos-*`/`cocinas-*`/`ventanas-*` (más las 6 de `banos-*` de una tanda anterior) están marcadas con `<!-- TODO -->` en el HTML: son de muestra/IA, pendientes de datos y fotografías reales de Xaixo Home.

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
│   ├── bathroom.webp (+ variantes -800.webp)
│   ├── exterior.webp (+ variantes -800/-1200.webp)
│   ├── hero.webp (+ variantes -800/-1200/-1600.webp)
│   ├── house.webp (+ variantes -800/-1200.webp)
│   ├── kitchen.webp (+ variantes -800/-1200.webp)
│   ├── living.webp (+ variantes -800/-1200.webp)
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
- `azulejos.html`, `cocinas.html`, `banos.html`, `ventanas.html`: las 4 páginas de categoría, todas con la plantilla oscura editorial (ver arriba).
- `aviso-legal.html`, `politica-privacidad.html`, `cookies.html`: páginas legales con texto base estándar. Marcadas con `<!-- TODO -->` donde falta el nombre fiscal y el CIF reales.
- `vite.config.js`: declara las 8 páginas como entradas de `build.rollupOptions.input` para que `vite build` las genere todas.
- `styles.css`: diseño, responsive, animaciones, cabecera, menú, footer, botón de WhatsApp, estados interactivos y el sistema `.reveal`/`.motion` (scroll reveal) que reutiliza `dark.css`. También el CSS propio de la home (hero con parallax, manifiesto, selector de espacios, proyectos) y de las páginas legales.
- `dark.css`: todos los componentes de la plantilla oscura editorial (hero a pantalla completa, bloques de producto con foto sticky, cinta de marcas, proceso, simulador y CTA con foto de fondo). Se carga junto a `styles.css`, que sigue aportando la cabecera, el menú, el pie y el botón de WhatsApp compartidos.
- `app.js`: animación del hero ligada al scroll, selector de ambientes, parallax genérico (`data-px`, usado por la plantilla oscura), swipe táctil, menú fullscreen, ampliación de proyectos, reveals y cursor contextual (`data-cursor`). Se carga como módulo de Vite; las funciones específicas de cada página se autodetectan y no se ejecutan en el resto.
- `build.mjs`: genera la versión de producción con Vite y copia `image-sources.json` a `dist/`.
- `scripts/generate-assets.mjs`: regenera las variantes responsive de las imágenes (`npm run generate:assets`); convierte automáticamente a WebP cualquier fuente `.png`/`.jpg` que aún no tenga su `.webp` **comprobando el contenido real del archivo con `sharp`, no la extensión** (alguna fuente ha llegado con extensión `.webp` conteniendo en realidad un PNG). No toca la fuente: `assets/manrope-variable.woff2` es la fuente variable (subset latin, pesos 200-800) copiada tal cual del paquete `@fontsource-variable/manrope` — ver el comentario al inicio del script para cómo actualizarla.
- `scripts/generate-pages.mjs`: regenera las 4 páginas de categoría (array `DARK_PAGES`) y las 3 páginas legales (`npm run generate:pages`) a partir del header, el pie de página, el botón de WhatsApp y el menú móvil de `index.html` (delimitados por los comentarios `SHARED-*`, fuente única de verdad) y de los textos definidos en el propio script. Cada entrada de `DARK_PAGES` puede marcar una imagen con `aiImage: true` para que el HTML generado incluya el TODO de "imagen generada por IA".
- `assets/`: fotografías optimizadas (con variantes responsive para `srcset`), logo y la fuente variable Manrope (`manrope-variable.woff2`, pesos 200-800, con su licencia OFL en `manrope-OFL.txt`) usados por la web.
- `image-sources.json`: procedencia y situación de derechos de las imágenes de inspiración de stock originales de la home (`kitchen`/`bathroom`/`living`/`exterior`/`house`). No aplica a las fotografías de `banos-*`/`azulejos-*`/`cocinas-*`/`ventanas-*`, que son generadas por IA (ver abajo).

## Imágenes y derechos

Dos procedencias distintas conviven en `assets/`:

- `kitchen`/`bathroom`/`living`/`exterior`/`house` (usadas en la home): referencias temporales de inspiración procedentes de un proyecto de Dom Arquitectura, con fotografías acreditadas a Jordi Anguera. No se encontró una licencia de reutilización comercial. Correspondencia completa en `image-sources.json`.
- `banos-*`, `azulejos-*`, `cocinas-*`, `ventanas-*` (usadas en las páginas de categoría): imágenes generadas por IA (confirmado por metadatos XMP `photoshop:Credit="Made with Google AI"` / `DigitalSourceType="trainedAlgorithmicMedia"` en varias de ellas). Cada uso en el HTML lleva un comentario `<!-- TODO: imagen generada por IA... -->` salvo las 6 de `banos-*` de la tanda anterior a esta convención, que de momento no lo llevan pero probablemente son de la misma naturaleza.

Antes de publicar esta web como página comercial definitiva, todas estas imágenes deben sustituirse por fotografías propias de Xaixo Home, imágenes de stock con licencia comercial o imágenes cuya autorización se haya obtenido.

## Publicación fuera de ChatGPT

Puedes subir el contenido generado dentro de `dist/` a cualquier alojamiento estático, por ejemplo Netlify, Vercel, Cloudflare Pages o un servidor web convencional. No se necesita base de datos ni backend para esta versión.

Los enlaces de secciones todavía no desarrolladas apuntan deliberadamente a la web actual de Xaixo Home. Se han conservado sin cambios para que esta exportación coincida con la versión publicada.
