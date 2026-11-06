import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { books, author, series } from '../data/author.js';
import { createBook3D, createSpine } from '../components/book3d.js';
import { renderCover } from '../components/cover.js';
import { openModal } from '../components/modal.js';
import { prefersReducedMotion } from '../core/utils.js';

gsap.registerPlugin(Flip);

const FILTERS = [
  ['all', 'All books', () => true],
  ['trilogy', 'Lanternfall Trilogy', (b) => b.series === 'Lanternfall Trilogy'],
  ['standalone', 'Standalone', (b) => !b.series],
];
const ROMAN = ['', 'I', 'II', 'III'];
const SPINE_SIZE = 300; // cover width of the shelf books
const SPINE_THICK = 54;
const META = (b) => [b.series ? `${b.series} · Book ${b.number}` : 'Standalone', b.status === 'upcoming' ? `Coming ${new Date(b.releaseDate).getFullYear()}` : b.year].join(' · ');
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/* ------------------------------------------------------------------ */
/* The open-book reader                                                */
/* ------------------------------------------------------------------ */

/** An off-screen page with the real reader metrics, used to find out what fits. */
function makeMeasurer() {
  const host = document.createElement('div');
  host.className = 'reader';
  host.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none';
  host.innerHTML = '<div class="reader__book"><div class="reader__spread"><div class="rpage rpage--right"><div class="pg"></div></div></div></div>';
  document.body.append(host);
  const pg = host.querySelector('.pg');
  return {
    fits: (cls, html) => { pg.className = `pg ${cls}`; pg.innerHTML = html; return pg.scrollHeight <= pg.clientHeight + 1; },
    done: () => host.remove(),
  };
}

/** Flow the excerpt over as many pages as it needs, so no page ever has to scroll. */
function paginate(paragraphs, m) {
  const pages = [];
  const queue = paragraphs.slice();
  while (queue.length) {
    const first = pages.length === 0;
    const cls = `pg--text${first ? ' pg--first' : ''}`;
    const head = first ? '<p class="pg__eyebrow">Excerpt</p>' : '';
    const html = [];
    const tryFit = (extra) => m.fits(cls, head + html.join('') + extra);
    while (queue.length) {
      const para = `<p>${esc(queue[0])}</p>`;
      if (tryFit(para)) { html.push(para); queue.shift(); continue; }
      // Split the paragraph at the last word that still fits.
      const words = queue[0].split(' ');
      let lo = 0, hi = words.length - 1;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (tryFit(`<p>${esc(words.slice(0, mid).join(' '))}</p>`)) lo = mid; else hi = mid - 1;
      }
      if (!html.length && lo < 1) lo = 1; // never loop on an empty page
      if (lo > 0) { html.push(`<p>${esc(words.slice(0, lo).join(' '))}</p>`); queue[0] = words.slice(lo).join(' '); }
      break;
    }
    pages.push(html.join(''));
  }
  return pages;
}

