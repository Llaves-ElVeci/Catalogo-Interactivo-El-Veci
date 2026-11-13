(function(){
'use strict';
if(window.frameElement?.id==='catalogoMotor')return;
if(window.__evProductShowcase)return;window.__evProductShowcase=true;
var FEED='https://el-veci-productos.rayocabrera8.chatgpt.site/catalog.json',cards=[],index=0,paused=false,timer,zone,slide,caption,dots,dialog,slot,marker,active,loaded=false;
function el(tag,text,cls){var n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n}
function code(c){return c.dataset.evEditorCode||c.querySelector('.boton-agregar')?.getAttribute('onclick')?.match(/agregarPedido\(\s*['"]([^'"]+)/)?.[1]||c.querySelector('h2')?.textContent.trim()||''}
function close(){if(active&&marker?.parentNode){marker.parentNode.insertBefore(active,marker);marker.remove()}active=null;if(dialog?.open)dialog.close();document.body.style.removeProperty('overflow')}
function open(c){if(!c)return;close();if(!dialog){dialog=el('dialog',null,'evProductDetail');dialog.id='evPublicProduct';dialog.setAttribute('aria-label','Ficha del producto');var back=el('button','← Volver al catálogo','evProductBack');back.onclick=close;slot=el('div');dialog.append(back,slot);dialog.addEventListener('cancel',function(e){e.preventDefault();close()});document.body.append(dialog)}marker=document.createComment('ficha original');c.parentNode.insertBefore(marker,c);active=c;slot.replaceChildren(c);c.style.display='block';dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';}
function videoSource(c){var v=c.querySelector('video');return v?.getAttribute('src')||v?.querySelector('source')?.getAttribute('src')||v?.getAttribute('data-src')||v?.querySelector('source')?.getAttribute('data-src')||Array.from(c.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).find(s=>/\.(mp4|webm)(?:$|\?)/i.test(s))||''}
function productGroup(c){if(c.classList.contains('ev-cat-ferreteria')||c.dataset.categoria==='ev-cat-ferreteria')return 'ferreteria';var category=c.dataset.evCategoria||c.dataset.categoria||'';if(category==='linea-automotriz'||category==='controles'||category==='espadas'||c.classList.contains('linea-automotriz'))return 'automotriz';if(category==='linea-hogar'||c.classList.contains('linea-hogar'))return 'cerradura';return 'otros'}
function visibleCards(){return Array.from(document.querySelectorAll('.producto')).filter(function(c){if(c.id==='carritoSeccion'||!c.querySelector('h2')||c.matches('.ev-oculto-catalogo,.ev-tag-prototype,.ev-tag-duplicate-hidden,.ev-info-pago,.ev-info-ubicacion')||c.dataset.evPublicState==='unavailable')return false;var override=typeof window.evStockOverride==='function'?window.evStockOverride(c):null;if(override===true)return false;if(override!==false&&c.matches('.ev-agotado,.ev-agotado-bloqueado,.ev-agotado-definitivo,.ev-sin-stock-final'))return false;return !!(c.dataset.evPublicId||c.querySelector('img[src]')||videoSource(c))})}
function selectShowcase(all,bucket){var order=['ferreteria','automotriz','ferreteria','cerradura','ferreteria','automotriz'],groups=['ferreteria','automotriz','cerradura','otros'],pools={},used=new Set(),chosen=[];groups.forEach(g=>{var pool=all.filter(c=>productGroup(c)===g).sort((a,b)=>code(a).localeCompare(code(b)));var count=order.filter(x=>x===g).length||1,offset=pool.length?(bucket*count)%pool.length:0;pools[g]=pool.slice(offset).concat(pool.slice(0,offset))});function take(g){var c=pools[g].find(c=>!used.has(code(c)));if(c){used.add(code(c));chosen.push(c)}return !!c}order.forEach((g,i)=>{if(chosen.length>=6)return;if(!take(g)){var fallback=groups.slice(i%groups.length).concat(groups.slice(0,i%groups.length));fallback.some(take)}});return chosen.slice(0,6)}
var selectionBucket=-1,showcaseStepAt=Date.now(),manualPause=false,pointerInside=false,focusInside=false,reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function refreshCards(){var bucket=Math.floor(Date.now()/(6*60*60*1000));cards=selectShowcase(visibleCards(),bucket);selectionBucket=bucket;if(index>=cards.length)index=0;if(zone){zone.hidden=!cards.length;draw()}}
function media(c){var src=videoSource(c),img=c.querySelector('.imagen img[src],.imagenes img[src],img[src]');if(src){var video=el('video');video.src=new URL(src,document.baseURI).href;video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');video.playsInline=true;video.setAttribute('playsinline','');video.controls=true;video.loop=true;video.autoplay=!reduceMotion&&!manualPause;video.preload='metadata';video.setAttribute('aria-label','Video de '+(c.querySelector('h2')?.textContent||'producto'));if(img)video.poster=img.src;video.addEventListener('click',e=>e.stopPropagation());video.addEventListener('error',function(){var note=el('p','Este video no pudo cargarse. Abra la ficha para consultar el producto.','evCarouselMediaNotice');video.replaceWith(img?Object.assign(el('img'),{src:img.src,alt:img.alt||'Producto'}):note)});return video}if(img){var image=el('img');image.src=img.src;image.alt=c.querySelector('h2')?.textContent||'Producto';image.loading='eager';image.onclick=()=>open(c);return image}if(c.dataset.evPublicId){var brand=el('img');brand.src='imagenes/logo_el_veci.png';brand.alt='Llaves El Veci';brand.onclick=()=>open(c);return brand}return null}
function draw(){if(!slide||!cards.length)return;slide.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});var c=cards[index],m=media(c);slide.replaceChildren();if(m)slide.append(m);var group=productGroup(c),labels={ferreteria:'MI FERRETERÍA',automotriz:'LÍNEA AUTOMOTRIZ',cerradura:'LLAVES DE CERRADURA',otros:'LLAVES EL VECI'},info=el('div',null,'evShowcaseInfo'),category=el('span',labels[group],'evShowcaseEyebrow'),title=el('h2',c.querySelector('h2')?.textContent||code(c)),price=Number(c.dataset.precio),status=c.dataset.evPublicId&&price>0?money(price)+' por '+(hardwareProducts.get(code(c))?.unit==='libra'?'libra':'unidad'):c.dataset.evPublicState==='coming'?'Disponibilidad por confirmar':price>0?'Desde $'+price.toFixed(price*100%1?3:2):'Conozca el producto',cta=el('button','Ver producto →','evShowcaseCta');cta.type='button';cta.onclick=()=>open(c);info.append(category,title,el('p',status),cta);slide.append(info);slide.setAttribute('aria-label','Producto '+(index+1)+' de '+cards.length);caption.textContent=(index+1)+' de '+cards.length+' · Selección automática · cambia cada 6 horas';dots.replaceChildren();cards.forEach(function(c,i){var b=el('button','●');b.type='button';b.className=i===index?'active':'';b.setAttribute('aria-label','Mostrar '+c.querySelector('h2')?.textContent);b.setAttribute('aria-current',String(i===index));b.onclick=function(){index=i;draw()};dots.append(b)});showcaseStepAt=Date.now();if(m?.tagName==='VIDEO'&&m.autoplay){var promise=m.play();if(promise?.catch)promise.catch(()=>{m.controls=true})}}
function init(){document.getElementById('evVideosPortada')?.remove();document.getElementById('evPreciosActuales')?.remove();document.getElementById('ev-videos-portada-script')?.remove();document.querySelectorAll('.ev-update-badge,.ev-actualizado,#evActualizado').forEach(n=>n.remove());if(zone)return;zone=el('section',null,'evShowcase');zone.id='evProductCarousel';zone.setAttribute('aria-label','Novedades del catálogo');var heading=el('div',null,'evShowcaseHeader');heading.append(el('div','Novedades para su negocio'),el('span','Una selección para usted'));slide=el('div',null,'evShowcaseSlide');slide.setAttribute('role','group');var nav=el('div',null,'evShowcaseNav'),prev=el('button','‹ Anterior'),next=el('button','Siguiente ›'),pause=el('button','Pausar'),tools=el('div');prev.type=next.type=pause.type='button';prev.onclick=function(){if(!cards.length)return;index=(index-1+cards.length)%cards.length;draw()};next.onclick=function(){if(!cards.length)return;index=(index+1)%cards.length;draw()};pause.onclick=function(){manualPause=!manualPause;pause.textContent=manualPause?'Reanudar':'Pausar';slide.querySelectorAll('video').forEach(v=>{if(manualPause)v.pause();else v.play()?.catch(()=>{})});showcaseStepAt=Date.now()};prev.setAttribute('aria-label','Producto anterior');next.setAttribute('aria-label','Producto siguiente');dots=el('div',null,'evShowcaseDots');tools.append(prev,pause,next);caption=el('p');caption.setAttribute('aria-live','off');nav.append(tools,dots,caption);zone.append(heading,slide,nav);var hero=document.querySelector('.hero'),logo=hero?.querySelector('.logo');if(logo)logo.after(zone);else (hero||document.body).prepend(zone);zone.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')pointerInside=true});zone.addEventListener('pointerleave',()=>pointerInside=false);zone.addEventListener('focusin',()=>focusInside=true);zone.addEventListener('focusout',e=>focusInside=zone.contains(e.relatedTarget));var startX;slide.addEventListener('touchstart',e=>{if(e.target.closest('video')){startX=null;return}startX=e.touches[0]?.clientX},{passive:true});slide.addEventListener('touchend',e=>{if(startX==null)return;var dx=(e.changedTouches[0]?.clientX||0)-startX;if(Math.abs(dx)>55&&cards.length){index=(index+(dx<0?1:-1)+cards.length)%cards.length;draw()}startX=null},{passive:true});refreshCards();timer=setInterval(function(){if(document.hidden||dialog?.open)return;var bucket=Math.floor(Date.now()/(6*60*60*1000));if(bucket!==selectionBucket){index=0;refreshCards();return}if(manualPause||pointerInside||focusInside||reduceMotion||!cards.length)return;var interval=slide.querySelector('video')?20000:8000;if(Date.now()-showcaseStepAt>=interval){index=(index+1)%cards.length;draw()}},1000);document.addEventListener('visibilitychange',function(){if(!document.hidden&&Math.floor(Date.now()/(6*60*60*1000))!==selectionBucket){index=0;refreshCards()}})}
const hardwareProducts = new Map();
const smallContactCement = { id: 'EVB17CB821ED2FE0F18D', code: 'DPF-080010' };
const oldContactCement = { id: 'EVB1B4DA22B1143BAC95', code: '7861194600048' };
const hardwareMenu = [
 ['tornilleria','Tornillería'],
 ['ferreteria','Ferretería general'],
 ['candados','Candados'],
 ['cerraduras','Cerraduras'],
];
const money = amount => '$' + amount.toFixed(2);
const units = product => product.unit === 'libra' ? 'libras' : 'unidades';
function hardwareTier(product) {
 var tier=product.wholesale;
 return [3,4].includes(tier?.minQty)&&Number.isFinite(tier.unitPrice)&&tier.unitPrice>0&&tier.unitPrice<=product.price?tier:null;
}
function hardwareSection(group, title) {
 if(/^Tornillería\b/i.test(group))return 'tornilleria';
 if(/^CANDADO\b/i.test(title))return 'candados';
 if(/^CERRADURA\b/i.test(title))return 'cerraduras';
 return 'ferreteria';
}
function hardwareProductURL(card) {
 const url=new URL('https://llaves-elveci.github.io/Catalogo-Interactivo-El-Veci/');
 url.searchParams.set('ev',card.dataset.evPublicId);
 return url.href;
}
function hardwareShare(card) {
 const product=hardwareProducts.get(code(card));
 if(!product)return null;
 const tier=hardwareTier(product);
 const lines=[product.title];
 if(product.price>0)lines.push('Precio de venta: '+money(product.price)+' por '+(product.unit==='libra'?'libra':'unidad'));
 if(tier)lines.push('Precio al por mayor: '+money(tier.unitPrice)+' c/u. A partir de '+tier.minQty+' unidades del mismo modelo.');
 lines.push(product.state==='available'?'Disponible':product.state==='unavailable'?'Agotado':'Disponibilidad por confirmar');
 return {url:hardwareProductURL(card),text:lines.join('\n')};
}
function orderQuantity(code) {
 try{return carrito.reduce((sum,item)=>sum+(item.codigo===code?Number(item.cantidad)||0:0),0)}catch{return 0}
}
function installHardwarePrices() {
 const previous=window.evPrecios2026;
 if(typeof previous!=='function'||previous.evHardware)return;
 const priceOrder=function(items){
  const result=previous.apply(this,arguments),quantities=new Map();
  for(const item of items) if(hardwareProducts.has(item.codigo)) quantities.set(item.codigo,(quantities.get(item.codigo)||0)+Number(item.cantidad||0));
  for(const item of items){
   const product=hardwareProducts.get(item.codigo);
   if(!product||product.price==null)continue;
   const tier=hardwareTier(product);
   item.precio=tier&&quantities.get(item.codigo)>=tier.minQty?tier.unitPrice:product.price;
  }
  return result;
 };
 priceOrder.evHardware=true;
 window.evPrecios2026=priceOrder;
 const render=window.actualizarListaCarrito;
 if(typeof render==='function')window.actualizarListaCarrito=function(){
  const result=render.apply(this,arguments);
  const list=document.getElementById('lista-carrito');
  if(list) Array.from(list.querySelectorAll('.carrito-item')).forEach((row,index)=>{
   let product;try{product=hardwareProducts.get(carrito[index]?.codigo)}catch{return}
   if(!product)return;
   const name=row.querySelector('strong'),qty=row.querySelector('[id^=cantidadTexto]');
   if(name)name.textContent=product.title;
   if(qty?.nextSibling?.nodeType===3)qty.nextSibling.nodeValue=' '+units(product);
  });
  return result;
 };
}
function quoteCounts(items) {
 const references=new Set(),hardware=new Set();
 let units=0,pounds=0,hardwareUnits=0,hardwarePounds=0;
 for(const item of items){
  const quantity=Number(item.cantidad)||0;
  if(quantity<=0)continue;
  const product=hardwareProducts.get(item.codigo);
  references.add(item.codigo);
  if(product)hardware.add(item.codigo);
  if(product?.unit==='libra'){pounds+=quantity;hardwarePounds+=quantity;}
  else{units+=quantity;if(product)hardwareUnits+=quantity;}
 }
 return {references:references.size,hardware:hardware.size,units,pounds,hardwareUnits,hardwarePounds};
}
function quantityText(units,pounds){
 const parts=[];
 if(units||!pounds)parts.push(units+(units===1?' unidad':' unidades'));
 if(pounds)parts.push(pounds+(pounds===1?' libra':' libras'));
 return parts.join(' y ');
}
function decorateHardwareQuote(items) {
 const tbody=document.getElementById('detalleCotizacion');
 if(!tbody)return;
 const table=tbody.closest('table'),header=table?.tHead?.rows[0],counts=quoteCounts(items);
 if(header){
  if(header.cells.length===5&&/descrip/i.test(header.cells[1].textContent))header.deleteCell(1);
  table.dataset.evSinDescripcion='1';
  if(header.cells[0])header.cells[0].textContent='Producto';
  for(const row of tbody.rows){
   if(row.cells.length>header.cells.length&&row.cells.length===5)row.deleteCell(1);
   const cell=row.cells[0],product=hardwareProducts.get(cell?.textContent.trim());
   if(!product||row.cells.length!==4)continue;
   const title=el('strong',product.title);
   cell.replaceChildren(title);
   const quantity=row.cells[1];
   quantity.append(el('small',product.unit==='libra'?'lb':'ud.','evQuoteUnit'));
  }
 }
 const total=document.getElementById('totalFinalCotizacion');
 if(!total)return;
 const moneyLine=total.parentElement,container=moneyLine.parentElement;
 let stats=container.querySelector('.evQuoteCounts');
 if(!stats){
  stats=el('div',null,'evQuoteCounts');
  container.insertBefore(stats,moneyLine);
 }
 stats.replaceChildren();
 if(counts.references){
  stats.append(el('p','Total de productos: '+counts.references+' · '+quantityText(counts.units,counts.pounds)));
  if(counts.hardware)stats.append(el('p','Ferretería: '+counts.hardware+' '+(counts.hardware===1?'producto':'productos')+' · '+quantityText(counts.hardwareUnits,counts.hardwarePounds)));
 }
 const home=document.getElementById('totalLlavesHogar');
 const hideHome=counts.hardware>0&&Number(home?.textContent||0)===0;
 if(home)home.parentElement.classList.toggle('evQuoteHideHome',hideHome);
 document.getElementById('precioAplicadoHogar')?.parentElement.classList.toggle('evQuoteHideHome',hideHome);
 document.getElementById('evPedidoPromocion')?.classList.toggle('evQuoteHideHome',hideHome);
}
function hardwareQuoteMessage(message,items) {
 const counts=quoteCounts(items);
 if(!counts.hardware)return message;
 const lines=message.split('\n');
 let item=null;
 for(let index=0;index<lines.length;index++){
  const line=lines[index], match=line.match(/^(\d+\) )(.+)$/);
  if(match){
   item=hardwareProducts.get(match[2]);
   if(item)lines[index]=match[1]+item.title;
  }else if(item&&/^\s+Cantidad: \d+$/.test(line)){
   const amount=Number(line.trim().split(' ').at(-1));
   lines[index]='   Cantidad: '+(item.unit==='libra'?quantityText(0,amount):quantityText(amount,0));
  }else if(item&&/^\s+Precio unitario:/.test(line)){
   lines[index]=line.replace('Precio unitario:',item.unit==='libra'?'Precio por libra:':'Precio por unidad:');
  }
  if(/^🔢 Total de unidades:/.test(line)){
   lines[index]='🔢 Total de productos: '+counts.references+' · '+quantityText(counts.units,counts.pounds)+
    '\nFerretería: '+counts.hardware+' '+(counts.hardware===1?'producto':'productos')+' · '+quantityText(counts.hardwareUnits,counts.hardwarePounds);
  }
 }
 return lines.join('\n');
}
function installHardwareQuote(){
 const summarize=window.actualizarResumen;
 if(typeof summarize==='function')window.actualizarResumen=function(){
  const result=summarize.apply(this,arguments);
  decorateHardwareQuote(carrito);
  return result;
 };
 const send=window.enviarPedido;
 if(typeof send==='function')window.enviarPedido=function(){
  const items=carrito;
  if(!items.some(item=>hardwareProducts.has(item.codigo)))return send.apply(this,arguments);
  const open=window.open;
  window.open=function(raw,target,features){
   const url=new URL(raw,document.baseURI);
   if(url.origin!=='https://wa.me'||url.pathname!=='/593983889592'||!url.searchParams.has('text')){
    return open.apply(this,arguments);
   }
   url.searchParams.set('text',hardwareQuoteMessage(url.searchParams.get('text'),items));
   const popup=open.call(this,url.href,target,features);
   if(popup)return popup;
   window.location.assign(url.href);
   return window;
  };
  try{return send.apply(this,arguments)}finally{window.open=open}
 };
 if(typeof window.actualizarResumen==='function')window.actualizarResumen();
}
function positionHardwareCards(){
 const kit=document.getElementById('cantidadKIT_GANZUAS_CERRADURA_AUTOMOTRIZ_CANDADO')?.closest('.producto');
 const cards=Array.from(document.querySelectorAll('.evHardwareCard'));
 if(kit&&!kit.closest('dialog'))kit.after(...cards);
 else{
  const payment=Array.from(document.querySelectorAll('.ev-info-pago,.ev-bloque-pago-uniforme')).find(card=>!card.closest('dialog'));
  const boundary=payment||document.getElementById('carritoSeccion');
  if(boundary&&!boundary.closest('dialog'))boundary.before(...cards);
 }
}
function sectionText(target, raw) {
 const lines=String(raw||'').split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!/^VENTA POR LIBRAS$/i.test(x));
 if(!lines.length)return;
 const group=el('div',null,'evHardwareDescription');
 let heading=el('h3','Descripción');
 group.append(heading);
 for(const line of lines){
  if(/^(características|áreas de uso|especificaciones|aplicaciones)\s*:?$/i.test(line)){
   if(group.lastChild===heading) heading.textContent=line.replace(/:$/,'');
   else{heading=el('h3',line.replace(/:$/,''));group.append(heading)}
  } else group.append(el('p',line));
 }
 target.append(group);
}
function publicCard(p) {
 if(!/^EVB1[A-F0-9]{16}$/.test(p.id)||!/^[A-Z0-9 ._/-]{1,100}$/.test(p.code))return;
 hardwareProducts.set(p.code,p);
 let c=Array.from(document.querySelectorAll('.producto')).find(node=>node.dataset.evPublicId===p.id||code(node)===p.code);
 if(!c){
  c=el('article',null,'producto ev-cat-ferreteria');
  const anchor=document.getElementById('carritoSeccion');
  const grid=document.getElementById('evProductosGrid');
  if(grid)grid.append(c);else (anchor?.parentNode||document.body).insertBefore(c,anchor||null);
 }
 const group=p.group||(p.description||'').match(/^Categoría: ([^\n]+)/)?.[1]||'Ferretería';
 c.dataset.evHardwareGroup=group;
 c.dataset.evHardwareSection=hardwareSection(group,p.title);
 c.dataset.evPublicId=p.id;
 c.dataset.evEditorCode=p.code;
 c.dataset.categoria=c.dataset.evCategoria='ev-cat-ferreteria';
 c.dataset.precio=p.price??'';
 c.dataset.evPriceMode='fixed';
 c.dataset.evPublicState=p.state;
 c.dataset.evFeatured=String(p.featured);
 if(p.id===smallContactCement.id)c.dataset.evPreviousPublicCode=oldContactCement.code;
 c.classList.add('ev-cat-ferreteria','evHardwareCard');
 c.classList.remove('ev-oculto-catalogo');
 const title=el('h2',p.title,'evHardwareTitle');
 c.replaceChildren(title,el('p',group,'evHardwareGroup'));
 if(p.image||p.video){
  const frame=el('div',null,'evHardwareMedia');
  if(p.image){
   const link=el('a');
   link.href=p.image;link.target='_blank';link.rel='noopener';
   link.setAttribute('aria-label','Ver foto completa de '+p.title);
   const img=el('img');img.src=p.image;img.alt=p.title;img.loading='lazy';link.append(img);frame.append(link);
  }
  if(p.video){
   const video=el('video');video.src=p.video;video.controls=true;video.playsInline=true;video.preload='metadata';frame.append(video);
  }
  c.append(frame);
 }
 const details=el('div',null,'detalles evHardwareDetails');
 const sales=el('div',null,'evHardwareSale');
 const tier=hardwareTier(p);
 const hasPrice=Number.isFinite(p.price)&&p.price>0;
 sales.append(el('h3','Precio de venta'));
 sales.append(el('strong',hasPrice?money(p.price)+' por '+(p.unit==='libra'?'libra':'unidad'):'Consultar precio','evHardwarePrice'));
 if(tier){
  const offer=el('div',null,'evHardwareTier');
  offer.append(
   el('h3','Precio al por mayor'),
   el('strong',money(tier.unitPrice)+' c/u'),
   el('p','A partir de '+tier.minQty+' unidades del mismo modelo')
  );
  sales.append(offer);
 }
 details.append(sales);
 sectionText(details,(p.description||'').replace(/^Categoría: [^\n]+\n/,'')
  .replace(/\nPrecio especial para negocios desde[^\n]*$/,'')
  .replace(/\s*Precio especial desde \d+ unidades del mismo modelo(?: y medida)?\.?\s*$/i,''));
 if(p.color)details.append(el('p','Acabado: '+p.color));
 const canOrder=p.state==='available'&&hasPrice;
 const stock=p.state==='available'?'Disponible':p.state==='coming'?'Disponibilidad por confirmar':'Agotado';
 const status=el('p',stock,'evHardwareStatus');
 status.dataset.state=p.state;
 details.append(status);
 if(canOrder){
  const order=el('div',null,'evHardwareOrder');
  const input=el('input');
  input.type='number';input.min='1';input.step='1';input.placeholder='Ej: 10';input.id='cantidad-'+p.id;
  const label=el('label','Cantidad en '+units(p));label.htmlFor=input.id;
  const total=el('p',null,'evHardwareTotal');total.setAttribute('aria-live','polite');
  const update=()=>{
   const quantity=Number(input.value);
   const selected=tier&&orderQuantity(p.code)+quantity>=tier.minQty?tier.unitPrice:p.price;
   total.textContent=Number.isSafeInteger(quantity)&&quantity>0?'Subtotal: '+money(quantity*selected):'';
  };
  input.addEventListener('input',update);
  const add=el('button','Agregar al pedido','boton-agregar');
  add.type='button';add.id='btn_'+input.id;
  add.setAttribute('onclick',"agregarPedido('"+p.code+"', '"+input.id+"')");
  add.addEventListener('click',()=>setTimeout(update,0));
  order.append(label,input,total,add);details.append(order);update();
 }else{
  const ask=el('a','Consultar por WhatsApp','evHardwareContact');
  const dest=new URL('https://wa.me/593983889592');
  dest.searchParams.set('text','Hola, quisiera consultar por '+p.title+'.');
  ask.href=dest.href;ask.target='_blank';ask.rel='noopener';details.append(ask);
 }
 c.append(details);
 const share=el('a','Compartir producto','ev-compartir-producto');
 share.href=hardwareProductURL(c);
 share.setAttribute('aria-label','Compartir '+p.title);
 c.append(share);
}
function deepLink(){var u=new URL(location.href),id=u.searchParams.get('ev'),requested=u.searchParams.get('producto')||legacyProductCode(u.hash),material=u.searchParams.get('material')||'';if(id===oldContactCement.id||requested===oldContactCement.code){id=smallContactCement.id;requested=smallContactCement.code}if(!id&&u.hash&&requested&&!hardwareProducts.has(requested))return;if(!requested&&!id){if(u.searchParams.get('linea')==='ev-cat-ferreteria'){var b=document.querySelector('[data-ev-editor-category="ev-cat-ferreteria"]');if(b)b.click()}return}var aliases=c=>[code(c),c.querySelector('h2')?.textContent,...Array.from(c.querySelectorAll('.detalles p')).map(n=>n.textContent.match(/^\s*C[óo]digo\s*:\s*(.+)/i)?.[1]).filter(Boolean)];var norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');var all=Array.from(document.querySelectorAll('.producto')).filter(c=>c.id!=='carritoSeccion'&&c.querySelector('h2')),c=all.find(c=>c.dataset.evPublicId===id&&id);if(!c){var target=norm(requested),variants={bronce:'BRONCE',plastica:'CABEZAPLASTICADECOLORES',aluminio:'COLOR',hierro:'HIERRO'},exact=all.filter(c=>aliases(c).some(a=>norm(a)===target));c=exact.find(c=>!material||norm(c.textContent).includes(variants[material]||norm(material)))||all.find(c=>aliases(c).some(a=>norm(a)===target+(variants[material]||'')))||exact[0]}if(c){document.querySelectorAll('.evPublicNotice').forEach(n=>n.remove());open(c)}else if(loaded){var note=el('p','Esta ficha aún no está publicada. Puede buscar el código o consultar a Llaves El Veci.','evPublicNotice');zone?.after(note)}}

function legacyProductCode(hash) {
 const match=hash.match(/^#producto=(.+)$/);
 if(!match)return null;
 try{return decodeURIComponent(match[1])}catch{return null}
}
function loadHardwareCards(products) {
 const canonical=products.some(product=>product.id===smallContactCement.id);
 for(const product of products){
  if(canonical&&product.id===oldContactCement.id)continue;
  publicCard(product);
 }
}

async function load(){try{var r=await fetch(FEED,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();var d=await r.json();loadHardwareCards(d.products);positionHardwareCards();installHardwarePrices();installHardwareQuote();loaded=true;refreshCards();window.dispatchEvent(new Event('ev-hardware-loaded'));deepLink();const input=document.getElementById('buscador');if(input&&document.activeElement===input)input.dispatchEvent(new Event('ev-hardware-ready'))}catch{loaded=true;window.dispatchEvent(new Event('ev-hardware-loaded'));deepLink()}}
var css=el('style');css.textContent='.evHardwareSections{max-width:1100px;margin:20px auto;padding:20px;border-radius:18px;background:#eff4f8;color:#123655}.evHardwareSections>div{display:flex;flex-wrap:wrap;gap:8px}.evHardwareSections button{white-space:normal;min-height:44px;width:auto!important;margin:0!important}.evHardwareSections button[aria-pressed=true]{background:#123655;color:#fff}.evHardwareSections>div:last-child{margin-top:14px}.evHardwareSections>div:last-child button{background:#fff;color:#123655;border:1px solid #ccd8e3;text-align:left;padding:12px;flex:1 1 230px}'+'.evShowcase{max-width:1100px;margin:18px auto 24px;background:#0c3154;border-radius:24px;overflow:hidden;box-shadow:0 12px 30px #16314d25;color:white;text-align:left}.evShowcaseHeader{display:flex;justify-content:space-between;gap:10px;padding:16px 24px;font-weight:800}.evShowcaseHeader span{font-size:13px;color:#d2ddea;font-weight:400}.evShowcaseSlide{margin:0!important;width:100%;min-height:320px;padding:24px!important;border-radius:0!important;background:linear-gradient(125deg,#fff 0%,#eff4f8 62%,#e4edf6)!important;color:#123655!important;display:grid!important;grid-template-columns:1fr 1fr;align-items:center;gap:30px;text-align:left!important}.evShowcaseSlide>img,.evShowcaseSlide>video{width:100%;height:290px;object-fit:contain;border-radius:12px}.evShowcaseInfo h2{text-align:left!important;font-size:clamp(24px,3vw,40px)!important;line-height:1.12;margin:14px 0}.evShowcaseEyebrow{letter-spacing:.14em;font-size:12px;font-weight:800;color:#4a6277}.evShowcaseCta{display:inline-block!important;width:auto!important;color:#123655!important;background:#ffd441!important;padding:12px 22px;border-radius:24px;font-weight:800;margin-top:12px}.evShowcaseNav{padding:12px 20px}.evShowcaseNav>div:first-child{display:flex;gap:10px}.evShowcaseNav button{width:auto!important;min-height:42px;margin:0!important;background:#ffffff17;color:#fff;border:1px solid #ffffff40}.evShowcaseNav p{font-size:12px;color:#d0ddea;margin:8px 0 0}.evShowcaseDots{display:flex;justify-content:center;gap:4px;margin:4px}.evShowcaseDots button{border:0;font-size:12px}.evShowcaseDots button.active{color:#ffda35}.evProductDetail{padding:18px;max-width:760px;width:calc(100vw - 24px);max-height:94dvh;border:0;border-radius:18px;background:#eef3f8;color:#123655;box-sizing:border-box}.evProductDetail::backdrop{background:#0b2038ba}.evProductBack{position:sticky;top:0;background:#123655;color:white;z-index:10}.evProductDetail .producto{display:block!important;max-width:100%!important;margin:16px 0!important}.evProductDetail img,.evProductDetail video{max-width:100%;max-height:360px;object-fit:contain}.evPublicNotice{padding:15px;background:#fff5c9;color:#17324a}@media(max-width:600px){.evShowcaseSlide{grid-template-columns:1fr;gap:6px;padding:18px!important}.evShowcaseSlide>img,.evShowcaseSlide>video{height:210px}.evShowcaseHeader{padding:14px 18px}.evShowcaseHeader span{display:none}.evShowcaseInfo h2{font-size:24px!important;margin:8px 0}.evShowcaseInfo p{margin:6px 0}.evShowcaseCta{margin:8px 0}.evShowcase{border-radius:18px}}@media(prefers-reduced-motion:reduce){.evShowcase video{display:block}}';document.head.append(css);
const hardwareStyle=el('style');hardwareStyle.textContent='.evHardwareCard{color:#1b2733!important;text-align:left!important;box-sizing:border-box}\n.evHardwareCard>.evHardwareTitle{margin:0!important;text-align:left!important;font-size:clamp(1.16rem,2vw,1.45rem)!important;line-height:1.23!important;color:#142838!important;overflow-wrap:anywhere}\n.evHardwareCard>.evHardwareGroup{margin:5px 0 14px!important;color:#526170!important;text-align:left!important;font-size:.86rem!important}\n.evHardwareCard>.evHardwareMedia{display:grid;gap:10px;width:100%;min-width:0;margin:0 0 15px;background:#f5f6f7;border-radius:12px;padding:0;box-sizing:border-box}\n.evHardwareMedia>a{display:block;width:100%;aspect-ratio:4/3;overflow:hidden;border-radius:12px;box-sizing:border-box}\n.evHardwareCard .evHardwareMedia img,.evHardwareCard .evHardwareMedia video{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;min-height:0!important;object-fit:contain!important;object-position:center!important;transform:none!important;margin:0!important;padding:0!important;position:static!important;border-radius:12px}\n.evHardwareCard .evHardwareMedia video{aspect-ratio:16/9}\n.evHardwareCard>.evHardwareDetails{display:grid!important;gap:13px;text-align:left!important;margin:0!important;padding:0!important}\n.evHardwareDetails h3{font-size:.88rem!important;text-align:left!important;font-weight:700;color:#243a4b;margin:0 0 5px!important}\n.evHardwareDetails p{font-size:.91rem!important;line-height:1.45;text-align:left!important;margin:0!important;color:#394b58}\n.evHardwareSale{padding:12px 14px;border:1px solid #e8d3d3;border-left:4px solid #a3262c;border-radius:10px;background:#fff9f9}\n.evHardwarePrice{display:block;color:#142838;font-size:1.17rem;line-height:1.25}\n.evHardwareTier{margin-top:10px;padding-top:10px;border-top:1px solid #e8d3d3}\n.evHardwareTier strong{display:block;color:#87202a;font-size:1.18rem;margin-bottom:3px}\n.evHardwareDetails .evHardwareTier p{color:#64333a}\n.evHardwareDescription{display:grid;gap:4px}\n.evHardwareDescription h3:not(:first-child){margin-top:8px!important}\n.evHardwareDetails .evHardwareStatus{font-weight:700;color:#694509}\n.evHardwareDetails .evHardwareStatus[data-state=available]{color:#17633b}\n.evHardwareDetails .evHardwareStatus[data-state=unavailable]{color:#7b2b2b}\n.evHardwareOrder{display:grid;gap:7px}\n.evHardwareOrder label{font-weight:600}\n.evHardwareOrder input,.evHardwareOrder button{width:100%!important;box-sizing:border-box;margin:0!important}\n.evHardwareContact{display:block;color:#153d62!important;text-decoration:underline}\n#evCatalogWindow .evWinContent:has(>.evHardwareCard){display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:start;max-width:1200px}\n#evCatalogWindow .evWinContent>.evHardwareCard{width:100%!important;max-width:none!important;margin:0!important;padding:16px!important;box-sizing:border-box}\n#evPublicProduct .evHardwareCard{width:100%!important;box-sizing:border-box}\n#evPublicProduct:has(.evHardwareCard) .evProductBack{position:static}\n@media(max-width:950px){#evCatalogWindow .evWinContent:has(>.evHardwareCard){grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:580px){#evCatalogWindow .evWinContent:has(>.evHardwareCard){grid-template-columns:minmax(0,1fr);padding:12px 12px 110px}}\n';document.head.append(hardwareStyle);
const quoteStyle=el('style');
quoteStyle.textContent='.evHardwareCard .ev-precio-visible,.evQuoteHideHome{display:none!important}.evHardwareOrder input::placeholder{color:#7b8792;opacity:1}.evHardwareTotal:empty{display:none}.evQuoteUnit{display:block;white-space:normal;font-size:.72em;line-height:1.1}.evQuoteCounts{margin:.75em 0}.evQuoteCounts p{margin:.3em 0;font-weight:700}#detalleCotizacion td:first-child{overflow-wrap:anywhere;white-space:normal!important}';
document.head.append(quoteStyle);
function hardwareSearchText(value){
 return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()
  .replace(/([A-Z])(\d)/g,'$1 $2').replace(/(\d)([A-Z])/g,'$1 $2')
  .replace(/[^A-Z0-9]+/g,' ').trim();
}
function hardwareSearchTerms(value){
 return hardwareSearchText(value).split(' ').filter(Boolean)
  .map(word=>/^[A-Z]{3,}S$/.test(word)?word.slice(0,-1):word);
}
function findHardware(query){
 const words=hardwareSearchTerms(query);
 if(!words.length||hardwareSearchText(query).length<2)return [];
 const phrase=words.join(' ');
 const matches=text=>{
  const terms=hardwareSearchTerms(text);
  return words.every(word=>terms.some(term=>/^[0-9]+$/.test(word)?term===word:term.startsWith(word)));
 };
 return Array.from(document.querySelectorAll('.evHardwareCard:not(.ev-oculto-catalogo)')).flatMap(card=>{
  const product=hardwareProducts.get(code(card));
  if(!product)return [];
  const title=hardwareSearchTerms(product.title).join(' ');
  const exactCode=[product.code,card.dataset.evPreviousPublicCode].some(value=>hardwareSearchText(value)===hardwareSearchText(query));
  const startsTitle=title===phrase||title.startsWith(phrase+' ');
  const rank=exactCode?4:startsTitle?3:matches(product.title+' '+product.code)?2:
   matches([product.title,product.code,card.dataset.evHardwareGroup,product.description].join(' '))?1:0;
  return rank?[{card,product,rank}]:[];
 }).sort((a,b)=>b.rank-a.rank||a.product.title.localeCompare(b.product.title,'es'));
}
function installHardwareSearch(){
 const input=document.getElementById('buscador');
 if(!input)return;
 input.placeholder='Ej: candados, spray negro, TR3';
 let timer;
 const getBox=()=>document.getElementById('evSugerenciasBusqueda');
 function showResults(){
  const box=getBox();
  if(!box)return;
  box.querySelectorAll('[data-ev-hardware-result]').forEach(button=>button.remove());
  const matches=findHardware(input.value).slice(0,8);
  if(!matches.length)return;
  box.querySelector('.ev-sugerencia-sin-resultados')?.remove();
  const options=matches.map(({product})=>{
   const button=el('button',null,'ev-sugerencia');
   button.type='button';
   button.dataset.evHardwareResult=product.code;
   button.append(el('strong',product.title),el('small','Ferretería'));
   return button;
  });
  box.prepend(...options);
  box.style.display='block';
 }
 function openResult(card){
  clearTimeout(timer);
  input.blur();
  const box=getBox();
  if(box)box.style.display='none';
  document.body.classList.remove('ev-search-active');
  open(card);
 }
 // The legacy search handles these events in document capture and renders its own list first.
 for(const eventName of ['input','focus','ev-hardware-ready']){
  window.addEventListener(eventName,event=>{
   if(event.target!==input)return;
   clearTimeout(timer);
   timer=setTimeout(showResults,0);
  },true);
 }
 window.addEventListener('keydown',event=>{
  if(event.target!==input||event.key!=='Enter'||event.isComposing)return;
  const first=findHardware(input.value)[0];
  const legacyResult=getBox()?.querySelector('.ev-sugerencia:not([data-ev-hardware-result]):not(.ev-sugerencia-sin-resultados)');
  if(!first||(first.rank<3&&legacyResult))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openResult(first.card);
 },true);
 window.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-ev-hardware-result]');
  if(!button)return;
  const card=Array.from(document.querySelectorAll('.evHardwareCard')).find(card=>code(card)===button.dataset.evHardwareResult);
  if(!card)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openResult(card);
 },true);
}
function installHardwareSharing() {
 window.addEventListener('click',async event=>{
  const link=event.target.closest?.('.ev-compartir-producto');
  const card=link?.closest('.evHardwareCard');
  if(!card)return;
  const offer=hardwareShare(card);
  if(!offer)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const text=offer.text+'\n'+offer.url;
  if(navigator.share){
   try{
    await navigator.share({title:card.querySelector('h2').textContent,text});
    return;
   }catch(error){if(error.name==='AbortError')return}
  }
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
 },true);
}
function installHardwareNavigation() {
 let section='';
 let inHardware=false;
 let nav;
 const render=()=>{
  const dialog=document.getElementById('evCatalogWindow');
  const content=dialog?.querySelector('.evWinContent');
  const search=dialog?.querySelector('.evWinSearch');
  if(!dialog?.open||!content||!inHardware)return;
  if(search.hidden&&dialog.querySelector('.evWinHeader h2')?.textContent==='Tu pedido')return;
  if(!nav?.isConnected){
   nav=el('div',null,'evWinMenu evHardwareMenu');
   for(const [key,label] of hardwareMenu){
    const button=el('button',label);
    button.type='button';
    button.onclick=()=>{
     section=key;
     search.value='';
     search.dispatchEvent(new Event('input'));
     render();
     dialog.scrollTop=0;
    };
    nav.append(button);
   }
   content.prepend(nav);
  }
  content.classList.add('evHardwareWindow');
  content.dataset.evHardwareSection=section;
  Array.from(nav.children).forEach((button,index)=>button.setAttribute('aria-pressed',String(hardwareMenu[index][0]===section)));
  search.hidden=!section;
  const empty=content.querySelector('.evWinEmpty');
  if(empty)empty.hidden=!section;
 };
 window.addEventListener('click',event=>{
  const button=event.target.closest?.('button');
  if(!button)return;
  if(button.parentElement?.id==='evCategorias'){
   inHardware=button.dataset.evEditorCategory==='ev-cat-ferreteria'||/filtrarPorLinea\(['"]ev-cat-ferreteria/.test(button.getAttribute('onclick')||'');
   section='';
   requestAnimationFrame(render);
   return;
  }
  if(!inHardware||!button.closest('#evCatalogWindow'))return;
  const heading=button.closest('#evCatalogWindow').querySelector('.evWinHeader h2');
  if(button.textContent.trim()==='← Volver'&&section&&heading?.textContent!=='Tu pedido'){
   event.preventDefault();
   event.stopImmediatePropagation();
   section='';
   render();
   return;
  }
  requestAnimationFrame(render);
 },true);
 window.addEventListener('ev-hardware-loaded',()=>{
  if(inHardware&&document.getElementById('evCatalogWindow')?.open&&document.querySelector('#evCatalogWindow .evWinEmpty')){
   const menu=document.getElementById('evCategorias');
   const entry=Array.from(menu?.children||[]).find(button=>button.dataset.evEditorCategory==='ev-cat-ferreteria'||/filtrarPorLinea\(['"]ev-cat-ferreteria/.test(button.getAttribute('onclick')||''));
   const previousSection=section;
   if(entry){entry.click();section=previousSection;render()}
  }
 });
 const style=el('style');
 style.textContent=`
 #evCatalogWindow .evHardwareMenu{grid-column:1/-1;margin-bottom:12px}
 #evCatalogWindow .evHardwareMenu button[aria-pressed=true]{box-shadow:inset 0 -4px #ffd441}
 #evCatalogWindow .evHardwareWindow:not([data-ev-hardware-section="candados"])>.evHardwareCard[data-ev-hardware-section="candados"],
 #evCatalogWindow .evHardwareWindow:not([data-ev-hardware-section="cerraduras"])>.evHardwareCard[data-ev-hardware-section="cerraduras"],
 #evCatalogWindow .evHardwareWindow:not([data-ev-hardware-section="tornilleria"])>.evHardwareCard[data-ev-hardware-section="tornilleria"],
 #evCatalogWindow .evHardwareWindow:not([data-ev-hardware-section="ferreteria"])>.evHardwareCard[data-ev-hardware-section="ferreteria"]{display:none!important}
 #evCatalogWindow .evHardwareWindow>.evWinEmpty[hidden]{display:none}
 `;
 document.head.append(style);
}
function start(){
 init();
 installHardwareNavigation();
 installHardwareSharing();
 installHardwareSearch();
 load();
 [1800,6500].forEach(t=>setTimeout(function(){
  document.getElementById('evVideosPortada')?.remove();
  document.getElementById('evPreciosActuales')?.remove();
  refreshCards();
 },t));
 if(reduceMotion)manualPause=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
