import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/book3d.css';
import './styles/shell.css';
import './styles/sections/book-page.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { author, books } from './data/author.js';
import { initTheme, initThemeHint } from './core/theme.js';
import { initShell } from './core/shell.js';
import { initSmoothScroll, scrollToTarget } from './core/smooth-scroll.js';
import { initCursor } from './core/cursor.js';
import { initTransitions } from './core/transitions.js';
import { initLantern } from './core/lantern.js';
import { initPreloader, ready } from './core/preloader.js';
import { createBook3D } from './components/book3d.js';
import { renderCover } from './components/cover.js';
import { splitText } from './core/split-text.js';
import { prefersReducedMotion, storage, formatDate } from './core/utils.js';

gsap.registerPlugin(ScrollTrigger);

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = new URLSearchParams(location.search).get('id');
const index = books.findIndex((b) => b.slug === slug);

if (index < 0) {
  // Unknown or missing id: send people to the themed 404.
  location.replace('/404.html');
} else {
  render(books[index], index);
}

function setMeta(book) {
  document.title = `${book.title} — ${author.name}`;
  const desc = `${book.title}${book.series ? ` (${book.series}, Book ${book.number})` : ''} by ${author.name}. ${book.logline}`;
  const set = (sel, attr, val, create) => {
    let el = document.head.querySelector(sel);
    if (!el && create) { el = document.createElement('meta'); el.setAttribute(create[0], create[1]); document.head.append(el); }
    el?.setAttribute(attr, val);
  };
  set('meta[name="description"]', 'content', desc);
  set('meta[property="og:title"]', 'content', document.title, ['property', 'og:title']);
  set('meta[property="og:description"]', 'content', desc, ['property', 'og:description']);
  set('meta[property="og:type"]', 'content', 'book', ['property', 'og:type']);
  set('meta[name="twitter:card"]', 'content', 'summary_large_image', ['name', 'twitter:card']);
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Book', name: book.title, author: { '@type': 'Person', name: author.name },
    datePublished: book.releaseDate, numberOfPages: book.pages, genre: book.genres, description: book.blurb.split('\n\n')[0],
    ...(book.series ? { isPartOf: { '@type': 'BookSeries', name: book.series }, position: book.number } : {}),
    ...(book.awards.length ? { award: book.awards } : {}),
  });
  document.head.append(ld);
}

