import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
const HEADER_OFFSET = 72;

export function getLenis() { return lenis; }

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
    history.pushState(null, '', url.hash);
  });
  return lenis;
}

export function scrollToTarget(target, { offset = -HEADER_OFFSET } = {}) {
  // Lenis already honours the CSS scroll-margin-top on sections, so no extra offset here.
  if (lenis) lenis.scrollTo(target, { offset: typeof target === 'number' ? offset : 0, duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    const top = typeof target === 'number' ? target : el.getBoundingClientRect().top + scrollY + offset;
    scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export function scrollToTop() { scrollToTarget(0, { offset: 0 }); }
/** Re-measure the page after content was added (Lenis caches the scroll limit). */
export function refreshScroll() { lenis?.resize(); }
export function stopScroll() { lenis?.stop(); }
export function startScroll() { lenis?.start(); }
