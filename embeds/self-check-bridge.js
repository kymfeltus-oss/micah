// @ts-check
/** @typedef {{type: 'height', height: number}|{type: 'self-check-scroll'}|{type: 'route', route: 'home'|'meet-micah'|'contact'}} ParentMessage */
(() => {
  'use strict';
  const embedded = window.parent !== window;
  if (embedded) document.documentElement.classList.add('embedded');
  if (!embedded) return;

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[data-parent-route]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const route = link.dataset.parentRoute;
    if (route !== 'home' && route !== 'meet-micah' && route !== 'contact') return;
    event.preventDefault();
    send({ type: 'route', route });
  });

  /** @type {number} */
  let lastHeight = 0;

  /** @param {ParentMessage} message */
  function send(message) {
    try {
      // Local file URLs may have an opaque origin; the parent validates source and payload.
      window.parent.postMessage(message, '*');
    } catch (error) {
      reportError('message parent document', error);
    }
  }

  /** @param {string} context @param {unknown} error */
  function reportError(context, error) {
    console.error(`[Self Check frame] ${context} failed.`, error);
    const warning = document.getElementById('script-warning');
    if (warning) {
      warning.textContent = 'The page could not resize correctly. Refresh the page or continue by discussing your questions with the practice.';
      warning.style.display = 'block';
    }
  }

  function report() {
    try {
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      if (height === lastHeight) return;
      lastHeight = height;
      send({ type: 'height', height });
    } catch (error) {
      reportError('report frame height', error);
    }
  }

  function reflect() {
    try {
      send({ type: 'self-check-scroll' });
      requestAnimationFrame(report);
      window.setTimeout(report, 150);
    } catch (error) {
      reportError('reflect content change', error);
    }
  }

  try {
    if ('ResizeObserver' in window) new ResizeObserver(report).observe(document.body);
    const intake = document.getElementById('intake');
    const results = document.getElementById('results');
    const generate = document.getElementById('generate-notes');
    const edit = document.getElementById('edit-answers');
    if (!intake || !results || !generate || !edit) throw new Error('Required self-check frame elements are missing.');
    new MutationObserver(report).observe(intake, { attributes: true, attributeFilter: ['class', 'hidden'] });
    new MutationObserver(report).observe(results, { attributes: true, attributeFilter: ['class', 'hidden'] });
    generate.addEventListener('click', reflect);
    edit.addEventListener('click', reflect);
    window.addEventListener('load', report);
    report();
  } catch (error) {
    reportError('initialize frame resizing', error);
  }
})();
