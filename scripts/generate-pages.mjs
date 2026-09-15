// Generates the 4 category pages (azulejos.html, cocinas.html, banos.html,
// ventanas.html) from shared header/menu markup lifted straight out of
// index.html (the single source of truth for those blocks, delimited by the
// SHARED-HEADER/SHARED-MENU comment markers) plus per-page content defined
// below.
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

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Gran+Via+Castell+de+Bair%C3%A9n+20%2C+Gandia";

// Xaixo Home only installs kitchens and windows; azulejos and baños are
// materials sold and advised on, fitted by the client's own installer.
const PROCESS_STEPS_INSTALL = ["Visita y medición", "Diseño 3D y presupuesto cerrado", "Instalación con nuestro equipo"];
const PROCESS_STEPS_MATERIALS = [
  "Nos cuentas tu proyecto",
  "Te asesoramos y elegimos juntos los materiales en el showroom",
  "Te lo servimos en obra listo para tu instalador",
];

// Generic brand placeholders shown on every category page until real logos
// from the brands Xaixo Home works with are available.
const BRAND_PLACEHOLDERS = ["MARCA 01", "MARCA 02", "MARCA 03", "MARCA 04", "MARCA 05", "MARCA 06"];

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
    slug: "azulejos",
    title: "Azulejos y porcelánico en Gandía | Xaixo Home",
    description:
      "Suelos porcelánicos, revestimientos y grandes formatos para toda la casa en Gandía. Asesoramiento y materiales de las mejores marcas en nuestro showroom.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "AZULEJOS Y PORCELÁNICO PARA TODA LA CASA",
    heroImage: "living",
    heroAlt: "Suelos y revestimientos de porcelánico, imagen temporal de referencia",
    heroPlaceholderNote:
      "TODO: foto de referencia temporal (salón) a falta de una fotografía real de azulejos/porcelánico de Xaixo Home",
    intro:
      "Suelos, revestimientos y grandes formatos de los mejores fabricantes. Los ves en nuestro showroom de Gandia y te los servimos en obra.",
    cards: [
      { title: "Suelos porcelánicos", desc: "Gran resistencia y acabados que imitan piedra, madera o cemento." },
      { title: "Revestimientos", desc: "Paredes con carácter, en formato clásico o gran formato." },
      { title: "Exterior y piscina", desc: "Antideslizante y resistente a la intemperie." },
      { title: "Grandes formatos", desc: "Superficies continuas de hasta 320 × 160 cm." },
    ],
    gallery: ["exterior", "house", "kitchen"],
  },
  {
    slug: "cocinas",
    title: "Cocinas a medida en Gandía | Xaixo Home",
    description:
      "Diseño 3D, mobiliario a medida e instalación completa de cocinas en Gandía y la Safor. Un mismo equipo del plano al montaje.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "COCINAS A MEDIDA, DISEÑADAS E INSTALADAS POR NOSOTROS",
    heroImage: "kitchen",
    heroAlt: "Cocina contemporánea de materiales naturales, referencia de inspiración",
    intro: "Del diseño en 3D a la instalación, con el mismo equipo.",
    cards: [
      { title: "Mobiliario", desc: "Diseño a medida, con los acabados y la distribución que necesitas." },
      { title: "Encimeras", desc: "Cuarzo, compacto o piedra natural, a la medida de tu cocina." },
      { title: "Electrodomésticos", desc: "Integrados o de libre instalación, de las mejores marcas." },
    ],
    gallery: ["living", "exterior", "house"],
    simulator: true,
    installs: true,
  },
  {
    slug: "banos",
    title: "Baños a medida en Gandía | Xaixo Home",
    description:
      "Sanitarios, muebles de baño, platos de ducha, mamparas y cerámica en Gandía. Asesoramiento y materiales de las mejores marcas en nuestro showroom.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "BAÑOS",
    heroImage: "bathroom",
    heroAlt: "Baño de piedra clara y luz suave, referencia de inspiración",
    intro:
      "Todo lo que necesita tu baño, elegido con criterio. Platos de ducha, mamparas, muebles, grifería y cerámica de las mejores marcas.",
    cards: [
      { title: "Sanitarios y grifería", desc: "Inodoros, lavabos y grifería de diseño y bajo consumo." },
      { title: "Muebles de baño", desc: "Muebles a medida y de catálogo, con encimeras a juego." },
      { title: "Platos de ducha y mamparas", desc: "Resina, mampara de vidrio templado y sistemas antical." },
      { title: "Cerámica y porcelánico", desc: "Pavimento y revestimiento de las mejores marcas." },
    ],
    gallery: ["kitchen", "living", "house"],
  },
  {
    slug: "ventanas",
    title: "Ventanas de PVC y aluminio en Gandía | Xaixo Home",
    description:
      "Ventanas de PVC y aluminio medidas e instaladas por Xaixo Home en Gandía. Aislamiento, seguridad y ahorro energético.",
    heroEyebrow: "XAIXO HOME — GANDÍA",
    heroTitle: "VENTANAS DE PVC Y ALUMINIO, MEDIDAS E INSTALADAS",
    heroImage: "exterior",
    heroAlt: "Cerramientos y ventanas de aluminio, imagen temporal de referencia",
    heroPlaceholderNote:
      "TODO: foto de referencia temporal (exterior) a falta de una fotografía real de ventanas instaladas por Xaixo Home",
    intro: "Aislamiento, seguridad y ahorro energético para tu casa.",
    cards: [
      { title: "Ventanas de PVC", desc: "Máximo aislamiento térmico y acústico." },
      { title: "Ventanas de aluminio", desc: "Perfiles esbeltos con rotura de puente térmico." },
      { title: "Correderas y cerramientos", desc: "Grandes paños de vidrio y cerramientos de terraza." },
    ],
    gallery: ["house", "living", "kitchen"],
    installs: true,
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

function cardsMarkup(cards) {
  return cards
    .map(
      (card, i) =>
        `<li class="reveal"><span class="cards-num">0${i + 1}</span><strong>${card.title}</strong><span class="card-desc">${card.desc}</span></li>`,
    )
    .join("");
}

function brandsMarkup(brands) {
  return brands.map((brand) => `<li class="reveal">${brand}</li>`).join("");
}

function renderPage(page) {
  const cardsItems = cardsMarkup(page.cards);
  const brandsItems = brandsMarkup(BRAND_PLACEHOLDERS);
  const steps = page.installs ? PROCESS_STEPS_INSTALL : PROCESS_STEPS_MATERIALS;
  const processItems = steps
    .map((step, i) => `<li class="reveal"><span class="process-num">0${i + 1}</span><p>${step}</p></li>`)
    .join("");
  const galleryItems = page.gallery.map(galleryImageMarkup).join("");

  const simulatorSection = page.simulator
    ? `<section class="simulator section-pad" id="simulador">
<div class="section-kicker reveal"><span>04 — PRESUPUESTO</span><span>SIMULADOR</span></div>
<h2 class="section-title reveal">CALCULA TU<br><span>PRESUPUESTO ORIENTATIVO</span></h2>
<!-- TODO: simulador interactivo de presupuesto (próxima iteración) -->
<p class="simulator-placeholder reveal">Muy pronto podrás calcular aquí un presupuesto orientativo.</p>
</section>
`
    : "";
  const galleryNumber = page.simulator ? "05" : "04";
  const heroImageComment = page.heroPlaceholderNote ? `<!-- ${page.heroPlaceholderNote} -->\n` : "";

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
${heroImageComment}${heroPictureMarkup(page.heroImage, page.heroAlt)}
<div class="hero-shade"></div>
<div class="page-hero-copy"><div class="hero-eyebrow">${page.heroEyebrow}</div><h1>${page.heroTitle}</h1></div>
</section>
<section class="page-intro section-pad">
<p class="reveal">${page.intro}</p>
</section>
<section class="includes section-pad" id="incluye">
<div class="section-kicker reveal"><span>01 — QUÉ INCLUYE</span><span>SERVICIO COMPLETO</span></div>
<h2 class="section-title reveal">QUÉ INCLUYE<span class="title-dot">.</span></h2>
<ul class="cards-grid">
${cardsItems}
</ul>
</section>
<section class="brands section-pad" id="marcas">
<div class="section-kicker reveal"><span>02 — MARCAS</span><span>CON LAS QUE TRABAJAMOS</span></div>
<h2 class="section-title reveal">MARCAS<span class="title-dot">.</span></h2>
<!-- TODO: sustituir estos placeholders por los logotipos reales de las marcas con las que trabaja Xaixo Home -->
<ul class="brands-grid">
${brandsItems}
</ul>
</section>
<section class="process section-pad" id="como-trabajamos">
<div class="section-kicker reveal"><span>03 — CÓMO TRABAJAMOS</span><span>3 PASOS</span></div>
<h2 class="section-title reveal">CÓMO<br><span>TRABAJAMOS</span></h2>
<ol class="process-steps">
${processItems}
</ol>
</section>
${simulatorSection}<section class="gallery section-pad" id="inspiracion">
<div class="section-kicker reveal"><span>${galleryNumber} — INSPIRACIÓN</span><span>REFERENCIAS VISUALES</span></div>
<h2 class="section-title reveal">INSPIRACIÓN<span class="title-dot">.</span></h2>
<!-- TODO: sustituir estas imágenes de assets/ (fotos de referencia) por fotografías reales de proyectos de Xaixo Home -->
<div class="gallery-grid">
${galleryItems}
</div>
</section>
<section class="page-cta section-pad" aria-label="Pide tu presupuesto">
<div class="page-cta-inner reveal">
<h2>¿EMPEZAMOS?</h2>
<div class="page-cta-actions">
<a class="page-cta-button" href="#contacto">PIDE TU PRESUPUESTO <span>↗</span></a>
<a class="page-cta-button page-cta-button--ghost" href="${MAPS_URL}" target="_blank" rel="noopener">VISITA EL SHOWROOM <span>↗</span></a>
</div>
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
<p class="reveal">El presente sitio web tiene por objeto ofrecer información sobre los materiales y servicios de azulejos, cocinas, baños y ventanas de Xaixo Home.</p>
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
