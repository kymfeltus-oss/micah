(function () {
  const menuButton = document.querySelector('.mr-mobile-menu-button');
  const menu = document.getElementById('mr-mobile-menu');
  const mobile = window.matchMedia('(max-width: 767px), (max-width: 960px) and (orientation: landscape) and (pointer: coarse)');

  menuButton.addEventListener('click', () => {
    menuButton.focus({preventScroll: true});
    menu.showModal();
  });
  menu.addEventListener('click', (event) => {
    if (event.target === menu || event.target.closest('a[href]')) menu.close();
  });
  window.addEventListener('hashchange', () => {
    if (menu.open) menu.close();
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches && menu.open) menu.close();
  });
})();
