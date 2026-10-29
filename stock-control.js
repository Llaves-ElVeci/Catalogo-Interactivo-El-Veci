/* Availability only; no inventory quantities, costs or customer information. */
(function(){
 'use strict';
 const endpoint='https://el-veci-disponibilidad.rayocabrera8.chatgpt.site/disponibilidad.json';
 let products=[],verified=false,updated=0,busy=false;try{products=JSON.parse(localStorage.getItem('ev-stock-known')||'[]').filter(p=>p.state==='exhausted'||p.state==='held')}catch{}
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
 const canonical=s=>norm(s).replace(/^CAT(?: CATERPILLAR)?$/,'CATERPILLAR');
 function match(card){
  const title=card.dataset.evEditorCode||card.querySelector('h2')?.textContent||'',details=Array.from(card.querySelectorAll('.detalles p'));
  const codeLine=details.find(p=>/^\s*C[oó]digo\s*:/i.test(p.textContent));
  const name=canonical(title),explicit=canonical(codeLine?.textContent.replace(/^[^:]*:/,'')),text=norm(title+' '+details.filter(p=>/^\s*Material\s*:/i.test(p.textContent)).map(p=>p.textContent).join(' '));
  const variant=/CABEZA PLASTICA|PLASTICO|\bCPC\b/.test(text)?'plastica':/ALUMINIO/.test(text)?'aluminio':/HIERRO/.test(text)?'hierro':'bronce';
  let candidates=products.filter(p=>[p.code,...p.aliases].some(code=>{const c=canonical(code);return c&&((name===c||explicit===c)||(' '+name+' ').includes(' '+c+' '))}));
  // Specific references win over their shorter base (KW1L over KW1, etc.).
  if(!candidates.length)return null;const length=Math.max(...candidates.map(p=>canonical(p.code).length));candidates=candidates.filter(p=>canonical(p.code).length===length);
  if(candidates.length>1)candidates=candidates.filter(p=>p.variant===variant);
  return candidates.length===1?candidates[0]:null;
 }
 function apply(){
  document.querySelectorAll('.producto').forEach(card=>{
   if(card.id==='carritoSeccion'||!card.querySelector('h2'))return;
   const p=match(card);if(!p)return;
   const state=verified&&Date.now()-updated<120000?p.state:p.state==='exhausted'||p.state==='held'?p.state:'verify';
   card.dataset.evLiveState=state;
   const blocked=state==='exhausted'||state==='held';
   const cfg=(window.__EV_CATALOG_EDIT?.changes||[]).find(x=>x.code===card.dataset.evEditorCode);if(cfg&&verified){cfg.unavailable=blocked;if(!blocked&&!cfg.hidden)card.classList.remove('ev-oculto-catalogo');}
   if(blocked)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');
   let status=card.querySelector('.ev-live-stock');if(!status){status=document.createElement('p');status.className='ev-live-stock';(card.querySelector('.detalles')||card).appendChild(status);}
   const text='Stock: '+(state==='local'?'Disponible en local':state==='warehouse'?'Disponible en bodega · coordinar entrega':state==='exhausted'?'Agotado en local y bodega':state==='held'?'No disponible':'Por confirmar · consulte antes de comprar');
   if(status.textContent!==text)status.textContent=text;
   card.querySelectorAll('.detalles > p').forEach(n=>{if(n!==status&&/^\s*Stock\s*:/i.test(n.textContent))n.hidden=true;});
  });
 }
 const previous=window.evStockOverride;
 window.evStockOverride=function(card){const state=card?.dataset.evLiveState;if(state==='exhausted'||state==='held')return true;if(state==='local'||state==='warehouse')return false;return previous?previous(card):null;};
 async function refresh(){if(busy)return;busy=true;try{const r=await fetch(endpoint,{cache:'no-store',signal:AbortSignal.timeout(18000)});if(!r.ok)throw Error();const d=await r.json();if(d.version!==1||!Array.isArray(d.products)||Math.abs(Date.now()-Date.parse(d.generatedAt))>120000)throw Error();products=d.products;try{localStorage.setItem('ev-stock-known',JSON.stringify(products))}catch{}verified=true;updated=Date.now();}catch{verified=false;}finally{busy=false;apply();}}
 function start(){const style=document.createElement('style');style.textContent='.producto[data-ev-live-state="exhausted"],.producto[data-ev-live-state="held"]{display:none!important}.ev-live-stock{font-weight:700;color:#173d70}';document.head.appendChild(style);
  document.addEventListener('click',e=>{const button=e.target.closest('button,a');const card=button?.closest('.producto');if(!card||card.id==='carritoSeccion'||!button?.matches('.boton-agregar,[onclick*="agregar"],[onclick*="Agregar"]'))return;const state=card.dataset.evLiveState;if(state==='exhausted'||state==='held'){e.preventDefault();e.stopImmediatePropagation();alert('Esta referencia está agotada. Consulte una alternativa con Llaves El Veci.');}},true);
  refresh();new MutationObserver(()=>{clearTimeout(window.evLiveStockTimer);window.evLiveStockTimer=setTimeout(apply,150)}).observe(document.body,{childList:true,subtree:true});setInterval(refresh,60000);window.addEventListener('focus',refresh);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
