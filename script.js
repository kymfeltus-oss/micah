(() => {
  "use strict";

  const screens = {
    home: {
      id: "screen-home",
      title: "Home | M.R.-Gen-C Psychiatry",
    },
    "meet-micah": {
      id: "screen-meet-micah",
      title: "Meet Micah | M.R.-Gen-C Psychiatry",
    },
    "our-approach": {
      id: "screen-our-approach",
      title: "Our Approach | M.R.-Gen-C Psychiatry",
    },
    conditions: {
      id: "screen-conditions",
      title: "Conditions | M.R.-Gen-C Psychiatry",
    },
    "how-it-works": {
      id: "screen-how-it-works",
      title: "How It Works | M.R.-Gen-C Psychiatry",
    },
    "resources-faqs": {
      id: "screen-resources-faqs",
      title: "Resources & FAQs | M.R.-Gen-C Psychiatry",
    },
  };
  const screenElements = [...document.querySelectorAll(".app-screen[data-screen]")];
  const navTriggers = [...document.querySelectorAll("[data-nav-target]")];
  let activeScreenKey = null;

  function normalizeKey(rawKey) {
    const key = String(rawKey || "home").replace(/^#/, "").trim().toLowerCase();
    return Object.hasOwn(screens, key) ? key : "home";
  }

  function setScreen(screenKey, options = {}) {
    const targetKey = normalizeKey(screenKey);
    const config = screens[targetKey];

    screenElements.forEach((section) => {
      const isTarget = section.dataset.screen === targetKey;
      section.hidden = !isTarget;
      section.classList.toggle("is-active", isTarget);
      if (isTarget) {
        section.removeAttribute("aria-hidden");
      } else {
        section.setAttribute("aria-hidden", "true");
      }
    });

    navTriggers.forEach((link) => {
      if (link.dataset.navTarget === targetKey) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.title = config.title;
    activeScreenKey = targetKey;

    if (options.updateHistory !== false) {
      const targetHash = `#${targetKey}`;
      if (window.location.hash !== targetHash) {
        const method = options.replaceHistory ? "replaceState" : "pushState";
        window.history[method]({ screen: targetKey }, "", targetHash);
      }
    }

    if (options.resetScroll !== false) {
      window.scrollTo(0, 0);
    }

    document.dispatchEvent(new CustomEvent("mrgen:screenchange", { detail: { screen: targetKey } }));
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest("[data-nav-target]");
    if (
      !trigger ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    setScreen(trigger.dataset.navTarget);
  });

  function syncFromLocation() {
    const targetKey = normalizeKey(window.location.hash);
    if (targetKey !== activeScreenKey) {
      setScreen(targetKey, { updateHistory: false });
    }
  }

  window.addEventListener("popstate", syncFromLocation);
  window.addEventListener("hashchange", syncFromLocation);

  window.MRGenCNavigation = {
    goTo: (screenKey) => setScreen(screenKey),
    getActiveScreen: () => activeScreenKey,
    screens: Object.keys(screens),
  };

  setScreen(window.location.hash, {
    updateHistory: true,
    replaceHistory: true,
    resetScroll: false,
  });

  const yearElement = document.getElementById("copyright-year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
