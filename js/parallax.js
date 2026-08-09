
(() => {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function setupParallax(container) {
    const img = container.querySelector("img");
    if (!img) return;

    let maxShift = 0; // px the image can travel inside the mask

    const measure = () => {
      // Ensure layout is up to date
      const cRect = container.getBoundingClientRect();
      const cH = cRect.height;

      // img height is based on CSS (%). Use rendered height.
      const iRect = img.getBoundingClientRect();
      const iH = iRect.height;

      maxShift = Math.max(0, iH - cH);
    };

    const update = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Progress 0..1 while the container moves through the viewport
      // Start when top hits bottom of viewport, end when bottom hits top.
      const start = vh;
      const end = -rect.height;
      const t = (rect.top - end) / (start - end);
      const progress = clamp(1 - t, 0, 1);

      // Move image up as you scroll down
      const y = -maxShift * progress;
      img.style.transform = `translate3d(0, ${y}px, 0)`;

      rafId = requestAnimationFrame(update);
    };

    let rafId = 0;

    const onResize = () => measure();

    // Wait for image to have dimensions
    if (img.complete) {
      measure();
      rafId = requestAnimationFrame(update);
    } else {
      img.addEventListener("load", () => {
        measure();
        rafId = requestAnimationFrame(update);
      }, { once: true });
    }

    window.addEventListener("resize", onResize, { passive: true });

    // Return a cleanup if you ever need it
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-parallax]").forEach(setupParallax);
  });
})();
