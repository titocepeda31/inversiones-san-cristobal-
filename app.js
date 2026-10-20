const menu=document.querySelector('#menu'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú')}));
const photos=[...document.querySelectorAll('[data-image]')],box=document.querySelector('#lightbox');let current=0;
function showPhoto(i){current=(i+photos.length)%photos.length;box.querySelector('img').src=photos[current].querySelector('img').getAttribute('src');box.querySelector('img').alt=photos[current].dataset.caption;box.querySelector('p').textContent=photos[current].dataset.caption+' · '+(current+1)+' / '+photos.length}
photos.forEach((p,i)=>p.addEventListener('click',()=>{showPhoto(i);box.showModal();document.body.classList.add("modal-open")}));
document.querySelector('#prev').addEventListener('click',()=>showPhoto(current-1));document.querySelector('#next').addEventListener('click',()=>showPhoto(current+1));
box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showPhoto(current-1);if(e.key==='ArrowRight')showPhoto(current+1)});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#interest').value=a.dataset.interest));
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);document.querySelector('#summary').textContent='Interés: '+f.get('interes')+'\nNombre: '+f.get('nombre')+'\nEmpresa: '+(f.get('empresa')||'No indicada')+'\nCorreo: '+f.get('correo')+'\nTeléfono: '+(f.get('telefono')||'No indicado')+'\n\n'+f.get('mensaje');document.querySelector('#copy-status').textContent='';document.querySelector('#proposal').showModal()});
document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#summary').textContent);document.querySelector('#copy-status').textContent='Resumen copiado.'}catch{document.querySelector('#copy-status').textContent='Seleccione el texto del resumen para copiarlo.'}});

// Keep the page still while either dialog is open.
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.addEventListener('close',()=>{
  if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');
 });
});
document.querySelector('#contact-form').addEventListener('submit',()=>document.body.classList.add('modal-open'));
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
const scrollTopButton=document.querySelector('#scroll-top');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function updateScrollTop(){scrollTopButton.hidden=window.scrollY<400}
window.addEventListener('scroll',updateScrollTop,{passive:true});
updateScrollTop();
scrollTopButton.addEventListener('click',()=>{
 window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
 document.querySelector('header .brand').focus({preventScroll:true});
});
