
(function(){
  const views=['home','approach','meet-micah','conditions','self-check','how-it-works','contact'];
  const navs=[...document.querySelectorAll('.site-header .nav a,.mr-mobile-bottom a')];
  function route(){
    const slug=(location.hash||'#home').slice(1);
    let current=views.includes(slug)?slug:'home';
    // The approved Home and Approach are sections of the same original composition.
    const onHome=current==='home'||current==='approach';
    for(const id of views){
      const el=document.getElementById(id);if(!el)continue;
      el.hidden=(id==='home'||id==='approach')?!onHome:(id!==current);
    }
    navs.forEach(a=>{
      const active=a.getAttribute('href')==='#'+current;
      a.classList.toggle('active',active);
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    if(current==='approach')document.getElementById('approach').scrollIntoView();
    else window.scrollTo(0,0);
    const titles={'home':'Feel Heard. Find Clarity.','approach':'Our Approach','meet-micah':'Meet Micah Craig','conditions':'Conditions Treated','self-check':'Self Check','how-it-works':'How Care Works','contact':'Contact & Telehealth'};
    document.title=titles[current]+' | M.R.-Gen-C Psychiatry';
  }
  window.addEventListener('hashchange',route);
  window.addEventListener('message',function(event){
    if(event.source!==document.getElementById('frame-conditions')?.contentWindow && event.source!==document.getElementById('frame-self-check')?.contentWindow)return;
    const data=event.data||{};
    if(data.mrgencRoute && views.includes(data.mrgencRoute)){location.hash='#'+data.mrgencRoute;return;}
    if(data.mrgencFrameHeight && views.includes(data.screen)){
      const frame=document.getElementById('frame-'+data.screen);
      if(frame)frame.style.height=Math.min(Math.max(Number(data.mrgencFrameHeight)+2,100),20000)+'px';
    }
  });
  route();
})();
