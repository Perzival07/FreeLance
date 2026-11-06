import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { praise, awards } from '../data/author.js';
import { createMarquee } from '../components/marquee.js';
import { prefersReducedMotion, isTouch } from '../core/utils.js';

gsap.registerPlugin(ScrollTrigger);

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const quote = (p) => `<figure class="qcard"><blockquote>“${esc(p.quote)}”</blockquote><figcaption>${esc(p.source)}</figcaption></figure>`;

/** Laurel seal: two leafy branches around a centre medallion. */
function seal(a) {
  const leaves = (side) => Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const ang = (100 - t * 170) * (Math.PI / 180); // bottom of the right branch, sweeping up
    const deg = (ang * 180) / Math.PI - 18;
    const x0 = 60 + Math.cos(ang) * 46;
    const cy = 60 + Math.sin(ang) * 46;
    const cx = side > 0 ? x0 : 120 - x0;
    const rot = side > 0 ? deg : -deg;
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="3.2" ry="8" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
  }).join('');
  const status = /shortlist/i.test(a.name) ? 'Shortlist' : 'Winner';
  return `<svg class="seal" viewBox="0 0 120 120" role="img" aria-label="${esc(a.name)}, ${a.year}" fill="none" stroke="currentColor">
    <circle cx="60" cy="60" r="57" stroke-width="1.2"/><circle cx="60" cy="60" r="31" stroke-width=".8" opacity=".6"/>
    <g fill="currentColor" stroke="none" opacity=".85">${leaves(1)}${leaves(-1)}</g>
    <text x="60" y="49" text-anchor="middle" fill="currentColor" stroke="none" font-size="6.2" letter-spacing="1.6" font-family="var(--font-ui)">${status.toUpperCase()}</text>
    <text x="60" y="68" text-anchor="middle" fill="currentColor" stroke="none" font-size="19" font-family="var(--font-display)" font-weight="600">${a.year}</text>
    <path d="M44 76h32" stroke-width=".8" opacity=".6"/>
  </svg>`;
}

function markup() {
  return `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow"><span class="section-head__num">07</span> Praise &amp; awards</p>
      <h2 class="section-title">Kind words, <em>carefully kept.</em></h2>
    </header>
  </div>
  <div class="praise__rows">
    <button class="praise__pause eyebrow" type="button" aria-pressed="false"><span class="praise__pause-ico" aria-hidden="true"></span><span class="praise__pause-txt">Pause scrolling quotes</span></button>
    <div class="praise__row" data-row="0"></div>
    <div class="praise__row" data-row="1"></div>
  </div>
  <div class="container">
    <dl class="stats">
      ${awards.stats.map((s) => `<div class="stat"><dd class="stat__num" data-value="${s.value}" data-suffix="${s.suffix}"><span class="stat__n">${s.value}</span>${s.suffix}</dd><dt class="stat__label">${s.label}</dt></div>`).join('')}
    </dl>
    <ul class="seals" aria-label="Awards">
      ${awards.items.map((a) => `<li class="seal-item"><div class="seal-wrap">${seal(a)}</div><p class="seal-name">${esc(a.name)}</p><p class="seal-book">${esc(a.book)}</p></li>`).join('')}
    </ul>
  </div>`;
}

export function initPraise() {
  const section = document.getElementById('praise');
  if (!section) return;
  section.classList.add('praisesec');
  section.innerHTML = markup();
  const reduced = prefersReducedMotion();

  const rows = [praise.slice(0, 5), praise.slice(5)];
  const marquees = rows.map((r, i) => {
    const m = createMarquee(r.map(quote), { direction: i === 0 ? 1 : -1, speed: i === 0 ? 42 : 34, label: i === 0 ? 'Press praise' : 'More praise' });
    section.querySelector(`[data-row="${i}"]`).append(m.el);
    return m;
  });

  const pause = section.querySelector('.praise__pause');
  if (reduced) pause.hidden = true;
  pause.addEventListener('click', () => {
    const on = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(on));
    pause.querySelector('.praise__pause-txt').textContent = on ? 'Resume scrolling quotes' : 'Pause scrolling quotes';
    marquees.forEach((m) => m.setPaused(on));
  });

  // Counters: count up once.
  section.querySelectorAll('.stat__num').forEach((el) => {
    const n = el.querySelector('.stat__n');
    const end = +el.dataset.value;
    if (reduced) return;
    n.textContent = '0';
    const c = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(c, { v: end, duration: 2, ease: 'power2.out', onUpdate: () => { n.textContent = String(Math.round(c.v)); } }),
    });
  });

  if (reduced) return;
  gsap.from(section.querySelectorAll('.seal-item'), { opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.seals', start: 'top 88%', once: true } });

  // Seals tilt toward the cursor.
  if (!isTouch()) {
    section.querySelectorAll('.seal-wrap').forEach((w) => {
      const svg = w.querySelector('.seal');
      const rx = gsap.quickTo(svg, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(svg, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const rz = gsap.quickTo(svg, 'rotation', { duration: 0.8, ease: 'power3.out' });
      gsap.set(w, { transformPerspective: 600 });
      addEventListener('pointermove', (e) => {
        const r = w.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        ry(dx * 50); rx(-dy * 50); rz(dx * 14);
      }, { passive: true });
    });
  }
}
