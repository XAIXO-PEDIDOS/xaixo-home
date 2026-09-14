(() => {
'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (n, a=0, b=1) => Math.min(b, Math.max(a,n));

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

// --- Scroll reveal (shared across all pages) ---
if(!reduced.matches && 'IntersectionObserver' in window){
 document.documentElement.classList.add('motion');
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

// --- "¿Qué quieres transformar?" scene tabs (only present on index.html) ---
const tabs=[...document.querySelectorAll('[data-scene]')];
if (tabs.length) {
 function orientTabs(){document.querySelector('.space-tabs').setAttribute('aria-orientation',innerWidth<=700?'horizontal':'vertical')} orientTabs(); addEventListener('resize',orientTabs);
 const images=[...document.querySelectorAll('[data-image]')];
 const arrows=[...document.querySelectorAll('.option-arrow')];
 const sceneMore=document.querySelector('#scene-more');
 const scenePanel=document.querySelector('#scene-panel');
 const descriptions=['El lugar donde todo se encuentra.','Una pausa. Un espacio para ti.','La vida, a tu manera.','El interior continúa fuera.','Todo empieza por imaginarlo.'];
 const spaceLabels=['cocina','baño','salón','exterior','vivienda completa'];
 let current=0;
 function selectScene(index,focus=false){
  current=(index+tabs.length)%tabs.length;
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
  arrows.forEach((a,i)=>{a.tabIndex=i===current?0:-1;});
  images.forEach((img,i)=>{img.classList.toggle('active',i===current);img.setAttribute('aria-hidden',String(i!==current))});
  scenePanel.setAttribute('aria-labelledby',`tab-${current}`);
  scenePanel.setAttribute('aria-label',`Ambiente de ${spaceLabels[current]}; desliza para cambiar de espacio`);
  document.querySelector('#scene-description').textContent=descriptions[current];
  document.querySelectorAll('.scene-count').forEach(el=>el.textContent=`0${current+1} / 05`);
  if(sceneMore){sceneMore.href=arrows[current].href;sceneMore.setAttribute('aria-label',`Ver más sobre ${spaceLabels[current]}`);}
  if(innerWidth<=700){const holder=document.querySelector('.space-tabs');holder.scrollTo({left:tabs[current].offsetLeft-holder.offsetLeft-12,behavior:reduced.matches?'instant':'smooth'});}
  if(focus)tabs[current].focus({preventScroll:true});
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>selectScene(i));
  tab.addEventListener('keydown',e=>{let target;if(['ArrowDown','ArrowRight'].includes(e.key))target=current+1;else if(['ArrowUp','ArrowLeft'].includes(e.key))target=current-1;else if(e.key==='Home')target=0;else if(e.key==='End')target=tabs.length-1;if(target!==undefined){e.preventDefault();selectScene(target,true)}});
 });
 selectScene(0);
 document.querySelector('.scene-prev').addEventListener('click',()=>selectScene(current-1));document.querySelector('.scene-next').addEventListener('click',()=>selectScene(current+1));
 let touchStart=null;
 scenePanel.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&!e.target.closest('button'))touchStart={x:e.clientX,y:e.clientY}});
 scenePanel.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)selectScene(current+(dx<0?1:-1));touchStart=null});
 scenePanel.addEventListener('pointercancel',()=>touchStart=null);
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
