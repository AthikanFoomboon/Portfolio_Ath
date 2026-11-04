/* Portfolio interactions — no dependencies. Project records live in data.js. */
(function(){
"use strict";
const projects=window.PORTFOLIO_PROJECTS||[];
const grid=document.getElementById("project-grid");
const dialog=document.getElementById("project-modal");
const content=document.getElementById("modal-content");
const toast=document.getElementById("toast");
const menu=document.getElementById("menu-toggle");
const nav=document.getElementById("primary-navigation");
let active=null,photoIndex=0,lastFocus=null,toastTimer=0;
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
function openProject(id,changeHash){
 const p=projects.find(function(x){return x.id===id});if(!p)return;
 active=p;photoIndex=0;lastFocus=document.activeElement;
 content.innerHTML='<span class="modal-overline">'+clean(p.number)+' / PROJECT CASE STUDY · '+clean(p.categoryLabel)+'</span>'
 +'<h2 id="modal-title">'+clean(p.title)+' <span style="color:#4568ed">↗</span></h2>'
 +'<p class="modal-desc">'+clean(p.subtitle)+' — '+clean(p.description)+'</p>'
 +'<div class="modal-tags">'+tagsHTML(p.tags)+'</div>'
 +'<div class="modal-showcase"><img id="modal-photo" src="'+clean(p.images[0].src)+'" alt="'+clean(p.images[0].caption)+'"></div>'
 +'<div class="modal-gallery"><span class="modal-count" id="modal-count">01 / '+String(p.images.length).padStart(2,"0")+' — '+clean(p.images[0].caption)+'</span>'
 +'<div class="modal-gallery-controls">'+(p.images.length>1?'<button class="gallery-arrow" id="prev-photo" type="button" aria-label="ภาพก่อนหน้า">←</button><button class="gallery-arrow" id="next-photo" type="button" aria-label="ภาพถัดไป">→</button>':"")
 +'<a class="gallery-view" id="view-photo" href="'+clean(p.images[0].src)+'" target="_blank" rel="noopener noreferrer">ขยายภาพ ↗</a></div></div>'
 +'<div class="modal-overview"><div><h3>PROJECT OVERVIEW</h3><p>'+clean(p.summary)+'</p></div>'
 +'<div><h3>KEY HIGHLIGHTS</h3><ul>'+p.features.map(function(f){return "<li>"+clean(f)+"</li>"}).join("")+'</ul></div></div>'
 +'<div class="modal-action-row">'+(p.live?'<a class="btn btn-dark" href="'+clean(p.live)+'" target="_blank" rel="noopener noreferrer">เปิดเว็บไซต์จริง <span>↗</span></a>':'<span class="modal-no-link">* ยังไม่มีลิงก์เว็บไซต์สาธารณะที่ระบุไว้</span>')
 +'<button class="btn btn-outline" id="close-detail-bottom" type="button" style="color:#152033;border-color:#d6dcdf">ปิดรายละเอียด <span>✕</span></button></div>';
 if(!dialog.open)dialog.showModal();
 document.body.style.overflow="hidden";
 document.getElementById("close-detail-bottom").addEventListener("click",closeProject);
 if(p.images.length>1){
 document.getElementById("prev-photo").addEventListener("click",function(){showPhoto(photoIndex-1)});
 document.getElementById("next-photo").addEventListener("click",function(){showPhoto(photoIndex+1)});
 }
 if(changeHash!==false)history.replaceState(null,"","#project-"+p.id);
}
function showPhoto(index){
 if(!active)return;
 photoIndex=(index+active.images.length)%active.images.length;
 const entry=active.images[photoIndex];
 const img=document.getElementById("modal-photo");img.src=entry.src;img.alt=entry.caption;
 document.getElementById("view-photo").href=entry.src;
 document.getElementById("modal-count").textContent=String(photoIndex+1).padStart(2,"0")+" / "+String(active.images.length).padStart(2,"0")+" — "+entry.caption;
}
function closeProject(){if(dialog.open)dialog.close()}
dialog.addEventListener("close",function(){
 document.body.style.overflow="";
 if(location.hash.indexOf("#project-")===0)history.replaceState(null,"","#projects");
 active=null;
 if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
});
dialog.addEventListener("click",function(e){if(e.target===dialog)closeProject()});
document.getElementById("modal-close").addEventListener("click",closeProject);
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
render("all");
const deep=location.hash.match(/^#project-([a-z0-9-]+)$/);
if(deep)requestAnimationFrame(function(){openProject(deep[1],false)});
})();