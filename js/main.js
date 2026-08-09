// Archana Kumari Portfolio - Custom JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('.frosty-menu');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function() {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close menu when clicking on a link
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 991) {
          menu.style.display = 'none';
        }
      });
    });
  }

  // Dropdown functionality
  const dropdowns = document.querySelectorAll('.w-dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.w-dropdown-toggle');
    const list = dropdown.querySelector('.dropdown-list');

    if (toggle && list) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          list.style.display = 'none';
        }
      });
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Confetti effect for party popper emoji
  const partyPopperElement = document.querySelector('.emoji-party-popper');

  if (partyPopperElement && typeof confetti !== 'undefined') {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
    };

    function shoot(x, y) {
      const colors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];
      const shapes = ["circle", "square"];

      confetti({
        ...defaults,
        particleCount: 30,
        scalar: 1.2,
        shapes,
        colors,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      });
    }

    partyPopperElement.addEventListener('click', (event) => {
      const { clientX, clientY } = event;
      shoot(clientX, clientY);
      setTimeout(() => shoot(clientX, clientY), 100);
      setTimeout(() => shoot(clientX, clientY), 200);
    });
  }

  // Initialize CircleType if available
  if (typeof CircleType !== 'undefined') {
    const circleText = document.getElementById('circletext');
    if (circleText) {
      new CircleType(circleText);
    }
  }

  // Add scroll effect to navbar
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }

      lastScroll = currentScroll;
    });
  }

  // Lazy load images
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
});

// Google Fonts loader fallback
if (typeof WebFont === 'undefined') {
  // Fallback to system fonts if WebFont fails to load
  document.documentElement.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
}
