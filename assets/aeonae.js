/*
  AEONAE ambient motion: soft parallax on elements with [data-aeo-parallax].

  data-aeo-parallax="0.05"  -> element drifts against the scroll by 5% of its
                               distance from the viewport center.
  data-aeo-lift="0.08"      -> sets --aeo-py on the element (used by the
                               floating bottle) from window.scrollY, clamped to +/-70px.

  Runs only when <html> has .aeo-ambient, which aeonae-head.liquid adds
  when the theme setting is on and the visitor has not asked for reduced motion.
*/
(function () {
  const root = document.documentElement;
  let parallaxEls = [];
  let liftEls = [];
  let ticking = false;

  function collect() {
    parallaxEls = Array.from(document.querySelectorAll('[data-aeo-parallax]'));
    liftEls = Array.from(document.querySelectorAll('[data-aeo-lift]'));
  }

  function update() {
    ticking = false;
    if (!root.classList.contains('aeo-ambient')) return;
    const vh = window.innerHeight;
    const sy = window.scrollY;

    parallaxEls.forEach((el) => {
      const factor = parseFloat(el.dataset.aeoParallax) || 0;
      const box = (el.parentElement || el).getBoundingClientRect();
      if (box.bottom < -vh || box.top > vh * 2) return;
      const offset = box.top + box.height / 2 - vh / 2;
      el.style.translate = `0 ${(-offset * factor).toFixed(1)}px`;
    });

    liftEls.forEach((el) => {
      const factor = parseFloat(el.dataset.aeoLift) || 0;
      const py = Math.max(-70, Math.min(70, sy * factor));
      el.style.setProperty('--aeo-py', `${py.toFixed(1)}px`);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function init() {
    collect();
    if (!parallaxEls.length && !liftEls.length) return;
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('shopify:section:load', init);
  document.addEventListener('shopify:section:unload', () => requestAnimationFrame(init));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
