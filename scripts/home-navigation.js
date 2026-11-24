(function () {
  const menuButton = document.querySelector('.mr-mobile-menu-button');
  const menu = document.getElementById('mr-mobile-menu');
  const providerDialog = document.getElementById('mr-provider-dialog');
  const providerPanels = providerDialog.querySelectorAll('section');
  const dialogs = [menu, providerDialog];
  const mobile = window.matchMedia('(max-width: 767px), (max-width: 960px) and (orientation: landscape) and (pointer: coarse)');
  const artworkRequests = new WeakSet();

  function openDialog(dialog, trigger) {
    trigger.focus({preventScroll: true});
    dialog.showModal();
  }

  function closeDialogs() {
    dialogs.forEach(dialog => {
      if (dialog.open) dialog.close();
    });
  }

  function loadArtwork() {
    if (!mobile.matches || window.matchMedia('(forced-colors: active)').matches) return;
    const screen = document.querySelector('[data-mobile-artwork]:not([hidden])');
    if (!screen || artworkRequests.has(screen)) return;

    artworkRequests.add(screen);
    const image = new Image();
    image.src = new URL(screen.dataset.mobileArtwork, document.baseURI).href;
    image.decode().then(() => {
      document.documentElement.style.setProperty(`--mr-${screen.id}-artwork`, `url("${image.src}")`);
      screen.dataset.artworkReady = '';
    }).catch(() => {
      // Keep the existing mobile layout if the reference image is unavailable.
    });
  }

  menuButton.addEventListener('click', () => openDialog(menu, menuButton));
  document.querySelectorAll('[data-provider-panel]').forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.providerPanel;
      providerPanels.forEach(panel => { panel.hidden = panel.id !== selected; });
      providerDialog.setAttribute('aria-labelledby', selected + '-title');
      openDialog(providerDialog, button);
    });
  });
  dialogs.forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.closest('a[href]')) dialog.close();
    });
  });
  window.addEventListener('hashchange', () => {
    closeDialogs();
    requestAnimationFrame(loadArtwork);
  });
  mobile.addEventListener('change', () => {
    if (mobile.matches) loadArtwork();
    else closeDialogs();
  });
  requestAnimationFrame(loadArtwork);
})();
