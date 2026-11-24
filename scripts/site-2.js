(function(){
  'use strict';
  const views=['home','approach','meet-micah','conditions','self-check','how-it-works','contact'];
  const screens=Object.fromEntries(views.map(id=>[id,document.getElementById(id)]));
  const navs=[...document.querySelectorAll('.site-header .nav a,.mr-mobile-bottom a,.mr-mobile-menu nav a')];
  const titles={'home':'Feel Heard. Find Clarity.','approach':'Our Approach','meet-micah':'Meet Micah Craig','conditions':'Conditions Treated','self-check':'Self Check','how-it-works':'How Care Works','contact':'Contact & Telehealth'};
  const mobile=window.matchMedia('(max-width: 767px), (max-width: 960px) and (orientation: landscape) and (pointer: coarse)');
  let activeView;
  function route(){
    let requested=(location.hash||'#home').slice(1);
    try{requested=decodeURIComponent(requested);}catch(error){if(!(error instanceof URIError))throw error;}
    const current=views.includes(requested)?requested:'home';
    if(current===activeView)return;
    const previous=activeView;
    activeView=current;
    for(const id of views){
      const el=screens[id]; if(!el)continue;
      el.hidden=id!==current;
      if(el.hidden)el.setAttribute('aria-hidden','true');else el.removeAttribute('aria-hidden');
    }
    navs.forEach(a=>{
      const active=a.getAttribute('href')==='#'+current;
      a.classList.toggle('active',active);
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    document.title=(current==='home'&&mobile.matches?'Mental Health Care for Real Life':titles[current])+' | M.R.-Gen-C Psychiatry';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    if(previous&&mobile.matches)requestAnimationFrame(()=>{
      if(current!==activeView)return;
      const screen=screens[current];
      const heading=[...screen.querySelectorAll('h1,h2')].find(element=>element.getClientRects().length);
      const destination=heading||screen;
      destination.tabIndex=-1;
      destination.focus({preventScroll:true});
    });
  }
  window.addEventListener('hashchange',route);
  window.addEventListener('popstate',route);
  mobile.addEventListener('change',()=>{
    if(activeView==='home')document.title=(mobile.matches?'Mental Health Care for Real Life':titles.home)+' | M.R.-Gen-C Psychiatry';
  });
  window.addEventListener('message',function(event){
    const conditionsFrame=document.getElementById('frame-conditions');
    const selfCheckFrame=document.getElementById('frame-self-check');
    if(event.source!==conditionsFrame?.contentWindow && event.source!==selfCheckFrame?.contentWindow)return;
    const data=event.data||{};
    if(data.mrgencRoute && views.includes(data.mrgencRoute)){location.hash='#'+data.mrgencRoute;return;}
    if(data.mrgencFrameHeight && (data.screen==='conditions'||data.screen==='self-check')){
      const frame=document.getElementById('frame-'+data.screen);
      if(frame)frame.style.height=Math.min(Math.max(Number(data.mrgencFrameHeight)+2,100),20000)+'px';
    }
  });
  route();
})();
