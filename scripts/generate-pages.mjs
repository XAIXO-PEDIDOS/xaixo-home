// Generates the 4 category pages (azulejos.html, cocinas.html, banos.html,
// ventanas.html) — all on the dark editorial template, DARK_PAGES below —
// from shared header/menu markup lifted straight out of index.html (the
// single source of truth for those blocks, delimited by the
// SHARED-HEADER/SHARED-MENU comment markers) plus the 3 legal pages.
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

// The wordmark links to "/" in index.html's own copy of these blocks (home,
// scrolls to top instead of reloading — see app.js); every other generated
// page needs it pointing at "index.html" instead.
function forOtherPages(html) {
  return html.replaceAll('class="wordmark" href="/"', 'class="wordmark" href="index.html"');
}
const HEADER_HTML_OTHER = forOtherPages(HEADER_HTML);
const MENU_HTML_OTHER = forOtherPages(MENU_HTML);
const FOOTER_HTML_OTHER = forOtherPages(FOOTER_HTML);

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Gran+Via+Castell+de+Bair%C3%A9n+20%2C+Gandia";
const WHATSAPP_URL = "https://wa.me/34689248559?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20un%20proyecto";
const ADDRESS_LINE = "Gran Via Castell de Bairén, 20 · Gandia";
const HOURS_LINE = "Lunes a viernes, 7:00 a 19:00";
const PHONE_DISPLAY = "615 439 842";
const PHONE_TEL = "+34615439842";

const SAMPLE_FIGURE_NOTE = "<!-- TODO: cifra de muestra, sustituir por un dato real de Xaixo Home -->";
const AI_IMAGE_NOTE = "<!-- TODO: imagen generada por IA, sustituir por una fotografía real de un proyecto de Xaixo Home -->";

// width/height per source photo, from assets/*.webp real dimensions
const IMAGE_DIMS = {
  kitchen: [1600, 1067],
  bathroom: [1067, 1600],
  living: [1600, 1067],
  exterior: [1600, 1067],
  house: [1600, 936],
  "banos-hero": [1376, 768],
  "banos-platos": [1200, 896],
  "banos-muebles": [1200, 896],
  "banos-griferia": [896, 1200],
  "banos-ceramica": [1200, 896],
  "banos-showroom": [1920, 1080],
  "azulejos-hero": [1376, 768],
  "azulejos-suelos": [1200, 896],
  "azulejos-revestimientos": [896, 1200],
  "azulejos-exterior": [2336, 1744],
  "azulejos-formatos": [1744, 2336],
  "cocinas-hero": [2688, 1520],
  "cocinas-mobiliario": [1168, 880],
  "cocinas-encimeras": [1168, 880],
  "cocinas-electrodomesticos": [1168, 880],
  "cocinas-montaje": [880, 1168],
  "ventanas-hero": [1344, 752],
  "ventanas-pvc": [1344, 752],
  "ventanas-aluminio": [1168, 880],
  "ventanas-correderas": [880, 1168],
  "ventanas-instalacion": [880, 1168],
};

