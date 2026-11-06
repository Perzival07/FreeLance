import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/book3d.css';
import './styles/shell.css';
import './styles/sections/hero.css';
import './styles/sections/featured.css';
import './styles/sections/bookshelf.css';
import './styles/sections/world.css';
import './styles/sections/quiz.css';
import './styles/sections/about.css';
import './styles/sections/praise.css';
import './styles/sections/events.css';
import './styles/sections/journal.css';
import './styles/sections/contact.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTheme, initThemeHint } from './core/theme.js';
import { initShell } from './core/shell.js';
import { initTransitions } from './core/transitions.js';
import { initLantern } from './core/lantern.js';
import { initSmoothScroll, scrollToTarget, refreshScroll } from './core/smooth-scroll.js';
import { initCursor } from './core/cursor.js';
import { initProgress } from './core/progress.js';
import { initPreloader } from './core/preloader.js';
import { initHero } from './sections/hero.js';
import { initFeatured } from './sections/featured.js';
import { initBookshelf } from './sections/bookshelf.js';
import { initWorldMap } from './sections/world-map.js';
import { initQuiz } from './sections/quiz.js';
import { initAbout } from './sections/about.js';
import { initPraise } from './sections/praise.js';
import { initEvents } from './sections/events.js';
import { initJournal } from './sections/journal.js';
import { initNewsletter } from './sections/newsletter.js';
import { initContact } from './sections/presskit-contact.js';

// Reloading should start at the top, not wherever the last visit ended (nav clicks leave a #hash in the URL).
// Links that point at a section on purpose (e.g. /#contact from another page) still land there.
const navType = performance.getEntriesByType?.('navigation')?.[0]?.type;
if (navType !== 'back_forward' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
if (navType === 'reload') {
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  scrollTo(0, 0);
}

initTransitions();
initLantern();
initShell();
initTheme();
initThemeHint();
initSmoothScroll();
initCursor();
initProgress();
initPreloader();
initHero();

// Below-the-fold sections are set up one per idle slot so they never block first paint.
// (Sections are created in document order, so each ScrollTrigger measures a stable layout.)
const SECTIONS = [initFeatured, initBookshelf, initWorldMap, initQuiz, initAbout, initPraise, initEvents, initJournal, initNewsletter, initContact];
const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 250 }) : setTimeout(fn, 16));

function next() {
  const init = SECTIONS.shift();
  if (!init) { done(); return; }
  init();
  idle(next);
}

function done() {
  ScrollTrigger.refresh();
  refreshScroll();
  // The browser tried to scroll to #hash before the section existed; do it now.
  if (location.hash && location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) requestAnimationFrame(() => scrollToTarget(target));
  }
  document.documentElement.classList.add('is-ready');
}
// Images finishing later can change heights; keep triggers and Lenis honest.
addEventListener('load', () => { ScrollTrigger.refresh(); refreshScroll(); });

idle(next);
