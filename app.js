(() => {
'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (n, a=0, b=1) => Math.min(b, Math.max(a,n));

// Web3Forms access key for the quote form (shared footer, every page).
// Submissions land at the email registered with this key on web3forms.com.
const WEB3FORMS_ACCESS_KEY = 'd02523e1-c9f5-4689-93db-d4856dcf3040';

// --- Analytics consent (shared, every page) ---
// Metricool is analytics, so it only loads if the visitor accepted it in the
// cookie notice. The choice ('granted' | 'denied') lives in localStorage;
// with no stored choice the notice shows and nothing is loaded. Any element
// with [data-cookie-settings] (footer, cookies page) reopens the notice so
// the choice can be changed at any time.
const METRICOOL_SRC = 'https://tracker.metricool.com/resources/be.js';
const METRICOOL_HASH = 'a826acd43700e2a9b228eedf90ebee1c';
const CONSENT_KEY = 'xh-cookie-consent';
let metricoolLoaded = false;

function readConsent() {
 try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
function saveConsent(value) {
 try { localStorage.setItem(CONSENT_KEY, value); } catch { /* private mode: the choice just lasts this page */ }
}

function loadMetricool() {
 if (metricoolLoaded) return;
 metricoolLoaded = true;
 const script = document.createElement('script');
 script.type = 'text/javascript';
 script.src = METRICOOL_SRC;
 script.onload = () => window.beTracker?.t({ hash: METRICOOL_HASH });
 document.head.appendChild(script);
}

function showCookieNotice() {
 if (document.querySelector('.cookie-notice')) return;
 const notice = document.createElement('section');
 notice.className = 'cookie-notice';
 notice.setAttribute('aria-label', 'Aviso de cookies');
 notice.innerHTML =
  '<p class="cookie-notice-text">Usamos <b>Metricool</b> para medir las visitas de forma estadística, y solo si lo aceptas. Puedes cambiar tu elección cuando quieras. <a href="/cookies">Más información</a></p>' +
  '<div class="cookie-notice-actions">' +
  '<button type="button" class="dk-btn dk-btn--sec" data-consent="denied">Rechazar</button>' +
  '<button type="button" class="dk-btn dk-btn--sec" data-consent="granted">Aceptar</button>' +
  '</div>';
 notice.addEventListener('click', e => {
  const choice = e.target.closest('[data-consent]')?.dataset.consent;
  if (!choice) return;
  const withdrawing = choice === 'denied' && metricoolLoaded;
  saveConsent(choice);
  notice.remove();
  if (choice === 'granted') loadMetricool();
  // The tracker can't be unloaded from a running page: withdrawing after it
  // started means a reload so it stops for real.
  else if (withdrawing) location.reload();
 });
 document.body.appendChild(notice);
}

if (readConsent() === 'granted') loadMetricool();
else if (readConsent() !== 'denied') showCookieNotice();
document.querySelectorAll('[data-cookie-settings]').forEach(el => el.addEventListener('click', showCookieNotice));

// --- Homepage hero parallax (only present on index.html) ---
const stage = document.querySelector('.hero-stage');
if (stage) {
 const frame = document.querySelector('.hero-frame');
 const copy = document.querySelector('.hero-copy');
 const caption = document.querySelector('.frame-caption');
 const prompt = document.querySelector('.scroll-prompt');
 let ticking=false;
 function paintHero(){
  ticking=false;
  if(reduced.matches){frame.style.transform='';copy.style.opacity='';copy.style.transform='';caption.style.opacity='0';prompt.style.opacity='';return;}
  const rect=stage.getBoundingClientRect();
  const vh=document.querySelector('.hero-sticky').clientHeight;
  const progress=clamp(-rect.top/Math.max(1,stage.offsetHeight-vh));
  const mobile=innerWidth<=700;
  frame.style.transform=`translateY(${-progress*(mobile?3:6)}%) scale(${1-progress*(mobile?.14:.32)})`;
  copy.style.opacity=String(clamp(1-progress*2.5));
  copy.style.transform=`translateY(${-progress*30}px)`;
  prompt.style.opacity=String(clamp(1-progress*4));
  caption.style.opacity=String(clamp((progress-.65)/.35));
 }
 function onScroll(){if(!ticking){requestAnimationFrame(paintHero);ticking=true;}}
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);reduced.addEventListener('change',paintHero);paintHero();
}

// --- Generic photo parallax (dark category pages: elements with data-px) ---
const parallaxLayers=[...document.querySelectorAll('[data-px]')];
if(parallaxLayers.length && !reduced.matches){
 let px_ticking=false;
 function paintParallax(){
  px_ticking=false;
  const vh=innerHeight;
  parallaxLayers.forEach(layer=>{
   const rect=layer.parentElement.getBoundingClientRect();
   if(rect.bottom<0||rect.top>vh)return;
   const center=(rect.top+rect.height/2-vh/2)/vh;
   const strength=parseFloat(layer.dataset.px||'0.12');
   layer.style.transform=`translateY(${-center*strength*vh}px)`;
  });
 }
 function onParallaxScroll(){if(!px_ticking){requestAnimationFrame(paintParallax);px_ticking=true;}}
 addEventListener('scroll',onParallaxScroll,{passive:true});addEventListener('resize',paintParallax);paintParallax();
}

// --- Scroll reveal (shared across all pages) ---
if(!reduced.matches && 'IntersectionObserver' in window){
 document.documentElement.classList.add('motion');
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

// --- "¿Qué necesitas?" preview selector (only present on index.html) ---
// The tabs are plain links to each category page: hovering (mouse only) or
// focusing one swaps the preview photo/caption; clicking, tapping or
// pressing Enter navigates there directly, no JS involved.
const tabs=[...document.querySelectorAll('[data-scene]')];
if (tabs.length) {
 const images=[...document.querySelectorAll('[data-image]')];
 const sceneMore=document.querySelector('#scene-more');
 const scenePanel=document.querySelector('#scene-panel');
 const descriptions=['El suelo y la pared, la base de todo.','El lugar donde todo se encuentra.','Una pausa. Un espacio para ti.','Luz que entra, frío que se queda fuera.'];
 const spaceLabels=['azulejos','cocinas','baños','ventanas'];
 let current=0;
 function showPreview(index){
  current=(index+tabs.length)%tabs.length;
  tabs.forEach((tab,i)=>tab.classList.toggle('active',i===current));
  images.forEach((img,i)=>{img.classList.toggle('active',i===current);img.setAttribute('aria-hidden',String(i!==current))});
  scenePanel.setAttribute('aria-label',`Ambiente de ${spaceLabels[current]}; desliza para cambiar de espacio`);
  document.querySelector('#scene-description').textContent=descriptions[current];
  document.querySelectorAll('.scene-count').forEach(el=>el.textContent=`0${current+1} / 04`);
  if(sceneMore){sceneMore.href=tabs[current].href;sceneMore.setAttribute('aria-label',`Ver más sobre ${spaceLabels[current]}`);}
  if(innerWidth<=700){const holder=document.querySelector('.space-tabs');holder.scrollTo({left:tabs[current].offsetLeft-holder.offsetLeft-12,behavior:reduced.matches?'instant':'smooth'});}
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('pointerenter',e=>{if(fine.matches&&e.pointerType==='mouse')showPreview(i);});
  tab.addEventListener('focus',()=>showPreview(i));
 });
 document.querySelector('.scene-prev').addEventListener('click',()=>showPreview(current-1));document.querySelector('.scene-next').addEventListener('click',()=>showPreview(current+1));
 let touchStart=null;
 scenePanel.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&!e.target.closest('button'))touchStart={x:e.clientX,y:e.clientY}});
 scenePanel.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)showPreview(current+(dx<0?1:-1));touchStart=null});
 scenePanel.addEventListener('pointercancel',()=>touchStart=null);
}