// --- Dark editorial template, shared by all 4 category pages. CSS lives in
// dark.css, loaded alongside styles.css for the shared header/menu/footer/
// WhatsApp button, @font-face and reveal-on-scroll system.
const DARK_PAGES = [
  {
    slug: "azulejos",
    title: "Azulejos y porcelánico en Gandía | Xaixo Home",
    description:
      "Suelos porcelánicos, revestimientos, exterior y grandes formatos en el showroom de Xaixo Home en Gandía. Los ves y comparas antes de comprar.",
    themeColor: "#1c1815",
    hero: {
      image: "azulejos-hero",
      alt: "Salón con suelo de porcelánico travertino y vista al mar a través de una puerta corredera, imagen de referencia",
      position: "center 58%",
      aiImage: true,
      title: "Azulejos",
      subtitle: "Suelos, revestimientos y grandes formatos de los mejores fabricantes. Los ves en el showroom de Gandia; te los servimos en obra.",
      figureValue: "+600",
      figureLabel: "referencias de pavimento y revestimiento en exposición permanente",
    },
    intro: {
      html: "Un azulejo se elige con luz natural. <b>Ven, compara piezas reales</b> y llévate el metro cuadrado calculado.",
      note: "No hacemos la instalación: te asesoramos, calculamos las cantidades exactas y lo servimos en obra listo para tu alicatador. Si no tienes uno, te ponemos en contacto con profesionales de confianza.",
    },
    products: [
      {
        title: "Suelos porcelánicos",
        desc: "Gran formato y formato tradicional, antideslizante para baño y cocina. Rectificado para junta mínima.",
        brands: ["Marca", "Marca", "Marca"],
        image: "azulejos-suelos",
        imageAlt: "Detalle de suelo porcelánico rectificado, vista a ras de suelo, imagen de referencia",
        aiImage: true,
        figureValue: "180",
        figureLabel: "referencias de suelo porcelánico",
      },
      {
        title: "Revestimientos",
        desc: "Pasta blanca y porcelánico para pared, en mate, brillo y relieve. Formatos desde 20 × 20 cm hasta gran formato.",
        brands: ["Marca", "Marca"],
        image: "azulejos-revestimientos",
        imageAlt: "Revestimiento cerámico acanalado en tono madera con balda y jarrón, imagen de referencia",
        imagePosition: "center 55%",
        aiImage: true,
        figureValue: "220",
        figureLabel: "referencias de revestimiento",
      },
      {
        title: "Exterior y piscina",
        desc: "Antideslizante clase C3, apto para playa de piscina y terraza. Resistente a heladas y a la sal.",
        brands: ["Marca", "Marca"],
        image: "azulejos-exterior",
        imageAlt: "Terraza con pavimento porcelánico antideslizante junto a una piscina, imagen de referencia",
        aiImage: true,
        figureValue: "60",
        figureLabel: "referencias para exterior y piscina",
      },
      {
        title: "Grandes formatos",
        desc: "Piezas de hasta 320 × 160 cm para suelo continuo o revestimiento sin apenas juntas. Cortadas a medida en el showroom.",
        brands: ["Marca", "Marca"],
        image: "azulejos-formatos",
        imageAlt: "Ducha revestida con una lámina de porcelánico de gran formato efecto mármol, imagen de referencia",
        aiImage: true,
        figureValue: "40",
        figureLabel: "referencias en gran formato",
      },
    ],
    brandsTicker: ["Marca uno", "Marca dos", "Marca tres", "Marca cuatro", "Marca cinco", "Marca seis"],
    steps: [
      { title: "Nos cuentas tu proyecto", desc: "Por WhatsApp o en el showroom. Con metros aproximados o un plano, mejor; sin ellos, también." },
      { title: "Elegimos juntos el material", desc: "Ves y tocas piezas reales, comparas con luz natural. Sales con un presupuesto cerrado." },
      { title: "Te lo servimos en obra", desc: "Todo en una entrega, en la fecha que necesite tu alicatador." },
    ],
    cta: {
      image: "banos-showroom",
      alt: "Fachada del showroom de Xaixo Home en Gandía",
      position: "center 62%",
      heading: "Ven a verlo<br>con tus ojos.",
      primary: { label: "Visita el showroom", href: MAPS_URL, external: true },
      secondary: { label: "Escríbenos por WhatsApp", href: WHATSAPP_URL, external: true },
    },
  },
  {
    slug: "cocinas",
    title: "Cocinas a medida en Gandía | Xaixo Home",
    description:
      "Cocinas diseñadas en 3D e instaladas por nuestro propio equipo en Gandía y la Safor. Mobiliario, encimeras y electrodomésticos.",
    themeColor: "#1c1815",
    hero: {
      image: "cocinas-hero",
      alt: "Cocina abierta con isla, mobiliario en tono arena y comedor con vistas al jardín, imagen de referencia",
      position: "center 55%",
      aiImage: true,
      title: "Cocinas",
      subtitle: "Diseñadas en 3D contigo e instaladas por nuestro equipo. Del plano a la última bisagra.",
      figureValue: "+120",
      figureLabel: "cocinas instaladas en la Safor",
    },
    intro: {
      html: "Una cocina no se compra por catálogo. <b>Se mide, se dibuja contigo</b> y se instala sin sorpresas.",
      note: "Diseño 3D, presupuesto cerrado e instalación con nuestro propio equipo, de principio a fin. Un único interlocutor durante toda la obra.",
    },
    products: [
      {
        title: "Mobiliario",
        desc: "Módulos a medida en melamina, laminado o lacado, con herrajes de cierre suave. Despensas y columnas hasta el techo.",
        brands: ["Marca", "Marca", "Marca"],
        image: "cocinas-mobiliario",
        imageAlt: "Armario despensa extraíble abierto junto a estantería de madera, imagen de referencia",
        imagePosition: "72% center",
        aiImage: true,
        figureValue: "40",
        figureLabel: "acabados de mobiliario en exposición",
      },
      {
        title: "Encimeras",
        desc: "Cuarzo, compacto y piedra natural, con canto recto o biselado. Fabricadas a medida de tu plano.",
        brands: ["Marca", "Marca"],
        image: "cocinas-encimeras",
        imageAlt: "Encimera de cuarzo blanco con canto a inglete y fregadero integrado, imagen de referencia",
        aiImage: true,
        figureValue: "25",
        figureLabel: "acabados de encimera en exposición",
      },
      {
        title: "Electrodomésticos",
        desc: "Integrados o de libre instalación: horno, inducción, frigorífico y lavavajillas de las mejores marcas.",
        brands: ["Marca", "Marca", "Marca"],
        image: "cocinas-electrodomesticos",
        imageAlt: "Horno y microondas integrados junto a placa de inducción con campana extractora, imagen de referencia",
        aiImage: true,
        figureValue: "15",
        figureLabel: "marcas de electrodomésticos",
      },
      {
        title: "Instalación propia",
        desc: "Montaje, conexión de agua y electrodomésticos, y ajustes finales con nuestro propio equipo, sin subcontratar.",
        brands: ["Marca", "Marca"],
        image: "cocinas-montaje",
        imageAlt: "Instalador montando muebles altos de cocina con nivel y taladro, imagen de referencia",
        imagePosition: "center 35%",
        aiImage: true,
        figureValue: "100%",
        figureLabel: "instalación con equipo propio, sin subcontratar",
      },
    ],
    brandsTicker: ["Marca uno", "Marca dos", "Marca tres", "Marca cuatro", "Marca cinco", "Marca seis"],
    steps: [
      { title: "Medimos en tu casa", desc: "Visitamos tu cocina actual y tomamos medidas reales, sin compromiso." },
      { title: "La diseñamos en 3D y cerramos presupuesto", desc: "Ves el resultado antes de decidir y sales con un precio cerrado." },
      { title: "La instalamos nosotros", desc: "Un único equipo, de principio a fin, sin cambios de interlocutor." },
    ],
    simulator: {
      title: "Calcula tu presupuesto orientativo",
    },
    cta: {
      image: "banos-showroom",
      alt: "Fachada del showroom de Xaixo Home en Gandía",
      position: "center 62%",
      heading: "Hablemos de<br>tu cocina.",
      primary: { label: "Pide tu presupuesto", href: "#contacto", external: false },
      secondary: { label: "Visita el showroom", href: MAPS_URL, external: true },
    },
  },
  {
    slug: "ventanas",
    title: "Ventanas de PVC y aluminio en Gandía | Xaixo Home",
    description:
      "Ventanas de PVC y aluminio medidas e instaladas por nuestro equipo en Gandía. Más aislamiento, más silencio, menos factura.",
    themeColor: "#1c1815",
    hero: {
      image: "ventanas-hero",
      alt: "Salón con gran ventanal corredero de aluminio abierto al mar, imagen de referencia",
      position: "center 42%",
      aiImage: true,
      title: "Ventanas",
      subtitle: "PVC y aluminio, medidas e instaladas por nosotros. Más aislamiento, más silencio, menos factura.",
      figureValue: "+300",
      figureLabel: "ventanas instaladas al año",
    },
    intro: {
      html: "Cambiar las ventanas <b>es la reforma que más se nota</b> y menos se ve.",
      note: "Medimos, fabricamos a medida e instalamos con nuestro propio equipo. Un único responsable de principio a fin.",
    },
    products: [
      {
        title: "Ventanas de PVC",
        desc: "Perfiles multicámara con refuerzo interior. El mejor aislamiento térmico y acústico al mejor precio.",
        brands: ["Marca", "Marca"],
        image: "ventanas-pvc",
        imageAlt: "Detalle de ventana de PVC oscilobatiente abierta, con manivela y perfil multicámara, imagen de referencia",
        aiImage: true,
        figureValue: "12",
        figureLabel: "sistemas de PVC en showroom",
      },
      {
        title: "Ventanas de aluminio",
        desc: "Perfil con rotura de puente térmico, esbelto y resistente. Ideal para grandes paños y diseño minimalista.",
        brands: ["Marca", "Marca"],
        image: "ventanas-aluminio",
        imageAlt: "Gran ventanal fijo de aluminio con vistas a un jardín de olivos, imagen de referencia",
        aiImage: true,
        figureValue: "10",
        figureLabel: "sistemas de aluminio en showroom",
      },
      {
        title: "Correderas y cerramientos",
        desc: "Correderas elevables y cerramientos de terraza con grandes paños de vidrio. Máxima apertura, mínimo perfil visto.",
        brands: ["Marca", "Marca", "Marca"],
        image: "ventanas-correderas",
        imageAlt: "Cerramiento corredero de aluminio negro abierto en un dormitorio con vistas al mar y terraza con tumbona, imagen de referencia",
        aiImage: true,
        figureValue: "8",
        figureLabel: "sistemas de corredera en showroom",
      },
      {
        title: "Instalación propia",
        desc: "Retirada de la ventana antigua, sellado, ajuste y limpieza final. Todo con nuestro propio equipo instalador.",
        brands: ["Marca", "Marca"],
        image: "ventanas-instalacion",
        imageAlt: "Instalador comprobando con un nivel una ventana de aluminio recién colocada en un hueco de obra, con vistas al mar",
        aiImage: true,
        figureValue: "100%",
        figureLabel: "instalación con equipo propio, sin subcontratar",
      },
    ],
    brandsTicker: ["Marca uno", "Marca dos", "Marca tres", "Marca cuatro", "Marca cinco", "Marca seis"],
    steps: [
      { title: "Medimos en tu casa", desc: "Comprobamos huecos y el estado del cerramiento actual, sin compromiso." },
      { title: "Elegimos sistema, vidrio y color", desc: "PVC o aluminio, vidrio de control solar o acústico, y el color que combine con tu fachada." },
      { title: "Las instalamos nosotros", desc: "Retirada de las antiguas, montaje y sellado, con nuestro propio equipo." },
    ],
    cta: {
      image: "banos-showroom",
      alt: "Fachada del showroom de Xaixo Home en Gandía",
      position: "center 62%",
      heading: "Hablemos de<br>tus ventanas.",
      primary: { label: "Pide tu presupuesto", href: "#contacto", external: false },
      secondary: { label: "Visita el showroom", href: MAPS_URL, external: true },
    },
  },
  {
    slug: "banos",
    title: "Baños a medida en Gandía | Xaixo Home",
    description:
      "Platos, mamparas, muebles, grifería y cerámica de baño en el showroom de Xaixo Home en Gandía. Te asesoramos y te lo servimos listo para tu instalador.",
    themeColor: "#1c1815",
    hero: {
      image: "banos-hero",
      alt: "Baño showroom Xaixo Home con mueble de lavabo en madera, ducha con mampara de vidrio y revestimiento de porcelánico beige",
      position: "center 30%",
      title: "Baños",
      subtitle: "Platos, mamparas, muebles, grifería y cerámica. Los eliges en el showroom de Gandia; te los servimos en obra.",
      figureValue: "+400",
      figureLabel: "referencias de baño en exposición permanente",
    },
    intro: {
      html: "Un baño se elige tocando. <b>Ven, compara materiales reales</b> y sal con el presupuesto cerrado.",
      note: "No hacemos la obra: te asesoramos, preparamos todo el material y lo entregamos listo para tu instalador. Si no tienes uno, te ponemos en contacto con profesionales de confianza.",
    },
    products: [
      {
        title: "Platos de ducha y mamparas",
        desc: "Resina, carga mineral y cerámica, cortados a la medida de tu hueco. Mamparas de vidrio templado con tratamiento antical, fijas o correderas.",
        brands: ["Marca", "Marca", "Marca"],
        image: "banos-platos",
        imageAlt: "Plato de ducha antracita con mampara de vidrio y marco negro, en ducha con revestimiento cerámico y hornacina para toallas",
        figureValue: "120",
        figureLabel: "platos de ducha",
      },
      {
        title: "Muebles y lavabos",
        desc: "Suspendidos, a suelo y a medida, con lavabo integrado o sobre encimera. Acabados en madera, lacado y porcelánico.",
        brands: ["Marca", "Marca"],
        image: "banos-muebles",
        imageAlt: "Mueble de baño suspendido en roble con espejo redondo retroiluminado",
        figureValue: "35",
        figureLabel: "muebles en exposición",
      },
      {
        title: "Grifería y sanitarios",
        desc: "Monomando, termostática y empotrada, en cromo, negro mate y cepillados. Inodoros suspendidos con cisterna empotrada y tapa de caída amortiguada.",
        brands: ["Marca", "Marca", "Marca"],
        image: "banos-griferia",
        imageAlt: "Grifería de lavabo en negro mate sobre encimera de piedra clara",
        imagePosition: "center 42%",
        figureValue: "18",
        figureLabel: "acabados de grifería",
      },
      {
        title: "Cerámica y porcelánico",
        desc: "Grandes formatos, efecto piedra y madera, rectificados y antideslizantes para suelo de ducha. Todo en piezas reales para que lo veas con luz natural.",
        brands: ["Marca", "Marca"],
        image: "banos-ceramica",
        imageAlt: "Revestimiento cerámico tipo travertino en ducha con hornacina para toallas",
        figureValue: "300",
        figureLabel: "modelos de cerámica",
      },
    ],
    brandsTicker: ["Marca uno", "Marca dos", "Marca tres", "Marca cuatro", "Marca cinco", "Marca seis"],
    steps: [
      { title: "Nos cuentas tu baño", desc: "Por WhatsApp o en el showroom. Con medidas o un plano, mejor; sin ellos, también." },
      { title: "Elegimos juntos el material", desc: "Ves y tocas piezas reales. Sales con un presupuesto cerrado, sin sorpresas." },
      { title: "Te lo servimos en obra", desc: "Todo en una entrega, en la fecha que necesite tu instalador." },
    ],
    cta: {
      image: "banos-showroom",
      alt: "Fachada del showroom de Xaixo Home en Gandía",
      position: "center 62%",
      heading: "Ven a verlo<br>con tus ojos.",
      primary: { label: "Visita el showroom", href: MAPS_URL, external: true },
      secondary: { label: "Escríbenos por WhatsApp", href: WHATSAPP_URL, external: true },
    },
  },
];