function buildSpreads(book) {
  const m = makeMeasurer();
  const pages = paginate(book.excerpt.split('\n\n'), m);
  const [blurb] = book.blurb.split('\n\n');
  const review = (r) => `<blockquote><p>“${esc(r.quote)}”</p><cite>${esc(r.source)}</cite></blockquote>`;
  let showLogline = true;
  const infoHTML = (nReviews, blurbText = blurb) => `<p class="pg__eyebrow">${META(book)}</p><h3 class="pg__title">${esc(book.title)}</h3>${showLogline ? `<p class="pg__logline">${esc(book.logline)}</p>` : ''}${blurbText ? `<p>${esc(blurbText)}</p>` : ''}${nReviews ? `<div class="pg__reviews">${book.reviews.slice(0, nReviews).map(review).join('')}</div>` : ''}`;
  // Show as many reviews as the page can hold.
  let nRev = Math.min(2, book.reviews.length);
  while (nRev > 0 && !m.fits('pg--info', infoHTML(nRev))) nRev--;
  // Still too tall (short screens): trim the blurb to the words that fit.
  let blurbText = blurb;
  if (!m.fits('pg--info', infoHTML(0))) {
    const words = blurb.split(' ');
    let lo = 0, hi = words.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (m.fits('pg--info', infoHTML(0, `${words.slice(0, mid).join(' ')}…`))) lo = mid; else hi = mid - 1;
    }
    blurbText = lo ? `${words.slice(0, lo).join(' ')}…` : '';
    // Tiniest screens: even the tagline has to go.
    if (!lo && !m.fits('pg--info', infoHTML(0, ''))) showLogline = false;
  }
  const buyHTML = (n) => book.retailers.slice(0, n).map((r, i) => `<a class="btn ${i ? 'btn--ghost' : 'btn--primary'} btn--sm" href="${r.url}" rel="noopener">${book.status === 'upcoming' ? 'Pre-order' : 'Buy'} · ${r.name}</a>`).join('');
  const endHTML = (n, title) => `<p class="pg__eyebrow">${book.status === 'upcoming' ? 'Pre-order' : 'Keep reading'}</p>${title ? `<h3 class="pg__title">${esc(book.title)}</h3>` : ''}<div class="pg__buy">${buyHTML(n)}</div><a class="pg__more" href="/book.html?id=${book.slug}">Full details &rarr;</a>`;
  // Fewer buttons / no repeated title until the closing page fits.
  let endN = book.retailers.length, endTitle = true;
  while (!m.fits('pg--end', endHTML(endN, endTitle)) && (endTitle || endN > 1)) { if (endTitle) endTitle = false; else endN--; }
  m.done();
  const text = (i) => `<div class="pg pg--text${i === 0 ? ' pg--first' : ''}">${i === 0 ? '<p class="pg__eyebrow">Excerpt</p>' : ''}${pages[i]}<span class="pg__no">${i + 2}</span></div>`;
  const end = `<div class="pg pg--end">${endHTML(endN, endTitle)}</div>`;
  const closing = '<div class="pg pg--end pg--closing"><p class="pg__eyebrow">End of the excerpt</p><p class="pg__orn" aria-hidden="true">✦</p></div>';

  // Spread 0 is info + the first excerpt page; the book always ends on the "keep reading" page.
  const L = ['', `<div class="pg pg--info">${infoHTML(nRev, blurbText)}</div>`];
  const R = [null, text(0)];
  let i = 1, ended = false;
  while (i < pages.length) {
    L.push(text(i++));
    if (i < pages.length) R.push(text(i++)); else { R.push(end); ended = true; }
  }
  if (!ended) { L.push(closing); R.push(end); }
  return { L, R };
}

