// Generates the 5 category pages (cocinas.html, banos.html, salon.html,
// exterior.html, vivienda-completa.html) from shared header/menu markup
// lifted straight out of index.html (the single source of truth for those
// blocks, delimited by the SHARED-HEADER/SHARED-MENU comment markers) plus
// per-page content defined below.
//
// Run with `npm run generate:pages` after editing this file, or after
// changing the header/menu in index.html so the new pages pick it up.
import { readFile, writeFile } from "node:fs/promises";

const indexHtml = await readFile("index.html", "utf8");

function extractBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1) throw new Error(`Markers not found: ${startMarker}`);
  return html.slice(start + startMarker.length, end).trim();
}

const HEADER_HTML = extractBetween(
  indexHtml,
  "<!-- SHARED-HEADER:START (kept in sync across pages by scripts/generate-pages.mjs) -->",
  "<!-- SHARED-HEADER:END -->",
);
const MENU_HTML = extractBetween(
  indexHtml,
  "<!-- SHARED-MENU:START (kept in sync across pages by scripts/generate-pages.mjs) -->",
  "<!-- SHARED-MENU:END -->",
);

const PROCESS_STEPS = [
  "Visita y medición en tu casa o en el showroom",
  "Diseño 3D y presupuesto cerrado",
  "Instalación con nuestro equipo",
];

// width/height per source photo, from assets/*.webp real dimensions
const IMAGE_DIMS = {
  kitchen: [1600, 1067],
  bathroom: [1067, 1600],
  living: [1600, 1067],
  exterior: [1600, 1067],
  house: [1600, 936],
};

const PAGES = [
  {
    slug: "cocinas",
    navNumber: "01",
    title: "Cocinas a medida en Gandía | Xaixo Home",
    description:
      "Diseño 3D, mobiliario a medida e instalación completa de cocinas en Gandía y la Safor. Un mismo equipo del plano al montaje.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "COCINAS",
    heroImage: "kitchen",
    heroAlt: "Cocina contemporánea de materiales naturales, referencia de inspiración",
    intro:
      "Cocinas a medida diseñadas contigo. Del plano en 3D a la instalación, todo con el mismo equipo.",
    incluye: ["Diseño 3D personalizado", "Mobiliario a medida", "Encimeras y electrodomésticos", "Instalación completa"],
    gallery: ["living", "exterior", "house"],
    simulator: true,
  },
  {
    slug: "banos",
    navNumber: "02",
    title: "Baños a medida en Gandía | Xaixo Home",
    description:
      "Platos de ducha, mamparas, muebles y cerámica para tu baño en Gandía. Elegidos e instalados por el mismo equipo.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "BAÑOS",
    heroImage: "bathroom",
    heroAlt: "Baño de piedra clara y luz suave, referencia de inspiración",
    intro:
      "Baños que se disfrutan cada día. Platos de ducha, mamparas, muebles y cerámica, elegidos y colocados por nosotros.",
    incluye: ["Sanitarios y grifería", "Muebles de baño", "Cerámica y porcelánico", "Instalación y albañilería"],
    gallery: ["kitchen", "living", "house"],
  },
  {
    slug: "salon",
    navNumber: "03",
    title: "Reforma de salones en Gandía | Xaixo Home",
    description:
      "Pavimentos, revestimientos, iluminación y mobiliario a medida para tu salón en Gandía. Diseño e instalación con un mismo equipo.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "SALÓN",
    heroImage: "living",
    heroAlt: "Salón cálido y abierto, referencia de inspiración",
    intro: "El espacio donde pasa la vida. Suelos, revestimientos y mobiliario para que el salón sea tuyo.",
    incluye: ["Pavimentos y porcelánicos", "Revestimientos de pared", "Iluminación", "Mobiliario a medida"],
    gallery: ["kitchen", "exterior", "house"],
  },
  {
    slug: "exterior",
    navNumber: "04",
    title: "Terrazas y exteriores en Gandía | Xaixo Home",
    description:
      "Porcelánico antideslizante, tarima, cerámica de piscina y cerramientos para tu terraza o exterior en Gandía.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "EXTERIOR",
    heroImage: "exterior",
    heroAlt: "Exterior de arquitectura mediterránea, referencia de inspiración",
    intro: "Terrazas y exteriores para vivir fuera. Porcelánico antideslizante, tarima y cerramientos.",
    incluye: ["Pavimento exterior", "Tarima y composite", "Cerámica para piscina", "Pérgolas y cerramientos"],
    gallery: ["living", "house", "kitchen"],
  },
  {
    slug: "vivienda-completa",
    navNumber: "05",
    title: "Reforma integral de vivienda en Gandía | Xaixo Home",
    description:
      "Proyecto integral de reforma con un solo interlocutor: diseño, materiales e instalación coordinados de principio a fin en Gandía.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "VIVIENDA COMPLETA",
    heroImage: "house",
    heroAlt: "Vivienda contemporánea, referencia de inspiración",
    intro: "Toda la casa con un solo interlocutor. Coordinamos diseño, materiales e instalación de principio a fin.",
    incluye: ["Proyecto integral", "Un solo presupuesto", "Coordinación de gremios", "Plazos cerrados"],
    gallery: ["kitchen", "bathroom", "living"],
  },
];

