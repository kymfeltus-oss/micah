(function(){
  'use strict';
  const button=document.getElementById('mrMobileMenuButton');
  const menu=document.getElementById('mrMobileTopMenu');
  if(!button||!menu)return;
  function close(){menu.hidden=true;button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation menu')}
  function open(){menu.hidden=false;button.setAttribute('aria-expanded','true');button.setAttribute('aria-label','Close navigation menu')}
  button.addEventListener('click',()=>button.getAttribute('aria-expanded')==='true'?close():open());
  menu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
  document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!button.contains(e.target))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();button.focus()}});
  window.addEventListener('hashchange',close);
})();
