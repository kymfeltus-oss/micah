// @ts-check
/** @typedef {[name: string, category: string, summary: string, understanding: string, care: string, experiences: string[]]} ConditionEntry */
/** @typedef {{type: 'height', height: number}} ParentHeightMessage */
/** @typedef {{tag: 'path'|'circle'|'rect', attributes: Readonly<Record<string, string>>}} SvgShape */

(() => {
  'use strict';

  /** @type {readonly ConditionEntry[]} */
  const conditions = [
    ['Depression', 'Mood', 'Low mood, exhaustion, or a loss of interest that changes how life feels.', 'Sleep, appetite and energy changes may accompany depression.', 'Explore medication options, sleep and medical contributors together.', ['Low mood', 'Loss of interest', 'Sleep or appetite changes']],
    ['Anxiety & Panic', 'Anxiety', 'Worry, tension, panic attacks or avoidance.', 'Anxiety may show up in thoughts and physical symptoms.', 'Discuss medication when appropriate and practical coping strategies.', ['Worry', 'Tension', 'Panic attacks', 'Avoidance']],
    ['ADHD', 'Attention', 'Attention, organization and working-memory challenges.', 'A thorough evaluation considers history and conditions with similar symptoms.', 'Review attention, sleep, mood and individualized treatment options.', ['Difficulty focusing', 'Disorganization', 'Working-memory challenges']],
    ['Mood Instability', 'Mood', 'Rapid shifts, irritability or emotional reactivity.', 'Mood changes can interfere with everyday life.', 'Explore patterns in mood, energy, sleep and context.', ['Irritability', 'Rapid mood changes', 'Emotional reactivity']],
    ['Bipolar Spectrum', 'Mood', 'Changes in mood, energy and sleep.', 'Episodes of elevation, reduced need for sleep or cycling require careful evaluation.', 'Discuss diagnosis and treatment options with attention to mood stability.', ['Elevated mood', 'Reduced need for sleep', 'Cycling']],
    ['PTSD & Trauma', 'Trauma', 'Trauma-related symptoms and their impact on daily life.', 'Hypervigilance, nightmares, numbness or shame may occur.', 'Discuss supportive tools, medication when appropriate and therapy referrals.', ['Hypervigilance', 'Nightmares', 'Numbness']],
    ['Sleep Concerns', 'Sleep', 'Insomnia and sleep disruption.', 'Sleep is an important part of psychiatric care.', 'Review sleep patterns, contributing factors and a personalized plan.', ['Difficulty sleeping', 'Disrupted sleep', 'Fatigue']],
    ['Personalized Care', 'Treatment', 'Family history and genetics-informed decision support.', 'Individual biology, environment and life experiences shape care.', 'Consider pharmacogenetic information when appropriate, as a decision aid rather than a diagnosis.', ['Past medication side effects', 'Medication questions', 'Family history']],
    ['Telehealth & New Clients', 'Services', 'Starting care from a private space.', 'Prepare intake forms, medication lists and questions before your first visit.', 'Use Headway to schedule and confirm insurance and eligibility.', ['New patient', 'Telehealth', 'Appointments', 'Insurance']],
  ];

  /** @type {readonly (readonly SvgShape[])[]} */
  const iconShapes = [
    [{ tag: 'path', attributes: { d: 'M8 21v-4H5V13l-2-1 3-5a8 8 0 1 1 12 10v4M9 8c0-3 5-4 6 0 4 0 3 5 0 5h-5' } }],
    [{ tag: 'path', attributes: { d: 'M12 20C4 14 2 9 6 6c3-2 5 0 6 2 1-2 3-4 6-2 4 3 2 8-6 14Z' } }],
    [
      { tag: 'rect', attributes: { x: '5', y: '4', width: '14', height: '17', rx: '2' } },
      { tag: 'path', attributes: { d: 'M9 4V2h6v4H9M8 11l2 2 5-5m-7 9h8' } },
    ],
    [
      { tag: 'path', attributes: { d: 'M3 6h18M3 12h18M3 18h18' } },
      { tag: 'circle', attributes: { cx: '8', cy: '6', r: '2', fill: 'white' } },
      { tag: 'circle', attributes: { cx: '15', cy: '12', r: '2', fill: 'white' } },
    ],
    [{ tag: 'path', attributes: { d: 'm2 7 10-5 10 5-10 5ZM2 12l10 5 10-5M2 17l10 5 10-5' } }],
    [{ tag: 'path', attributes: { d: 'm12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6Z M8 12l3 3 5-6' } }],
    [{ tag: 'path', attributes: { d: 'M20 15A9 9 0 0 1 9 3 9 9 0 1 0 20 15Z' } }],
    [
      { tag: 'circle', attributes: { cx: '12', cy: '6', r: '4' } },
      { tag: 'path', attributes: { d: 'M4 21v-3a8 8 0 0 1 16 0v3' } },
    ],
    [
      { tag: 'rect', attributes: { x: '3', y: '3', width: '18', height: '14', rx: '2' } },
      { tag: 'path', attributes: { d: 'M1 21h22M12 6v8M8 10h8' } },
    ],
  ];


  /** @template {HTMLElement} T @param {string} id @returns {T} */
  function requireElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Required element #${id} is missing.`);
    return /** @type {T} */ (element);
  }

  /** @param {number} index @returns {HTMLSpanElement} */
  function createIcon(index) {
    const wrapper = document.createElement('span');
    wrapper.className = 'symbol';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('aria-hidden', 'true');
    (iconShapes[index] || []).forEach(({ tag, attributes }) => {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
      svg.appendChild(shape);
    });
    wrapper.appendChild(svg);
    return wrapper;
  }


  /** @param {ConditionEntry} condition @returns {string} */
  function group(condition) {
    return condition[1] === 'Mood' ? 'Mood & Wellbeing' : condition[1];
  }

  /** @type {number} */
  let selectedIndex = 0;
  const search = /** @type {HTMLInputElement} */ (requireElement('search'));
  const list = /** @type {HTMLElement} */ (requireElement('list'));
  const explorer = /** @type {HTMLElement} */ (requireElement('explorer'));
  const topic = /** @type {HTMLElement} */ (requireElement('topic'));

  list.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button.tile[data-index]');
    if (!(button instanceof HTMLButtonElement) || !list.contains(button)) return;
    const index = Number(button.dataset.index);
    runSafely('open care topic', () => openTopic(index));
  });

  function render() {
    const queryText = search.value.trim().toLowerCase();
    const matches = conditions
      .map((condition, index) => ({ condition, index }))
      .filter(({ condition }) => [condition[0], condition[1], condition[2], condition[3], condition[4], ...condition[5]]
        .join(' ').toLowerCase().includes(queryText));

    if (matches.length && !matches.some(({ index }) => index === selectedIndex)) {
      selectedIndex = matches[0].index;
    }
    list.replaceChildren();
    const count = /** @type {HTMLElement} */ (requireElement('count'));
    count.textContent = matches.length
      ? `${matches.length} care topics`
      : 'No matches. Try a different search. Previous topic remains below.';

    matches.forEach(({ condition, index }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tile';
      button.dataset.index = String(index);
      button.setAttribute('aria-pressed', String(index === selectedIndex));
      button.appendChild(createIcon(index));
      const copy = document.createElement('span');
      copy.className = 'tile-copy';
      const number = document.createElement('b');
      number.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'tile-label';
      label.textContent = condition[0];
      copy.append(number, label);
      const chevron = document.createElement('span');
      chevron.className = 'chev';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '›';
      button.append(copy, chevron);
      list.append(button);
    });

    const selectedCondition = conditions[selectedIndex];
    if (!selectedCondition) return;
    const preview = /** @type {HTMLElement} */ (requireElement('preview'));
    const previewCopy = document.createElement('div');
    const category = document.createElement('small');
    category.textContent = group(selectedCondition);
    const previewTitle = document.createElement('h2');
    previewTitle.textContent = selectedCondition[0];
    const description = document.createElement('p');
    description.textContent = selectedCondition[2];
    previewCopy.append(category, previewTitle, description);
    const circle = document.createElement('span');
    circle.className = 'circle';
    circle.setAttribute('aria-hidden', 'true');
    circle.textContent = '→';
    preview.replaceChildren(previewCopy, circle);
    preview.setAttribute('aria-label', `Read about ${selectedCondition[0]}`);
  }

  function scrollTop() {
    window.scrollTo(0, 0);
    if (parent !== window) {
      try {
        parent.scrollTo(0, 0);
      } catch (error) {
        reportError('scroll parent document', error);
      }
    }
  }

  /** @param {number} index */
  function openTopic(index) {
    if (!Number.isInteger(index) || index < 0 || index >= conditions.length) return;
    selectedIndex = index;
    const condition = conditions[index];
    /** @type {HTMLElement} */ (requireElement('group')).textContent = group(condition);
    const title = /** @type {HTMLElement} */ (requireElement('title'));
    title.textContent = condition[0];
    /** @type {HTMLElement} */ (requireElement('summary')).textContent = condition[2];

    /** @type {Array<{heading: string, iconIndex: number, text?: string, experiences?: string[]}>} */
    const rows = [
      { heading: 'Understanding This Concern', text: condition[3], iconIndex: 0 },
      { heading: 'How Care May Help', text: condition[4], iconIndex: 1 },
      { heading: 'Common Experiences', experiences: condition[5], iconIndex: 2 },
    ];
    const detail = /** @type {HTMLElement} */ (requireElement('detail'));
    detail.replaceChildren();
    rows.forEach(({ heading, text, experiences, iconIndex }) => {
      const disclosure = document.createElement('details');
      disclosure.open = true;
      const disclosureSummary = document.createElement('summary');
      disclosureSummary.appendChild(createIcon(iconIndex));
      const headingWrapper = document.createElement('div');
      const headingElement = document.createElement('h2');
      headingElement.textContent = heading;
      headingWrapper.appendChild(headingElement);
      disclosureSummary.appendChild(headingWrapper);
      const content = document.createElement('div');
      content.className = 'extra';
      if (experiences) {
        const list = document.createElement('ul');
        experiences.forEach((experience) => {
          const item = document.createElement('li');
          item.textContent = experience;
          list.appendChild(item);
        });
        content.appendChild(list);
      } else {
        content.textContent = text || '';
      }
      disclosure.append(disclosureSummary, content);
      detail.appendChild(disclosure);
    });


    /** @type {HTMLElement} */ (requireElement('position')).textContent = `${index + 1} of ${conditions.length}`;
    const previous = /** @type {HTMLButtonElement} */ (requireElement('prev'));
    const next = /** @type {HTMLButtonElement} */ (requireElement('next'));
    previous.disabled = index === 0;
    next.disabled = index === conditions.length - 1;
    previous.querySelector('small')?.replaceChildren(index ? document.createTextNode(conditions[index - 1][0]) : document.createTextNode(''));
    next.querySelector('small')?.replaceChildren(index < conditions.length - 1 ? document.createTextNode(conditions[index + 1][0]) : document.createTextNode(''));
    explorer.hidden = true;
    topic.hidden = false;
    scrollTop();
    title.focus({ preventScroll: true });
    resize();
  }

  /** @param {string} feature @param {() => void} callback */
  function runSafely(feature, callback) {
    try {
      callback();
    } catch (error) {
      reportError(feature, error);
      showFallback();
    }
  }

  /** @param {string} feature @param {unknown} error */
  function reportError(feature, error) {
    console.error(`[Conditions explorer] ${feature} failed.`, error);
  }

  function showFallback() {
    explorer.hidden = false;
    topic.hidden = true;
    const count = document.getElementById('count');
    if (count) count.textContent = 'The conditions explorer is temporarily unavailable. Please refresh the page or contact the practice.';
  }

  function resize() {
    if (parent === window) return;
    try {
      /** @type {ParentHeightMessage} */
      const message = { type: 'height', height: Math.ceil(document.body.getBoundingClientRect().height) };
      // The parent validates this frame's source and message payload.
      parent.postMessage(message, '*');
    } catch (error) {
      reportError('report embedded height', error);
    }
  }

  const back = /** @type {HTMLButtonElement} */ (requireElement('back'));
  const previous = /** @type {HTMLButtonElement} */ (requireElement('prev'));
  const next = /** @type {HTMLButtonElement} */ (requireElement('next'));
  const preview = /** @type {HTMLElement} */ (requireElement('preview'));

  back.addEventListener('click', () => runSafely('return to conditions list', () => {
    topic.hidden = true;
    explorer.hidden = false;
    render();
    scrollTop();
    (list.querySelector(`[data-index="${selectedIndex}"]`) || search).focus({ preventScroll: true });
    resize();
  }));
  previous.addEventListener('click', () => {
    if (selectedIndex > 0) runSafely('previous care topic', () => openTopic(selectedIndex - 1));
  });
  next.addEventListener('click', () => {
    if (selectedIndex < conditions.length - 1) runSafely('next care topic', () => openTopic(selectedIndex + 1));
  });
  preview.addEventListener('click', () => runSafely('open preview topic', () => openTopic(selectedIndex)));
  search.addEventListener('input', () => runSafely('filter care topics', render));
  window.addEventListener('load', resize);
  window.addEventListener('resize', resize);
  window.addEventListener('error', (event) => {
    reportError('runtime', event.error || event.message);
    showFallback();
  });

  try {
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => runSafely('resize observer', resize)).observe(document.body);
    }
    render();
  } catch (error) {
    reportError('initialize', error);
    showFallback();
  }
})();