function darkImageMarkup(image, alt, { className, sizes, position, priority } = {}) {
  const [w, h] = IMAGE_DIMS[image];
  const candidateWidths = priority ? [800, 1200, 1600, 2400, w] : [800, 1200, 1600, w];
  const srcset = candidateWidths
    .filter((width, i, arr) => arr.indexOf(width) === i && width <= w)
    .map((width) => (width === w ? `assets/${image}.webp ${w}w` : `assets/${image}-${width}.webp ${width}w`))
    .join(", ");
  const style = position ? ` style="object-position: ${position};"` : "";
  const loadingAttrs = priority ? ` fetchpriority="high"` : ` loading="lazy" decoding="async"`;
  return `<img class="${className}" src="assets/${image}.webp" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="${w}" height="${h}"${loadingAttrs}${style}>`;
}

function darkHeroPreloadMarkup(image) {
  const [w] = IMAGE_DIMS[image];
  const srcset = [800, 1200, 1600, 2400, w]
    .filter((width, i, arr) => arr.indexOf(width) === i && width <= w)
    .map((width) => (width === w ? `assets/${image}.webp ${w}w` : `assets/${image}-${width}.webp ${width}w`))
    .join(", ");
  return `<link rel="preload" href="assets/${image}.webp" as="image" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high">`;
}

