/* Portfolio interactions — no dependencies. Project records live in data.js. */
(function(){
"use strict";
const projects=window.PORTFOLIO_PROJECTS||[];
const grid=document.getElementById("project-grid");
const dialog=document.getElementById("project-modal");
const content=document.getElementById("modal-content");
const footer=document.getElementById("modal-footer");
const closeButton=document.getElementById("modal-close");
const toast=document.getElementById("toast");
const menu=document.getElementById("menu-toggle");
const nav=document.getElementById("primary-navigation");
let active=null,photoIndex=0,lastFocus=null,toastTimer=0,previousBodyOverflow="";
function clean(str){return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function tagsHTML(tags){return tags.map(function(t){return "<span>"+clean(t)+"</span>"}).join("")}
function liveHTML(p){
 return p.live?'<a class="project-live-link" href="'+clean(p.live)+'" target="_blank" rel="noopener noreferrer" aria-label="เปิดเว็บไซต์จริงของ '+clean(p.title)+'">LIVE WEBSITE ↗</a>':"";
}
function cardHTML(p,featured){
 return '<article class="project-card '+(featured?"is-featured":"")+'" data-id="'+clean(p.id)+'">'
 +'<div class="project-media"><img src="'+clean(p.cover)+'" alt="ภาพตัวอย่าง '+clean(p.title)+'" loading="lazy">'
 +'<span class="project-number">'+clean(p.number)+' / 05</span>'
 +'<span class="project-status '+(p.live?"":"is-case")+'">'+(p.live?"LIVE PROJECT":"CASE STUDY")+'</span></div>'
 +'<div class="project-info"><div class="project-meta"><span>'+clean(p.categoryLabel)+'</span><span>'+clean(p.year)+'</span></div>'
 +'<h3>'+clean(p.title)+'</h3><p>'+clean(p.subtitle)+' — '+clean(p.summary)+'</p>'
 +'<div class="project-tags">'+tagsHTML(p.tags)+'</div>'
 +'<div class="project-actions"><button class="project-detail-btn" type="button" data-project="'+clean(p.id)+'">ดูรายละเอียด <span aria-hidden="true">↗</span></button>'+liveHTML(p)+'</div>'
 +'</div></article>';
}
function render(filter){
 const filtered=filter==="all"?projects:projects.filter(function(p){return p.category===filter||(filter==="dashboard"&&p.tags.indexOf("Dashboard")!==-1)});
 grid.innerHTML=filtered.map(function(p){return cardHTML(p,filter==="all"&&p.featured)}).join("");
}
function modalImage(p,index){
 const images=Array.isArray(p.images)&&p.images.length?p.images:[{src:p.cover||"assets/preview-fallback.svg",caption:p.title}];
 return images[Math.max(0,Math.min(index,images.length-1))];
}
function openProject(id,changeHash){
 const p=projects.find(function(x){return x.id===id});
 if(!p)return;
 if(!dialog.open){
  lastFocus=document.activeElement;
  previousBodyOverflow=document.body.style.overflow;
 }
 active=p;photoIndex=0;
 const photos=Array.isArray(p.images)&&p.images.length?p.images:[modalImage(p,0)];
 const image=photos[0];
 const features=Array.isArray(p.features)?p.features.filter(Boolean):[];
 content.innerHTML=
  '<div class="modal-intro">'
    +'<span class="modal-overline">'+clean(p.number)+' / '+clean(p.categoryLabel)+'</span>'
    +'<h2 id="modal-title">'+clean(p.title)+'</h2>'
    +'<p class="modal-desc">'+clean(p.subtitle)+'</p>'
  +'</div>'
  +'<div class="modal-showcase"><img id="modal-photo" src="'+clean(image.src)+'" alt="'+clean(image.caption||p.title)+'"></div>'
  +'<div class="modal-gallery"><span class="modal-count" id="modal-count">'+(photos.length>1?'ภาพ 1 จาก '+photos.length+' · ':'')+clean(image.caption||p.title)+'</span>'
    +'<div class="modal-gallery-controls">'
      +(photos.length>1?'<button class="gallery-arrow" id="prev-photo" type="button" aria-label="ภาพก่อนหน้า" disabled>←</button><button class="gallery-arrow" id="next-photo" type="button" aria-label="ภาพถัดไป">→</button>':'')
      +'<a class="gallery-view" id="view-photo" href="'+clean(image.src)+'" target="_blank" rel="noopener noreferrer" aria-label="เปิดภาพเต็มในแท็บใหม่">เปิดภาพเต็ม ↗</a>'
    +'</div>'
  +'</div>'
  +'<div class="modal-overview">'
    +'<div><h3>PROJECT OVERVIEW</h3><p>'+clean(p.description||p.summary||"")+'</p></div>'
    +(features.length?'<div><h3>KEY HIGHLIGHTS</h3><ul>'+features.map(function(f){return '<li>'+clean(f)+'</li>';}).join("")+'</ul></div>':'')
  +'</div>';

 if(p.live){
  footer.hidden=false;
  footer.innerHTML='<a class="modal-live-link" href="'+clean(p.live)+'" target="_blank" rel="noopener noreferrer" aria-label="เปิดเว็บไซต์จริงของ '+clean(p.title)+' ในแท็บใหม่">เปิดเว็บไซต์จริง <span aria-hidden="true">↗</span></a>';
 }else{
  footer.hidden=true;
  footer.textContent="";
 }
 if(photos.length>1){
  document.getElementById("prev-photo").addEventListener("click",function(){showPhoto(photoIndex-1)});
  document.getElementById("next-photo").addEventListener("click",function(){showPhoto(photoIndex+1)});
 }
 content.scrollTop=0;
 if(!dialog.open)dialog.showModal();
 document.body.style.overflow="hidden";
 closeButton.focus({preventScroll:true});
 if(changeHash!==false)history.replaceState(null,"","#project-"+p.id);
}
function showPhoto(index){
 if(!active)return;
 const photos=Array.isArray(active.images)&&active.images.length?active.images:[modalImage(active,0)];
 photoIndex=Math.max(0,Math.min(index,photos.length-1));
 const entry=photos[photoIndex];
 const img=document.getElementById("modal-photo");
 img.src=entry.src;
 img.alt=entry.caption||active.title;
 document.getElementById("view-photo").href=entry.src;
 document.getElementById("modal-count").textContent="ภาพ "+(photoIndex+1)+" จาก "+photos.length+" · "+(entry.caption||active.title);
 const prev=document.getElementById("prev-photo");
 const next=document.getElementById("next-photo");
 if(prev)prev.disabled=photoIndex===0;
 if(next)next.disabled=photoIndex===photos.length-1;
}
function closeProject(){if(dialog.open)dialog.close()}
dialog.addEventListener("close",function(){
 document.body.style.overflow=previousBodyOverflow;
 if(location.hash.indexOf("#project-")===0)history.replaceState(null,"","#projects");
 active=null;
 if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
});
dialog.addEventListener("click",function(e){if(e.target===dialog)closeProject()});
closeButton.addEventListener("click",closeProject);
grid.addEventListener("click",function(e){const btn=e.target.closest("[data-project]");if(btn)openProject(btn.dataset.project,true)});
document.querySelectorAll(".filter").forEach(function(btn){
 btn.addEventListener("click",function(){
  document.querySelectorAll(".filter").forEach(function(b){const yes=b===btn;b.classList.toggle("is-selected",yes);b.setAttribute("aria-pressed",String(yes))});
  render(btn.dataset.filter);
 });
});
menu.addEventListener("click",function(){
 const opened=menu.getAttribute("aria-expanded")!=="true";
 menu.setAttribute("aria-expanded",String(opened));nav.classList.toggle("is-open",opened);
});
document.querySelectorAll(".nav-link").forEach(function(link){
 link.addEventListener("click",function(){nav.classList.remove("is-open");menu.setAttribute("aria-expanded","false")});
});
document.addEventListener("click",function(e){
 if(!e.target.closest(".site-header")&&nav.classList.contains("is-open")){
 nav.classList.remove("is-open");menu.setAttribute("aria-expanded","false");
 }
});
function updateScroll(){
 const maximum=document.documentElement.scrollHeight-innerHeight;
 document.getElementById("scroll-progress").style.width=(maximum>0?scrollY/maximum*100:0)+"%";
 document.querySelector(".site-header").classList.toggle("is-scrolled",scrollY>24);
 const names=["home","projects","expertise","about","contact"];let current="home";
 names.forEach(function(n){const el=document.getElementById(n);if(el&&el.getBoundingClientRect().top<innerHeight*.34)current=n});
 document.querySelectorAll(".nav-link").forEach(function(a){a.classList.toggle("is-active",a.getAttribute("href")==="#"+current)});
}
addEventListener("scroll",updateScroll,{passive:true});addEventListener("resize",updateScroll);updateScroll();
function notify(msg){toast.textContent=msg;toast.classList.add("is-visible");clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove("is-visible")},2800)}
document.getElementById("share-portfolio").addEventListener("click",async function(){
 const url=location.href.split("#")[0];
 if(navigator.share){try{await navigator.share({title:"ATHIKAN — Portfolio",text:"Portfolio รวมผลงาน Web Application และ UI/UX",url:url});return}catch(e){if(e.name==="AbortError")return}}
 try{await navigator.clipboard.writeText(url);notify("คัดลอกลิงก์ Portfolio แล้ว")}
 catch(e){const field=document.createElement("textarea");field.value=url;document.body.appendChild(field);field.select();let success=false;try{success=document.execCommand("copy")}catch(err){}field.remove();notify(success?"คัดลอกลิงก์ Portfolio แล้ว":"ไม่สามารถคัดลอกอัตโนมัติได้")}
});
document.getElementById("year").textContent=new Date().getFullYear();
function renderHeroWorkspace(){
 const board=document.getElementById("hero-project-windows");
 if(!board)return;
 const sizes=["is-wide","is-medium","","",""];
 board.innerHTML=projects.map(function(p,index){
  const domain=p.live?new URL(p.live).hostname.replace(/^www\./,""):"DESIGN PREVIEW";
  const src=p.cover||(p.images&&p.images[0]&&p.images[0].src)||"assets/preview-fallback.svg";
  return '<button type="button" class="showcase-window '+(sizes[index]||"")+'" data-project="'+clean(p.id)+'" aria-label="ดูรายละเอียดโปรเจกต์ '+clean(p.title)+'">'
    +'<span class="showcase-browser-bar" aria-hidden="true"><span class="showcase-browser-dots"><i></i><i></i><i></i></span><span class="showcase-browser-address">'+clean(domain)+'</span><span class="showcase-browser-action">↗</span></span>'
    +'<img class="showcase-screenshot" src="'+clean(src)+'" alt="" loading="eager" decoding="async">'
    +'<span class="showcase-window-footer"><span class="showcase-window-label">'+clean(p.title)+'</span><span class="showcase-window-number">'+String(index+1).padStart(2,"0")+'</span></span>'
    +'</button>';
 }).join("");
 board.addEventListener("click",function(event){
  const tile=event.target.closest(".showcase-window[data-project]");
  if(tile)openProject(tile.dataset.project,true);
 });
}

renderHeroWorkspace();
render("all");
const deep=location.hash.match(/^#project-([a-z0-9-]+)$/);
if(deep)requestAnimationFrame(function(){openProject(deep[1],false)});
})();