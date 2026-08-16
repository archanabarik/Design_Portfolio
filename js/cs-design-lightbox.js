/**
 * Design timeline — thumb strip + in-page lightbox with arrow nav.
 * Supports multiple [data-design-lightbox] galleries on one page.
 */
(function () {
  'use strict';

  var galleries = document.querySelectorAll('[data-design-lightbox]');
  var lightbox = document.getElementById('cs-design-lightbox');
  if (!galleries.length || !lightbox) return;

  // .container sets position/z-index, which traps the lightbox in a stacking
  // context that paints beneath the fixed navbar. Reparent to escape it.
  if (lightbox.parentNode !== document.body) {
    document.body.appendChild(lightbox);
  }

  var imageEl = lightbox.querySelector('.cs-design-lightbox-image');
  var prevBtn = lightbox.querySelector('[data-lightbox-prev]');
  var nextBtn = lightbox.querySelector('[data-lightbox-next]');
  var closeEls = lightbox.querySelectorAll('[data-lightbox-close]');

  var mobileQuery = window.matchMedia('(max-width: 768px)');
  var mobileHintQuery = window.matchMedia('(max-width: 768px)');

  var activeSlides = [];
  var currentIndex = 0;
  var lastActive = null;

  function slideSrc(btn) {
    var mobileSrc = btn.getAttribute('data-full-mobile');
    if (mobileQuery.matches && mobileSrc) return mobileSrc;
    return btn.getAttribute('data-full');
  }

  function slidesFromGallery(gallery) {
    return Array.prototype.slice
      .call(gallery.querySelectorAll('.cs-design-thumb-trigger'))
      .map(function (btn) {
        return {
          btn: btn,
          alt: btn.getAttribute('data-alt') || ''
        };
      });
  }

  function updateNav() {
    prevBtn.hidden = currentIndex === 0;
    nextBtn.hidden = currentIndex === activeSlides.length - 1;
  }

  function showSlide(index) {
    if (index < 0 || index >= activeSlides.length) return;
    currentIndex = index;
    var slide = activeSlides[currentIndex];
    imageEl.src = slideSrc(slide.btn);
    imageEl.alt = slide.alt;
    updateNav();
  }

  function openAt(slides, index, trigger) {
    activeSlides = slides;
    lastActive = trigger || document.activeElement;
    showSlide(index);
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cs-design-lightbox-open');
    lightbox.querySelector('.cs-design-lightbox-close').focus();
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cs-design-lightbox-open');
    imageEl.removeAttribute('src');
    activeSlides = [];

    if (lastActive) {
      var parentGallery = lastActive.closest('[data-design-lightbox]');
      if (parentGallery) {
        parentGallery.classList.remove('is-hint-visible');
      }
      if (typeof lastActive.focus === 'function') {
        lastActive.focus({ preventScroll: true });
      }
    }
  }

  galleries.forEach(function (gallery) {
    var slides = slidesFromGallery(gallery);
    if (!slides.length) return;

    slides.forEach(function (slide) {
      slide.btn.addEventListener('click', function () {
        var index = parseInt(slide.btn.getAttribute('data-index'), 10);
        if (!isNaN(index)) {
          gallery.classList.remove('is-hint-visible');
          openAt(slides, index, slide.btn);
        }
      });
    });

    var hint = gallery.querySelector('.cs-design-thumb-hint');
    var hintShown = false;

    function hideMobileHint() {
      gallery.classList.remove('is-hint-visible');
    }

    function showMobileHintOnce() {
      if (!mobileHintQuery.matches || hintShown || !hint) return;
      hintShown = true;
      gallery.classList.add('is-hint-visible');
      window.setTimeout(hideMobileHint, 2800);
    }

    if (hint && 'IntersectionObserver' in window) {
      var hintObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              showMobileHintOnce();
              hintObserver.disconnect();
            }
          });
        },
        { threshold: 0.45, rootMargin: '0px 0px -8% 0px' }
      );
      hintObserver.observe(gallery);
    }

    gallery.addEventListener('click', hideMobileHint);
  });

  prevBtn.addEventListener('click', function () {
    showSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    showSlide(currentIndex + 1);
  });

  closeEls.forEach(function (el) {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden || !activeSlides.length) return;

    if (e.key === 'Escape') {
      close();
      return;
    }

    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      showSlide(currentIndex - 1);
    }

    if (e.key === 'ArrowRight' && currentIndex < activeSlides.length - 1) {
      e.preventDefault();
      showSlide(currentIndex + 1);
    }
  });
})();
