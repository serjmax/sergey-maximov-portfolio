const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopViewport = window.matchMedia('(min-width: 761px)');

if (!reducedMotion && desktopViewport.matches) {
  let backgroundTicking = false;

  const updateBackground = () => {
    const shift = Math.min(36, window.scrollY * 0.018);
    document.documentElement.style.setProperty('--background-shift', `${shift}px`);
    backgroundTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (backgroundTicking) return;
    backgroundTicking = true;
    window.requestAnimationFrame(updateBackground);
  }, { passive: true });
}

if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 2, 1) * 90}ms`;
    observer.observe(element);
  });
}