// --- Wordmark (logo): every page links to "/". On the home page,
// smooth-scroll to top instead of reloading; on every other page it's a
// plain link and navigates there. Keyed off the current path, not the
// href, so it still works if the href value ever changes. ---
if (location.pathname === '/' || location.pathname === '/index.html') {
 document.querySelectorAll('a.wordmark').forEach(link=>{
  link.addEventListener('click',e=>{
   e.preventDefault();
   scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'});
  });
 });
}

// --- Quote wizard (shared footer, present on every page) ---
// One-question-per-screen flow: cards/pills auto-advance on click, the
// message and contact steps have an explicit continue/submit button.
// `current` is the only state that matters for navigation; `needValue`/
// `stageValue` (hidden inputs) carry the step 1/2 picks into the FormData.
const wizard = document.querySelector('#quote-wizard');
if (wizard) {
 const form = wizard.querySelector('#quote-form');
 const steps = [...wizard.querySelectorAll('.quote-step')];
 const total = steps.length;
 const progressBar = wizard.querySelector('#quote-progress-bar');
 const stepCurrentEl = wizard.querySelector('#quote-step-current');
 const backBtn = wizard.querySelector('#quote-back');
 const liveEl = wizard.querySelector('#quote-live');
 const doneScreen = wizard.querySelector('#quote-done');
 const needValue = wizard.querySelector('#quote-need-value');
 const stageValue = wizard.querySelector('#quote-stage-value');
 const stepTitles = steps.map(s => s.querySelector('.quote-step-title').textContent.trim());
 let current = 0;
 let animating = false;

 function firstControl(step) {
  return step.querySelector('.quote-card, .quote-pill, textarea, input:not([type="hidden"]):not([type="checkbox"])');
 }
 function updateChrome() {
  progressBar.style.width = `${((current + 1) / total) * 100}%`;
  stepCurrentEl.textContent = String(current + 1).padStart(2, '0');
  backBtn.hidden = current === 0;
 }
 function showError(step, message) {
  const el = step.querySelector('.quote-step-error');
  if (el) el.textContent = message;
 }
 function clearError(step) {
  showError(step, '');
 }
 function goTo(index, { focus = true } = {}) {
  if (animating || index === current || index < 0 || index >= total) return;
  const prevStep = steps[current];
  const nextStep = steps[index];
  animating = true;
  const reveal = () => {
   nextStep.hidden = false;
   nextStep.classList.add('is-entering');
   current = index;
   updateChrome();
   liveEl.textContent = `Paso ${index + 1} de ${total}: ${stepTitles[index]}`;
   if (focus) firstControl(nextStep)?.focus({ preventScroll: true });
   requestAnimationFrame(() => nextStep.classList.remove('is-entering'));
   animating = false;
  };
  if (reduced.matches) {
   prevStep.hidden = true;
   reveal();
  } else {
   prevStep.classList.add('is-leaving');
   prevStep.addEventListener(
    'animationend',
    () => {
     prevStep.hidden = true;
     prevStep.classList.remove('is-leaving');
     reveal();
    },
    { once: true },
   );
  }
 }

 // Step 1: category cards (auto-advance)
 const cards = [...steps[0].querySelectorAll('.quote-card')];
 cards.forEach(card => {
  card.addEventListener('click', () => {
   cards.forEach(c => {
    c.classList.toggle('is-selected', c === card);
    c.setAttribute('aria-checked', String(c === card));
   });
   needValue.value = card.dataset.value;
   clearError(steps[0]);
   goTo(1);
  });
 });

 // Step 2: stage pills (auto-advance)
 const pills = [...steps[1].querySelectorAll('.quote-pill')];
 pills.forEach(pill => {
  pill.addEventListener('click', () => {
   pills.forEach(p => {
    p.classList.toggle('is-selected', p === pill);
    p.setAttribute('aria-checked', String(p === pill));
   });
   stageValue.value = pill.dataset.value;
   clearError(steps[1]);
   goTo(2);
  });
 });

 // Step 3: message (attachments aren't possible — Web3Forms' free plan
 // doesn't support file uploads at all; see the WhatsApp hint in the
 // markup instead)
 const textarea = steps[2].querySelector('#quote-message');
 textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
 });
 steps[2].querySelector('.quote-next').addEventListener('click', () => {
  if (textarea.value.trim().length < 10) {
   showError(steps[2], 'Cuéntanos un poco más para poder ayudarte.');
   textarea.focus();
   return;
  }
  clearError(steps[2]);
  goTo(3);
 });

 // Step 4: contact details + submit
 const nameInput = steps[3].querySelector('#quote-name');
 const phoneInput = steps[3].querySelector('#quote-phone');
 const emailInput = steps[3].querySelector('#quote-email');
 const consentInput = steps[3].querySelector('.quote-consent input');
 const submitBtn = steps[3].querySelector('.quote-submit');
 const submitLabel = submitBtn.textContent;
 function validateStep4() {
  if (!nameInput.value.trim() || !phoneInput.value.trim() || !emailInput.value.trim()) {
   return 'Nos falta algún dato: nombre, teléfono y email.';
  }
  if (!emailInput.checkValidity()) return 'Revisa el email, no parece válido.';
  if (!consentInput.checked) return 'Marca la casilla para poder contactarte.';
  return null;
 }

 function resetSubmit() {
  submitBtn.disabled = false;
  submitBtn.classList.remove('is-sending');
  submitBtn.textContent = submitLabel;
 }

 form.addEventListener('submit', async e => {
  e.preventDefault();
  const err = validateStep4();
  if (err) {
   showError(steps[3], err);
   return;
  }
  clearError(steps[3]);
  submitBtn.disabled = true;
  submitBtn.classList.add('is-sending');
  submitBtn.textContent = 'Enviando…';

  // No file field at all: Web3Forms' free plan doesn't support attachments
  // (people with a plan/photo are pointed to WhatsApp instead — see step 3).
  const formData = new FormData(form);
  const summary = `Qué necesita: ${needValue.value || '—'}\nEn qué punto está: ${stageValue.value || '—'}\n\n${(formData.get('message') || '').toString().trim()}`;
  formData.set('message', summary);
  formData.set('access_key', WEB3FORMS_ACCESS_KEY);

  let res;
  try {
   res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
   });
  } catch (networkErr) {
   console.error('[quote-form] fallo de red al enviar:', networkErr);
   showError(steps[3], 'No se pudo conectar con el servidor (revisa tu conexión). Prueba de nuevo o escríbenos por WhatsApp.');
   resetSubmit();
   return;
  }

  const rawText = await res.text();
  let data = null;
  try {
   data = JSON.parse(rawText);
  } catch {
   /* Web3Forms always replies with JSON; a parse failure means something
      else answered (proxy, redirect…) — rawText below covers it. */
  }
  console.log('[quote-form] Web3Forms respondió', res.status, rawText);

  if (!res.ok || !data?.success) {
   console.error('[quote-form] envío rechazado:', data ?? rawText);
   showError(steps[3], `El servidor rechazó el envío${data?.message ? ` (${data.message})` : ''}. Prueba de nuevo o escríbenos por WhatsApp.`);
   resetSubmit();
   return;
  }

  wizard.querySelector('#quote-done-name').textContent = nameInput.value.trim().split(' ')[0] || '';
  form.hidden = true;
  doneScreen.hidden = false;
  liveEl.textContent = 'Solicitud enviada';
  doneScreen.querySelector('.quote-done-actions a, .quote-done-actions button')?.focus({ preventScroll: true });
 });

 backBtn.addEventListener('click', () => goTo(current - 1));

 // Enter advances — except inside the free-text message, which needs
 // newlines.
 form.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA') return;
  if (e.target.matches('.quote-card, .quote-pill')) return;
  e.preventDefault();
  if (current === 2) steps[2].querySelector('.quote-next').click();
  else if (current === 3) submitBtn.click();
 });

 wizard.querySelector('.quote-restart').addEventListener('click', () => {
  form.reset();
  cards.forEach(c => {
   c.classList.remove('is-selected');
   c.setAttribute('aria-checked', 'false');
  });
  pills.forEach(p => {
   p.classList.remove('is-selected');
   p.setAttribute('aria-checked', 'false');
  });
  needValue.value = '';
  stageValue.value = '';
  textarea.style.height = 'auto';
  clearError(steps[3]);
  submitBtn.disabled = false;
  submitBtn.classList.remove('is-sending');
  submitBtn.textContent = submitLabel;
  doneScreen.hidden = true;
  form.hidden = false;
  steps.forEach((s, i) => (s.hidden = i !== 0));
  current = 0;
  updateChrome();
  liveEl.textContent = `Paso 1 de ${total}: ${stepTitles[0]}`;
  firstControl(steps[0])?.focus({ preventScroll: true });
 });

 updateChrome();
}