const STRIPS = 14;     // the turning leaf is cut into hinged strips so it can bend
const PEEK = 0.07;     // how far a page corner lifts when hovered
const clamp01 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function buildReader(book) {
  const spreads = buildSpreads(book);
  const el = document.createElement('div');
  el.className = 'reader';
  el.innerHTML = `
    <div class="reader__book">
      <div class="reader__spread">
        <div class="rpage rpage--left is-empty"></div>
        <div class="rpage rpage--right rpage--cover"></div>
        <div class="cast-wrap" aria-hidden="true"><i class="cast"></i></div>
        <div class="leaf" hidden aria-hidden="true"></div>
      </div>
    </div>
    <div class="reader__controls">
      <button class="reader__btn" type="button" data-turn="-1">&larr; <span>Back</span></button>
      <span class="reader__count" role="status" aria-live="polite"></span>
      <button class="reader__btn reader__btn--next" type="button" data-turn="1"><span>Open</span> &rarr;</button>
    </div>
    <p class="reader__hint" aria-hidden="true">Drag a page, click it, or lift a corner to turn</p>`;
  const q = (s) => el.querySelector(s);
  const bookEl = q('.reader__book'), spread = q('.reader__spread'), left = q('.rpage--left'), right = q('.rpage--right');
  const leaf = q('.leaf'), cast = q('.cast');
  const prev = q('[data-turn="-1"]'), next = q('[data-turn="1"]'), count = q('.reader__count');
  const reduced = prefersReducedMotion();
  const LAST = spreads.L.length - 2;
  let idx = -1;        // spread currently shown (-1 = closed, cover showing)
  let cur = null;      // the turn in flight: { dir, j, q, tween, committed, drag, peek }
  let queued = 0;      // turns requested while one was in flight (+n forward / -n back)
  let strips = [];

  const coverHTML = () => renderCover(book).outerHTML;
  const rHTML = (i) => (i < 0 ? coverHTML() : spreads.R[i + 1]);
  const lHTML = (i) => (i < 0 ? '' : spreads.L[i + 1]);
  const pageW = () => bookEl.getBoundingClientRect().width / 2;

  function show(i) {
    left.innerHTML = lHTML(i);
    left.classList.toggle('is-empty', i < 0);
    right.innerHTML = rHTML(i);
    right.classList.toggle('rpage--cover', i < 0);
    idx = i;
    prev.disabled = i < 0;
    next.disabled = i >= LAST;
    next.querySelector('span').textContent = i < 0 ? 'Open' : 'Turn page';
    count.textContent = i < 0 ? 'Cover' : `Spread ${i + 1} of ${LAST + 1}`;
    gsap.set(spread, { xPercent: i < 0 ? -25 : 0 });
  }

  /** The leaf: STRIPS thin hinged slices, each carrying its slice of the front and of the back of the page. */
  function buildLeaf(frontHTML, backHTML, frontIsCover) {
    leaf.innerHTML = '';
    strips = [];
    let parent = leaf;
    for (let i = 0; i < STRIPS; i++) {
      const st = document.createElement('div');
      st.className = 'st';
      st.style.width = `calc(var(--pw) / ${STRIPS})`;
      st.innerHTML = `<div class="sf sf--front"><div class="sc${frontIsCover ? ' sc--cover' : ''}" style="left:calc(var(--pw) / ${STRIPS} * ${-i})">${frontHTML}</div><i class="sh"></i></div>`
        + `<div class="sf sf--back"><div class="sc" style="left:calc(var(--pw) / ${STRIPS} * ${-(STRIPS - 1 - i)})">${backHTML}</div><i class="sh"></i></div>`;
      parent.append(st);
      strips.push({ st, shades: st.querySelectorAll('.sh') });
      parent = st;
    }
  }

  /** Shape of the leaf at p (0 = lying on the right, 1 = lying on the left): per-strip hinge angles,
   *  their running totals, and how far from the spine the free edge sits (in page widths, -1..1). */
  function shape(p, hard = false) {
    const amp = Math.sin(Math.PI * p);
    const angles = [], cums = [];
    let prevPhi = 0, edge = 0;
    for (let i = 0; i < STRIPS; i++) {
      // Orientation of strip i: the free edge leads and the spine side lags, so the sheet curls like paper.
      // (0.6 keeps every strip's progress inside 0..1 and monotonic, so the page lies flat at both ends.)
      // A hard cover (hard = true) never bends: every strip shares one angle, so it swings open as a flat board.
      const f = p + (hard ? 0 : 0.6) * amp * ((i + 0.5) / STRIPS - 0.5);
      const phi = -180 * f;
      angles.push(phi - prevPhi);                       // strips are nested, so each one rotates relative to its parent
      cums.push(phi);
      edge += Math.cos((phi * Math.PI) / 180) / STRIPS;
      prevPhi = phi;
    }
    return { amp, angles, cums, edge };
  }
  /** The p whose free edge sits at `edge` (page widths from the spine): the edge follows the pointer exactly. */
  function solveP(edge, hard = false) {
    let lo = 0, hi = 1;
    for (let k = 0; k < 22; k++) { const mid = (lo + hi) / 2; if (shape(mid, hard).edge > edge) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  const shadeOf = (cumDeg) => { const sn = Math.sin((cumDeg * Math.PI) / 180); return 0.5 * sn * sn; };
  const dark = (v) => `rgba(20,10,0,${v.toFixed(3)})`;

  /** Draw the leaf at turn progress t (0 = just started, 1 = landed). */
  function render(t) {
    const p = cur.dir > 0 ? t : 1 - t;
    const { amp, angles, cums, edge } = shape(p, cur.hard);
    const W = pageW();
    const d = cums.map(shadeOf);
    strips.forEach((s, i) => {
      s.st.style.transform = `rotateY(${angles[i]}deg)`;
      // Blend each strip's shade into its neighbours' so the curl reads as one smooth surface.
      const l = dark((d[Math.max(0, i - 1)] + d[i]) / 2), r = dark((d[i] + d[Math.min(STRIPS - 1, i + 1)]) / 2);
      s.shades[0].style.background = `linear-gradient(90deg, ${l}, ${r})`;
      s.shades[1].style.background = `linear-gradient(90deg, ${r}, ${l})`; // back face is mirrored
    });
    // Shadow the leaf throws on the page beneath it.
    const sw = W * 0.45, ex = W * edge;
    cast.classList.toggle('is-left', p >= 0.5);
    cast.style.width = `${sw}px`;
    cast.style.left = `${W + ex - (p >= 0.5 ? sw : 0)}px`;
    cast.style.opacity = (Math.pow(amp, 0.7) * 0.95).toFixed(3);
    // Opening or closing the cover: slide the book between "closed" and "open" positions.
    if (idx < 0 || cur.j < 0) {
      const e = t * t * (3 - 2 * t);
      gsap.set(spread, { xPercent: cur.dir > 0 ? -25 * (1 - e) : -25 * e });
    }
  }

  function clearLeaf() {
    leaf.hidden = true; leaf.innerHTML = ''; strips = [];
    cast.style.opacity = 0;
  }
  function prepare(dir) {
    const j = idx + dir;
    if (j < -1 || j > LAST) return null;
    cancel();
    if (dir > 0) {
      buildLeaf(rHTML(idx), lHTML(j), idx < 0);
      right.innerHTML = rHTML(j); right.classList.remove('rpage--cover');
    } else {
      buildLeaf(rHTML(j), lHTML(idx), j < 0);
      left.innerHTML = lHTML(j); left.classList.toggle('is-empty', j < 0);
    }
    leaf.hidden = false;
    // The front cover is a hard board: only the pages bend.
    const hard = dir > 0 ? idx < 0 : j < 0;
    cur = { dir, j, hard, q: 0, tween: null, committed: false, drag: false, peek: false };
    render(0);
    return cur;
  }
  function cancel() {
    if (!cur) return;
    cur.tween?.kill();
    cur = null;
    clearLeaf();
    show(idx);
  }
  function finish() {
    const { j } = cur;
    cur = null;
    clearLeaf();
    show(j);
    if (queued) { const d = Math.sign(queued); queued -= d; turn(d); }
  }
  function animateTo(target, dur, ease = 'power2.inOut') {
    const c = cur;
    c.tween?.kill();
    c.committed = target === 1;
    c.peek = false;
    c.tween = gsap.to(c, {
      q: target, duration: dur, ease,
      onUpdate: () => render(c.q),
      onComplete: () => { if (target === 1) finish(); else if (target === 0) cancel(); },
    });
  }

  function turn(dir) {
    const j = idx + dir;
    if (j < -1 || j > LAST) return;
    if (reduced) { show(j); return; }
    if (cur) {
      if (cur.drag) return;
      if (cur.committed) {
        // Quick clicks: hurry this turn along and line the rest up behind it.
        queued = Math.sign(queued) === dir ? queued + dir : dir;
        cur.tween.timeScale(2.5);
        return;
      }
      if (cur.dir !== dir) cancel();
    }
    if (!cur && !prepare(dir)) return;
    animateTo(1, 0.4 + 0.85 * (1 - cur.q));
  }

  // ---- A corner lifts when you hover near the outer edge of a page ----
  function peek(dir) {
    if (reduced || (cur && (cur.drag || cur.committed))) return;
    if (!dir) { if (cur?.peek) animateTo(0, 0.3, 'power2.out'); return; }
    if (cur?.peek && cur.dir === dir) return;
    if (cur && cur.dir !== dir) cancel();
    if (!cur && !prepare(dir)) return;
    animateTo(PEEK, 0.35, 'power2.out');
    cur.peek = true;
  }

  // ---- Drag a page: the free edge follows the pointer; a flick or passing halfway completes the turn ----
  let g = null;
  bookEl.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || e.target.closest('a, button, summary, input')) return;
    const r = bookEl.getBoundingClientRect(), w = r.width / 2, rx = e.clientX - (r.left + w);
    let dir;
    if (idx < 0) { if (Math.abs(rx) > w / 2) return; dir = 1; } // closed: only the cover is there
    else dir = rx < 0 ? -1 : 1;
    if (idx + dir < -1 || idx + dir > LAST) return;
    g = { id: e.pointerId, x0: e.clientX, dir, moved: false, t0: performance.now(), samples: [[e.clientX, performance.now()]] };
  });
  bookEl.addEventListener('pointermove', (e) => {
    if (g && e.pointerId === g.id) {
      const dx = e.clientX - g.x0;
      if (!g.moved) {
        if (Math.abs(dx) < 6) return;
        if (dx * g.dir > 0 || (cur && cur.committed)) { g = null; return; }
        if (cur && cur.dir !== g.dir) cancel();
        if (!cur && !prepare(g.dir)) { g = null; return; }
        cur.tween?.kill(); cur.drag = true; cur.peek = false; cur.committed = false;
        g.moved = true;
        try { bookEl.setPointerCapture(e.pointerId); } catch { /* synthetic or ended pointer */ }
        bookEl.classList.add('is-dragging');
      }
      const w = pageW();
      const p = solveP(clamp01(((g.dir > 0 ? w : -w) + dx) / w, -1, 1), cur.hard);
      cur.q = g.dir > 0 ? p : 1 - p;
      render(cur.q);
      const now = performance.now();
      g.samples.push([e.clientX, now]);
      while (g.samples.length > 2 && now - g.samples[0][1] > 90) g.samples.shift();
      return;
    }
    if (e.pointerType !== 'mouse' || g) return;
    const r = bookEl.getBoundingClientRect(), w = r.width / 2, rx = e.clientX - (r.left + w);
    let dir = 0;
    if (idx < 0) { if (rx > w * 0.2 && rx < w * 0.5) dir = 1; }
    else if (rx > w * 0.7) dir = 1;
    else if (rx < -w * 0.7) dir = -1;
    if (dir && idx + dir >= -1 && idx + dir <= LAST) peek(dir); else peek(0);
  });
  const release = (e) => {
    if (!g || e.pointerId !== g.id) return;
    const done = g; g = null;
    bookEl.classList.remove('is-dragging');
    if (!done.moved) { if (e.type === 'pointerup' && performance.now() - done.t0 < 600) turn(done.dir); return; }
    const [x1, t1] = done.samples[0], [x2, t2] = done.samples[done.samples.length - 1];
    // px per ms over the last moments of the drag; a drag that paused before release has no flick.
    const vx = t2 > t1 && performance.now() - t2 < 100 ? (x2 - x1) / (t2 - t1) : 0;
    const toward = -vx * done.dir;                          // > 0 when flicking in the turning direction
    let target = cur.q > 0.5 ? 1 : 0;
    if (toward > 0.5) target = 1; else if (toward < -0.5) target = 0;
    cur.drag = false;
    animateTo(target, 0.25 + 0.75 * Math.abs(target - cur.q), 'power2.out');
  };
  bookEl.addEventListener('pointerup', release);
  bookEl.addEventListener('pointercancel', release);
  bookEl.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !g) peek(0); });

  el.addEventListener('click', (e) => { const b = e.target.closest('[data-turn]'); if (b) turn(+b.dataset.turn); });
  const key = (e) => { if (e.key === 'ArrowRight') turn(1); else if (e.key === 'ArrowLeft') turn(-1); };
  show(-1);
  return { el, turn, key, book: bookEl, isClosed: () => idx < 0 };
}

