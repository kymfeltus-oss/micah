// @ts-check
// M.R.-Gen-C Psychiatry page behavior.
// Feature initializers keep DOM behavior separated while remaining framework-free.
(() => {
  'use strict';

  /** @typedef {'home'|'approach'|'meet-micah'|'conditions'|'self-check'|'how-it-works'|'contact'} RouteId */
  /** @typedef {{id: RouteId, title: string}} RouteDefinition */
  /** @typedef {{route: RouteId, menuOpen: boolean, viewController: AbortController|null, locationKey: string, announcementFrame: number|null}} NavigationState */
  /** @typedef {{menu: HTMLElement|null, toggles: HTMLButtonElement[], sections: HTMLElement[]}} NavigationElements */
  /** @typedef {{activeCard: HTMLButtonElement|null, initialized: boolean}} CareJourneyState */
  /** @typedef {{root: HTMLElement, cards: HTMLButtonElement[], progressNodes: HTMLButtonElement[]}} CareJourneyElements */
  /** @typedef {{preparedInquiry: string}} ContactFormState */
  /** @typedef {{careJourney: CareJourneyState, contact: ContactFormState}} RouteFeatureState */
  /** @typedef {{tag: 'path'|'circle'|'rect', attributes: Readonly<Record<string, string>>}} SvgShape */
  /** @typedef {{type: 'height', height: number}|{type: 'route', route: RouteId}|{type: 'self-check-scroll'}} FrameMessage */
  /** @typedef {{topic: string, text: string}} InquiryDraft */
  /** @typedef {'firstName'|'lastName'|'email'|'phone'|'topic'|'message'} FormFieldName */
  /** @typedef {'home'|'person'|'check'|'calendar'|'chat'|'phone'|'menu'|'leaf'|'layers'|'people'|'lotus'|'arrow'} IconName */

  /** @type {string} */
  const BOOKING_URL = 'https://care.headway.co/providers/micah-craig';

  /** @type {readonly RouteDefinition[]} */
  const ROUTES = Object.freeze([
    { id: 'home', title: 'Home' },
    { id: 'approach', title: 'Our Approach' },
    { id: 'meet-micah', title: 'Meet Micah' },
    { id: 'conditions', title: 'Treatment' },
    { id: 'self-check', title: 'Self Check' },
    { id: 'how-it-works', title: 'How It Works' },
    { id: 'contact', title: 'Contact' },
  ]);

  /** Keep secondary pages highlighted within their nearest primary mobile section. @type {Partial<Record<RouteId, RouteId>>} */
  const MOBILE_NAV_SECTION = Object.freeze({
    conditions: 'self-check',
    'how-it-works': 'approach',
  });

  /** @type {Readonly<Record<IconName, readonly SvgShape[]>>} */
  const ICON_SHAPES = Object.freeze({
    home: [{ tag: 'path', attributes: { d: 'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10' } }],
    person: [
      { tag: 'circle', attributes: { cx: '12', cy: '6', r: '4' } },
      { tag: 'path', attributes: { d: 'M3 22v-2a9 9 0 0 1 18 0v2' } },
      { tag: 'path', attributes: { class: 'accent', d: 'M15 13v5m0 0a2 2 0 1 0 4 0v-2a2 2 0 0 0-4 0' } },
    ],
    check: [
      { tag: 'rect', attributes: { x: '5', y: '4', width: '15', height: '18', rx: '2' } },
      { tag: 'path', attributes: { d: 'M9 4V2h7v4H9z', fill: 'white' } },
      { tag: 'path', attributes: { class: 'accent', d: 'm8 10 1.5 1.5L12 9m-4 6 1.5 1.5L12 14m-4 6 1.5 1.5L12 19M14 11h3m-3 5h3m-3 5h3' } },
    ],
    calendar: [
      { tag: 'rect', attributes: { x: '3', y: '5', width: '18', height: '17', rx: '3' } },
      { tag: 'path', attributes: { class: 'accent', d: 'M3 10h18M7 2v6m10-6v6' } },
      { tag: 'path', attributes: { d: 'M7 14h1m4 0h1m4 0h1M7 18h1m4 0h1m4 0h1' } },
    ],
    chat: [
      { tag: 'path', attributes: { d: 'M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 22l1.4-5A9 9 0 1 1 21 11Z' } },
      { tag: 'path', attributes: { class: 'accent', d: 'M7 11h.1m4.9 0h.1m4.9 0h.1', 'stroke-width': '3' } },
    ],
    phone: [{ tag: 'path', attributes: { d: 'M7 3 3 6c-1 5 9 15 14 15l4-4-5-4-3 3a13 13 0 0 1-5-5l3-3Z' } }],
    menu: [{ tag: 'path', attributes: { d: 'M3 5h18M3 12h18M3 19h18' } }],
    leaf: [{ tag: 'path', attributes: { d: 'M3 21C6 12 13 7 21 3 22 17 14 22 5 18M3 21 17 8' } }],
    layers: [{ tag: 'path', attributes: { d: 'm2 7 10-5 10 5-10 5zM2 12l10 5 10-5M2 17l10 5 10-5' } }],
    people: [
      { tag: 'circle', attributes: { cx: '12', cy: '5', r: '3' } },
      { tag: 'circle', attributes: { cx: '4', cy: '9', r: '2.5' } },
      { tag: 'circle', attributes: { cx: '20', cy: '9', r: '2.5' } },
      { tag: 'path', attributes: { d: 'M5 22v-4a7 7 0 0 1 14 0v4M1 20v-3a5 5 0 0 1 5-5m17 8v-3a5 5 0 0 0-5-5' } },
    ],
    lotus: [{ tag: 'path', attributes: { d: 'M12 2c-8 9-7 15 0 19 7-4 8-10 0-19ZM12 21C4 21 1 15 1 9c4 0 7 2 9 5m2 7c8 0 11-6 11-12-4 0-7 2-9 5' } }],
    arrow: [{ tag: 'path', attributes: { d: 'M3 12h18m-7-7 7 7-7 7' } }],
  });

  /** @template {Element} T @param {string} selector @param {ParentNode} [root] @returns {T|null} */
  function query(selector, root = document) {
    return /** @type {T|null} */ (root.querySelector(selector));
  }

  /** @template {Element} T @param {string} selector @param {ParentNode} [root] @returns {T[]} */
  function queryAll(selector, root = document) {
    return /** @type {T[]} */ (Array.from(root.querySelectorAll(selector)));
  }

  /** @param {string} feature @param {unknown} error */
  function reportError(feature, error) {
    console.error(`[M.R.-Gen-C] ${feature} failed.`, error);
  }

  /** @param {string} name @param {() => void} initializeFeature @param {(() => void)|undefined} [fallback] */
  function initializeSafely(name, initializeFeature, fallback) {
    try {
      initializeFeature();
    } catch (error) {
      reportError(name, error);
      if (fallback) {
        try {
          fallback();
        } catch (fallbackError) {
          reportError(`${name} fallback`, fallbackError);
        }
      }
    }
  }

  /** Show the contact section's existing status region when the form cannot run. @param {string} message */
  function showContactFallback(message) {
    const status = /** @type {HTMLElement|null} */ (query('#ct-send-feedback'));
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
  }

  /** @param {unknown} value @returns {value is Record<string, unknown>} */
  function isRecord(value) {
    return typeof value === 'object' && value !== null;
  }

  /** @param {string} value @returns {value is RouteId} */
  function isRouteId(value) {
    return ROUTES.some(({ id }) => id === value);
  }

  /** @param {string} value @returns {value is IconName} */
  function isIconName(value) {
    return Object.prototype.hasOwnProperty.call(ICON_SHAPES, value);
  }

  /** Validate messages received from embedded page documents. @param {unknown} value @returns {value is FrameMessage} */
  function isFrameMessage(value) {
    if (!isRecord(value)) return false;
    if (value.type === 'height') return typeof value.height === 'number' && Number.isFinite(value.height);
    if (value.type === 'route') return typeof value.route === 'string' && isRouteId(value.route);
    return value.type === 'self-check-scroll';
  }

  // Presentation helpers
  function renderIcons() {
    /** @type {HTMLElement[]} */ (queryAll('[data-icon]')).forEach((element) => {
      const requestedIcon = element.dataset.icon || '';
      const iconName = isIconName(requestedIcon) ? requestedIcon : null;
      element.replaceChildren(createSvgIcon(iconName, 'ico'));
    });
  }

  /** @param {IconName|null} iconName @param {string} className @returns {SVGSVGElement} */
  function createSvgIcon(iconName, className) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (!iconName) return svg;

    ICON_SHAPES[iconName].forEach(({ tag, attributes }) => {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
      svg.appendChild(shape);
    });
    return svg;
  }

  function configureBookingLinks() {
    /** @type {HTMLAnchorElement[]} */ (queryAll('.book')).forEach((link) => {
      link.href = BOOKING_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  function initializeSkipLink() {
    const skipLink = /** @type {HTMLAnchorElement|null} */ (query('#skip'));
    const main = /** @type {HTMLElement|null} */ (query('#main'));
    if (!skipLink || !main) return;

    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      main.focus();
      main.scrollIntoView();
    });
  }

  // Navigation state is separate from route rendering and event wiring.
  /** @returns {NavigationState} */
  function createNavigationState() {
    return {
      route: 'home',
      menuOpen: false,
      viewController: null,
      locationKey: getLocationKey(),
      announcementFrame: null,
    };
  }

  /** @returns {RouteFeatureState} */
  function createRouteFeatureState() {
    return {
      careJourney: { activeCard: null, initialized: false },
      contact: { preparedInquiry: '' },
    };
  }

  function getLocationKey() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  /** @returns {NavigationElements} */
  function getNavigationElements() {
    return {
      menu: /** @type {HTMLElement|null} */ (query('#menu')),
      toggles: /** @type {HTMLButtonElement[]} */ (queryAll('.menu-toggle')),
      sections: /** @type {HTMLElement[]} */ (queryAll('#site-pages > section')),
    };
  }

  /** @param {string} hash @returns {RouteId|null} */
  function routeFromHash(hash) {
    let candidate = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!candidate) return null;
    try {
      candidate = decodeURIComponent(candidate);
    } catch {
      return null;
    }
    return isRouteId(candidate) ? candidate : null;
  }

  /** @param {NavigationState} state @param {HTMLElement|null} menu @param {HTMLButtonElement[]} toggles @param {boolean} isOpen */
  function setMenuOpen(state, menu, toggles, isOpen) {
    state.menuOpen = Boolean(menu && isOpen);
    if (menu) menu.hidden = !state.menuOpen;
    toggles.forEach((button) => {
      button.setAttribute('aria-expanded', String(state.menuOpen));
      button.setAttribute('aria-label', state.menuOpen ? 'Close navigation' : 'Open navigation');
    });
  }

  /** @param {NavigationState} state @param {NavigationElements} elements */
  function renderRoute(state, elements) {
    const route = ROUTES.find(({ id }) => id === state.route);
    if (!route) return;

    document.body.dataset.route = state.route;
    elements.sections.forEach((section) => {
      section.hidden = section.id !== state.route;
    });
    /** @type {HTMLAnchorElement[]} */ (queryAll('nav a[href^="#"]')).forEach((link) => {
      if (link.hash === `#${state.route}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const mobileSection = MOBILE_NAV_SECTION[state.route] || state.route;
    /** @type {HTMLAnchorElement[]} */ (queryAll('.bottom-nav a[href^="#"]')).forEach((link) => {
      if (mobileSection !== state.route && link.hash === `#${mobileSection}`) {
        link.setAttribute('aria-current', 'location');
      }
    });
    document.title = `${route.title} | M.R.-Gen-C Psychiatry`;
  }

  /** @returns {HTMLElement} */
  function getRouteAnnouncementRegion() {
    let region = /** @type {HTMLElement|null} */ (query('#route-announcement'));
    if (region) return region;

    region = document.createElement('div');
    region.id = 'route-announcement';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'visually-hidden';
    document.body.appendChild(region);
    return region;
  }

  /** Move assistive technology focus into the newly active page section. @param {RouteId} routeId */
  function focusRouteContent(routeId) {
    const section = /** @type {HTMLElement|null} */ (query(`#${routeId}`));
    if (!section) return;
    const heading = /** @type {HTMLElement|null} */ (query('h1, h2, h3', section));
    const frame = /** @type {HTMLIFrameElement|null} */ (query('iframe', section));
    const target = heading || frame || section;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  }

  /** Announce a client-side route change without adding visible content. @param {NavigationState} state @param {RouteId} routeId */
  function announceRouteChange(state, routeId) {
    const route = ROUTES.find(({ id }) => id === routeId);
    if (!route) return;
    const region = getRouteAnnouncementRegion();
    if (state.announcementFrame !== null) window.cancelAnimationFrame(state.announcementFrame);
    region.textContent = '';
    state.announcementFrame = window.requestAnimationFrame(() => {
      region.textContent = `${route.title} page loaded.`;
      state.announcementFrame = null;
    });
  }

  /** @param {RouteId} routeId */
  function loadRouteFrame(routeId) {
    const frame = /** @type {HTMLIFrameElement|null} */ (query(`#${routeId} iframe`));
    if (!frame || frame.dataset.loaded) return;
    frame.dataset.loaded = 'true';
    if (!frame.hasAttribute('srcdoc') && frame.dataset.src) frame.src = frame.dataset.src;
  }

  /** @param {NavigationState} state @param {NavigationElements} elements @param {RouteFeatureState} featureState @param {RouteId} routeId @param {boolean} shouldScrollToTop @param {boolean} shouldMoveFocus */
  function transitionRoute(state, elements, featureState, routeId, shouldScrollToTop, shouldMoveFocus) {
    const routeChanged = state.route !== routeId;
    if (routeChanged) {
      state.viewController?.abort();
      state.viewController = null;
      state.route = routeId;
    }

    renderRoute(state, elements);
    setMenuOpen(state, elements.menu, elements.toggles, false);

    if (!state.viewController) {
      const controller = new AbortController();
      state.viewController = controller;
      try {
        initializeRouteFeatures(routeId, controller.signal, featureState);
      } catch (error) {
        controller.abort();
        state.viewController = null;
        reportError(`${routeId} view initialization`, error);
        if (routeId === 'contact') {
          showContactFallback('The contact form is unavailable right now. Please use the secure patient portal to contact the practice.');
        }
      }
    }

    loadRouteFrame(routeId);
    if (routeChanged && shouldMoveFocus) {
      focusRouteContent(routeId);
      announceRouteChange(state, routeId);
    }
    if (shouldScrollToTop || routeChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    state.locationKey = getLocationKey();
  }

  /** @param {NavigationState} state @param {NavigationElements} elements @param {RouteFeatureState} featureState @param {boolean} shouldScrollToTop @param {boolean} shouldMoveFocus */
  function synchronizeRoute(state, elements, featureState, shouldScrollToTop, shouldMoveFocus) {
    const currentKey = getLocationKey();
    if (currentKey === state.locationKey && state.viewController) return;

    const hash = window.location.hash;
    let routeId = routeFromHash(hash);
    let usedFallbackRoute = false;
    if (hash && !routeId) {
      usedFallbackRoute = true;
      try {
        window.history.replaceState(window.history.state, '', '#home');
      } catch (error) {
        reportError('normalize invalid route', error);
        try {
          window.location.hash = 'home';
        } catch (fallbackError) {
          reportError('invalid route fallback URL', fallbackError);
        }
      }
      routeId = 'home';
    }

    transitionRoute(state, elements, featureState, routeId || 'home', shouldScrollToTop || usedFallbackRoute, shouldMoveFocus);
  }

  /** @param {RouteId} routeId @param {NavigationState} state @param {NavigationElements} elements @param {RouteFeatureState} featureState */
  function navigateToRoute(routeId, state, elements, featureState) {
    const nextHash = `#${routeId}`;
    if (window.location.hash !== nextHash) {
      try {
        window.history.pushState({ route: routeId }, '', nextHash);
      } catch (error) {
        reportError('push route history entry', error);
        try {
          window.location.hash = routeId;
        } catch (fallbackError) {
          reportError('route hash fallback', fallbackError);
        }
      }
    }
    transitionRoute(state, elements, featureState, routeId, true, true);
  }

  /** @param {MouseEvent} event @param {NavigationState} state @param {NavigationElements} elements @param {RouteFeatureState} featureState */
  function handleNavigationClick(event, state, elements, featureState) {
    if (!(event.target instanceof Element)) return;
    const target = event.target;
    const toggle = target.closest('.menu-toggle');
    if (toggle instanceof HTMLButtonElement && elements.toggles.includes(toggle)) {
      setMenuOpen(state, elements.menu, elements.toggles, !state.menuOpen);
      return;
    }

    const menuLink = target.closest('#menu a');
    const routeLink = target.closest('a[href^="#"]');
    const routeId = routeLink instanceof HTMLAnchorElement ? routeFromHash(routeLink.hash) : null;
    if (routeId && routeLink instanceof HTMLAnchorElement) {
      if (state.route === routeId && window.location.hash === routeLink.hash) {
        setMenuOpen(state, elements.menu, elements.toggles, false);
        return;
      }
      event.preventDefault();
      navigateToRoute(routeId, state, elements, featureState);
      return;
    }

    if (menuLink) {
      setMenuOpen(state, elements.menu, elements.toggles, false);
      return;
    }
    if (state.menuOpen && elements.menu && !elements.menu.contains(target)) {
      setMenuOpen(state, elements.menu, elements.toggles, false);
    }
  }

  function initializeNavigation() {
    const state = createNavigationState();
    const elements = getNavigationElements();
    const featureState = createRouteFeatureState();
    const desktopNavigation = window.matchMedia('(min-width: 1200px)');

    const closeMenuOnBreakpointChange = () => {
      setMenuOpen(state, elements.menu, elements.toggles, false);
    };

    if (desktopNavigation.addEventListener) {
      desktopNavigation.addEventListener('change', closeMenuOnBreakpointChange);
    } else {
      desktopNavigation.addListener(closeMenuOnBreakpointChange);
    }

    // One delegated listener handles current and future menu controls and links.
    document.addEventListener('click', (event) => {
      initializeSafely('navigation click', () => handleNavigationClick(event, state, elements, featureState));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !state.menuOpen) return;
      setMenuOpen(state, elements.menu, elements.toggles, false);
      elements.toggles[0]?.focus();
    });
    window.addEventListener('popstate', () => {
      initializeSafely('history navigation', () => synchronizeRoute(state, elements, featureState, true, true));
    });
    window.addEventListener('hashchange', () => {
      initializeSafely('hash navigation', () => synchronizeRoute(state, elements, featureState, true, true));
    });
    const initialHash = window.location.hash;
    const initialRoute = routeFromHash(initialHash);
    const routeToShow = initialRoute || 'home';
    const addressHash = initialHash && !initialRoute ? '#home' : initialHash;
    if (initialHash) {
      try {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
      } catch (error) {
        reportError('suppress initial fragment scroll', error);
      }
    }
    state.locationKey = getLocationKey();
    initializeSafely('initial route', () => transitionRoute(state, elements, featureState, routeToShow, true, false));
    if (initialHash) {
      try {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${addressHash}`);
      } catch (error) {
        reportError('restore initial route address', error);
      }
      state.locationKey = getLocationKey();
      window.addEventListener('load', () => {
        if (window.location.hash === addressHash) window.scrollTo(0, 0);
      }, { once: true });
    }
  }

  /** @param {MessageEvent<unknown>} event */
  function handleFrameMessage(event) {
    try {
      const frames = /** @type {HTMLIFrameElement[]} */ (queryAll('iframe'));
      const frame = frames.find((item) => item.contentWindow === event.source);
      const trustedOrigin = window.location.protocol === 'file:'
        ? event.origin === 'null'
        : event.origin === window.location.origin;
      if (!frame || !trustedOrigin || !isFrameMessage(event.data)) return;

      const message = event.data;
      if (message.type === 'height') {
        const safeHeight = Math.max(100, Math.min(20000, Math.ceil(message.height)));
        frame.style.height = `${safeHeight}px`;
        return;
      }
      if (message.type === 'route') {
        window.location.hash = message.route;
        return;
      }
      if (message.type === 'self-check-scroll'
        && frame.id === 'self-check-frame'
        && document.body.dataset.route === 'self-check') {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      reportError('embedded page message', error);
    }
  }

  function initializeFrameMessaging() {
    window.addEventListener('message', handleFrameMessage);
  }

  // Shared behavior for single-open disclosure groups
  /** @param {ParentNode|null} root @param {string} selector @param {AbortSignal} signal */
  function bindExclusiveDetails(root, selector, signal) {
    if (!root) return;
    const details = /** @type {HTMLDetailsElement[]} */ (queryAll(selector, root));
    details.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        details.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }, { signal });
    });
  }

  /** @param {RouteId} routeId @param {AbortSignal} signal @param {RouteFeatureState} state */
  function initializeRouteFeatures(routeId, signal, state) {
    if (routeId === 'home') {
      bindExclusiveDetails(query('#care-steps'), 'details', signal);
    } else if (routeId === 'approach') {
      bindExclusiveDetails(query('#approach.approved-approach'), '.oa-card', signal);
    } else if (routeId === 'how-it-works') {
      initializeCareJourney(signal, state.careJourney);
    } else if (routeId === 'contact') {
      bindExclusiveDetails(query('#contact'), '.ct-faqs details', signal);
      initializeContactForm(signal, state.contact);
    }
  }

  // How It Works interaction
  /** @param {HTMLElement} root @returns {CareJourneyElements} */
  function getCareJourneyElements(root) {
    return {
      root,
      cards: /** @type {HTMLButtonElement[]} */ (queryAll('.cw-card', root)),
      progressNodes: /** @type {HTMLButtonElement[]} */ (queryAll('.cw-progress-node', root)),
    };
  }

  /** @param {CareJourneyElements} elements @param {HTMLButtonElement|null} card */
  function renderCareJourneyProgress(elements, card) {
    const index = card ? elements.cards.indexOf(card) : -1;
    elements.progressNodes.forEach((node, nodeIndex) => {
      const isActive = nodeIndex === index;
      node.classList.toggle('is-active', isActive);
      if (isActive) node.setAttribute('aria-current', 'step');
      else node.removeAttribute('aria-current');
    });
  }

  /** @param {CareJourneyState} state @param {CareJourneyElements} elements */
  function renderCareJourney(state, elements) {
    elements.cards.forEach((card) => {
      const isOpen = card === state.activeCard;
      card.setAttribute('aria-expanded', String(isOpen));
      card.closest('.cw-item')?.classList.toggle('is-active', isOpen);
      const panelId = card.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.hidden = !isOpen;
    });
    renderCareJourneyProgress(elements, state.activeCard);
  }

  /** @param {CareJourneyState} state @param {CareJourneyElements} elements @param {HTMLButtonElement|null} card */
  function setActiveCareCard(state, elements, card) {
    state.activeCard = card;
    renderCareJourney(state, elements);
  }

  /** @param {CareJourneyState} state @param {CareJourneyElements} elements @param {MouseEvent} event */
  function handleCareJourneyClick(state, elements, event) {
    if (!(event.target instanceof Element)) return;
    const progressNode = event.target.closest('.cw-progress-node');
    if (progressNode instanceof HTMLButtonElement && elements.root.contains(progressNode)) {
      const cardIndex = elements.progressNodes.indexOf(progressNode);
      const card = elements.cards[cardIndex];
      if (card) setActiveCareCard(state, elements, card);
      return;
    }

    const card = event.target.closest('.cw-card');
    if (!(card instanceof HTMLButtonElement) || !elements.root.contains(card)) return;
    const isOpen = card.getAttribute('aria-expanded') === 'true';
    setActiveCareCard(state, elements, isOpen ? null : card);
  }

  /** @param {AbortSignal} signal @param {CareJourneyState} state */
  function initializeCareJourney(signal, state) {
    const root = /** @type {HTMLElement|null} */ (query('#how-it-works'));
    if (!root) return;
    const elements = getCareJourneyElements(root);
    if (!state.initialized || (state.activeCard && !elements.cards.includes(state.activeCard))) {
      state.activeCard = elements.cards.find((card) => card.getAttribute('aria-expanded') === 'true') || null;
      state.initialized = true;
    }

    // Delegation supports cards and progress controls added after initialization.
    root.addEventListener('click', (event) => handleCareJourneyClick(state, elements, event), { signal });
    root.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !state.activeCard) return;
      const activeCard = state.activeCard;
      setActiveCareCard(state, elements, null);
      activeCard.focus();
    }, { signal });

    renderCareJourney(state, elements);
  }

  // Contact form data and UI
  /** @param {FormData} formData @param {FormFieldName} name @returns {string} */
  function readFormValue(formData, name) {
    const value = formData.get(name);
    return typeof value === 'string' ? value.trim() : '';
  }

  /** @param {FormData} formData @returns {InquiryDraft} */
  function composeInquiry(formData) {
    const firstName = readFormValue(formData, 'firstName');
    const lastName = readFormValue(formData, 'lastName');
    const email = readFormValue(formData, 'email');
    const phone = readFormValue(formData, 'phone') || 'Not provided';
    const topic = readFormValue(formData, 'topic');
    const message = readFormValue(formData, 'message');
    const text = `M.R.-Gen-C Psychiatry — General Inquiry\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nInquiry type: ${topic}\n\nMessage:\n${message}\n\n(Please do not include private medical details in ordinary email.)`;
    return { topic, text };
  }

  /** @param {string} topic @param {string} text */
  function openEmailDraft(topic, text) {
    const subject = `General Inquiry - M.R.-Gen-C Psychiatry: ${topic}`;
    const mailto = `mailto:mrgencpsychiatry@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = mailto;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hidden = true;
    document.body.append(link);
    try {
      link.click();
    } finally {
      link.remove();
    }
  }

  /** @param {AbortSignal} signal @param {ContactFormState} state */
  function initializeContactForm(signal, state) {
    const root = /** @type {HTMLElement|null} */ (query('#contact'));
    if (!root) return;
    const form = /** @type {HTMLFormElement|null} */ (query('#ct-message-form', root));
    if (!form) {
      reportError('contact form setup', new TypeError('The contact form was not found.'));
      showContactFallback('The contact form is unavailable right now. Please use the secure patient portal to contact the practice.');
      return;
    }

    const messageField = form.elements.namedItem('message');
    const topicField = form.elements.namedItem('topic');
    if (!(messageField instanceof HTMLTextAreaElement) || !(topicField instanceof HTMLSelectElement)) {
      reportError('contact form setup', new TypeError('Expected message and topic fields were not found.'));
      showContactFallback('The contact form is unavailable right now. Please use the secure patient portal to contact the practice.');
      return;
    }

    const counter = /** @type {HTMLElement|null} */ (query('#ct-charcount', root));
    const status = /** @type {HTMLElement|null} */ (query('#ct-send-feedback', root));
    const fallback = /** @type {HTMLTextAreaElement|null} */ (query('#ct-copy-fallback', root));
    const copyButton = /** @type {HTMLButtonElement|null} */ (query('#ct-copy-inquiry', root));
    function clearStatus() {
      if (status) status.hidden = true;
    }

    function showCopyFallback() {
      if (!fallback || !copyButton) {
        if (status) {
          status.hidden = false;
          status.textContent = 'Copying is unavailable. Please select the inquiry text and copy it manually.';
        }
        return;
      }

      try {
        fallback.hidden = false;
        fallback.value = state.preparedInquiry;
        fallback.focus();
        fallback.select();
        copyButton.textContent = 'Select and copy the text below';
        if (status) {
          status.hidden = false;
          status.textContent = 'Copying is unavailable. Select the inquiry text below and copy it manually.';
        }
      } catch (error) {
        reportError('manual copy fallback', error);
        if (status) {
          status.hidden = false;
          status.textContent = 'Copying is unavailable. Please use the secure patient portal to contact the practice.';
        }
      }
    }

    async function copyInquiry() {
      if (!state.preparedInquiry || !copyButton) return;
      if (!navigator.clipboard?.writeText) {
        showCopyFallback();
        return;
      }

      try {
        await navigator.clipboard.writeText(state.preparedInquiry);
        copyButton.textContent = 'Copied — paste into email';
      } catch (error) {
        reportError('copy inquiry', error);
        showCopyFallback();
      }
    }

    messageField.addEventListener('input', () => {
      if (counter) counter.textContent = `${messageField.value.length} / 1000`;
      clearStatus();
    }, { signal });
    form.addEventListener('input', (event) => {
      if (event.target !== messageField) clearStatus();
    }, { signal });
    topicField.addEventListener('change', () => topicField.setCustomValidity(''), { signal });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        if (!form.reportValidity()) return;
        const inquiry = composeInquiry(new FormData(form));
        if (!inquiry.topic) {
          topicField.setCustomValidity('Choose an inquiry type');
          form.reportValidity();
          return;
        }
        state.preparedInquiry = inquiry.text;
        if (status) status.hidden = false;
        if (fallback) fallback.hidden = true;
        openEmailDraft(inquiry.topic, state.preparedInquiry);
      } catch (error) {
        reportError('prepare inquiry', error);
        if (fallback && state.preparedInquiry) {
          fallback.hidden = false;
          fallback.value = state.preparedInquiry;
          fallback.focus();
          fallback.select();
        }
        if (status) {
          status.hidden = false;
          status.textContent = state.preparedInquiry
            ? 'The email draft could not be opened. You can copy your inquiry below.'
            : 'Your inquiry could not be prepared. Please try again or use the secure patient portal.';
        }
      }
    }, { signal });
    copyButton?.addEventListener('click', () => {
      void copyInquiry();
    }, { signal });
  }

  function initializeApproachScroll() {
    const root = /** @type {HTMLElement|null} */ (query('#approach.approved-approach'));
    if (!root) return;
    window.addEventListener('load', () => {
      if (window.location.hash === '#approach') requestAnimationFrame(() => window.scrollTo(0, 0));
    }, { once: true });
  }

  function installErrorBoundary() {
    window.addEventListener('error', (event) => {
      reportError('page runtime', event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
      reportError('asynchronous operation', event.reason);
    });
  }

  function initialize() {
    installErrorBoundary();
    /** @type {Array<{name: string, initialize: () => void, fallback?: () => void}>} */
    const features = [
      { name: 'icons', initialize: renderIcons },
      { name: 'booking links', initialize: configureBookingLinks },
      { name: 'embedded page messages', initialize: initializeFrameMessaging },
      { name: 'navigation', initialize: initializeNavigation },
      { name: 'skip link', initialize: initializeSkipLink },
      { name: 'approach scroll', initialize: initializeApproachScroll },
    ];
    features.forEach(({ name, initialize: initializeFeature, fallback }) => {
      initializeSafely(name, initializeFeature, fallback);
    });
  }

  initialize();
})();
