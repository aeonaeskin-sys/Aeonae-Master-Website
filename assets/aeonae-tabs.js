/*
  AEONAE tabs: progressive enhancement for <aeo-tabs> (sections/aeonae-tabs.liquid).

  Server markup: every panel visible, the tab list rendered with [hidden].
  This upgrade follows the WAI-ARIA Authoring Practices tabs pattern:
  - role="tablist" / "tab" / "tabpanel", aria-selected, aria-controls, aria-labelledby
  - roving tabindex: only the selected tab is in the Tab order
  - Left/Right arrows move to and select the previous/next tab (wrapping, RTL aware),
    Home/End select the first/last tab; activation is automatic
  - the selected panel is focusable (tabindex="0") so its content is reachable
  It also opens the panel whose id is in the URL hash, and follows block
  selection in the theme editor.
*/
if (!customElements.get('aeo-tabs')) {
  customElements.define(
    'aeo-tabs',
    class AeoTabs extends HTMLElement {
      constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
        this.onBlockSelect = this.onBlockSelect.bind(this);
        this.onHashChange = this.onHashChange.bind(this);
      }

      connectedCallback() {
        this.list = this.querySelector('[data-aeo-tablist]');
        this.tabs = Array.from(this.querySelectorAll('[data-aeo-tab]'));
        this.panels = Array.from(this.querySelectorAll('[data-aeo-panel]'));
        if (!this.list || this.tabs.length < 2 || this.tabs.length !== this.panels.length) return;

        this.list.setAttribute('role', 'tablist');
        if (this.dataset.labelledby && document.getElementById(this.dataset.labelledby)) {
          this.list.setAttribute('aria-labelledby', this.dataset.labelledby);
        }

        this.tabs.forEach((tab, index) => {
          const panel = this.panels[index];
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-controls', panel.id);
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tab.id);
        });

        this.list.hidden = false;
        this.setAttribute('data-enhanced', '');

        this.list.addEventListener('click', this.onClick);
        this.list.addEventListener('keydown', this.onKeydown);
        document.addEventListener('shopify:block:select', this.onBlockSelect);
        window.addEventListener('hashchange', this.onHashChange);

        const fromHash = this.indexFromHash();
        this.select(fromHash > -1 ? fromHash : 0, false);
      }

      disconnectedCallback() {
        if (!this.list) return;
        this.list.removeEventListener('click', this.onClick);
        this.list.removeEventListener('keydown', this.onKeydown);
        document.removeEventListener('shopify:block:select', this.onBlockSelect);
        window.removeEventListener('hashchange', this.onHashChange);
      }

      select(index, moveFocus) {
        this.tabs.forEach((tab, i) => {
          const selected = i === index;
          tab.setAttribute('aria-selected', selected ? 'true' : 'false');
          tab.tabIndex = selected ? 0 : -1;
          const panel = this.panels[i];
          panel.hidden = !selected;
          if (selected) {
            panel.tabIndex = 0;
          } else {
            panel.removeAttribute('tabindex');
          }
        });
        this.selected = index;
        if (moveFocus) this.tabs[index].focus();
      }

      onClick(event) {
        const tab = event.target.closest('[data-aeo-tab]');
        const index = this.tabs.indexOf(tab);
        if (index > -1) this.select(index, true);
      }

      onKeydown(event) {
        const index = this.tabs.indexOf(event.target.closest('[data-aeo-tab]'));
        if (index < 0 || event.altKey || event.ctrlKey || event.metaKey) return;

        const last = this.tabs.length - 1;
        const rtl = getComputedStyle(this).direction === 'rtl';
        const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
        const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';
        let target;

        switch (event.key) {
          case nextKey:
            target = index === last ? 0 : index + 1;
            break;
          case prevKey:
            target = index === 0 ? last : index - 1;
            break;
          case 'Home':
            target = 0;
            break;
          case 'End':
            target = last;
            break;
          default:
            return;
        }

        event.preventDefault();
        this.select(target, true);
      }

      onBlockSelect(event) {
        const index = this.panels.indexOf(event.target);
        if (index > -1) this.select(index, false);
      }

      indexFromHash() {
        let id = '';
        try {
          id = decodeURIComponent(window.location.hash.slice(1));
        } catch (error) {
          return -1;
        }
        if (!id) return -1;
        return this.panels.findIndex((panel) => panel.id === id);
      }

      onHashChange() {
        const index = this.indexFromHash();
        if (index > -1) this.select(index, false);
      }
    }
  );
}
