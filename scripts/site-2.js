(function(){
  'use strict';
  const views=['home','approach','meet-micah','conditions','self-check','how-it-works','contact'];
  const screens=Object.fromEntries(views.map(id=>[id,document.getElementById(id)]));
  const navs=[...document.querySelectorAll('.site-header .nav a,.mr-mobile-bottom a,.mr-mobile-top-menu a')];
  const titles={'home':'Feel Heard. Find Clarity.','approach':'Our Approach','meet-micah':'Meet Micah Craig','conditions':'Conditions Treated','self-check':'Self Check','how-it-works':'How Care Works','contact':'Contact & Telehealth'};
  function route(){
    const requested=decodeURIComponent((location.hash||'#home').slice(1));
    const current=views.includes(requested)?requested:'home';
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
    const moreButton=document.getElementById('mrMoreButton');
    if(moreButton){
      const overflowActive=['self-check','how-it-works','contact'].includes(current);
      moreButton.classList.toggle('route-active',overflowActive);
      if(overflowActive)moreButton.setAttribute('aria-current','page');else moreButton.removeAttribute('aria-current');
    }
    document.title=titles[current]+' | M.R.-Gen-C Psychiatry';
    document.body.dataset.route=current;
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  window.addEventListener('hashchange',route);
  window.addEventListener('popstate',route);
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
