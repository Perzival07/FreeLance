import { gsap } from 'gsap';
import { author } from '../data/author.js';
import { prefersReducedMotion, storage, lockScroll } from './utils.js';

const KEY = 'ev-preloaded';
const session = storage('session');

let resolveReady;
/** Resolves when the preloader is done (or immediately when it is skipped). */
export const ready = new Promise((r) => { resolveReady = r; });

/** Ink drop -> fills the screen -> reveals the name -> lifts away. Capped at ~1.5s. */
export function initPreloader() {
  if (prefersReducedMotion() || session.get(KEY)) { resolveReady(); return; }
  session.set(KEY, '1');

  const el = document.createElement('div');
  el.className = 'preloader';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-label', 'Loading');
  el.innerHTML = `<span class="preloader__ink"></span><span class="preloader__name" aria-hidden="true">${author.name}</span>`;
  document.body.append(el);
  lockScroll(true);

  const ink = el.querySelector('.preloader__ink');
  const name = el.querySelector('.preloader__name');
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    el.remove();
    lockScroll(false);
    resolveReady();
  };
  setTimeout(finish, 1800); // failsafe

  gsap.set(ink, { scale: 0, y: '-40vh' });
  gsap.set(name, { yPercent: 40, opacity: 0 });
  gsap.timeline({ onComplete: finish })
    .to(ink, { y: 0, scale: 0.08, duration: 0.3, ease: 'power2.in' })
    .to(ink, { scale: 1, duration: 0.5, ease: 'expo.out' })
    .to(name, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }, '-=0.25')
    .to(el, { yPercent: -100, duration: 0.45, ease: 'expo.inOut' }, '+=0.1');
}
