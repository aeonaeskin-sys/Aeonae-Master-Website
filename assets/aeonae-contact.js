/*
  AEONAE contact form (sections/aeonae-contact.liquid).
  - Inline, accessible validation for the required email and message fields.
  - One "Sending…" state per submit, so a double click cannot send the message twice.
  - Moves focus to the success or error message Shopify renders after the page reloads.
  The form still submits to Shopify normally; without JavaScript the browser validates it.
*/
(function () {
  const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function setError(field, message) {
    const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
    if (errorEl) errorEl.textContent = message || '';
  }

  function validate(field) {
    const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
    const message = errorEl ? errorEl.dataset.aeoError : '';
    const value = field.value.trim();
    const ok = field.type === 'email' ? EMAIL.test(value) : value.length > 0;
    setError(field, ok ? '' : message);
    return ok;
  }

  function init(form) {
    if (form.dataset.aeoContactReady) return;
    form.dataset.aeoContactReady = 'true';

    const required = Array.from(form.querySelectorAll('[required]'));
    const button = form.querySelector('[data-aeo-contact-submit]');
    const label = form.querySelector('[data-aeo-contact-label]');

    required.forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value.trim() !== '' || field.hasAttribute('aria-invalid')) validate(field);
      });
      field.addEventListener('input', () => {
        if (field.hasAttribute('aria-invalid')) validate(field);
      });
    });

    form.addEventListener('submit', (event) => {
      if (form.dataset.aeoSending === 'true') {
        event.preventDefault();
        return;
      }
      const invalid = required.filter((field) => !validate(field));
      if (invalid.length) {
        event.preventDefault();
        invalid[0].focus();
        return;
      }
      form.dataset.aeoSending = 'true';
      if (button) {
        button.setAttribute('aria-busy', 'true');
        button.setAttribute('aria-disabled', 'true');
        if (label && button.dataset.sendingLabel) {
          label.dataset.idleLabel = label.textContent;
          label.textContent = button.dataset.sendingLabel;
        }
      }
    });

    const status = form.querySelector('[data-aeo-contact-focus]');
    if (status) {
      status.scrollIntoView({ block: 'center' });
      status.focus({ preventScroll: true });
    }
  }

  function initAll() {
    document.querySelectorAll('form.aeo-contact__form').forEach(init);
  }

  // Reset the sending state when the page is restored from the back/forward cache.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    document.querySelectorAll('form.aeo-contact__form').forEach((form) => {
      delete form.dataset.aeoSending;
      const button = form.querySelector('[data-aeo-contact-submit]');
      if (button) {
        button.removeAttribute('aria-busy');
        button.removeAttribute('aria-disabled');
      }
      const label = form.querySelector('[data-aeo-contact-label]');
      if (label && label.dataset.idleLabel) label.textContent = label.dataset.idleLabel;
    });
  });

  document.addEventListener('shopify:section:load', initAll);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
