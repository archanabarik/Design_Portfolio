/**
 * Case study / About TOC:
 * - Short custom smooth scroll (rAF, ~280ms) starts on the next frame — avoids browser
 *   smooth-scroll “dead air” before movement when html { scroll-behavior: smooth }.
 * - prefers-reduced-motion: instant jump.
 * - Scroll spy for .active on TOC links.
 * - body.cs-toc-scrolling during TOC scroll so nav-scroll-hide.js doesn’t toggle the header mid-animation.
 */
(function () {
  'use strict';

  var tocLinks = document.querySelectorAll('a.cs-side-nav[href^="#"]');
  if (!tocLinks.length) return;

  var DURATION_MS = 280;

  function idsFromToc() {
    var ids = [];
    tocLinks.forEach(function (l) {
      var h = l.getAttribute('href');
      if (h && h.charAt(0) === '#') ids.push(h.slice(1));
    });
    return ids;
  }

  function getTocSections() {
    var main = document.querySelector('.about-right-col') || document.querySelector('.cs-case-main');
    if (!main) return [];
    var want = new Set(idsFromToc());
    var nodes = main.querySelectorAll('[id]');
    var arr = [];
    nodes.forEach(function (n) {
      if (want.has(n.id)) arr.push(n);
    });
    arr.sort(function (a, b) {
      return a.offsetTop - b.offsetTop;
    });
    return arr;
  }

  var sections = getTocSections();

  function scrollMarginTopPx(el) {
    if (!el) return 0;
    var n = parseFloat(getComputedStyle(el).scrollMarginTop);
    return isNaN(n) ? 0 : n;
  }

  function clampScrollY(y) {
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(y, max));
  }

  function targetScrollY(el) {
    var rect = el.getBoundingClientRect();
    var sm = scrollMarginTopPx(el);
    return clampScrollY(window.scrollY + rect.top - sm);
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  var ticking = false;
  function updateActive() {
    var scrollPos = window.scrollY + 140;
    var cur = '';
    for (var i = 0; i < sections.length; i++) {
      if (scrollPos >= sections[i].offsetTop) {
        cur = sections[i].id;
      }
    }
    tocLinks.forEach(function (l) {
      var href = l.getAttribute('href') || '';
      l.classList.toggle('active', href === '#' + cur);
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateActive);
      ticking = true;
    }
  }

  if (sections.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', updateActive);
    updateActive();
  }

  function runTocScroll(toY, done) {
    document.body.classList.add('cs-toc-scrolling');

    if (prefersReducedMotion()) {
      window.scrollTo(0, toY);
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(done);
      });
      return;
    }

    var startY = window.scrollY;
    var delta = toY - startY;
    if (Math.abs(delta) < 0.5) {
      window.requestAnimationFrame(done);
      return;
    }

    var t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var u = Math.min(1, (now - t0) / DURATION_MS);
      var y = startY + delta * easeOutCubic(u);
      window.scrollTo(0, y);
      if (u < 1) {
        requestAnimationFrame(step);
      } else {
        done();
      }
    }
    requestAnimationFrame(step);
  }

  tocLinks.forEach(function (link) {
    link.addEventListener(
      'click',
      function (e) {
        var href = link.getAttribute('href') || '';
        if (href.charAt(0) !== '#') return;
        var target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', href);
        }

        var toY = targetScrollY(target);

        runTocScroll(toY, function () {
          document.body.classList.remove('cs-toc-scrolling');
          updateActive();
        });
      },
      { passive: false }
    );
  });
})();
