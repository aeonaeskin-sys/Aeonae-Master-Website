/*
  AEONAE product page behaviour (loaded by sections/main-product.liquid).

  1. Edition band (.aeo-edition, id aeo-edition-{section}): on variant change, swaps in
     the band Dawn's section re-render produced for the new variant, so the live count
     and bar always reflect the selected variant's real inventory.
  2. <aeo-purchase-options>: native selling plans. Keeps the hidden
     <input name="selling_plan"> in Dawn's product form in sync with the chosen card and
     plan, refreshes cards on variant change (allocations differ per variant) and
     preselects the subscription when the URL hash is #subscribe.

  Both listen to Dawn's PUB_SUB_EVENTS.variantChange, published by product-info.js
  with { sectionId, html, variant }.
*/
(function () {
  if (window.AeonaeProduct) return;
  window.AeonaeProduct = true;

  const hasPubSub = () => typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined';

  /* The section id Dawn renders with (quick add prefixes the DOM copy, not the fetched HTML). */
  const sourceSectionId = (el) => {
    const info = el.closest('product-info');
    return info ? info.dataset.originalSection || info.dataset.section : null;
  };

  /* A quick add copy of the main product shares its source section id, so also require that
     this copy is the one whose variant changed. Dawn's product-info.js updates the form's
     variant input before it publishes variantChange. */
  const isPublisher = (el, data) => {
    const info = el.closest('product-info');
    const input = info && info.querySelector('form[id^="product-form-"] input[name="id"]');
    if (!input) return true;
    return input.value === (data.variant ? String(data.variant.id) : '');
  };

  /* HTML from the fetched section, with ids rewritten for a quick add copy when needed. */
  const adoptHtml = (el, source, sectionId) => {
    const info = el.closest('product-info');
    const current = info ? info.dataset.section : sectionId;
    return current && current !== sectionId ? source.innerHTML.replaceAll(sectionId, current) : source.innerHTML;
  };

  /* ---------- Edition band ---------- */

  function syncEditions({ data }) {
    if (!data || !data.html || !data.sectionId) return;
    const source = data.html.getElementById(`aeo-edition-${data.sectionId}`);
    if (!source) return;

    document.querySelectorAll('.aeo-edition').forEach((band) => {
      if (sourceSectionId(band) !== data.sectionId) return;
      if (!isPublisher(band, data)) return;
      if (band.dataset.productId !== source.dataset.productId) return;
      band.className = source.className;
      band.innerHTML = adoptHtml(band, source, data.sectionId);
    });
  }

  if (hasPubSub()) subscribe(PUB_SUB_EVENTS.variantChange, syncEditions);

  /* ---------- Total in the Add to cart button ----------
     Unit price (variant, or the chosen selling plan) times quantity. Dawn rewrites only the
     button's first <span> (the label), so this sibling survives variant changes; it is
     hidden whenever the button is disabled (sold out or unavailable). */

  const formatCents = (cents) => {
    const currency = (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD';
    try {
      return new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency }).format(cents / 100);
    } catch (e) {
      return (cents / 100).toFixed(2);
    }
  };

  const atcParts = (info) => {
    const price = info.querySelector('[data-aeo-atc-price]');
    if (!price) return null;
    return {
      price,
      button: price.closest('button'),
      qty: info.querySelector('.quantity__input'),
    };
  };

  function renderAtcTotal(info) {
    const parts = atcParts(info);
    if (!parts) return;
    const unit = Number(parts.price.dataset.planCents || parts.price.dataset.unitCents);
    const qty = Math.max(1, parseInt(parts.qty ? parts.qty.value : '1', 10) || 1);
    const disabled = parts.button && parts.button.disabled;
    parts.price.hidden = disabled || !Number.isFinite(unit);
    if (!parts.price.hidden) parts.price.textContent = formatCents(unit * qty);
  }

  function applyPlan(info, planId) {
    const parts = atcParts(info);
    if (!parts) return;
    const planInput = planId ? info.querySelector(`[data-aeo-plan][value="${CSS.escape(planId)}"]`) : null;
    if (planInput && planInput.dataset.priceCents) parts.price.dataset.planCents = planInput.dataset.priceCents;
    else delete parts.price.dataset.planCents;
    renderAtcTotal(info);
  }

  /* Delegated, so quick add copies of the product form work too. */
  const infoFor = (target) => (target && target.closest ? target.closest('product-info') : null);
  const onQuantity = (event) => {
    if (!event.target.matches || !event.target.matches('.quantity__input')) return;
    const info = infoFor(event.target);
    if (info) renderAtcTotal(info);
  };
  document.addEventListener('change', onQuantity);
  document.addEventListener('input', onQuantity);
  document.addEventListener('click', (event) => {
    const info = event.target.closest && event.target.closest('.quantity__button') ? infoFor(event.target) : null;
    if (info) window.setTimeout(() => renderAtcTotal(info));
  });
  document.addEventListener('aeo:plan-change', (event) => {
    const info = infoFor(event.target);
    if (info) applyPlan(info, event.detail.planId);
  });

  function initAtcTotals() {
    document.querySelectorAll('product-info').forEach((info) => {
      const planInput = info.querySelector('[data-aeo-plan-input]');
      applyPlan(info, planInput ? planInput.value : '');
    });
  }

  if (hasPubSub()) {
    subscribe(PUB_SUB_EVENTS.variantChange, ({ data }) => {
      if (!data || !data.html || !data.sectionId) return;
      const source = data.html.querySelector(`#ProductSubmitButton-${data.sectionId} [data-aeo-atc-price]`);
      document.querySelectorAll('product-info').forEach((info) => {
        const parts = atcParts(info);
        if (!parts || sourceSectionId(parts.price) !== data.sectionId || !isPublisher(parts.price, data)) return;
        if (source) parts.price.dataset.unitCents = source.dataset.unitCents;
        // Dawn toggles the button's disabled state after publishing; read it on the next frame.
        window.requestAnimationFrame(() => renderAtcTotal(info));
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAtcTotals);
  else initAtcTotals();

  /* ---------- Purchase options ---------- */

  if (customElements.get('aeo-purchase-options')) return;

  class AeoPurchaseOptions extends HTMLElement {
    constructor() {
      super();
      this.onChange = this.onChange.bind(this);
      this.onHashChange = () => this.applyHash(true);
    }

    connectedCallback() {
      this.input = this.querySelector('[data-aeo-plan-input]') || this.input;
      if (!this.input) return;

      this.attachInputToForm();
      this.addEventListener('change', this.onChange);
      window.addEventListener('hashchange', this.onHashChange);

      if (hasPubSub()) {
        this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, ({ data }) => this.onVariantChange(data));
      }

      if (!this.applyHash(false)) this.sync();
    }

    disconnectedCallback() {
      this.removeEventListener('change', this.onChange);
      window.removeEventListener('hashchange', this.onHashChange);
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = null;
    }

    get body() {
      return this.querySelector('.aeo-po__body');
    }

    get modeInputs() {
      return Array.from(this.querySelectorAll('[data-aeo-mode]'));
    }

    /*
      The input is rendered with form="product-form-{section}", which is enough for
      Dawn's FormData. It is also moved inside that form so dynamic checkout buttons,
      which read the form's own fields, see the selected plan as well.
    */
    attachInputToForm() {
      const formId = this.input.getAttribute('form');
      if (!formId) return;
      const scope = this.closest('product-info') || document;
      const form = scope.querySelector(`#${CSS.escape(formId)}`);
      if (form && this.input.parentElement !== form) form.appendChild(this.input);
    }

    onChange(event) {
      if (event.target.matches('[data-aeo-mode], [data-aeo-plan]')) this.sync();
    }

    sync() {
      const body = this.body;
      let mode = this.modeInputs.find((input) => input.checked);

      if (!mode && this.dataset.requiresPlan === 'true') {
        mode = this.modeInputs.find((input) => input.value);
        if (mode) mode.checked = true;
      }

      const groupId = mode ? mode.value : '';
      let planId = '';

      this.querySelectorAll('[data-aeo-plans]').forEach((fieldset) => {
        const active = groupId !== '' && fieldset.dataset.aeoPlans === groupId;
        fieldset.hidden = !active;
        if (!active) return;

        let plan = fieldset.querySelector('[data-aeo-plan]:checked');
        if (!plan) {
          plan = fieldset.querySelector('[data-aeo-plan]');
          if (plan) plan.checked = true;
        }
        if (!plan) return;

        planId = plan.value;
        this.updateGroupCard(mode, plan);
      });

      if (body && body.hidden) planId = '';
      this.input.value = planId;

      const plan = planId ? this.querySelector(`[data-aeo-plan][value="${CSS.escape(planId)}"]`) : null;
      this.dispatchEvent(
        new CustomEvent('aeo:plan-change', {
          bubbles: true,
          detail: { planId, price: plan ? plan.dataset.price || '' : '' },
        })
      );
    }

    updateGroupCard(mode, plan) {
      const card = mode.closest('.aeo-po__mode');
      if (!card) return;

      const price = card.querySelector('[data-aeo-group-price]');
      if (price && plan.dataset.price) price.textContent = plan.dataset.price;

      const save = card.querySelector('[data-aeo-group-save]');
      if (save) {
        save.textContent = plan.dataset.save || '';
        save.hidden = !plan.dataset.save;
      }
    }

    onVariantChange(data) {
      if (!data || !data.html || !this.isConnected) return;
      if (sourceSectionId(this) !== data.sectionId) return;
      if (!isPublisher(this, data)) return;

      const source = data.html.getElementById(`aeo-po-${data.sectionId}`);
      const target = this.body;
      if (!source || !target || source.dataset.productId !== target.dataset.productId) return;

      const previousMode = this.modeInputs.find((input) => input.checked);
      const previousModeValue = previousMode ? previousMode.value : null;
      const previousPlan = this.input.value;

      target.innerHTML = adoptHtml(this, source, data.sectionId);
      target.hidden = source.hasAttribute('hidden');

      if (previousModeValue !== null) {
        const mode = this.modeInputs.find((input) => input.value === previousModeValue);
        if (mode) mode.checked = true;
      }
      if (previousPlan) {
        const plan = Array.from(this.querySelectorAll('[data-aeo-plan]')).find((input) => input.value === previousPlan);
        if (plan) plan.checked = true;
      }

      this.sync();
    }

    applyHash(fromHashChange) {
      if (window.location.hash !== '#subscribe') return false;
      if (this.closest('quick-add-modal')) return false;

      const body = this.body;
      const subscription = this.modeInputs.find((input) => input.value);
      if (!subscription || (body && body.hidden)) return false;

      subscription.checked = true;
      this.sync();

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.requestAnimationFrame(() => {
        this.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        if (fromHashChange) subscription.focus({ preventScroll: true });
      });
      return true;
    }
  }

  customElements.define('aeo-purchase-options', AeoPurchaseOptions);
})();
