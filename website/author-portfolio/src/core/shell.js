import { gsap } from 'gsap';
import { author, site } from '../data/author.js';
import { prefersReducedMotion, lockScroll, EMAIL_RE } from './utils.js';
import { scrollToTop, stopScroll, startScroll } from './smooth-scroll.js';
import { SOUND_BUTTON, initSound } from './sound.js';

const NAV = [
  ['Books', '/#books'],
  ['World', '/#world'],
  ['About', '/#about'],
  ['Events', '/#events'],
  ['Journal', '/#journal'],
  ['Contact', '/#contact'],
];

const LAMP = `<svg class="lamp" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <path class="lamp__cone" d="M12.5 13 3 29h26L19.5 13z"/>
  <path d="M10 5h12l3 8H7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <circle class="lamp__bulb" cx="16" cy="11" r="2.2"/>
  <path d="M16 13v14M10 29h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const QUILL = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 3c-7 0-12 4-13 11l-3 7 7-3c7-1 11-6 11-13 0-1 0-2-2-2z"/><path d="M4 21 15 10M9 15h5"/></svg>`;

function headerHTML() {
  const links = NAV.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('');
  return `
  <div class="site-header__bar container">
    <a class="monogram" href="/" aria-label="${author.monogram}, ${author.name} home" data-cursor="Home">${author.monogram}</a>
    <nav class="site-nav" aria-label="Primary"><ul>${links}</ul></nav>
    <div class="site-header__actions">
      <a class="btn btn--primary btn--sm site-header__cta" href="/#featured">Pre-order</a>
      ${SOUND_BUTTON}
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Night mode" aria-pressed="false">${LAMP}</button>
      <button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
        <span class="menu-btn__bars" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <ul class="mobile-menu__list">
      ${NAV.map(([t, h], i) => `<li><a href="${h}"><span class="mobile-menu__num">0${i + 1}</span><span class="mobile-menu__line">${t}</span></a></li>`).join('')}
      <li><a class="mobile-menu__cta" href="/#featured"><span class="mobile-menu__num">✦</span><span class="mobile-menu__line">Pre-order</span></a></li>
    </ul>
    <p class="mobile-menu__foot eyebrow">${author.tagline}</p>
  </div>`;
}

function footerHTML() {
  return `
  <div class="container">
    <p class="footer__signoff">${site.signOff}</p>
    <div class="footer__grid">
      <nav aria-label="Footer"><h2 class="eyebrow">Explore</h2><ul>${NAV.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></nav>
      <div><h2 class="eyebrow">Elsewhere</h2><ul>${author.socials.map((s) => `<li><a href="${s.url}" rel="noopener">${s.name}</a></li>`).join('')}</ul></div>
      <form class="footer__news" novalidate>
        <h2 class="eyebrow"><label for="footer-email">The Lamplighter Letter</label></h2>
        <div class="footer__news-row">
          <input id="footer-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required />
          <button class="btn btn--primary btn--sm" type="submit">Subscribe</button>
        </div>
        <p class="footer__news-msg" role="status" aria-live="polite"></p>
      </form>
    </div>
    <div class="footer__bottom">
      <p>© ${new Date().getFullYear()} ${author.name}. A fictional author; all text original.</p>
      <p>Set in Fraunces &amp; Newsreader, by lantern light.</p>
      <button class="to-top" type="button" aria-label="Back to top" data-cursor="Top">${QUILL}</button>
    </div>
  </div>`;
}

function initFooterForm(footer) {
  const form = footer.querySelector('.footer__news');
  const msg = footer.querySelector('.footer__news-msg');
  const input = form.elements.email;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(input.value.trim())) {
      msg.textContent = 'That email doesn’t look right. Try again?';
      msg.dataset.state = 'error';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    msg.dataset.state = '';
    msg.textContent = 'Sending…';
    setTimeout(() => { msg.textContent = 'Thank you. The first letter is on its way.'; msg.dataset.state = 'ok'; form.reset(); }, 700);
  });
  footer.querySelector('.to-top').addEventListener('click', scrollToTop);
}

function initHeaderBehaviour(header) {
  let last = scrollY;
  let dir = 0;
  let turnY = scrollY; // where the current scroll direction began
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (y !== last) {
      const d = Math.sign(y - last);
      if (d !== dir) { dir = d; turnY = last; }
    }
    const travelled = y - turnY;
    if (y <= 240 || (dir < 0 && -travelled > 12)) header.classList.remove('is-hidden');
    else if (dir > 0 && travelled > 48 && !header.classList.contains('menu-open') && !header.matches(':focus-within')) header.classList.add('is-hidden');
    last = y;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function initMobileMenu(header) {
  const btn = header.querySelector('.menu-btn');
  const menu = header.querySelector('#mobile-menu');
  const focusables = () => [btn, ...menu.querySelectorAll('a[href]')];
  let open = false;

  function set(next) {
    if (next === open) return;
    open = next;
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    lockScroll(open);
    open ? stopScroll() : startScroll();
    const lines = menu.querySelectorAll('li');
    if (open) {
      menu.hidden = false;
      if (prefersReducedMotion()) { menu.querySelector('a').focus(); return; }
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(lines, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07, delay: 0.1 });
      menu.querySelector('a').focus();
    } else {
      const done = () => { menu.hidden = true; };
      if (prefersReducedMotion()) { done(); btn.focus(); return; }
      gsap.to(menu, { opacity: 0, duration: 0.25, onComplete: done });
      btn.focus();
    }
  }

  btn.addEventListener('click', () => set(!open));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); set(false); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

const DEMO_BADGE = `
  <aside class="demo-badge" aria-label="Concept website demo disclaimer">
    <a class="demo-badge__link" href="https://www.linkedin.com/in/koustav-das-037ba22a1/" target="_blank" rel="noopener noreferrer" title="Concept website by Koustav Das · Demo">
      <span class="demo-badge__dot" aria-hidden="true"></span>
      <span class="demo-badge__label"><span class="demo-badge__full">Concept website by </span><span class="demo-badge__short">Concept by </span><strong>Koustav Das</strong></span>
      <span class="demo-badge__pill">Demo</span>
    </a>
  </aside>`;

export function initShell() {
  if (!document.querySelector('.demo-badge')) document.body.insertAdjacentHTML('beforeend', DEMO_BADGE);
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = headerHTML();
    initHeaderBehaviour(header);
    initMobileMenu(header);
    initSound();
  }
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = footerHTML();
    initFooterForm(footer);
  }
}