function darkProductMarkup(product) {
  const image = darkImageMarkup(product.image, product.imageAlt, {
    className: "dk-pic-img",
    sizes: "(max-width: 820px) 100vw, 50vw",
    position: product.imagePosition,
  });
  const brands = product.brands.map((brand) => `<span>${brand}</span>`).join("");
  const imageNote = product.aiImage ? `${AI_IMAGE_NOTE}\n` : "";
  return `<article class="dk-prod">
<div class="dk-pic" data-cursor="VER">
${imageNote}<div class="dk-ph" data-px="0.12">${image}</div>
${SAMPLE_FIGURE_NOTE}
<div class="dk-fig-box"><div class="dk-fig">${product.figureValue}</div><div class="dk-fig-l">${product.figureLabel}</div></div>
</div>
<div class="dk-txt">
<h2 class="reveal">${product.title}</h2>
<p class="reveal">${product.desc}</p>
<div class="dk-brands reveal">${brands}</div>
<a class="dk-more reveal" href="#contacto" aria-label="Ver la galería de ${product.title}" data-cursor="VER">Ver la galería <i aria-hidden="true">→</i></a>
</div>
</article>`;
}

function darkBrandsTickerMarkup(brands) {
  const spans = brands.map((brand) => `<span>${brand}</span>`).join("");
  return `<div class="dk-marcas" aria-label="Marcas con las que trabajamos">
<div class="dk-row">${spans}</div><div class="dk-row" aria-hidden="true">${spans}</div>
</div>`;
}