// --- Mobile menu dialog (shared header, present on every page) ---
const menu=document.querySelector('#menu');
document.querySelector('.menu-toggle').addEventListener('click',()=>menu.showModal());document.querySelector('.close-menu').addEventListener('click',()=>menu.close());menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));

// --- Project lightbox (only present on index.html) ---
const projectDialog=document.querySelector('#project-dialog');
if (projectDialog) {
 document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  const project=button.closest('.project');const img=button.querySelector('img');
  document.querySelector('#project-dialog-title').textContent=project.dataset.title;
  const large=document.querySelector('#project-dialog-image');large.src=img.currentSrc||img.src;large.alt=img.alt;projectDialog.showModal();
 }));
 document.querySelector('.close-project').addEventListener('click',()=>projectDialog.close());
 projectDialog.addEventListener('click',e=>{if(e.target===projectDialog){const r=projectDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)projectDialog.close()}});
}

// --- Contextual cursor (shared; only triggers on elements with data-cursor) ---
const cursor=document.querySelector('.context-cursor');
if (cursor) {
 document.querySelectorAll('[data-cursor]').forEach(el=>{
  el.addEventListener('pointerenter',e=>{if(!fine.matches||reduced.matches||e.pointerType!=='mouse')return;cursor.textContent=el.dataset.cursor;cursor.style.opacity='1'});
  el.addEventListener('pointermove',e=>{if(fine.matches&&!reduced.matches)cursor.style.transform=`translate(${e.clientX-41}px,${e.clientY-41}px)`});
  el.addEventListener('pointerleave',()=>cursor.style.opacity='0');el.addEventListener('click',()=>cursor.style.opacity='0');
 });
}
})();
