/**
 * Site header: hide .navbar.w-nav when scrolling down, show when scrolling up.
 * Styles live in css/min.css (.nav--scroll-hidden).
 * Include before </body> on every page: <script src="/js/nav-scroll-hide.js"></script>
 * (use path relative to site root so it works from /Works/... too)
 */
(() => {
  'use strict';

  const nav = document.querySelector('.navbar.w-nav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 40;
  const TOP_EPS = 8;
  let lastY = window.scrollY || document.documentElement.scrollTop;
  let ticking = false;

  function menuIsOpen() {
    return Boolean(
      nav.querySelector('.w-nav-button.w--open') ||
      nav.querySelector('.w-nav-menu.w--open')
    );
  }

  function update() {
    ticking = false;
    const y = window.scrollY || document.documentElement.scrollTop;

    if (document.body.classList.contains('cs-toc-scrolling')) {
      lastY = y;
      return;
    }

    if (menuIsOpen()) {
      nav.classList.remove('nav--scroll-hidden');
      lastY = y;
      return;
    }

    if (y <= TOP_EPS) {
      nav.classList.remove('nav--scroll-hidden');
    } else if (y > lastY && y > SCROLL_THRESHOLD) {
      nav.classList.add('nav--scroll-hidden');
    } else if (y < lastY) {
      nav.classList.remove('nav--scroll-hidden');
    }

    lastY = y;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();
