import { gsap } from 'gsap';
import { prefersReducedMotion, storage } from './utils.js';

const session = storage('session');
const FLAG = 'ev-wipe';

/**
 * Page transitions between index.html and book.html.
 * Browsers with cross-document View Transitions use the CSS rule in base.css (nothing to do here).
 * Everywhere else we run an ink-wipe overlay: it grows from the click point, the next page loads,
 * and the overlay retracts on arrival.
 */
export function initTransitions() {
  const native = typeof CSSViewTransitionRule !== 'undefined';
  if (native || prefersReducedMotion()) return;

  const makeOverlay = () => {
    const el = document.createElement('div');
    el.className = 'ink-wipe';
    el.setAttribute('aria-hidden', 'true');
    document.body.append(el);
    return el;
  };

  // Arrival: reveal the new page.
  if (session.get(FLAG)) {
    session.set(FLAG, '');
    const el = makeOverlay();
    gsap.set(el, { clipPath: 'circle(150% at 50% 100%)' });
    gsap.to(el, { clipPath: 'circle(0% at 50% 100%)', duration: 0.9, ease: 'expo.inOut', delay: 0.1, onComplete: () => el.remove() });
  }
  addEventListener('pageshow', (e) => { if (e.persisted) document.querySelectorAll('.ink-wipe').forEach((n) => n.remove()); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    const el = makeOverlay();
    const x = `${((e.clientX / innerWidth) * 100).toFixed(1)}%`, y = `${((e.clientY / innerHeight) * 100).toFixed(1)}%`;
    gsap.fromTo(el, { clipPath: `circle(0% at ${x} ${y})` }, {
      clipPath: `circle(150% at ${x} ${y})`, duration: 0.7, ease: 'power3.in',
      onComplete: () => { session.set(FLAG, '1'); location.href = url.href; },
    });
  });
}