function darkStepsMarkup(steps) {
  return steps.map((step) => `<div class="dk-step reveal"><strong>${step.title}</strong><p>${step.desc}</p></div>`).join("");
}

function darkSimulatorMarkup(simulator) {
  if (!simulator) return "";
  return `<section class="dk-sim" id="simulador">
<h3 class="reveal">${simulator.title}</h3>
<!-- TODO: simulador interactivo de presupuesto (próxima iteración) -->
<p class="reveal">Muy pronto podrás calcular aquí un presupuesto orientativo.</p>
</section>
`;
}

function darkCtaButtonMarkup(button, modifierClass) {
  const targetAttrs = button.external ? ` target="_blank" rel="noopener"` : "";
  return `<a class="dk-btn ${modifierClass}" href="${button.href}"${targetAttrs}>${button.label}</a>`;
}

function darkCtaMarkup(page) {
  const { cta } = page;
  const image = darkImageMarkup(cta.image, cta.alt, {
    className: "dk-cta-img",
    sizes: "100vw",
    position: cta.position,
  });
  return `<section class="dk-cta" id="visita">
<div class="dk-ph" data-px="0.1">${image}</div>
<div class="dk-cta-in">
<div>
<h2 class="reveal">${cta.heading}</h2>
<div class="dk-btns reveal">
${darkCtaButtonMarkup(cta.primary, "dk-btn--pri")}
${darkCtaButtonMarkup(cta.secondary, "dk-btn--sec")}
</div>
</div>
<div class="dk-addr reveal">
<b>Showroom Xaixo Home</b>
${ADDRESS_LINE}<br>
${HOURS_LINE}<br>
<a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
</div>
</div>
</section>`;
}

