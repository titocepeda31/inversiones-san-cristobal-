const menu=document.querySelector('#menu'),nav=document.querySelector('#navigation');
if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú')}));
}
const photos=[...document.querySelectorAll('[data-image]')],box=document.querySelector('#lightbox');let current=0;
if(box&&photos.length){
function showPhoto(i){current=(i+photos.length)%photos.length;box.querySelector('img').src=photos[current].querySelector('img').getAttribute('src');box.querySelector('img').alt=photos[current].dataset.caption;box.querySelector('p').textContent=photos[current].dataset.caption+' · '+(current+1)+' / '+photos.length}
photos.forEach((p,i)=>p.addEventListener('click',()=>{showPhoto(i);box.showModal();document.body.classList.add("modal-open")}));
document.querySelector('#prev').addEventListener('click',()=>showPhoto(current-1));document.querySelector('#next').addEventListener('click',()=>showPhoto(current+1));
box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showPhoto(current-1);if(e.key==='ArrowRight')showPhoto(current+1)});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#interest').value=a.dataset.interest));
// Swipe only on the photograph; vertical movements and pinch gestures do not navigate.
const enlargedPhoto=box.querySelector('img');
let swipeStart=null;
enlargedPhoto.draggable=false;
enlargedPhoto.addEventListener('touchstart',event=>{
 swipeStart=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;
},{passive:true});
enlargedPhoto.addEventListener('touchmove',event=>{
 if(event.touches.length!==1)swipeStart=null;
},{passive:true});
enlargedPhoto.addEventListener('touchend',event=>{
 if(!swipeStart)return;
 const start=swipeStart;swipeStart=null;
 if(event.touches.length||event.changedTouches.length!==1)return;
 const dx=event.changedTouches[0].clientX-start.x;
 const dy=event.changedTouches[0].clientY-start.y;
 if(Math.abs(dx)>=50&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(current+(dx<0?1:-1));
},{passive:true});
enlargedPhoto.addEventListener('touchcancel',()=>{swipeStart=null},{passive:true});
}

document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{
 if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');
}));

const scrollTopButton=document.querySelector('#scroll-top');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function updateScrollTop(){scrollTopButton.hidden=window.scrollY<400}
window.addEventListener('scroll',updateScrollTop,{passive:true});
updateScrollTop();
scrollTopButton.addEventListener('click',()=>{
 window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
 document.querySelector('header .brand').focus({preventScroll:true});
});


const contactForm=document.querySelector('#contact-form');
if(contactForm){
 const status=document.querySelector('#form-status');
 const submit=contactForm.querySelector('button[type="submit"]');
 let sending=false;
 contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending)return;
  if(location.hostname.endsWith('.github.io')){
   status.textContent='Para enviar su consulta, visite inversionessancristobal.cl o utilice el botón de WhatsApp.';
   status.dataset.state='error';status.focus();return;
  }
  sending=true;submit.disabled=true;submit.textContent='Enviando…';
  status.textContent='Estamos enviando su consulta.';status.dataset.state='pending';
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch(contactForm.action,{
    method:'POST',headers:{'Accept':'application/json'},
    body:new URLSearchParams(new FormData(contactForm)),signal:controller.signal
   });
   let result;
   try{result=await response.json()}catch{throw new Error('El envío no está disponible en este momento. Escríbanos por WhatsApp o correo.')}
   if(!response.ok||result.ok!==true)throw new Error(result.message||'No se pudo enviar su consulta. Sus datos siguen en el formulario.');
   status.textContent=result.message;status.dataset.state='success';contactForm.reset();
  }catch(error){
   status.textContent=error.name==='AbortError'||error instanceof TypeError
    ?'No pudimos confirmar el envío. Sus datos siguen aquí; contáctenos por WhatsApp antes de volver a enviarlos.'
    :error.message;
   status.dataset.state='error';
  }finally{
   clearTimeout(timeout);sending=false;submit.disabled=false;submit.textContent='Enviar consulta';
   status.focus({preventScroll:true});
  }
 });
}
