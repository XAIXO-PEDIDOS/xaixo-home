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
│   ├── logo.png (+ logo-source.png), apple-touch-icon.png, icon-512.png
│   ├── logos/ (logos de marca, ver el README de esa carpeta)
│   ├── manrope-variable.woff2
│   └── manrope-OFL.txt
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── og/ (imágenes Open Graph, una por página con hero propio)
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
- `aviso-legal.html`, `politica-privacidad.html`, `cookies.html`: páginas legales con texto base estándar y plantilla oscura, con los datos identificativos de Materiales Xaixo Home S.L. ya rellenos.
- `vite.config.js`: declara las 8 páginas como entradas de `build.rollupOptions.input` para que `vite build` las genere todas.
- `styles.css`: diseño, responsive, animaciones, cabecera, menú, footer, botón de WhatsApp, estados interactivos y el sistema `.reveal`/`.motion` (scroll reveal). También el CSS propio de la home (hero con parallax, manifiesto, selector de espacios, proyectos) y de las páginas legales, en su capa de layout; los colores del tema oscuro de estos elementos viven en `dark.css`.
- `dark.css`: el tema oscuro de todo el sitio (clase `body.dark-page`) — los componentes de la plantilla editorial de las páginas de categoría (hero a pantalla completa, bloques de producto con foto sticky, cinta de marcas, proceso, simulador y CTA con foto de fondo) y los colores oscuros de la home, el menú móvil, el pie y las páginas legales. Se carga junto a `styles.css`, que sigue aportando la cabecera, el menú, el pie y el botón de WhatsApp compartidos.
- `app.js`: animación del hero ligada al scroll, selector de ambientes, parallax genérico (`data-px`, usado por la plantilla oscura), swipe táctil, menú fullscreen, ampliación de proyectos, reveals y cursor contextual (`data-cursor`). Se carga como módulo de Vite; las funciones específicas de cada página se autodetectan y no se ejecutan en el resto.
- `build.mjs`: genera la versión de producción con Vite.
- `scripts/generate-assets.mjs`: regenera las variantes responsive de las imágenes (`npm run generate:assets`); convierte automáticamente a WebP cualquier fuente `.png`/`.jpg` que aún no tenga su `.webp` **comprobando el contenido real del archivo con `sharp`, no la extensión** (alguna fuente ha llegado con extensión `.webp` conteniendo en realidad un PNG o, en el caso de `azulejos-hero`, un PNG de 3840×2160 sin comprimir — si un hero pesa varios MB tras regenerar, es probable que la fuente haya llegado así). No toca la fuente: `assets/manrope-variable.woff2` es la fuente variable (subset latin, pesos 200-800) copiada tal cual del paquete `@fontsource-variable/manrope` — ver el comentario al inicio del script para cómo actualizarla. También procesa `assets/logos/`: cualquier logo de marca que se deje ahí (en sus colores y fondo originales) se convierte en un recorte blanco sobre transparente (`<marca>-mono.png`), leyendo los píxeles reales en vez de asumir un filtro CSS — ver `assets/logos/README.md`. Y genera `public/favicon.ico`, `assets/apple-touch-icon.png` y `assets/icon-512.png` a partir de `assets/logo.png` sobre fondo `#1c1815`, más un recorte 1200×630 de cada hero en `public/og/<hero>.jpg` para Open Graph/Twitter card.
- `scripts/generate-pages.mjs`: regenera las 4 páginas de categoría (array `DARK_PAGES`) y las 3 páginas legales (`npm run generate:pages`) a partir del header, el pie de página, el botón de WhatsApp y el menú móvil de `index.html` (delimitados por los comentarios `SHARED-*`, fuente única de verdad) y de los textos definidos en el propio script. Cada entrada de `DARK_PAGES` puede marcar una imagen con `aiImage: true` para que el HTML generado incluya el TODO de "imagen generada por IA". Las marcas de la cinta y de las etiquetas de cada bloque de producto (`brands`/`brandsTicker`) se resuelven con el logo de `assets/logos/` si existe, o como texto si no. También genera el bloque de `<meta>` Open Graph/Twitter, `canonical` y los `<link>` de favicon de cada página, y `public/sitemap.xml` con las 8 URLs (constante `SITE_URL`, hoy `https://xaixohome.com`: cámbiala si el dominio final es otro y vuelve a generar).
- `assets/`: fotografías optimizadas (con variantes responsive para `srcset`), logo, iconos, logos de marca (`logos/`) y la fuente variable Manrope (`manrope-variable.woff2`, pesos 200-800, con su licencia OFL en `manrope-OFL.txt`) usados por la web.
- `public/`: archivos que Vite copia tal cual a la raíz de `dist/` sin procesarlos — `favicon.ico` (referenciado como `/favicon.ico`, para el caso de que un navegador lo pida directamente sin mirar los `<link>`), `robots.txt` y `sitemap.xml` (necesitan vivir en la raíz del sitio, no bajo `assets/`), y `og/` (las imágenes Open Graph, referenciadas por URL absoluta en un `<meta content>`, que Vite no reescribe como sí hace con `<img src>` o `<link href>`).

