const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopViewport = window.matchMedia('(min-width: 761px)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (!reducedMotion && finePointer.matches) {
  const cursorLight = document.querySelector('.cursor-light');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight * 0.35;
  let lightX = cursorX;
  let lightY = cursorY;
  let cursorFrame;

  const animateCursorLight = () => {
    lightX += (cursorX - lightX) * 0.14;
    lightY += (cursorY - lightY) * 0.14;
    cursorLight.style.setProperty('--cursor-x', `${lightX}px`);
    cursorLight.style.setProperty('--cursor-y', `${lightY}px`);

    if (Math.abs(cursorX - lightX) > 0.2 || Math.abs(cursorY - lightY) > 0.2) {
      cursorFrame = window.requestAnimationFrame(animateCursorLight);
    } else {
      cursorFrame = undefined;
    }
  };

  window.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    document.body.classList.add('has-cursor-light');
    if (!cursorFrame) cursorFrame = window.requestAnimationFrame(animateCursorLight);
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    document.body.classList.remove('has-cursor-light');
  });
}

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
