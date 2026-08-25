const defaultContent={heroEyebrow:'Riviera Maya · Mexico',heroTitle:'Master|your depth.',heroSubtitle:'Elite freediving instruction, advanced equalization, and depth training for people who want to feel at home beneath the surface.',aboutLead:'At OceanicVibes, we train athletes, watermen, and dedicated individuals to safely unlock their true aquatic potential.',aboutBody:'From Frenzel and Mouthfill equalization to CO2 tolerance and deep relaxation, every session is built around calm, measurable progression and uncompromising safety.',footerCopy:'Private instruction and depth training in the waters of the Yucatan.',footerEmail:'train@oceanicvibes.com',instagram:'@_oceanicvibes_',courses:[{date:'Oct 15–17',location:'Playa del Carmen',title:'AIDA 2 Foundation',description:'Build a bulletproof foundation with Frenzel equalization, duck dives, breathing techniques, and safety protocols up to 20 meters.'},{date:'Nov 02–05',location:'Bacalar',title:'Stillness & Technique',description:'A focused Bacalar weekend for breathwork, relaxation, body position, and the calm precision that makes depth feel effortless.'},{date:'Nov 18–22',location:'Playa del Carmen',title:'Advanced Depth',description:'Line training in Free Immersion and Constant Weight, with advanced equalization and coaching through your next depth barrier.'}]};
function getContent(){return fetch('content.json',{cache:'no-store'}).then(response=>response.ok?response.json():Promise.reject()).catch(()=>defaultContent)}
function escapeHtml(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}

const depthValue=document.getElementById('depthValue');
const reduceMotion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsapReady=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'&&!reduceMotion;

/* ---------------------------------------------------------------------
   AMBIENT MOTION — caustic light + the descent veil, bound to scroll.
   Independent of GSAP so it stays calm and cheap; skipped when reduced.
   --------------------------------------------------------------------- */
function bindAmbient(){
  const el=document.querySelector('.caustic'),cd=document.querySelector('.caustic-deep'),ds=document.querySelector('.descent');
  if(!el&&!cd&&!ds)return;
  const root=document.documentElement||document.body;
  const apply=()=>{
    const scrollable=Math.max(0,(root.scrollHeight||0)-window.innerHeight);
    const sy=(window.pageYOffset!==undefined?window.pageYOffset:(root.scrollTop||0));
    const p=scrollable>0?Math.min(1,Math.max(0,sy/scrollable)):0;
    if(el){el.style.setProperty('--caust-x',(p*54-16).toFixed(1)+'px');el.style.setProperty('--caust-y',(p*118-8).toFixed(1)+'px')}
    if(cd){cd.style.setProperty('--caust-x',(p*88-28).toFixed(1)+'px');cd.style.setProperty('--caust-y',(p*170-18).toFixed(1)+'px')}
    if(ds)ds.style.setProperty('--descent-op',(p*0.18).toFixed(3));
  };
  apply();
  if(!reduceMotion){window.addEventListener('scroll',apply,{passive:true});window.addEventListener('resize',apply)}
}

/* -------------------------------------------------------------------------
   DEPTH COUNTER — driven by a GSAP proxy-object tween, scrubbed to the
   whole page scroll. Rendered into #depthValue and kept in --depth-scale
   so the number (and its type size) descend 5 → 100, smooth, no jitter.
   ------------------------------------------------------------------------- */
