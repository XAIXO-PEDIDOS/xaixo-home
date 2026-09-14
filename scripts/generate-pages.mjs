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
const FOOTER_HTML = extractBetween(
  indexHtml,
  "<!-- SHARED-FOOTER:START (kept in sync across pages by scripts/generate-pages.mjs) -->",
  "<!-- SHARED-FOOTER:END -->",
);
const WHATSAPP_HTML = extractBetween(
  indexHtml,
  "<!-- SHARED-WHATSAPP:START (kept in sync across pages by scripts/generate-pages.mjs) -->",
  "<!-- SHARED-WHATSAPP:END -->",
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
</main>
${FOOTER_HTML}
${MENU_HTML}
${WHATSAPP_HTML}
</body>
</html>
`;
}

const LEGAL_PAGES = [
  {
    slug: "aviso-legal",
    title: "Aviso Legal | Xaixo Home",
    description: "Condiciones de uso y datos identificativos del titular del sitio web de Xaixo Home.",
    heading: "AVISO LEGAL",
    bodyHtml: `<h2 class="reveal">1. Datos identificativos</h2>
<p class="reveal">En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa de los siguientes datos: el titular de este sitio web es <!-- TODO: nombre fiscal --> (Xaixo Home), con CIF <!-- TODO: CIF -->, y domicilio en Gran Via Castell de Bairén, 20, 46702 Gandia (Valencia).</p>
<h2 class="reveal">2. Objeto</h2>
<p class="reveal">El presente sitio web tiene por objeto ofrecer información sobre los servicios de reforma, cocinas, baños e interiorismo de Xaixo Home.</p>
<h2 class="reveal">3. Condiciones de uso</h2>
<p class="reveal">El acceso a este sitio web es gratuito y su uso implica la aceptación plena de las condiciones aquí recogidas. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para incurrir en actividades ilícitas o contrarias a la buena fe.</p>
<h2 class="reveal">4. Propiedad intelectual e industrial</h2>
<p class="reveal">Los contenidos de este sitio web (textos, imágenes, diseño y código) son propiedad de Xaixo Home o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
<h2 class="reveal">5. Responsabilidad</h2>
<p class="reveal">Xaixo Home no se hace responsable de los daños derivados de un uso inadecuado de este sitio web, ni garantiza la ausencia de interrupciones o errores en el acceso al mismo.</p>
<h2 class="reveal">6. Legislación aplicable</h2>
<p class="reveal">Las presentes condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio del titular, salvo que la normativa de consumidores establezca otro fuero.</p>`,
  },
  {
    slug: "politica-privacidad",
    title: "Política de Privacidad | Xaixo Home",
    description: "Cómo trata Xaixo Home los datos personales de las personas usuarias del sitio web.",
    heading: "POLÍTICA DE PRIVACIDAD",
    bodyHtml: `<h2 class="reveal">1. Responsable del tratamiento</h2>
<p class="reveal">El responsable del tratamiento de los datos personales recabados a través de este sitio web es <!-- TODO: nombre fiscal --> (Xaixo Home), con CIF <!-- TODO: CIF -->, domicilio en Gran Via Castell de Bairén, 20, 46702 Gandia (Valencia), teléfono 615 439 842.</p>
<h2 class="reveal">2. Finalidad del tratamiento</h2>
<p class="reveal">Los datos facilitados a través de los formularios de contacto o WhatsApp se utilizan para atender consultas, elaborar presupuestos y gestionar la relación comercial con la persona usuaria.</p>
<h2 class="reveal">3. Legitimación</h2>
<p class="reveal">La base legal para el tratamiento es el consentimiento de la persona interesada, prestado al facilitar sus datos y contactar con Xaixo Home.</p>
<h2 class="reveal">4. Destinatarios</h2>
<p class="reveal">Los datos no se cederán a terceros salvo obligación legal. Podrán tratarse a través de proveedores de servicios (por ejemplo, alojamiento web o mensajería) que actúan como encargados del tratamiento.</p>
<h2 class="reveal">5. Derechos de las personas interesadas</h2>
<p class="reveal">Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un correo o escribiendo al domicilio indicado, adjuntando copia de un documento que acredite tu identidad.</p>
<h2 class="reveal">6. Conservación de los datos</h2>
<p class="reveal">Los datos se conservarán mientras sean necesarios para la finalidad para la que se recabaron y, posteriormente, durante los plazos legalmente exigibles.</p>`,
  },
  {
    slug: "cookies",
    title: "Política de Cookies | Xaixo Home",
    description: "Qué cookies utiliza el sitio web de Xaixo Home y cómo puedes gestionarlas.",
    heading: "POLÍTICA DE COOKIES",
    bodyHtml: `<h2 class="reveal">1. Qué son las cookies</h2>
<p class="reveal">Las cookies son pequeños archivos que se almacenan en tu navegador al visitar un sitio web. Se utilizan para recordar tus preferencias y mejorar el funcionamiento del sitio.</p>
<h2 class="reveal">2. Cookies utilizadas en este sitio</h2>
<p class="reveal">Este sitio web utiliza únicamente cookies técnicas necesarias para su correcto funcionamiento. <!-- TODO: actualizar este apartado si se incorporan cookies de análisis, personalización o publicidad --></p>
<h2 class="reveal">3. Cómo gestionar las cookies</h2>
<p class="reveal">Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador que utilices. Consulta la ayuda de tu navegador para más información.</p>`,
  },
];

function renderLegalPage(page) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#eeeae3"><title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23262421'/%3E%3Cpath d='M17 15l30 34m0-34L17 49' stroke='%23eeeae3' stroke-width='5'/%3E%3C/svg%3E">
<link rel="preload" href="assets/manrope.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css">
<script type="module" src="/app.js"></script>
</head>
<body>
<a class="skip" href="#legal-content">Saltar al contenido</a>
${HEADER_HTML}
<main>
<section class="legal-page section-pad" id="legal-content">
<h1 class="reveal">${page.heading}</h1>
${page.bodyHtml}
</section>
</main>
${FOOTER_HTML}
${MENU_HTML}
${WHATSAPP_HTML}
</body>
</html>
`;
}

for (const page of PAGES) {
  const html = renderPage(page);
  await writeFile(`${page.slug}.html`, html);
  console.log(`${page.slug}.html`);
}

for (const page of LEGAL_PAGES) {
  const html = renderLegalPage(page);
  await writeFile(`${page.slug}.html`, html);
  console.log(`${page.slug}.html`);
}