function heroPictureMarkup(image, alt) {
  const [w, h] = IMAGE_DIMS[image];
  const srcset = [800, 1200, w]
    .filter((width, i, arr) => arr.indexOf(width) === i && width <= w)
    .map((width) => (width === w ? `assets/${image}.webp ${w}w` : `assets/${image}-${width}.webp ${width}w`))
    .join(", ");
  return `<img class="page-hero-image" src="assets/${image}.webp" srcset="${srcset}" sizes="100vw" alt="${alt}" width="${w}" height="${h}" fetchpriority="high">`;
}

function heroPreloadMarkup(image) {
  const [w] = IMAGE_DIMS[image];
  const srcset = [800, 1200, w]
    .filter((width, i, arr) => arr.indexOf(width) === i && width <= w)
    .map((width) => (width === w ? `assets/${image}.webp ${w}w` : `assets/${image}-${width}.webp ${width}w`))
    .join(", ");
  return `<link rel="preload" href="assets/${image}.webp" as="image" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high">`;
}

function galleryImageMarkup(image) {
  const [w, h] = IMAGE_DIMS[image];
  const srcset = [800, 1200, w]
    .filter((width, i, arr) => arr.indexOf(width) === i && width <= w)
    .map((width) => (width === w ? `assets/${image}.webp ${w}w` : `assets/${image}-${width}.webp ${width}w`))
    .join(", ");
  return `<img class="reveal" src="assets/${image}.webp" srcset="${srcset}" sizes="(max-width: 700px) 45vw, 30vw" alt="Referencia visual, imagen temporal" width="${w}" height="${h}" loading="lazy" decoding="async">`;
}

function renderPage(page) {
  const incluyeItems = page.incluye
    .map((item, i) => `<li class="reveal"><span class="includes-num">0${i + 1}</span><span>${item}</span></li>`)
    .join("");
  const processItems = PROCESS_STEPS.map(
    (step, i) => `<li class="reveal"><span class="process-num">0${i + 1}</span><p>${step}</p></li>`,
  ).join("");
  const galleryItems = page.gallery.map(galleryImageMarkup).join("");

  const simulatorSection = page.simulator
    ? `<section class="simulator section-pad" id="simulador">
<div class="section-kicker reveal"><span>03 — PRESUPUESTO</span><span>SIMULADOR</span></div>
<h2 class="section-title reveal">CALCULA TU<br><span>PRESUPUESTO ORIENTATIVO</span></h2>
<!-- TODO: simulador interactivo de presupuesto (próxima iteración) -->
<p class="simulator-placeholder reveal">Muy pronto podrás calcular aquí un presupuesto orientativo.</p>
</section>
`
    : "";
  const galleryNumber = page.simulator ? "04" : "03";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#eeeae3"><title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23262421'/%3E%3Cpath d='M17 15l30 34m0-34L17 49' stroke='%23eeeae3' stroke-width='5'/%3E%3C/svg%3E">
<link rel="preload" href="assets/manrope.woff2" as="font" type="font/woff2" crossorigin>
${heroPreloadMarkup(page.heroImage)}
<link rel="stylesheet" href="styles.css">
<script type="module" src="/app.js"></script>
</head>
<body>
<a class="skip" href="#incluye">Saltar al contenido</a>
${HEADER_HTML}
<main>
<section class="page-hero" id="inicio" aria-label="${page.heroTitle}">
${heroPictureMarkup(page.heroImage, page.heroAlt)}
<div class="hero-shade"></div>
<div class="page-hero-copy"><div class="hero-eyebrow">${page.heroEyebrow}</div><h1>${page.heroTitle}</h1></div>
</section>
<section class="page-intro section-pad">
<p class="reveal">${page.intro}</p>
</section>
<section class="includes section-pad" id="incluye">
<div class="section-kicker reveal"><span>01 — QUÉ INCLUYE</span><span>SERVICIO COMPLETO</span></div>
<h2 class="section-title reveal">QUÉ INCLUYE<span class="title-dot">.</span></h2>
<ul class="includes-grid">
${incluyeItems}
</ul>
</section>
<section class="process section-pad" id="como-trabajamos">
<div class="section-kicker reveal"><span>02 — CÓMO TRABAJAMOS</span><span>3 PASOS</span></div>
<h2 class="section-title reveal">CÓMO<br><span>TRABAJAMOS</span></h2>
<ol class="process-steps">
${processItems}
</ol>
</section>
${simulatorSection}<section class="gallery section-pad" id="galeria">
<div class="section-kicker reveal"><span>${galleryNumber} — GALERÍA</span><span>REFERENCIAS VISUALES</span></div>
<h2 class="section-title reveal">GALERÍA<span class="title-dot">.</span></h2>
<!-- TODO: sustituir estas imágenes de assets/ (fotos de referencia) por fotografías reales de proyectos de Xaixo Home -->
<div class="gallery-grid">
${galleryItems}
</div>
</section>
<section class="page-cta section-pad" aria-label="Pide tu presupuesto">
<div class="page-cta-inner reveal">
<h2>¿EMPEZAMOS?</h2>
<a class="page-cta-button" href="#contacto">PIDE TU PRESUPUESTO <span>↗</span></a>
</div>
</section>
<div class="page-footer"><span>XAIXO HOME · GANDÍA</span><a href="#inicio">VOLVER ARRIBA ↑</a></div>
</main>
${MENU_HTML}
</body>
</html>
`;
}

for (const page of PAGES) {
  const html = renderPage(page);
  await writeFile(`${page.slug}.html`, html);
  console.log(`${page.slug}.html`);
}
