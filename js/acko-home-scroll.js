/* =====================================================
   ACKO Homepage Case Study — Scroll interactions
   - Fade-in on scroll (IntersectionObserver)
   - Impact bar animation on enter
   - Active sidebar link highlighting
   ===================================================== */

   (function () {
    'use strict';
  
    /* ── Fade-in elements ── */
    var fadeIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('ah-in');
          fadeIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('.ah-fi').forEach(function (el) {
      fadeIo.observe(el);
    });
  
    /* ── Impact bar animation ── */
    var barIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('ah-in');
          barIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });
  
    document.querySelectorAll('.ah-impact-card').forEach(function (el) {
      barIo.observe(el);
    });
  
    /* ── Active sidebar link on scroll ── */
    var sections = Array.from(document.querySelectorAll('.cs-offset-section[id]'));
    var sideLinks = Array.from(document.querySelectorAll('.cs-side-nav'));
  
    if (sections.length && sideLinks.length) {
      var ticking = false;
  
      function updateActive() {
        var scrollPos = window.scrollY + 140;
        var cur = '';
  
        for (var i = 0; i < sections.length; i++) {
          if (scrollPos >= sections[i].offsetTop) {
            cur = sections[i].id;
          }
        }
  
        sideLinks.forEach(function (l) {
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
  
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      updateActive();
  
      /* ── Smooth scroll for sidebar links ── */
      sideLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          var href = link.getAttribute('href') || '';
          if (href.charAt(0) !== '#') return;
  
          var target = document.querySelector(href);
          if (!target) return;
  
          e.preventDefault();
  
          var top = target.getBoundingClientRect().top + window.pageYOffset - 120;
  
          window.scrollTo({
            top: top,
            behavior: 'smooth'
          });
        });
      });
    }
  })();