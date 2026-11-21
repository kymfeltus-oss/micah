
(function(){
  const routes={'index.html':'home','our-approach.html':'approach','conditions.html':'conditions','self-check.html':'self-check','meet-micah.html':'meet-micah'};
  document.addEventListener('click',function(ev){
    const a=ev.target.closest('a[href]'); if(!a)return;
    const href=a.getAttribute('href')||'';
    const base=href.split('#')[0].split('?')[0];
    if(routes[base]){ev.preventDefault();parent.postMessage({mrgencRoute:routes[base]},'*');}
  });
  function resize(){
    const content=document.querySelector('.page');
    const height=Math.ceil(content.getBoundingClientRect().bottom + 3);
    parent.postMessage({mrgencFrameHeight:height,screen:'self-check'},'*');
  }
  window.addEventListener('load',resize);
  window.addEventListener('resize',resize);
  new ResizeObserver(resize).observe(document.querySelector('.page'));
  setTimeout(resize,100);
})();
