/*
  AEONAE header group behaviour (loaded deferred by the ticker and header sections;
  safe to load twice).

  <aeo-marquee>  Announcement ticker: fills wide screens with aria-hidden copies so the
                 loop is seamless, pause/play button (remembered for the session),
                 static single row under prefers-reduced-motion.
  <aeo-header>   Sticky header: --header-height on <html>, border/shadow after 20px of
                 scroll (IntersectionObserver, no scroll listener), and the menu drawer
                 (focus trap, Esc, overlay click, focus return, scroll lock, inert when
                 closed, closes on same-page anchor links).
*/
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const FOCUSABLE =
    'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

  const session = {
    get(key) {
      try {
        return window.sessionStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.sessionStorage.setItem(key, value);
      } catch (error) {
        /* storage unavailable (private mode, blocked): the button still works for this page */
      }
    },
  };

  const listenToMedia = (query, handler) => {
    if (query.addEventListener) query.addEventListener('change', handler);
    else if (query.addListener) query.addListener(handler);
  };

  const unlistenToMedia = (query, handler) => {
    if (query.removeEventListener) query.removeEventListener('change', handler);
    else if (query.removeListener) query.removeListener(handler);
  };

  /* ------------------------------------------------------------------ */
  /* Ticker                                                              */
  /* ------------------------------------------------------------------ */

  if (!customElements.get('aeo-marquee')) {
    const PAUSE_KEY = 'aeo-marquee-paused';
    const MAX_GROUPS = 12;

    class AeoMarquee extends HTMLElement {
      connectedCallback() {
        this.viewport = this.querySelector('.aeo-marquee__viewport');
        this.track = this.querySelector('.aeo-marquee__track');
        this.toggleButton = this.querySelector('.aeo-marquee__toggle');
        if (!this.viewport || !this.track) return;

        this.onToggle = () => this.setPaused(!this.classList.contains('is-paused'), true);
        this.onLayout = () => this.scheduleLayout();
        this.onBlockSelect = () => this.classList.add('is-editor-paused');
        this.onBlockDeselect = () => this.classList.remove('is-editor-paused');

        if (this.toggleButton) this.toggleButton.addEventListener('click', this.onToggle);
        this.addEventListener('shopify:block:select', this.onBlockSelect);
        this.addEventListener('shopify:block:deselect', this.onBlockDeselect);
        listenToMedia(reduceMotion, this.onLayout);

        /* Re-measure when the bar resizes or the first group changes width (e.g. web fonts load) */
        if ('ResizeObserver' in window) {
          this.resizeObserver = new ResizeObserver(this.onLayout);
          this.resizeObserver.observe(this.viewport);
          const firstGroup = this.track.querySelector('.aeo-marquee__group');
          if (firstGroup) this.resizeObserver.observe(firstGroup);
        } else {
          window.addEventListener('resize', this.onLayout, { passive: true });
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(this.onLayout);

        if (this.toggleButton) this.setPaused(session.get(PAUSE_KEY) === '1', false);
        this.scheduleLayout();
      }

      disconnectedCallback() {
        if (this.toggleButton) this.toggleButton.removeEventListener('click', this.onToggle);
        this.removeEventListener('shopify:block:select', this.onBlockSelect);
        this.removeEventListener('shopify:block:deselect', this.onBlockDeselect);
        unlistenToMedia(reduceMotion, this.onLayout);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        window.removeEventListener('resize', this.onLayout);
        if (this.frame) cancelAnimationFrame(this.frame);
        this.frame = null;
      }

      get isStatic() {
        return this.classList.contains('aeo-marquee--static') || reduceMotion.matches;
      }

      scheduleLayout() {
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
          this.frame = null;
          this.layout();
        });
      }

      layout() {
        if (!this.isConnected) return;
        const first = this.track.querySelector('.aeo-marquee__group');
        if (!first) return;

        /* Static row: messages wrap onto extra centered lines (CSS), nothing to measure. */
        if (this.isStatic) return;

        this.fill(first);
      }

      /* Seamless loop: the track must hold enough copies to cover the viewport plus one
         group. The animation shifts by exactly one group (-100% / number of groups). */
      fill(first) {
        const template = this.track.querySelector('[data-aeo-clone]');
        if (!template) return;

        const groupWidth = first.getBoundingClientRect().width;
        if (!groupWidth) return;

        const needed = Math.min(MAX_GROUPS, Math.max(2, Math.ceil(this.viewport.clientWidth / groupWidth) + 1));
        let count = this.track.children.length;

        while (count < needed) {
          this.track.appendChild(template.cloneNode(true));
          count += 1;
        }

        this.track.style.setProperty('--aeo-marquee-groups', count);
      }

      setPaused(paused, remember) {
        this.classList.toggle('is-paused', paused);

        if (this.toggleButton) {
          const label = paused ? this.toggleButton.dataset.playLabel : this.toggleButton.dataset.pauseLabel;
          if (label) this.toggleButton.setAttribute('aria-label', label);
        }

        if (remember) session.set(PAUSE_KEY, paused ? '1' : '0');
      }
    }

    customElements.define('aeo-marquee', AeoMarquee);
  }

  /* ------------------------------------------------------------------ */
  /* Header + menu drawer                                                */
  /* ------------------------------------------------------------------ */

  if (!customElements.get('aeo-header')) {
    const SCROLL_THRESHOLD = 20;

    class AeoHeader extends HTMLElement {
      connectedCallback() {
        this.section = this.closest('.shopify-section') || this;
        this.bar = this.querySelector('.aeo-header');
        this.drawer = this.querySelector('.aeo-drawer');
        this.overlay = this.querySelector('.aeo-drawer-overlay');
        this.toggleButton = this.querySelector('[data-aeo-menu-toggle]');
        this.closeButton = this.drawer ? this.drawer.querySelector('.aeo-drawer__close') : null;
        this.isOpen = false;

        /* The drawer and its overlay are mounted on <body>. Inside the sticky header they would be
           clipped to its stacking context and backdrop, which let the page show through the drawer.
           A click on the overlay or the close button both close it. */
        this.closers = [this.overlay, this.closeButton].filter(Boolean);
        this.portal = [this.overlay, this.drawer].filter(Boolean);
        this.portal.forEach((el) => document.body.appendChild(el));

        this.onToggleClick = this.onToggleClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onDrawerClick = this.onDrawerClick.bind(this);
        this.onPageShow = this.onPageShow.bind(this);
        this.onSectionDeselect = this.onSectionDeselect.bind(this);
        this.setHeaderHeight = this.setHeaderHeight.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.setupHeight();
        this.setupScrollState();
        this.setupDrawer();
      }

      disconnectedCallback() {
        if (this.isOpen) this.close({ returnFocus: false });
        clearTimeout(this.lowerTimer);
        this.section.classList.remove('aeo-menu-is-open');

        if (this.resizeObserver) this.resizeObserver.disconnect();
        window.removeEventListener('resize', this.setHeaderHeight);
        if (this.intersectionObserver) this.intersectionObserver.disconnect();
        if (this.sentinel) this.sentinel.remove();
        window.removeEventListener('scroll', this.onScroll);

        if (this.toggleButton) this.toggleButton.removeEventListener('click', this.onToggleClick);
        (this.closers || []).forEach((el) => el.removeEventListener('click', this.onCloseClick));
        if (this.drawer) this.drawer.removeEventListener('click', this.onDrawerClick);
        window.removeEventListener('pageshow', this.onPageShow);
        document.removeEventListener('shopify:section:deselect', this.onSectionDeselect);

        // Remove the body-mounted copies so a section re-render in the editor never leaves a duplicate.
        (this.portal || []).forEach((el) => el.remove());
      }

      /* --header-height, like Dawn's sticky-header (used by the account dialog and other sections) */
      setupHeight() {
        if (!this.bar) return;
        this.setHeaderHeight();

        if ('ResizeObserver' in window) {
          this.resizeObserver = new ResizeObserver(this.setHeaderHeight);
          this.resizeObserver.observe(this.bar);
        } else {
          window.addEventListener('resize', this.setHeaderHeight, { passive: true });
        }
      }

      setHeaderHeight() {
        document.documentElement.style.setProperty('--header-height', `${this.bar.offsetHeight}px`);
      }

      /* Border + shadow once the page has scrolled more than 20px */
      setupScrollState() {
        if (!this.bar) return;

        if ('IntersectionObserver' in window) {
          this.sentinel = document.createElement('span');
          this.sentinel.className = 'aeo-header-sentinel';
          this.sentinel.setAttribute('aria-hidden', 'true');
          document.body.prepend(this.sentinel);

          this.intersectionObserver = new IntersectionObserver((entries) => {
            const entry = entries[entries.length - 1];
            this.bar.classList.toggle('is-scrolled', !entry.isIntersecting);
          });
          this.intersectionObserver.observe(this.sentinel);
          return;
        }

        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.onScroll();
      }

      onScroll() {
        if (this.scrollTicking) return;
        this.scrollTicking = true;
        requestAnimationFrame(() => {
          this.scrollTicking = false;
          this.bar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
        });
      }

      setupDrawer() {
        if (!this.drawer || !this.toggleButton) return;

        this.toggleButton.addEventListener('click', this.onToggleClick);
        this.closers.forEach((el) => el.addEventListener('click', this.onCloseClick));
        this.drawer.addEventListener('click', this.onDrawerClick);
        window.addEventListener('pageshow', this.onPageShow);
        document.addEventListener('shopify:section:deselect', this.onSectionDeselect);
      }

      onToggleClick() {
        if (this.isOpen) this.close();
        else this.open();
      }

      onCloseClick() {
        this.close();
      }

      open() {
        if (this.isOpen) return;
        this.isOpen = true;

        clearTimeout(this.lowerTimer);
        this.section.classList.add('aeo-menu-is-open');
        this.drawer.removeAttribute('inert');
        this.drawer.classList.add('is-open');
        if (this.overlay) this.overlay.classList.add('is-open');
        this.toggleButton.setAttribute('aria-expanded', 'true');
        this.lockScroll();

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('focusin', this.onFocusIn);

        (this.closeButton || this.drawer).focus({ preventScroll: true });
      }

      close({ returnFocus = true } = {}) {
        if (!this.isOpen) return;
        this.isOpen = false;

        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('focusin', this.onFocusIn);

        this.drawer.classList.remove('is-open');
        if (this.overlay) this.overlay.classList.remove('is-open');
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.unlockScroll();

        if (returnFocus) this.toggleButton.focus({ preventScroll: true });
        else if (this.drawer.contains(document.activeElement)) document.activeElement.blur();
        this.drawer.setAttribute('inert', '');

        /* Keep the section above page content until the slide-out has finished */
        clearTimeout(this.lowerTimer);
        this.lowerTimer = setTimeout(
          () => {
            if (!this.isOpen) this.section.classList.remove('aeo-menu-is-open');
          },
          reduceMotion.matches ? 0 : 450
        );
      }

      lockScroll() {
        const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        document.body.style.setProperty('--aeo-scrollbar-w', `${scrollbar}px`);
        document.body.classList.add('aeo-scroll-lock');
      }

      unlockScroll() {
        document.body.classList.remove('aeo-scroll-lock');
        document.body.style.removeProperty('--aeo-scrollbar-w');
      }

      getFocusable() {
        return Array.from(this.drawer.querySelectorAll(FOCUSABLE)).filter(
          (el) =>
            el.getClientRects().length > 0 &&
            window.getComputedStyle(el).visibility !== 'hidden' &&
            !el.closest('[hidden], [inert]')
        );
      }

      /* Focus trap. Computed on every Tab so hidden pickers and late content are handled. */
      onKeyDown(event) {
        if (event.key !== 'Tab') return;

        const items = this.getFocusable();
        if (!items.length) {
          event.preventDefault();
          this.drawer.focus({ preventScroll: true });
          return;
        }

        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        const inside = this.drawer.contains(active) && active !== this.drawer;

        if (event.shiftKey && (!inside || active === first)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (!inside || active === last)) {
          event.preventDefault();
          first.focus();
        }
      }

      /* Escape on keyup, like Dawn: an open country/language list consumes it first. */
      onKeyUp(event) {
        if (event.key === 'Escape' || event.code === 'Escape') this.close();
      }

      onFocusIn(event) {
        if (!this.drawer.contains(event.target)) (this.closeButton || this.drawer).focus({ preventScroll: true });
      }

      /* Same-page anchors (e.g. "/products/serum#reviews" while on that product): close, then scroll. */
      onDrawerClick(event) {
        const link = event.target.closest('a[href]');
        if (!link || !this.drawer.contains(link)) return;
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        let url;
        try {
          url = new URL(link.href, window.location.href);
        } catch (error) {
          return;
        }

        const here = window.location;
        if (!url.hash || url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search) return;

        event.preventDefault();
        this.close({ returnFocus: false });

        if (here.hash === url.hash) {
          let target = null;
          try {
            target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
          } catch (error) {
            target = null;
          }
          if (target) target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
        } else {
          here.hash = url.hash;
        }
      }

      /* Returning with the back button (bfcache) should never show a stale open drawer. */
      onPageShow(event) {
        if (event.persisted && this.isOpen) this.close({ returnFocus: false });
      }

      onSectionDeselect(event) {
        if (event.detail && event.detail.sectionId === this.dataset.sectionId) this.close({ returnFocus: false });
      }
    }

    customElements.define('aeo-header', AeoHeader);

    /* Anchor the customer account dialog to the bottom of its button (same as Dawn's header).
       The `open` event is composed but does not bubble, so listen during capture. */
    document.addEventListener(
      'open',
      (event) => {
        if (!(event.target instanceof HTMLElement) || !event.target.matches('shopify-account')) return;
        const bottom = Math.max(0, Math.round(event.target.getBoundingClientRect().bottom));
        event.target.style.setProperty('--account-dialog-top', `${bottom}px`);
      },
      true
    );
  }
})();