function buildSheet(book) {
  const el = document.createElement('div');
  el.className = 'sheet';
  const paras = book.excerpt.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('');
  el.innerHTML = `
    <div class="sheet__cover"></div>
    <p class="pg__eyebrow">${META(book)}</p>
    <h3 class="pg__title">${esc(book.title)}</h3>
    <p class="pg__logline">${esc(book.logline)}</p>
    ${book.blurb.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}
    <div class="pg__reviews">${book.reviews.map((r) => `<blockquote><p>“${esc(r.quote)}”</p><cite>${esc(r.source)}</cite></blockquote>`).join('')}</div>
    <h4 class="pg__eyebrow sheet__h">Excerpt</h4>
    <div class="sheet__excerpt">${paras}</div>
    <div class="pg__buy">${book.retailers.map((r, i) => `<a class="btn ${i ? 'btn--ghost' : 'btn--primary'} btn--sm" href="${r.url}" rel="noopener">${book.status === 'upcoming' ? 'Pre-order' : 'Buy'} · ${r.name}</a>`).join('')}</div>
    <a class="pg__more" href="/book.html?id=${book.slug}">Full details &rarr;</a>`;
  el.querySelector('.sheet__cover').append(renderCover(book));
  return el;
}

export function openBook(book, trigger, srcRect) {
  const small = matchMedia('(max-width: 767px)').matches;
  if (small) {
    openModal({ content: buildSheet(book), label: `${book.title}, excerpt and details`, trigger, className: 'modal--sheet' });
    return;
  }
  // Pagination measures real text, so wait for the page fonts first (instant after the first open).
  const fontsReady = () => {
    // Render a sample off-screen so the browser requests exactly the faces the pages use, then wait for them.
    const m = makeMeasurer();
    m.fits('pg--text', '<p class="pg__eyebrow">Excerpt</p><h3 class="pg__title">Aa</h3><p class="pg__logline">Aa</p><p>Aa “quoted” — and… ‘more’</p><cite>Aa</cite>');
    return document.fonts.ready.then(m.done, m.done);
  };
  (document.fonts ? fontsReady() : Promise.resolve()).then(() => showReader(book, trigger, srcRect));
}