function initDepthGSAP(){
  const proxy={value:5};
  const render=()=>{
    depthValue.textContent=Math.round(proxy.value);
    depthValue.style.setProperty('--depth-scale',((proxy.value-5)/95).toFixed(3));
  };
  gsap.to(proxy,{value:100,ease:'none',
    scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate:render}});
  render();
}
function depthCounterFallback(){
  let frame=0;
  function update(){
    frame=0;
    const scrollable=document.documentElement.scrollHeight-window.innerHeight;
    const progress=scrollable>0?window.scrollY/scrollable:0;
    const depth=Math.min(100,5+Math.round(progress*19)*5);
    const scale=(depth-5)/95;
    depthValue.textContent=depth;
    depthValue.style.setProperty('--depth-scale',scale.toFixed(3));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  schedule();
}

/* -------------------------------------------------------------------------
   IMAGE PARALLAX — slow, scrub-scrolled drift through the viewport.
   ------------------------------------------------------------------------- */
function imageParallax(){
  gsap.to('.hero-image',{yPercent:12,ease:'none',
    scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.fromTo('.method-image img',{yPercent:-10},{yPercent:10,ease:'none',
    scrollTrigger:{trigger:'.method-image',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.closing-image',{yPercent:10,ease:'none',
    scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom bottom',scrub:true}});
}

/* -------------------------------------------------------------------------
   SECTION REVEALS — fade + rise, staggered. No blur, no clipping, and the
   copy always settles into a fully legible resting state.
   ------------------------------------------------------------------------- */
function sectionReveals(){
  const groups=[
    ['.manifesto-grid h2',['.manifesto-grid h2']],
    ['.manifesto-copy',['.manifesto-copy p','.manifesto-copy .text-link']],
    ['.method-image',['.method-image']],
    ['.location-strip',['.location-strip > div']],
    ['.section-heading',['.section-heading h2','.section-heading p']],
    ['.closing-image',['.closing-image']],
    ['.closing-copy',['.closing-copy h2','.closing-copy .kicker','.closing-copy .button']]
  ];
  groups.forEach(([trigger,items])=>{
    const el=document.querySelector(trigger);
    if(!el)return;
    const targets=items.map(s=>document.querySelector(s)).filter(Boolean);
    if(!targets.length)targets.push(el);
    gsap.from(targets,{y:34,opacity:0,duration:1,ease:'power2.out',
      stagger:targets.length>1?0.12:0,
      scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none reverse'}});
  });

  /* footer, handled separately so it reads as one final breath */
  gsap.from('.footer-main',{y:30,opacity:0,duration:1,ease:'power2.out',
    scrollTrigger:{trigger:'.site-footer',start:'top 88%'}});
  gsap.from('.footer-bottom',{y:22,opacity:0,duration:.9,ease:'power2.out',
    scrollTrigger:{trigger:'.footer-bottom',start:'top 92%'}});
}

/* course cards are rendered asynchronously after content.json resolves,
   so their reveals are bound post-render (and re-bound on filter). */
const cardTriggers=[];
function bindCourseReveals(){
  cardTriggers.forEach(t=>t.kill());
  cardTriggers.length=0;
  gsap.utils.toArray('.course-card').forEach(card=>{
    const tween=gsap.from(card,{y:26,opacity:0,duration:.7,ease:'power2.out',
      scrollTrigger:{trigger:card,start:'top 90%'}});
    cardTriggers.push(tween.scrollTrigger);
  });
  ScrollTrigger.refresh();
}

/* -------------------------------------------------------------------------
   HERO ENTRANCE — a single calm descent on load. Headlines rise, settle and
   stay fully legible; nothing is blurred, clipped or swept away.
   ------------------------------------------------------------------------- */
function heroEntrance(){
  const tl=gsap.timeline({defaults:{ease:'power2.out'}});
  tl.to('.hero-ident-top',{opacity:1,y:0,duration:.7},.05)
    .to('#heroTitle',{opacity:1,y:0,duration:1.05},.18)
    .to('#heroSubtitle',{opacity:1,y:0,duration:.85},.5)
    .to('.hero-actions',{opacity:1,y:0,duration:.75},.62)
    .to('.hero-image',{scale:1,duration:1.4,ease:'power2.out'},.1)
    .to('.depth-badge',{opacity:1,scale:1,duration:.7,ease:'back.out(1.4)'},.82)
    .to('.image-caption',{opacity:1,duration:.6},.92)
    .to('.hero-meta',{opacity:1,y:0,duration:.7},1.0);
}

if(gsapReady){
  gsap.registerPlugin(ScrollTrigger);

  /* set hero resting-hidden immediately so there's no visible flash */
  gsap.set(['.hero-ident-top','#heroTitle','#heroSubtitle','.hero-actions','.image-caption','.hero-meta'],{opacity:0});
  gsap.set(['.hero-ident-top','#heroSubtitle','.hero-actions','.hero-meta'],{y:16});
  gsap.set('#heroTitle',{y:44});
  gsap.set('.hero-image',{scale:1.05});
  gsap.set('.depth-badge',{opacity:0,scale:.6});

  initDepthGSAP();
  bindAmbient();
  imageParallax();
  sectionReveals();

  getContent().then(content=>{
    const put=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value};
    document.getElementById('heroTitle').innerHTML=content.heroTitle.split('|').map((part,index)=>index?`<i>${escapeHtml(part)}</i>`:escapeHtml(part)).join('<br>');
    put('heroSubtitle',content.heroSubtitle);put('aboutLead',content.aboutLead);put('aboutBody',content.aboutBody);
    put('footerCopy',content.footerCopy);put('footerEmail',content.footerEmail);
    document.getElementById('footerEmail').href=`mailto:${encodeURIComponent(content.footerEmail)}`;
    put('instagramLink',content.instagram);
    document.getElementById('instagramLink').href=`https://instagram.com/${encodeURIComponent(content.instagram.replace('@',''))}`;

    const list=document.getElementById('courseList');let activeFilter='all';
    function renderCourses(){
      const courses=content.courses.filter(c=>activeFilter==='all'||c.location===activeFilter);
      list.innerHTML=courses.length?courses.map(c=>`<article class="course-card"><div class="course-date">${escapeHtml(c.date)}<span class="course-location">${escapeHtml(c.location)}</span></div><div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.description)}</p></div><span class="course-arrow">↗</span></article>`).join(''):'<div class="empty-state">No sessions are listed for this location yet.</div>';
      bindCourseReveals();
    }
    renderCourses();
    document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{
      document.querySelectorAll('.filter-button').forEach(item=>item.classList.remove('is-active'));
      button.classList.add('is-active');activeFilter=button.dataset.filter;renderCourses();
    }));
    heroEntrance();
    ScrollTrigger.refresh();
  });
} else {
  /* graceful fallback: no GSAP or reduced-motion → everything stays visible */
  depthCounterFallback();
  bindAmbient();
  getContent().then(content=>{
    const put=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value};
    document.getElementById('heroTitle').innerHTML=content.heroTitle.split('|').map((part,index)=>index?`<i>${escapeHtml(part)}</i>`:escapeHtml(part)).join('<br>');
    put('heroSubtitle',content.heroSubtitle);put('aboutLead',content.aboutLead);put('aboutBody',content.aboutBody);
    put('footerCopy',content.footerCopy);put('footerEmail',content.footerEmail);
    document.getElementById('footerEmail').href=`mailto:${encodeURIComponent(content.footerEmail)}`;
    put('instagramLink',content.instagram);
    document.getElementById('instagramLink').href=`https://instagram.com/${encodeURIComponent(content.instagram.replace('@',''))}`;
    const list=document.getElementById('courseList');let activeFilter='all';
    function renderCourses(){
      const courses=content.courses.filter(c=>activeFilter==='all'||c.location===activeFilter);
      list.innerHTML=courses.length?courses.map(c=>`<article class="course-card"><div class="course-date">${escapeHtml(c.date)}<span class="course-location">${escapeHtml(c.location)}</span></div><div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.description)}</p></div><span class="course-arrow">↗</span></article>`).join(''):'<div class="empty-state">No sessions are listed for this location yet.</div>';
    }
    renderCourses();
    document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{
      document.querySelectorAll('.filter-button').forEach(item=>item.classList.remove('is-active'));
      button.classList.add('is-active');activeFilter=button.dataset.filter;renderCourses();
    }));
  });
}