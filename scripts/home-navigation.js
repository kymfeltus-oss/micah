(function(){
  const more=document.querySelector('.mr-mobile-more');
  const top=document.querySelector('.mr-mobile-menu-button');
  const menu=document.getElementById('mr-mobile-menu');
  if(!menu||!more||!top)return;
  function set(open){menu.hidden=!open;more.setAttribute('aria-expanded',String(open));top.setAttribute('aria-expanded',String(open));}
  function toggle(){set(menu.hidden);}
  more.addEventListener('click',toggle);
  top.addEventListener('click',toggle);
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
  window.addEventListener('hashchange',()=>set(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!more.contains(e.target)&&!top.contains(e.target))set(false);});
  function update(){let h=location.hash||'#home';more.classList.toggle('active',['#self-check','#how-it-works','#contact'].includes(h));}
  window.addEventListener('hashchange',update);update();
})();