function showReader(book, trigger, srcRect) {
  const reader = buildReader(book);
  const reduced = prefersReducedMotion();
  const modal = openModal({
    content: reader.el,
    label: `${book.title}, open book`,
    trigger,
    className: 'modal--reader',
    animateOut(done) {
      if (reduced || !srcRect) return done();
      const to = reader.book.getBoundingClientRect();
      gsap.to(modal.dialog, { opacity: 0, duration: 0.35, ease: 'power2.in' });
      gsap.to(reader.book, { x: srcRect.left + srcRect.width / 2 - (to.left + to.width / 2), y: srcRect.top + srcRect.height / 2 - (to.top + to.height / 2), scale: 0.25, duration: 0.45, ease: 'power3.in', onComplete: done });
    },
  });
  document.addEventListener('keydown', reader.key);
  const origClose = modal.close.bind(modal);
  modal.close = () => { document.removeEventListener('keydown', reader.key); origClose(); };

  if (reduced) { reader.turn(1); reader.el.querySelector('[data-turn="1"]').focus(); return; }
  // Fly in from the shelf, then open the cover.
  const to = reader.book.getBoundingClientRect();
  const dx = srcRect.left + srcRect.width / 2 - (to.left + to.width / 2);
  const dy = srcRect.top + srcRect.height / 2 - (to.top + to.height / 2);
  gsap.fromTo(modal.root.querySelector('.modal__backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.5 });
  gsap.from(reader.book, { x: dx, y: dy, scale: 0.3, rotateY: 60, opacity: 0, duration: 0.9, ease: 'expo.out', onComplete: () => reader.turn(1) });
  gsap.from(reader.el.querySelector('.reader__controls'), { opacity: 0, y: 12, duration: 0.6, delay: 0.7 });
}

/* ------------------------------------------------------------------ */
/* The shelf                                                           */
/* ------------------------------------------------------------------ */

export function initBookshelf() {
  const section = document.getElementById('books');
  if (!section) return;
  section.classList.add('bookshelf');
  section.innerHTML = `
    <div class="container">
      <header class="section-head">
        <p class="eyebrow"><span class="section-head__num">03</span> The Bookshelf</p>
        <h2 class="section-title">Five books, one lantern.</h2>
      </header>
      <div class="shelf-filters" role="group" aria-label="Filter books">
        ${FILTERS.map(([id, label], i) => `<button class="chip" type="button" data-filter="${id}" aria-pressed="${i === 0}">${label}</button>`).join('')}
      </div>
      <div class="shelf-layout">
        <div class="shelf" data-mode="spines"><p class="shelf-hint" role="note"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.4a6 6 0 0 1-4.6-2.1L4 15.5a1.6 1.6 0 0 1 2.4-2L9 15"/></svg><span></span></p><ul class="shelf__row" role="list"></ul><div class="shelf__plank" aria-hidden="true"></div></div>
        <div class="nook" aria-live="polite">
          <p class="eyebrow nook__meta"></p>
          <h3 class="nook__title"></h3>
          <p class="nook__logline"></p>
          <p class="nook__series"></p>
          <div class="nook__actions"><button class="btn btn--primary nook__open" type="button" data-cursor="Open">Open the book</button><a class="btn btn--ghost nook__more">Full details</a></div>
        </div>
      </div>
      <p class="shelf-note eyebrow">${series.startHere}</p>
    </div>`;

  const row = section.querySelector('.shelf__row');
  const shelf = section.querySelector('.shelf');
  const nook = section.querySelector('.nook');
  const reduced = prefersReducedMotion();
  const mq = matchMedia('(max-width: 767px)');
  let slots = [];
  let activeSlug = books[0].slug;
  let filter = 'all';

  function setNook(book) {
    activeSlug = book.slug;
    nook.querySelector('.nook__meta').textContent = META(book);
    nook.querySelector('.nook__title').textContent = book.title;
    nook.querySelector('.nook__logline').textContent = book.logline;
    nook.querySelector('.nook__series').textContent = book.awards[0] ? `✦ ${book.awards[0]}` : '';
    nook.querySelector('.nook__more').href = `/book.html?id=${book.slug}`;
    gsap.fromTo(nook.children, { opacity: 0.2, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', overwrite: true });
  }

  function build() {
    row.innerHTML = '';
    slots = [];
    const covers = mq.matches;
    shelf.dataset.mode = covers ? 'covers' : 'spines';
    books.forEach((book) => {
      const li = document.createElement('li');
      li.className = 'shelf-slot';
      li.dataset.slug = book.slug;
      // The button is an empty overlay (its name is the aria-label); the visuals are an aria-hidden sibling.
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shelf-book';
      btn.setAttribute('aria-label', `${book.title}, ${META(book)}. Open book.`);
      btn.dataset.cursor = 'Open';
      const visual = document.createElement('span');
      visual.className = 'shelf-visual';
      visual.setAttribute('aria-hidden', 'true');
      li.append(visual, btn);

      if (covers) {
        visual.append(renderCover(book, { label: false }));
        const cap = document.createElement('span');
        cap.className = 'shelf-cap';
        cap.textContent = book.title;
        visual.append(cap);
      } else if (reduced) {
        visual.classList.add('shelf-visual--flat');
        li.style.width = `${SPINE_THICK}px`;
        visual.append(createSpine(book, { width: SPINE_THICK, height: SPINE_SIZE * 1.5 }));
      } else {
        const b3d = createBook3D(book, { size: SPINE_SIZE, thickness: SPINE_THICK, rotateY: 90, rotateX: 0, interactive: false });
        const pull = document.createElement('span');
        pull.className = 'shelf-pull';
        pull.append(b3d.el);
        visual.append(pull);
        li.style.width = `${SPINE_THICK}px`;
        li._b3d = b3d;
        li._pull = pull;
      }
      li._book = book;
      li._btn = btn;
      row.append(li);
      slots.push(li);

      btn.addEventListener('click', () => openBook(book, btn, btn.getBoundingClientRect()));
      if (!covers) {
        li.addEventListener('pointerenter', () => activate(li, true));
        li.addEventListener('pointerleave', () => activate(li, false));
        btn.addEventListener('focus', () => activate(li, true));
        btn.addEventListener('blur', () => activate(li, false));
      }
    });
    applyFilter(filter, false);
  }

  function activate(li, on) {
    if (on) {
      slots.forEach((s) => { s.classList.toggle('is-dim', s !== li); s.classList.toggle('is-active', s === li); });
      setNook(li._book);
    } else {
      li.classList.remove('is-active');
      if (!slots.some((s) => s.classList.contains('is-active'))) slots.forEach((s) => s.classList.remove('is-dim'));
    }
    if (li._b3d) {
      // The pulled-out cover is wider than a spine, so slide it sideways to stay inside the case's side panels.
      let dx = 0;
      if (on) {
        const rr = row.getBoundingClientRect(), lr = li.getBoundingClientRect();
        const half = (SPINE_SIZE * 1.04) / 2 + 6, pad = 12 + 8; // 12px side panel + breathing room
        const c = lr.left + lr.width / 2;
        dx = Math.min(Math.max(c, rr.left + pad + half), rr.right - pad - half) - c;
      }
      const target = on ? { y: 24, lift: -34, s: 1.04, x: dx } : { y: 90, lift: 0, s: 1, x: 0 };
      const st = li._tween || (li._tween = { y: 90, lift: 0, s: 1, x: 0 });
      gsap.to(st, { ...target, duration: 0.7, ease: 'expo.out', overwrite: true, onUpdate: () => {
        li._b3d.setRotation(on || st.y < 89 ? -3 : 0, st.y, { snap: true });
        gsap.set(li._pull, { x: st.x, y: st.lift, scale: st.s });
      } });
    }
  }

  function applyFilter(id, animate = true) {
    filter = id;
    const test = FILTERS.find((f) => f[0] === id)[2];
    const state = animate && !reduced ? Flip.getState(slots) : null;
    slots.forEach((s) => s.classList.toggle('is-hidden', !test(s._book)));
    const first = slots.find((s) => !s.classList.contains('is-hidden'));
    if (first && !slots.find((s) => s._book.slug === activeSlug && !s.classList.contains('is-hidden'))) setNook(first._book);
    else if (!animate) setNook(books.find((b) => b.slug === activeSlug));
    if (state) {
      Flip.from(state, {
        duration: 0.8, ease: 'power3.inOut', stagger: 0.05, absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      });
    }
  }

  section.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', () => {
    section.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    applyFilter(chip.dataset.filter);
  }));
  nook.querySelector('.nook__open').addEventListener('click', (e) => {
    const slot = slots.find((s) => s._book.slug === activeSlug) || slots[0];
    openBook(slot._book, e.currentTarget, slot._btn.getBoundingClientRect());
  });
  mq.addEventListener('change', build);
  build();

  // Reminder: when the shelf scrolls into view, nudge people to hover (or tap) a book. Gone after the first try.
  const hint = shelf.querySelector('.shelf-hint');
  const hintText = () => { hint.querySelector('span').textContent = mq.matches ? 'Swipe along, tap a book to open it' : 'Hover over a book to pull it out'; };
  hintText();
  mq.addEventListener('change', hintText);
  let hintDone = false;
  const dismissHint = () => {
    if (hintDone) return;
    hintDone = true;
    hint.classList.remove('is-on');
    clearTimeout(hintTimer);
  };
  let hintTimer = 0;
  shelf.addEventListener('pointerover', (e) => { if (e.target.closest('.shelf-slot')) dismissHint(); });
  shelf.addEventListener('pointerdown', dismissHint);
  shelf.addEventListener('focusin', (e) => { if (e.target.closest('.shelf-slot')) dismissHint(); });
  new IntersectionObserver(([entry], io) => {
    if (!entry.isIntersecting || hintDone) return;
    io.disconnect();
    setTimeout(() => { if (hintDone) return; hint.classList.add('is-on'); hintTimer = setTimeout(dismissHint, 14000); }, 700);
  }, { threshold: 0.6 }).observe(shelf);
}