## Imágenes y derechos

Todas las fotografías de `assets/` (`home-hero`, `banos-*`, `azulejos-*`, `cocinas-*`, `ventanas-*`) son imágenes generadas por IA (confirmado por metadatos XMP `photoshop:Credit="Made with Google AI"` / `DigitalSourceType="trainedAlgorithmicMedia"` en varias de ellas), usadas como referencia de estilo mientras no hay fotografía propia. Cada uso en el HTML lleva un comentario `<!-- TODO: imagen generada por IA... -->` salvo las 6 de `banos-*` de la tanda anterior a esta convención, que de momento no lo llevan pero probablemente son de la misma naturaleza.

Antes de publicar esta web como página comercial definitiva, todas estas imágenes deben sustituirse por fotografías propias de Xaixo Home, imágenes de stock con licencia comercial o imágenes cuya autorización se haya obtenido.

## Formulario de presupuesto

En el pie de página (`id="contacto"`, compartido por las 8 páginas) hay un wizard a pantalla completa, una pregunta por pantalla, en vez de un formulario plano: 1) qué necesita (tarjetas grandes con la hero de cada categoría de fondo, avanza solo al elegir), 2) en qué punto está (píldoras, avanza solo), 3) mensaje libre (textarea sin caja, solo línea inferior) — el plan gratuito de Web3Forms no admite adjuntos, así que en vez de subir un archivo hay una línea discreta que enlaza a WhatsApp con el texto precargado para quien tenga plano o fotos —, y 4) nombre/teléfono/email con etiqueta flotante y la casilla de privacidad. Barra de progreso y contador arriba, botón atrás, Enter avanza (salvo en el mensaje, donde inserta salto de línea), foco movido al primer control de cada paso y un `aria-live` que anuncia el cambio de paso — las transiciones se saltan con `prefers-reduced-motion`. Envía por [Web3Forms](https://web3forms.com) sin backend propio (`fetch` a su API, con todas las respuestas incluidas en el campo `message`), con el *access key* ya configurado en la constante `WEB3FORMS_ACCESS_KEY` al principio de `app.js` (cuenta dada de alta con `javierxaixo@gmail.com`; los envíos llegan a ese email). Para cambiar de cuenta o clave, genera una nueva en Web3Forms y sustituye ahí el valor — no hace falta tocar el HTML ni volver a generar las páginas.

Validación por paso (no puedes avanzar sin elegir tarjeta/píldora, sin escribir algo en el mensaje, o con el email o la casilla de privacidad sin marcar en el último paso), con mensajes de error en el mismo tono que el resto del sitio, más un honeypot oculto contra spam. La pantalla final saluda por el nombre, ofrece el botón de WhatsApp como alternativa y un enlace para enviar otra solicitud.

## SEO y redes sociales

Cada página lleva ya `canonical`, favicon/iconos y las etiquetas Open Graph y Twitter Card correspondientes (ver `scripts/generate-pages.mjs`). El sitio ya no lleva `<meta name="robots" content="noindex, nofollow">` en ninguna página: es rastreable e indexable. `public/robots.txt` permite el rastreo completo y enlaza a `public/sitemap.xml` (generado por `npm run generate:pages`, con las 8 URLs en su forma sin `.html` — la que usa el sitio publicado). Nota: `canonical`/`og:url` sí siguen usando `.html` (p. ej. `https://xaixohome.com/azulejos.html`) mientras que el sitemap usa la forma limpia (`https://xaixohome.com/azulejos`); si el hosting final sirve las páginas sin extensión, conviene revisar y unificar ambos antes de publicar.

## Publicación fuera de ChatGPT

Puedes subir el contenido generado dentro de `dist/` a cualquier alojamiento estático, por ejemplo Netlify, Vercel, Cloudflare Pages o un servidor web convencional. No se necesita base de datos ni backend para esta versión.

Los enlaces de secciones todavía no desarrolladas apuntan deliberadamente a la web actual de Xaixo Home. Se han conservado sin cambios para que esta exportación coincida con la versión publicada.
