/*
  AEONAE mobile buy bar: <aeo-sticky-buy> (sections/aeonae-sticky-buy.liquid).

  data-mode="product": mirrors Dawn's main product form.
    - "Add to cart" calls requestSubmit() on form#product-form-<sectionId>, so Dawn's
      <product-form> does the AJAX add and opens the cart drawer as usual.
    - Mirrors the main submit button (disabled, sold out / unavailable label, loading).
    - Follows PUB_SUB_EVENTS.variantChange for the price.
    - Shows once the main submit button has scrolled above the viewport.
  data-mode="link": shows after the visitor scrolls data-threshold % of the viewport height.

  Hidden while a drawer or modal locks the page (Dawn adds body.overflow-hidden*),
  while the cart drawer is open, and while a text field elsewhere has focus
  (the on-screen keyboard is up). No scroll listeners: IntersectionObserver only.
  The observers extend the root far below the viewport (PAST_TOP), so "intersecting"
  means "not yet scrolled above the viewport top" and an instant jump (anchor link,
  scroll restoration) still crosses the boundary and fires the callback.
*/
(() => {
  if (customElements.get('aeo-sticky-buy')) return;

  const LOCK_CLASSES = ['aeo-scroll-lock', 'aeo-menu-open', 'aeo-drawer-open'];
  const TYPING_SELECTOR = [
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="range"]):not([type="color"]):not([type="file"])',
    'textarea',
    'select',
    '[contenteditable="true"]',
  ].join(',');

  const clean = (text) => (text || '').replace(/\s+/g, ' ').trim();

  const PAST_TOP = { rootMargin: '0px 0px 1000000px 0px' };
  const isPastTop = (entries) => {
    const entry = entries[entries.length - 1];
    return !entry.isIntersecting && entry.boundingClientRect.top < 0;
  };

  const hasLock = (el) =>
    Array.from(el.classList).some((name) => name.startsWith('overflow-hidden') || LOCK_CLASSES.includes(name));

  class AeoStickyBuy extends HTMLElement {
    connectedCallback() {
      this.bar = this.querySelector('.aeo-sbuy__bar');
      if (!this.bar) return;

      this.mode = this.dataset.mode;
      this.state = { eligible: false, triggered: false, blocked: false, typing: false, editor: false };
      this.cleanups = [];
      this.main = null;

      this.priceWrap = this.querySelector('[data-aeo-sbuy-price]');
      this.amountEl = this.querySelector('[data-aeo-sbuy-amount]');
      this.compareEl = this.querySelector('[data-aeo-sbuy-compare]');
      this.compareAmountEl = this.querySelector('[data-aeo-sbuy-compare-amount]');
      this.saleLabelEl = this.querySelector('[data-aeo-sbuy-sale-label]');

      this.observeSize();
      this.observeLocks();
      this.observeTyping();
      this.observeEditor();

      const onBarFocusOut = () => setTimeout(() => this.update());
      this.bar.addEventListener('focusout', onBarFocusOut);
      this.cleanups.push(() => this.bar.removeEventListener('focusout', onBarFocusOut));

      if (this.mode === 'product') this.initProduct();
      if (this.mode === 'link') this.initLink();

      this.update();
    }

    disconnectedCallback() {
      (this.cleanups || []).forEach((cleanup) => cleanup());
      this.cleanups = [];
      this.unbindMain();
      document.documentElement.classList.remove('aeo-sbuy-on');
      document.documentElement.style.removeProperty('--aeo-sbuy-h');
    }

    /* ---------- Visibility ---------- */

    update() {
      if (!this.bar) return;
      const { eligible, triggered, blocked, typing, editor } = this.state;

      let show = eligible && (triggered || editor);
      // Never yank the bar away from under keyboard focus.
      if (!show && this.bar.contains(document.activeElement)) show = true;
      const tucked = show && !editor && (blocked || typing);

      this.classList.toggle('is-visible', show);
      this.classList.toggle('is-blocked', tucked);
      this.bar.toggleAttribute('inert', !show);
      document.documentElement.classList.toggle('aeo-sbuy-on', show && !tucked);
    }

    observeSize() {
      const setHeight = () => {
        document.documentElement.style.setProperty('--aeo-sbuy-h', `${this.bar.offsetHeight}px`);
      };
      setHeight();
      if (!('ResizeObserver' in window)) return;
      const resizeObserver = new ResizeObserver(setHeight);
      resizeObserver.observe(this.bar);
      this.cleanups.push(() => resizeObserver.disconnect());
    }

    observeLocks() {
      const check = () => {
        const cartDrawerOpen = Boolean(document.querySelector('cart-drawer.active'));
        const locked = cartDrawerOpen || hasLock(document.body) || hasLock(document.documentElement);
        if (locked === this.state.blocked) return;
        this.state.blocked = locked;
        this.update();
      };

      const observer = new MutationObserver(check);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) observer.observe(cartDrawer, { attributes: true, attributeFilter: ['class'] });
      this.cleanups.push(() => observer.disconnect());
      check();
    }

    observeTyping() {
      const check = () => {
        const active = document.activeElement;
        const typing = Boolean(active && !this.contains(active) && active.matches && active.matches(TYPING_SELECTOR));
        if (typing === this.state.typing) return;
        this.state.typing = typing;
        this.update();
      };
      const onFocusChange = () => setTimeout(check);
      document.addEventListener('focusin', onFocusChange);
      document.addEventListener('focusout', onFocusChange);
      this.cleanups.push(() => {
        document.removeEventListener('focusin', onFocusChange);
        document.removeEventListener('focusout', onFocusChange);
      });
    }

    observeEditor() {
      if (!window.Shopify || !window.Shopify.designMode) return;
      const sectionId = this.dataset.sectionId;
      const onSelect = (event) => {
        if (!event.detail || event.detail.sectionId !== sectionId) return;
        this.state.editor = true;
        this.update();
      };
      const onDeselect = (event) => {
        if (!event.detail || event.detail.sectionId !== sectionId) return;
        this.state.editor = false;
        this.update();
      };
      document.addEventListener('shopify:section:select', onSelect);
      document.addEventListener('shopify:section:deselect', onDeselect);
      this.cleanups.push(() => {
        document.removeEventListener('shopify:section:select', onSelect);
        document.removeEventListener('shopify:section:deselect', onDeselect);
      });
    }

    /* ---------- Link mode (pages other than product pages) ---------- */

    initLink() {
      this.state.eligible = true;
      const threshold = parseFloat(this.dataset.threshold) || 90;

      // A 1px marker at <threshold>vh from the top of the document: once it has
      // scrolled above the viewport, the visitor is past the threshold.
      // display is inline because Dawn hides div:empty.
      const marker = document.createElement('div');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = `display:block;position:absolute;left:0;top:${threshold}vh;width:1px;height:1px;pointer-events:none;visibility:hidden;`;
      document.body.appendChild(marker);

      const observer = new IntersectionObserver((entries) => {
        this.state.triggered = isPastTop(entries);
        this.update();
      }, PAST_TOP);
      observer.observe(marker);

      this.cleanups.push(() => {
        observer.disconnect();
        marker.remove();
      });
    }

    /* ---------- Product mode ---------- */

    initProduct() {
      this.addButton = this.querySelector('[data-aeo-sbuy-add]');
      this.addText = this.querySelector('[data-aeo-sbuy-text]');
      this.addSpinner = this.addButton ? this.addButton.querySelector('.loading__spinner') : null;
      if (!this.addButton) return;

      const onClick = () => this.submitMainForm();
      this.addButton.addEventListener('click', onClick);
      this.cleanups.push(() => this.addButton.removeEventListener('click', onClick));

      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        const unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => this.onVariantChange(event));
        const unsubscribeError = subscribe(PUB_SUB_EVENTS.cartError, (event) => this.onCartError(event));
        const unsubscribeUpdate = subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
          this.pendingSubmit = 0;
        });
        this.cleanups.push(unsubscribe, unsubscribeError, unsubscribeUpdate);
      }

      // The main product block can be swapped (combined listings) or re-rendered in the editor.
      const rebind = () => requestAnimationFrame(() => this.bindMainProduct());
      document.addEventListener('product-info:loaded', rebind);
      document.addEventListener('shopify:section:load', rebind);
      this.cleanups.push(() => {
        document.removeEventListener('product-info:loaded', rebind);
        document.removeEventListener('shopify:section:load', rebind);
      });

      this.bindMainProduct();
    }

    findMainProduct() {
      const root = document.getElementById('MainContent') || document;
      const productId = this.dataset.productId;
      const infos = Array.from(root.querySelectorAll('product-info[data-section]'));
      const isMain = (el) => el.id && el.id.indexOf('MainProduct-') === 0;
      const matches = (el) => !productId || el.dataset.productId === productId;

      const info =
        infos.find((el) => isMain(el) && matches(el)) ||
        infos.find(matches) ||
        infos.find(isMain) ||
        null;

      let sectionId = info ? info.dataset.section : null;
      let form = sectionId ? document.getElementById(`product-form-${sectionId}`) : null;

      if (!form) {
        form = root.querySelector('product-form form[id^="product-form-"]');
        if (form) sectionId = form.id.replace('product-form-', '');
      }
      if (!form) return null;

      const button =
        document.getElementById(`ProductSubmitButton-${sectionId}`) ||
        form.querySelector('[type="submit"][name="add"]') ||
        form.querySelector('[type="submit"]');
      if (!button) return null;

      const sectionIds = [sectionId];
      if (info && info.dataset.originalSection) sectionIds.push(info.dataset.originalSection);

      return { info, form, button, sectionId, sectionIds };
    }

    bindMainProduct() {
      const found = this.findMainProduct();
      if (found && this.main && found.form === this.main.form && found.button === this.main.button) return;

      this.unbindMain();
      this.main = found;
      this.state.eligible = Boolean(found);

      if (found) {
        this.buttonObserver = new MutationObserver(() => this.syncButton());
        this.buttonObserver.observe(found.button, {
          attributes: true,
          attributeFilter: ['disabled', 'aria-disabled', 'class'],
          childList: true,
          subtree: true,
          characterData: true,
        });

        const priceEl = document.getElementById(`price-${found.sectionId}`);
        if (priceEl) {
          this.priceObserver = new MutationObserver(() => this.syncPriceVisibility());
          this.priceObserver.observe(priceEl, { attributes: true, attributeFilter: ['class'] });
        }

        // Watch the button itself; fall back to the form if a theme hides the button box.
        const target = found.button.getClientRects().length ? found.button : found.form;
        this.viewObserver = new IntersectionObserver((entries) => {
          this.state.triggered = isPastTop(entries);
          this.update();
        }, PAST_TOP);
        this.viewObserver.observe(target);

        // Subscription chosen in the AEONAE purchase options: show its per-delivery price.
        if (found.info) {
          this.planListener = () => this.updatePrice();
          this.planTarget = found.info;
          found.info.addEventListener('aeo:plan-change', this.planListener);
        }

        this.syncButton();
        // Picks up a price change after a product swap (combined listings), which publishes no variantChange.
        this.updatePrice();
      } else {
        this.state.triggered = false;
      }

      this.update();
    }

    unbindMain() {
      if (this.buttonObserver) this.buttonObserver.disconnect();
      if (this.priceObserver) this.priceObserver.disconnect();
      if (this.viewObserver) this.viewObserver.disconnect();
      if (this.planTarget) this.planTarget.removeEventListener('aeo:plan-change', this.planListener);
      this.planTarget = null;
      this.buttonObserver = null;
      this.priceObserver = null;
      this.viewObserver = null;
    }

    submitMainForm() {
      if (!this.main || !document.contains(this.main.form)) this.bindMainProduct();
      if (!this.main) return;

      const { form, button } = this.main;
      if (button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true') return;

      this.pendingSubmit = Date.now();
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        button.click();
      }
    }

    readMainLabel(button) {
      const label = Array.from(button.children).find(
        (child) =>
          child.tagName === 'SPAN' &&
          !child.classList.contains('hidden') &&
          !child.classList.contains('visually-hidden') &&
          !child.classList.contains('loading__spinner') &&
          clean(child.textContent)
      );
      return clean(label ? label.textContent : button.textContent);
    }

    syncButton() {
      if (!this.main || !this.addButton) return;
      const source = this.main.button;

      this.addButton.disabled = source.hasAttribute('disabled');

      const busy = source.getAttribute('aria-disabled') === 'true';
      if (busy) {
        this.addButton.setAttribute('aria-disabled', 'true');
      } else {
        this.addButton.removeAttribute('aria-disabled');
      }

      const loading = source.classList.contains('loading');
      this.addButton.classList.toggle('loading', loading);
      if (this.addSpinner) this.addSpinner.classList.toggle('hidden', !loading);

      const label = this.readMainLabel(source);
      if (label && this.addText && this.addText.textContent !== label) this.addText.textContent = label;

      this.syncPriceVisibility();
    }

    syncPriceVisibility() {
      if (!this.priceWrap || !this.main) return;
      const priceEl = document.getElementById(`price-${this.main.sectionId}`);
      this.priceWrap.hidden = Boolean(priceEl && priceEl.classList.contains('hidden'));
    }

    /* Dawn shows add-to-cart errors next to the main button, which is off screen whenever
       the bar is visible. Bring that message into view when the bar started the request. */
    onCartError(event) {
      const fromBar = this.pendingSubmit && Date.now() - this.pendingSubmit < 15000;
      this.pendingSubmit = 0;
      if (!fromBar || !this.main || (event && event.source && event.source !== 'product-form')) return;

      const scope = this.main.form.closest('product-form') || this.main.info || document;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Dawn un-hides the message right after publishing cartError.
      requestAnimationFrame(() => {
        const message = scope.querySelector('.product-form__error-message-wrapper');
        if (!message || message.hasAttribute('hidden')) return;
        message.setAttribute('tabindex', '-1');
        message.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        message.focus({ preventScroll: true });
      });
    }

    readPlanPrice() {
      const options = this.main && this.main.info && this.main.info.querySelector('aeo-purchase-options');
      if (!options) return '';
      const input = options.input || options.querySelector('[data-aeo-plan-input]');
      const planId = input ? input.value : '';
      if (!planId) return '';
      const plan = options.querySelector(`[data-aeo-plan][value="${CSS.escape(planId)}"]`);
      return plan ? clean(plan.dataset.price) : '';
    }

    onVariantChange(event) {
      const data = event && event.data;
      if (!data || !this.main) return;
      if (data.sectionId && !this.main.sectionIds.includes(data.sectionId)) return;
      this.updatePrice(data.variant);
    }

    updatePrice(variant) {
      // A selected subscription plan's per-delivery price is what will be charged.
      const planPrice = this.readPlanPrice();
      if (planPrice) {
        this.renderPrice(planPrice, '');
        return;
      }
      // Otherwise prefer the price Dawn just rendered (right currency and format for the market).
      const fromPage = this.readPagePrice();
      if (fromPage) {
        this.renderPrice(fromPage.amount, fromPage.compare);
        return;
      }
      if (!variant) return;
      const compare =
        variant.compare_at_price && variant.compare_at_price > variant.price
          ? this.formatMoney(variant.compare_at_price)
          : '';
      this.renderPrice(this.formatMoney(variant.price), compare);
    }

    readPagePrice() {
      const wrap = this.main && document.getElementById(`price-${this.main.sectionId}`);
      const price = wrap && wrap.querySelector('.price');
      if (!price) return null;

      const onSale = price.classList.contains('price--on-sale');
      const amountEl = onSale
        ? price.querySelector('.price__sale .price-item--sale')
        : price.querySelector('.price__regular span.price-item--regular');
      if (!amountEl || !clean(amountEl.textContent)) return null;

      const compareEl = onSale ? price.querySelector('.price__sale s.price-item--regular') : null;
      return { amount: clean(amountEl.textContent), compare: compareEl ? clean(compareEl.textContent) : '' };
    }

    formatMoney(cents) {
      const amount = Number(cents) / 100;
      const currency = window.Shopify && window.Shopify.currency && window.Shopify.currency.active;
      try {
        return new Intl.NumberFormat(document.documentElement.lang || undefined, {
          style: currency ? 'currency' : 'decimal',
          currency: currency || undefined,
          minimumFractionDigits: 2,
        }).format(amount);
      } catch (error) {
        return amount.toFixed(2);
      }
    }

    renderPrice(amount, compare) {
      if (!this.amountEl || !amount) return;
      this.amountEl.textContent = amount;

      const showCompare = Boolean(compare) && compare !== amount;
      if (this.compareEl) this.compareEl.hidden = !showCompare;
      if (this.compareAmountEl) this.compareAmountEl.textContent = showCompare ? compare : '';
      if (this.saleLabelEl) this.saleLabelEl.hidden = !showCompare;
    }
  }

  customElements.define('aeo-sticky-buy', AeoStickyBuy);
})();
