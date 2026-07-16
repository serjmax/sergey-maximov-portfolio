const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopViewport = window.matchMedia('(min-width: 761px)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (!reducedMotion && finePointer.matches) {
  const cursorLight = document.querySelector('.cursor-light');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight * 0.35;
  let lightX = cursorX;
  let lightY = cursorY;
  let trailX1 = cursorX;
  let trailY1 = cursorY;
  let trailX2 = cursorX;
  let trailY2 = cursorY;
  let cursorFrame;
  let previousTime = performance.now();

  const animateCursorLight = (time) => {
    const delta = Math.min(50, time - previousTime);
    previousTime = time;
    const leadEase = 1 - Math.exp(-delta / 300);
    const trailEase1 = 1 - Math.exp(-delta / 620);
    const trailEase2 = 1 - Math.exp(-delta / 1050);

    lightX += (cursorX - lightX) * leadEase;
    lightY += (cursorY - lightY) * leadEase;
    trailX1 += (lightX - trailX1) * trailEase1;
    trailY1 += (lightY - trailY1) * trailEase1;
    trailX2 += (trailX1 - trailX2) * trailEase2;
    trailY2 += (trailY1 - trailY2) * trailEase2;

    cursorLight.style.setProperty('--cursor-x', `${lightX}px`);
    cursorLight.style.setProperty('--cursor-y', `${lightY}px`);
    cursorLight.style.setProperty('--trail-x-1', `${trailX1}px`);
    cursorLight.style.setProperty('--trail-y-1', `${trailY1}px`);
    cursorLight.style.setProperty('--trail-x-2', `${trailX2}px`);
    cursorLight.style.setProperty('--trail-y-2', `${trailY2}px`);

    const stillMoving =
      Math.abs(cursorX - lightX) > 0.25 || Math.abs(cursorY - lightY) > 0.25 ||
      Math.abs(lightX - trailX1) > 0.25 || Math.abs(lightY - trailY1) > 0.25 ||
      Math.abs(trailX1 - trailX2) > 0.25 || Math.abs(trailY1 - trailY2) > 0.25;

    if (stillMoving) {
      cursorFrame = window.requestAnimationFrame(animateCursorLight);
    } else {
      cursorFrame = undefined;
    }
  };

  window.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    document.body.classList.add('has-cursor-light');
    if (!cursorFrame) {
      previousTime = performance.now();
      cursorFrame = window.requestAnimationFrame(animateCursorLight);
    }
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
