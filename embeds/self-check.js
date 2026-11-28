// @ts-check
/** @typedef {'medication'|'mood'|'inside'|'understand'|'whole'|'begin'} ExperienceKey */
/** @typedef {'Clearer answers'|'Medication guidance'|'Feeling heard'|'Better daily balance'|'A practical next step'} PriorityKey */
/** @typedef {'intake'|'results'} ViewName */

(() => {
  'use strict';

  /** @template {HTMLElement} T @param {string} id @returns {T} */
  function requireElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Required element #${id} is missing.`);
    return /** @type {T} */ (element);
  }

  /** @template {Element} T @param {string} selector @returns {T[]} */
  function all(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  /** @param {unknown} error */
  function reportError(error) {
    console.error('[Self Check] Interactive feature failed.', error);
  }

  /** Show the existing inline warning only when a feature has failed. @param {string} [message] */
  function showFallback(message = 'An interactive feature is temporarily unavailable. Please refresh the page or continue by discussing your questions with the practice.') {
    const warning = document.getElementById('script-warning');
    if (!warning) return;
    warning.textContent = message;
    warning.style.display = 'block';
  }

  /** @param {string} value @returns {value is ExperienceKey} */
  function isExperienceKey(value) {
    return Object.prototype.hasOwnProperty.call(experienceLabels, value);
  }

  /** @param {string|undefined} value @returns {value is PriorityKey} */
  function isPriorityKey(value) {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(priorityQuestions, value);
  }

  /** @type {Readonly<Record<ExperienceKey, string>>} */
  const experienceLabels = Object.freeze({
    medication: "I've tried medication, but I still have questions about benefit, changes, or side effects.",
    mood: 'My thoughts, mood, or energy have felt difficult to manage.',
    inside: 'I may appear fine externally while experiencing difficulties internally.',
    understand: "I'd like a clearer understanding of what I've been experiencing.",
    whole: 'I want to consider sleep, routines, lifestyle, and my goals—not medication alone.',
    begin: "I'm not sure where to begin and would appreciate help identifying useful questions.",
  });

  /** @type {Readonly<Record<ExperienceKey, string>>} */
  const questions = Object.freeze({
    medication: 'What would be useful to review about my prior medication experience, benefits, or side effects?',
    mood: 'What information about my mood, attention, energy, or daily functioning would help guide our discussion?',
    inside: 'How can I describe concerns that may not be obvious to others?',
    understand: 'What would a thoughtful evaluation involve, and how could it clarify my concerns?',
    whole: 'How might sleep, routines, stress, and other factors fit into our discussion of care options?',
    begin: 'What information should I prepare, and what should I expect from a first visit?',
  });

  /** @type {Readonly<Record<PriorityKey, string>>} */
  const priorityQuestions = Object.freeze({
    'Clearer answers': 'What questions should I ask to better understand the possibilities and what further assessment may be appropriate?',
    'Medication guidance': 'How can we review past medication experiences and discuss available options?',
    'Feeling heard': 'How will my experiences and preferences be considered when planning next steps?',
    'Better daily balance': 'What parts of my daily routine or functioning would be useful to discuss?',
    'A practical next step': 'What might a realistic, collaborative next step look like after an evaluation?',
  });

  try {
    const familiar = /** @type {HTMLInputElement[]} */ (all('input[name="familiar"]'));
    const priorityButtons = /** @type {HTMLButtonElement[]} */ (all('button[data-priority]'));
    const notes = /** @type {HTMLTextAreaElement} */ (requireElement('additional-notes'));
    const intake = /** @type {HTMLElement} */ (requireElement('intake'));
    const results = /** @type {HTMLElement} */ (requireElement('results'));
    const warning = /** @type {HTMLElement} */ (requireElement('script-warning'));
    const action = /** @type {HTMLButtonElement} */ (requireElement('generate-notes'));
    const lastTouchState = { at: 0 };

    /** @returns {HTMLButtonElement[]} */
    function chosenPriorities() {
      return priorityButtons.filter((button) => button.getAttribute('aria-pressed') === 'true');
    }

    /** @param {string} value @returns {number} */
    function wordCount(value) {
      const trimmed = value.trim();
      return trimmed ? trimmed.split(/\s+/).length : 0;
    }

    function setState() {
      /** @type {HTMLElement} */ (requireElement('selection-count')).textContent = `${familiar.filter((input) => input.checked).length} selected`;
      const selectedPriorities = chosenPriorities();
      /** @type {HTMLElement} */ (requireElement('priority-count')).textContent = `${selectedPriorities.length} of 2`;
      priorityButtons.forEach((button) => {
        button.disabled = selectedPriorities.length >= 2 && button.getAttribute('aria-pressed') !== 'true';
      });
      /** @type {HTMLElement} */ (requireElement('priority-hint')).textContent = selectedPriorities.length === 2
        ? 'Both priorities selected. Tap one to change it.'
        : 'You may select up to two.';
      /** @type {HTMLElement} */ (requireElement('word-count')).textContent = `${wordCount(notes.value)} / 150 words`;
    }

    /** @param {HTMLButtonElement|null} button */
    function togglePriority(button) {
      if (!button || button.disabled) return;
      const wasSelected = button.getAttribute('aria-pressed') === 'true';
      if (!wasSelected && chosenPriorities().length >= 2) return;
      button.setAttribute('aria-pressed', wasSelected ? 'false' : 'true');
      setState();
    }

    priorityButtons.forEach((button) => {
      /** @type {number} */
      let lastTouchAt = 0;
      button.addEventListener('touchend', (event) => {
        if (event.cancelable) event.preventDefault();
        lastTouchAt = Date.now();
        togglePriority(button);
      }, false);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (Date.now() - lastTouchAt < 650) return;
        togglePriority(button);
      }, false);
    });

    familiar.forEach((input) => input.addEventListener('change', setState, false));
    /** @type {HTMLButtonElement} */ (requireElement('clear-recognize')).addEventListener('click', () => {
      familiar.forEach((input) => { input.checked = false; });
      setState();
    });
    notes.addEventListener('input', () => {
      const words = notes.value.trim().split(/\s+/);
      if (wordCount(notes.value) > 150) notes.value = words.slice(0, 150).join(' ');
      setState();
    });

    /** @param {string} id @param {string} value */
    function addListItem(id, value) {
      const item = document.createElement('li');
      item.textContent = value;
      /** @type {HTMLElement} */ (requireElement(id)).appendChild(item);
    }

    function buildSummary() {
      const selectedExperiences = familiar
        .filter((input) => input.checked)
        .map((input) => input.value)
        .filter(isExperienceKey);
      const selectedPriorityKeys = chosenPriorities()
        .map((button) => button.dataset.priority)
        .filter(isPriorityKey);

      /** @type {HTMLElement} */ (requireElement('prepared-date')).textContent = new Date().toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      /** @type {HTMLElement} */ (requireElement('summary-intro')).textContent = selectedExperiences.length
        ? 'I am seeking a thoughtful conversation about the concerns and goals outlined below. I would like my experiences and preferences to inform the discussion.'
        : 'I am preparing for a conversation about my mental well-being and would welcome guidance on where to begin.';

      const experienceList = /** @type {HTMLElement} */ (requireElement('summary-experiences'));
      experienceList.replaceChildren();
      if (selectedExperiences.length) {
        selectedExperiences.forEach((key) => addListItem('summary-experiences', experienceLabels[key]));
      } else {
        addListItem('summary-experiences', 'No specific experiences selected; I would like to discuss my concerns in person.');
      }

      /** @type {HTMLElement} */ (requireElement('summary-priority-copy')).textContent = selectedPriorityKeys.length
        ? 'The following are the most important outcomes I hope to discuss:'
        : 'I have not selected specific priorities yet and would like to identify them together during a consultation.';
      const priorityList = /** @type {HTMLElement} */ (requireElement('summary-priorities'));
      priorityList.replaceChildren();
      selectedPriorityKeys.forEach((key) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = key;
        priorityList.appendChild(tag);
      });

      /** @type {HTMLElement} */ (requireElement('ownwords-section')).hidden = !notes.value.trim();
      /** @type {HTMLElement} */ (requireElement('summary-ownwords')).textContent = notes.value.trim();
      const questionList = /** @type {HTMLElement} */ (requireElement('summary-questions'));
      questionList.replaceChildren();
      const suggestedQuestions = selectedExperiences.map((key) => questions[key])
        .concat(selectedPriorityKeys.map((key) => priorityQuestions[key]));
      if (!suggestedQuestions.length) {
        suggestedQuestions.push(
          'How can I best prepare for a first psychiatric consultation?',
          'What information about my goals and daily life would help inform our conversation?',
        );
      }
      /** @type {Set<string>} */ const seen = new Set();
      suggestedQuestions.forEach((question) => {
        if (!question || seen.has(question) || seen.size >= 6) return;
        seen.add(question);
        addListItem('summary-questions', question);
      });
    }

    /** @param {ViewName} viewName */
    function showView(viewName) {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      intake.classList.toggle('hidden', viewName !== 'intake');
      results.classList.toggle('hidden', viewName !== 'results');
      document.title = `${viewName === 'results' ? 'Pre-Consultation Notes' : 'Self Check'} | M.R.-Gen-C Psychiatry`;
      window.scrollTo(0, 0);
    }

    /** @param {Event} [event] */
    function generateNotes(event) {
      event?.preventDefault();
      try {
        buildSummary();
        showView('results');
      } catch (error) {
        reportError(error);
        showFallback('Unable to prepare the notes in this browser. Your selections remain available; refresh the page or discuss your questions with the practice.');
      }
    }

    action.addEventListener('touchend', (event) => {
      if (event.cancelable) event.preventDefault();
      lastTouchState.at = Date.now();
      generateNotes(event);
    }, false);
    action.addEventListener('click', (event) => {
      if (Date.now() - lastTouchState.at < 650) {
        event.preventDefault();
        return;
      }
      generateNotes(event);
    }, false);
    /** @type {HTMLFormElement} */ (requireElement('intake-form')).addEventListener('submit', generateNotes, false);
    /** @type {HTMLButtonElement} */ (requireElement('edit-answers')).addEventListener('click', () => showView('intake'));
    /** @type {HTMLButtonElement} */ (requireElement('print-notes')).addEventListener('click', () => {
      try {
        window.print();
      } catch (error) {
        reportError(error);
        showFallback('Printing is unavailable in this browser. You can still review your notes on this page.');
      }
    });

    /** @returns {string} */
    function composeNotes() {
      const letterhead = /** @type {HTMLElement} */ (requireElement('letterhead'));
      return (letterhead.innerText || letterhead.textContent || '').replace(/\n{3,}/g, '\n\n');
    }

    const copyButton = /** @type {HTMLButtonElement} */ (requireElement('copy-notes'));
    /** @param {string} noteText */
    function fallbackCopy(noteText) {
      const temporaryField = document.createElement('textarea');
      temporaryField.value = noteText;
      temporaryField.setAttribute('readonly', '');
      temporaryField.style.position = 'fixed';
      temporaryField.style.left = '-9999px';
      try {
        document.body.appendChild(temporaryField);
        temporaryField.select();
        if (!document.execCommand('copy')) {
          showFallback('Automatic copying is unavailable. Select your notes on this page and copy them manually.');
          return;
        }
        copyButton.textContent = 'Copied!';
        window.setTimeout(() => { copyButton.textContent = 'Copy notes'; }, 1800);
      } catch (error) {
        reportError(error);
        showFallback('Automatic copying is unavailable. Select your notes on this page and copy them manually.');
      } finally {
        temporaryField.remove();
      }
    }

    async function copyNotes() {
      try {
        const noteText = composeNotes();
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.');
        await navigator.clipboard.writeText(noteText);
        copyButton.textContent = 'Copied!';
        window.setTimeout(() => { copyButton.textContent = 'Copy notes'; }, 1800);
      } catch (error) {
        reportError(error);
        try {
          fallbackCopy(composeNotes());
        } catch (fallbackError) {
          reportError(fallbackError);
          showFallback('Automatic copying is unavailable. Select your notes on this page and copy them manually.');
        }
      }
    }

    copyButton.addEventListener('click', () => { void copyNotes(); });
    window.addEventListener('hashchange', () => {
      try {
        if (location.hash === '#intake') showView('intake');
        else if (location.hash === '#notes' && /** @type {HTMLElement} */ (requireElement('summary-intro')).textContent) showView('results');
      } catch (error) {
        reportError(error);
        showFallback();
      }
    });
    window.addEventListener('error', (event) => {
      reportError(event.error || event.message);
      showFallback();
    });
    window.addEventListener('unhandledrejection', (event) => {
      reportError(event.reason);
      showFallback();
    });

    setState();
    warning.style.display = 'none';
  } catch (error) {
    reportError(error);
    showFallback('The Self Check could not start in this browser. Refresh the page or discuss your questions directly with the practice.');
  }
})();
