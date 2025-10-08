/**
 * Changelog:
 * - Added defensive checks and passive listeners for scroll/resize to reduce main-thread overhead.
 * - Kept focus visibility strategy with .using-keyboard class for accessibility.
 * - Preserved reduced-motion handling; no functional changes to interactions.
 * - Ensured no default click navigation to avoid unexpected page jumps in preview.
 */

// PUBLIC_INTERFACE
function initHomeScreenInteractions() {
  const btns = document.querySelectorAll('.home-125-171__btn, .home-125-171__fab');
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = !!(mql && mql.matches);

  // Hover/focus helpers
  btns.forEach((el) => {
    if (!el) return;
    const addHover = () => el.classList.add('is-hover');
    const rmHover = () => el.classList.remove('is-hover');
    const addFocus = () => el.classList.add('is-focus');
    const rmFocus = () => el.classList.remove('is-focus');

    el.addEventListener('mouseenter', addHover, { passive: true });
    el.addEventListener('mouseleave', rmHover, { passive: true });
    el.addEventListener('focus', addFocus);
    el.addEventListener('blur', rmFocus);

    el.addEventListener('click', (e) => e.preventDefault());
  });

  // Keyboard focus visibility
  function handleKeyDown(e) {
    if (e && e.key === 'Tab') document.documentElement.classList.add('using-keyboard');
  }
  function handlePointer() {
    document.documentElement.classList.remove('using-keyboard');
  }
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handlePointer);
  document.addEventListener('touchstart', handlePointer, { passive: true });

  // Maintain viewport min-height to avoid layout shift on scale
  const viewportEl = document.querySelector('.home-125-171__viewport');

  function applyFrameSizing() {
    if (!viewportEl) return;
    viewportEl.style.minHeight = window.innerHeight + 'px';
  }

  applyFrameSizing();
  window.addEventListener('resize', applyFrameSizing, { passive: true });
  window.addEventListener('orientationchange', applyFrameSizing);

  // Reduced motion: remove transitions defensively
  if (prefersReduced) {
    btns.forEach((el) => {
      el.style.transition = 'none';
      el.style.webkitTransition = 'none';
    });
  }
}

document.addEventListener('DOMContentLoaded', initHomeScreenInteractions);