function renderDarkCategoryPage(page) {
  const heroImage = darkImageMarkup(page.hero.image, page.hero.alt, {
    className: "dk-hero-img",
    sizes: "100vw",
    position: page.hero.position,
    priority: true,
  });
  const heroImageNote = page.hero.aiImage ? `${AI_IMAGE_NOTE}\n` : "";
  const productsHtml = page.products.map(darkProductMarkup).join("\n");
  const brandsTicker = darkBrandsTickerMarkup(page.brandsTicker);
  const stepsHtml = darkStepsMarkup(page.steps);
  const simulatorSection = darkSimulatorMarkup(page.simulator);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="${page.themeColor}"><title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23262421'/%3E%3Cpath d='M17 15l30 34m0-34L17 49' stroke='%23eeeae3' stroke-width='5'/%3E%3C/svg%3E">
<link rel="preload" href="assets/manrope-variable.woff2" as="font" type="font/woff2" crossorigin>
${darkHeroPreloadMarkup(page.hero.image)}
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="dark.css">
<script type="module" src="/app.js"></script>
</head>
<body class="dark-page">
<a class="skip" href="#intro">Saltar al contenido</a>
${HEADER_HTML_OTHER}
<main>
<section class="dk-hero" id="inicio" aria-label="${page.hero.title}">
${heroImageNote}<div class="dk-ph" data-px="0.18">${heroImage}</div>
<div class="dk-hero-txt">
<div>
<h1>${page.hero.title}</h1>
<p class="dk-hero-sub">${page.hero.subtitle}</p>
</div>
<div class="dk-hero-fig reveal">
${SAMPLE_FIGURE_NOTE}
<div class="dk-fig">${page.hero.figureValue}</div>
<div class="dk-fig-l">${page.hero.figureLabel}</div>
</div>
</div>
<div class="dk-scroll-hint" aria-hidden="true"></div>
</section>
<section class="dk-intro" id="intro">
<p class="reveal">${page.intro.html}</p>
<small class="reveal">${page.intro.note}</small>
</section>
<div class="dk-products">
${productsHtml}
</div>
${brandsTicker}
<section class="dk-proc">
<h3 class="reveal">Así lo hacemos</h3>
<div class="dk-steps">
${stepsHtml}
</div>
</section>
${simulatorSection}${darkCtaMarkup(page)}
</main>
${FOOTER_HTML_OTHER}
${MENU_HTML_OTHER}
<div class="context-cursor" aria-hidden="true">VER</div>
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
<meta name="theme-color" content="#1c1815"><title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23262421'/%3E%3Cpath d='M17 15l30 34m0-34L17 49' stroke='%23eeeae3' stroke-width='5'/%3E%3C/svg%3E">
<link rel="preload" href="assets/manrope-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="dark.css">
<script type="module" src="/app.js"></script>
</head>
<body class="dark-page">
<a class="skip" href="#legal-content">Saltar al contenido</a>
${HEADER_HTML_OTHER}
<main>
<section class="legal-page section-pad" id="legal-content">
<h1 class="reveal">${page.heading}</h1>
${page.bodyHtml}
</section>
</main>
${FOOTER_HTML_OTHER}
${MENU_HTML_OTHER}
${WHATSAPP_HTML}
</body>
</html>
`;
}

for (const page of DARK_PAGES) {
  const html = renderDarkCategoryPage(page);
  await writeFile(`${page.slug}.html`, html);
  console.log(`${page.slug}.html`);
}

for (const page of LEGAL_PAGES) {
  const html = renderLegalPage(page);
  await writeFile(`${page.slug}.html`, html);
  console.log(`${page.slug}.html`);
}