function render(book, i) {
  setMeta(book);
  initTransitions();
  initLantern();
  initShell();
  initTheme();
  initThemeHint();
  initSmoothScroll();
  initCursor();
  initPreloader();

  const prev = books[(i - 1 + books.length) % books.length];
  const next = books[(i + 1) % books.length];
  const upcoming = book.status === 'upcoming';
  const words = book.excerpt.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  const others = books.filter((b) => b.slug !== book.slug);
  const facts = [
    ['Pages', book.pages],
    [upcoming ? 'Publication' : 'Published', formatDate(book.releaseDate)],
    ['Series', book.series ? `${book.series}, Book ${book.number}` : 'Standalone'],
    ['Genres', book.genres.join(', ')],
  ];

  document.getElementById('main').innerHTML = `
  <article class="bk">
    <header class="bk-hero container">
      <a class="bk-back" href="/#books" data-cursor="Back">&larr; All books</a>
      <div class="bk-hero__grid">
        <div class="bk-art"></div>
        <div class="bk-info">
          <p class="bk-badge">${book.series ? `${esc(book.series)} &middot; Book ${book.number}` : 'Standalone novel'}${upcoming ? ' &middot; <strong>Coming soon</strong>' : ''}</p>
          <h1 class="bk-title">${esc(book.title)}</h1>
          <p class="bk-logline">${esc(book.logline)}</p>
          <div class="bk-buy">
            ${book.retailers.map((r, n) => `<a class="btn ${n ? 'btn--ghost' : 'btn--primary'}" href="${r.url}" rel="noopener" data-cursor="${upcoming ? 'Pre-order' : 'Buy'}">${upcoming ? 'Pre-order' : 'Buy'} &middot; ${r.name}</a>`).join('')}
          </div>
          <dl class="bk-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(String(v))}</dd></div>`).join('')}</dl>
        </div>
      </div>
    </header>

    <section class="bk-blurb container" aria-labelledby="blurb-h">
      <h2 class="eyebrow" id="blurb-h">About the book</h2>
      <div class="bk-blurb__text">${book.blurb.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    </section>

    <section class="bk-read" id="excerpt" aria-labelledby="read-h">
      <div class="bk-read__bar" role="toolbar" aria-label="Reading options">
        <div class="container bk-read__barin">
          <h2 id="read-h">Read the first chapter</h2>
          <p class="bk-read__time" aria-live="off"><span>${minutes} min read</span> &middot; <span class="bk-read__pct">0%</span></p>
          <div class="bk-read__size">
            <button type="button" data-size="-1" data-g="A−" aria-label="Smaller text"></button>
            <button type="button" data-size="1" data-g="A+" aria-label="Larger text"></button>
          </div>
          <i class="bk-read__progress" aria-hidden="true"></i>
        </div>
      </div>
      <div class="bk-read__col"><div class="bk-text" tabindex="0" aria-label="Chapter excerpt">${book.excerpt.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <p class="bk-read__end">&mdash; The excerpt ends here. ${upcoming ? 'Pre-order to read on.' : 'Buy the book to read on.'}</p>
        <p class="sr-only bk-read__status" role="status" aria-live="polite"></p>
      </div>
    </section>

    <section class="bk-proof container" aria-labelledby="proof-h">
      <h2 class="eyebrow" id="proof-h">What readers and critics say</h2>
      <div class="bk-reviews">${book.reviews.map((r) => `<figure><blockquote>&ldquo;${esc(r.quote)}&rdquo;</blockquote><figcaption>${esc(r.source)}</figcaption></figure>`).join('')}</div>
      ${book.awards.length ? `<ul class="bk-awards" aria-label="Awards">${book.awards.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
    </section>

    <section class="bk-more" aria-labelledby="more-h">
      <div class="container"><h2 class="bk-more__title" id="more-h">More from Elara</h2></div>
      <ul class="bk-more__row">${others.map((b) => `<li><a class="bk-card" href="/book.html?id=${b.slug}" data-cursor="Open"><span class="bk-card__cover"></span><span class="bk-card__t">${esc(b.title)}</span><span class="bk-card__m">${b.series ? `${esc(b.series)} &middot; ${b.number}` : 'Standalone'}</span></a></li>`).join('')}</ul>
      <nav class="bk-pn container" aria-label="Previous and next book">
        <a href="/book.html?id=${prev.slug}" data-cursor="Prev"><span>&larr; Previous</span><strong>${esc(prev.title)}</strong></a>
        <a href="/book.html?id=${next.slug}" data-cursor="Next"><span>Next &rarr;</span><strong>${esc(next.title)}</strong></a>
      </nav>
    </section>
  </article>`;

  const root = document.getElementById('main');
  const reduced = prefersReducedMotion();

  // 3D book
  const b3d = createBook3D(book, { size: 320, rotateY: 24, rotateX: -4, interactive: true, range: 22 });
  root.querySelector('.bk-art').append(b3d.el);
  root.querySelectorAll('.bk-card__cover').forEach((el, n) => el.append(renderCover(others[n], { label: false })));

  // Kinetic title
  const title = root.querySelector('.bk-title');
  const split = splitText(title, { chars: true });
  const intro = [root.querySelector('.bk-back'), root.querySelector('.bk-badge'), root.querySelector('.bk-logline'), ...root.querySelectorAll('.bk-buy .btn'), root.querySelector('.bk-facts')];
  if (!reduced) {
    gsap.set(split.chars, { yPercent: 110, rotateX: -70, opacity: 0, transformOrigin: '50% 100%' });
    gsap.set(intro, { opacity: 0, y: 20 });
    gsap.set(b3d.el, { opacity: 0, y: 80, rotateZ: -4 });
    ready.then(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to(b3d.el, { opacity: 1, y: 0, rotateZ: 0, duration: 1.4 }, 0)
        .to(split.chars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1, stagger: 0.025 }, 0.15)
        .to(intro, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.4);
    });
    // Letters lift as the pointer passes over them.
    split.chars.forEach((c) => c.addEventListener('pointerenter', () => gsap.fromTo(c, { y: 0 }, { y: -12, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' })));
    gsap.from(root.querySelectorAll('.bk-blurb__text p, .bk-reviews figure, .bk-awards li'), { opacity: 0, y: 40, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.bk-blurb', start: 'top 85%', once: true } });
    gsap.from(root.querySelectorAll('.bk-reviews figure'), { opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.bk-reviews', start: 'top 88%', once: true } });
  }

  // Reading column: adjustable size (remembered), progress indicator
  const store = storage('local');
  const SIZES = [0.9, 1, 1.15, 1.3, 1.5];
  let size = Math.min(SIZES.length - 1, Math.max(0, +store.get('ev-read-size') || 1));
  const read = root.querySelector('.bk-read');
  const status = root.querySelector('.bk-read__status');
  const applySize = (announce) => {
    read.style.setProperty('--read-size', SIZES[size]);
    root.querySelector('[data-size="-1"]').disabled = size === 0;
    root.querySelector('[data-size="1"]').disabled = size === SIZES.length - 1;
    if (announce) status.textContent = `Text size ${size + 1} of ${SIZES.length}`;
    ScrollTrigger.refresh();
  };
  root.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => {
    size = Math.min(SIZES.length - 1, Math.max(0, size + +b.dataset.size));
    store.set('ev-read-size', String(size));
    applySize(true);
  }));
  applySize(false);

  const pct = root.querySelector('.bk-read__pct');
  const bar = root.querySelector('.bk-read__progress');
  const col = root.querySelector('.bk-text');
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = col.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    pct.textContent = `${Math.round(p * 100)}%`;
    bar.style.transform = `scaleX(${p})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  // Deep link: /book.html?id=...#excerpt
  if (location.hash === '#excerpt') setTimeout(() => scrollToTarget(read, { offset: 0 }), 600);
}
