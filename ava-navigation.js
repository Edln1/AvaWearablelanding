/* Ava's rich journey uses a pinned stage on desktop. Map anchor navigation to
   the visible narrative beat while preserving native hashes and browser history. */
(()=>{'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),scenes=matchMedia('(min-width:1024px)');
 const journey=$('[data-journey]'),stage=$('[data-journey-stage]'),header=$('header'),desktopLinks=$$('[data-pill-item]');
 const height=()=>header?.getBoundingClientRect().height||88;
 const pinned=()=>scenes.matches&&!reduced.matches&&stage?.dataset.journeyArmed!==undefined;
 function bounds(){const top=journey.getBoundingClientRect().top+scrollY,offset=parseFloat(getComputedStyle(stage).top)||height();return{start:top-offset,range:Math.max(0,journey.offsetHeight-innerHeight+offset)};}
 function destination(id){const target=document.getElementById(id);if(!target)return null;if(pinned()&&['meet','capabilities'].includes(id)){const {start,range}=bounds();return start+range*(id==='capabilities'?.985:.018);}return target.getBoundingClientRect().top+scrollY-height()-16;}
 function mark(id){desktopLinks.forEach(a=>{if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});const selected=desktopLinks.find(a=>a.getAttribute('aria-current')==='page'),scope=$('[data-pill-scope]'),pill=$('[data-pill-overlay]');if(scope&&pill){if(selected)pill.style.clipPath=`inset(0 ${Math.max(0,scope.offsetWidth-selected.offsetLeft-selected.offsetWidth)}px 0 ${selected.offsetLeft}px round 9999px)`;else pill.style.clipPath='inset(0 100% 0 0 round 9999px)';}}
 function go(id,behavior='smooth'){const y=destination(id);if(y===null)return;mark(id);scrollTo({top:Math.max(0,y),behavior:reduced.matches?'instant':behavior});}
 $$('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const id=decodeURIComponent(link.hash.slice(1));if(!['main','meet','capabilities','questions'].includes(id)||!document.getElementById(id))return;event.preventDefault();if(location.hash!=='#'+id)history.pushState(null,'','#'+id);go(id);}));
 const fromHash=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(['main','meet','capabilities','questions'].includes(id))go(id,'instant');};
 addEventListener('hashchange',fromHash);addEventListener('popstate',()=>requestAnimationFrame(fromHash));
 let scheduled=false;function update(){scheduled=false;const cursor=height()+innerHeight*.18,questions=$('#questions');let active='';if(questions&&questions.getBoundingClientRect().top<=cursor)active='questions';else if(journey){if(pinned()){const {start,range}=bounds(),p=(scrollY-start)/Math.max(1,range);if(p>=.89)active='capabilities';else if(p>=-.1)active='meet';}else{const meet=$('#meet'),caps=$('#capabilities');if(caps.getBoundingClientRect().top<=cursor)active='capabilities';else if(meet.getBoundingClientRect().top<=cursor)active='meet';}}mark(active);}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);
 const ready=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{fromHash();update();}));if(document.readyState==='complete')ready();else addEventListener('load',ready,{once:true});document.fonts.ready.then(()=>{if(location.hash)ready();});
 $$('.ava-channel-panel').forEach(panel=>panel.inert=!panel.hasAttribute('data-active'));
 const animated=$$('.ava-loop-mascot,svg.syn-logo-mark'),visible=new Set();
 function syncAnimated(){animated.forEach(svg=>{const paused=document.hidden||reduced.matches||!visible.has(svg);svg.toggleAttribute('data-motion-paused',paused);if(svg.matches('.syn-logo-mark')){if(paused)svg.pauseAnimations?.();else svg.unpauseAnimations?.();}});}
 const motionVisibility=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});syncAnimated();},{rootMargin:'100px 0px'});animated.forEach(svg=>motionVisibility.observe(svg));document.addEventListener('visibilitychange',syncAnimated);reduced.addEventListener('change',syncAnimated);syncAnimated();
})();
