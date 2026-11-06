import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journal } from '../data/author.js';
import { openModal } from '../components/modal.js';
import { prefersReducedMotion, isTouch, formatDate } from '../core/utils.js';

gsap.registerPlugin(ScrollTrigger);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function article(post) {
  const el = document.createElement('article');
  el.className = 'article';
  el.innerHTML = `
    <img class="article__img" src="${post.image}" alt="" width="900" height="500" decoding="async" />
    <div class="article__body">
      <p class="eyebrow"><span class="tag">${esc(post.tag)}</span> &middot; <time datetime="${post.date}">${formatDate(post.date)}</time> &middot; ${post.readingTime} min read</p>
      <h2 class="article__title">${esc(post.title)}</h2>
      <p class="article__lede">${esc(post.excerpt)}</p>
      ${post.body.map((p) => `<p>${esc(p)}</p>`).join('')}
      <p class="article__sign">&mdash; Elara</p>
    </div>`;
  return el;
}

export function initJournal() {
  const section = document.getElementById('journal');
  if (!section) return;
  section.classList.add('journalsec');
  section.innerHTML = `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow"><span class="section-head__num">09</span> The Journal</p>
      <h2 class="section-title">Notes from the <em>lamp-room.</em></h2>
    </header>
    <div class="jgrid">
      ${journal.map((p, i) => `
      <article class="jcard jcard--${i + 1}" data-slug="${p.slug}">
        <div class="jcard__img"><img src="${p.image}" alt="" width="800" height="600" loading="lazy" decoding="async" /></div>
        <div class="jcard__body">
          <p class="jcard__meta"><span class="tag">${esc(p.tag)}</span><time datetime="${p.date}">${formatDate(p.date, { day: 'numeric', month: 'short', year: 'numeric' })}</time><span>${p.readingTime} min</span></p>
          <h3 class="jcard__title"><button class="jcard__link" type="button" data-cursor="Read">${esc(p.title)}</button></h3>
          <p class="jcard__excerpt">${esc(p.excerpt)}</p>
          <span class="jcard__more" aria-hidden="true">Read &rarr;</span>
        </div>
      </article>`).join('')}
    </div>
  </div>`;

  const reduced = prefersReducedMotion();
  section.querySelectorAll('.jcard').forEach((card) => {
    const post = journal.find((p) => p.slug === card.dataset.slug);
    const btn = card.querySelector('.jcard__link');
    btn.addEventListener('click', () => {
      openModal({
        content: article(post), label: post.title, trigger: btn, className: 'modal--article',
        onOpen: (m) => { if (!reduced) { gsap.from(m.dialog.firstElementChild, { y: 60, opacity: 0, duration: 0.7, ease: 'expo.out' }); gsap.from(m.root.querySelector('.modal__backdrop'), { opacity: 0, duration: 0.4 }); } },
        animateOut: (done, m) => { if (reduced) return done(); gsap.to(m.dialog.firstElementChild, { y: 30, opacity: 0, duration: 0.3 }); gsap.to(m.root, { opacity: 0, duration: 0.3, onComplete: done }); },
      });
    });
    if (reduced || isTouch()) return;
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });

  if (!reduced) gsap.from(section.querySelectorAll('.jcard'), { opacity: 0, y: 60, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.jgrid', start: 'top 85%', once: true } });
}
