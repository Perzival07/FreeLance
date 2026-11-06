import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { worldMap, books, series } from '../data/author.js';
import { renderCover } from '../components/cover.js';
import { openBook } from './bookshelf.js';
import { prefersReducedMotion, clamp } from '../core/utils.js';

gsap.registerPlugin(ScrollTrigger);

const rand = (seed) => { const x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); };
const mountain = ([x, y, s = 1]) => `<path d="M${x} ${y}l${14 * s}-${26 * s} ${14 * s} ${26 * s}M${x + 14 * s} ${y - 26 * s}l${5 * s} ${9 * s}-${5 * s}-${3 * s}-${5 * s} ${3 * s}" />`;
const tree = ([x, y]) => `<g><circle cx="${x}" cy="${y - 6}" r="4.2"/><path d="M${x} ${y - 2}v6"/></g>`;
const wave = ([x, y]) => `<path d="M${x} ${y}q5-6 10 0t10 0"/>`;

const forests = [[300, 330, 70, 60, 14], [470, 190, 90, 40, 14], [650, 320, 80, 50, 12], [250, 250, 40, 40, 6]];
const trees = forests.flatMap(([x0, y0, w, h, n], f) => Array.from({ length: n }, (_, i) => [x0 + rand(f * 31 + i) * w, y0 + rand(f * 17 + i * 3) * h]));
const mountains = [[690, 135, 1.1], [722, 150], [752, 128, 1.2], [786, 150], [818, 132, 1], [740, 182], [778, 188, 0.9], [262, 205, 0.9], [288, 220, 0.8]];
const waves = [[40, 80], [90, 40], [330, 40], [540, 30], [760, 50], [940, 90], [960, 400], [940, 560], [800, 640], [600, 650], [250, 640], [60, 600], [50, 330], [60, 200], [230, 580], [520, 620], [700, 610], [980, 250], [30, 450]];

const ROUTE = 'M220 126C262 200 340 222 380 280S520 340 560 392 700 432 760 462 862 382 840 280';

function mapSVG() {
  return `
<svg class="map-svg" viewBox="0 0 1000 700" role="img" aria-label="Illustrated map of the land of Lanternfall" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <mask id="route-mask"><path class="route-reveal" pathLength="1" stroke="#fff" stroke-width="6" d="M220 126C262 200 340 222 380 280S520 340 560 392 700 432 760 462 862 382 840 280"/></mask>
  </defs>
  <rect class="map-sea" width="1000" height="700" stroke="none"/>
  <g class="map-waves" stroke-width="1.1" opacity=".35">${waves.map(wave).join('')}</g>
  <g class="map-land">
    <path class="land-shadow" d="M190 150C230 80 360 70 470 95S650 80 740 110 910 210 905 300 940 440 880 500 700 540 640 560 500 520 430 530 330 450 270 430 170 330 175 260 160 190 190 150Z" stroke-width="9" opacity=".08"/>
    <path class="coast land-fill" pathLength="1" d="M190 150C230 80 360 70 470 95S650 80 740 110 910 210 905 300 940 440 880 500 700 540 640 560 500 520 430 530 330 450 270 430 170 330 175 260 160 190 190 150Z" stroke-width="2"/>
    <path class="coast land-fill" pathLength="1" d="M360 560C380 540 440 545 455 575 465 600 420 620 385 610 355 600 345 575 360 560Z" stroke-width="2"/>
    <path class="coast land-fill" pathLength="1" d="M95 470C110 440 170 440 195 475 210 505 170 540 125 530 90 520 80 490 95 470Z" stroke-width="2"/>
  </g>
  <ellipse class="map-lagoon" cx="372" cy="282" rx="46" ry="26" stroke-width="1.4"/>
  <g class="map-rivers" stroke-width="1.5">
    <path class="river" pathLength="1" d="M800 150C750 215 705 245 692 322S640 420 700 478"/>
    <path class="river" pathLength="1" d="M335 175C362 225 330 258 340 282"/>
    <path class="river" pathLength="1" d="M560 120C590 190 540 260 590 330"/>
  </g>
  <g class="map-peaks" stroke-width="1.5">${mountains.map(mountain).join('')}</g>
  <g class="map-trees" stroke-width="1.1" opacity=".75">${trees.map(tree).join('')}</g>
  <path class="map-route" stroke="var(--accent)" stroke-width="2.4" stroke-dasharray="2 9" mask="url(#route-mask)" d="M220 126C262 200 340 222 380 280S520 340 560 392 700 432 760 462 862 382 840 280"/>
  <path class="map-trail" fill="none" stroke="#ffe3a0" stroke-width="3.4" d="${ROUTE}"/>
  <g class="map-ship" stroke-width="1.3" fill="var(--bg)"><path d="M-9 0h18l-4 7h-10zM0 0v-15l9 11z"/><animateMotion dur="48s" repeatCount="indefinite" rotate="0" path="M260 40C340 62 430 28 520 50S680 28 760 52C680 70 560 40 470 62S320 30 260 40Z"/></g>
  <g class="map-compass" transform="translate(900 610)" stroke-width="1.3">
    <circle r="34"/><circle r="26" opacity=".5"/><path d="M0-48 7-7 48 0 7 7 0 48-7 7-48 0-7-7z"/><text y="-54" text-anchor="middle" fill="currentColor" stroke="none" font-size="14" font-family="var(--font-display)">N</text>
  </g>
  <g class="map-title" fill="currentColor" stroke="none">
    <text x="500" y="52" text-anchor="middle" font-size="40" font-style="italic" font-family="var(--font-display)" letter-spacing="10">LANTERNFALL</text>
    <text x="150" y="395" font-size="15" font-style="italic" font-family="var(--font-display)" opacity=".55" transform="rotate(-6 150 395)">The Sunken Reach</text>
    <text x="705" y="545" font-size="15" font-style="italic" font-family="var(--font-display)" opacity=".55">Glass Marsh</text>
  </g>
</svg>`;
}

const fireflies = Array.from({ length: 16 }, (_, i) => `<i class="fly" aria-hidden="true" style="left:${(8 + rand(i + 3) * 84).toFixed(1)}%;top:${(8 + rand(i * 7 + 1) * 84).toFixed(1)}%;--d:${(7 + rand(i + 9) * 8).toFixed(1)}s;--del:-${(rand(i + 5) * 9).toFixed(1)}s;--dx:${(rand(i + 2) * 60 - 30).toFixed(0)}px;--dy:${(rand(i + 6) * 50 - 25).toFixed(0)}px"></i>`).join('');
const LANTERN = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M12 2a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3zM8 6h8l1.5 12h-11L8 6zm4 3c-1.6 1.7-1.6 3.5 0 4.8 1.6-1.3 1.6-3.1 0-4.8zM7 19h10v2H7z"/></svg>';

function markup() {
  const trilogy = series.order.map((slug) => books.find((b) => b.slug === slug));
  const standalone = books.filter((b) => !b.series);
  return `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow"><span class="section-head__num">04</span> The World</p>
      <h2 class="section-title">Lanternfall, <em>inked.</em></h2>
    </header>
    <div class="world-layout">
      <div class="map" data-zoom="1">
        <div class="map-filters" role="group" aria-label="Show places by book">
          <button class="chip" type="button" data-focus="" aria-pressed="true">All places</button>
          ${[...new Set(worldMap.locations.map((l) => l.book))].map((slug) => `<button class="chip" type="button" data-focus="${slug}" aria-pressed="false">${books.find((b) => b.slug === slug).title}</button>`).join('')}
        </div>
        <div class="map-vp" tabindex="-1">
          <div class="map-canvas">
            ${mapSVG()}
            <div class="map-dark" aria-hidden="true"></div>
            ${fireflies}
            ${worldMap.locations.map((l, i) => `<button class="spot" type="button" style="left:${l.x}%;top:${l.y}%;--i:${i}" data-id="${l.id}" data-book="${l.book}" aria-expanded="false" aria-haspopup="dialog" data-cursor="Look"><span class="spot__in"><span class="spot__ring"></span><span class="spot__core">${LANTERN}</span><span class="spot__name">${l.name}</span></span></button>`).join('')}
            <span class="traveler" aria-hidden="true"><span class="traveler__glow"></span></span>
          </div>
          <div class="map-card" role="dialog" aria-modal="false" aria-labelledby="map-card-title" tabindex="-1" hidden></div>
        </div>
        <div class="map-foot">
          <div class="map-info">
            <p class="map-hint eyebrow">Tap a lantern &middot; drag to explore &middot; &#8984;/Ctrl + scroll to zoom</p>
            <p class="map-count" aria-live="polite"><span class="map-count__bar" aria-hidden="true"><i></i></span><span class="map-count__txt"><b data-found>0</b> / ${worldMap.locations.length} lanterns found</span></p>
          </div>
          <div class="map-actions">
            <button class="map-btn map-btn--go" type="button" data-journey aria-pressed="false"><span aria-hidden="true">&#9654;</span> <span>Walk the route</span></button>
            <button class="map-btn" type="button" data-light aria-pressed="false"><span aria-hidden="true">&#9790;</span> <span>Lantern light</span></button>
            <div class="map-tools" role="group" aria-label="Map zoom">
              <button type="button" data-zoom-in data-g="+" aria-label="Zoom in"></button>
              <button type="button" data-zoom-out data-g="−" aria-label="Zoom out"></button>
              <button type="button" data-zoom-reset data-g="↺" aria-label="Reset map view"></button>
            </div>
          </div>
        </div>
      </div>
      <aside class="order" aria-labelledby="order-title">
        <h3 class="order__title" id="order-title">Where to start?</h3>
        <p class="order__intro">${series.startHere}</p>
        <ol class="order__list">
          <span class="order__line" aria-hidden="true"></span>
          ${trilogy.map((b, i) => `<li class="order__item"><button type="button" data-book="${b.slug}" data-cursor="Open"><span class="order__num">${i + 1}</span><span class="order__cover" aria-hidden="true"></span><span class="order__text"><strong>${b.title}</strong><small>${b.year} &middot; ${b.logline}</small></span></button>${i === 0 ? '<span class="order__stamp" aria-hidden="true">Start here</span>' : ''}</li>`).join('')}
        </ol>
        <p class="eyebrow order__sub">Or read anywhere, standalone</p>
        <ul class="order__alt">
          ${standalone.map((b) => `<li><button type="button" data-book="${b.slug}">${b.title} <span>${b.status === 'upcoming' ? 'coming 2027' : b.year}</span></button></li>`).join('')}
        </ul>
      </aside>
    </div>
  </div>`;
}

function initPanZoom(map) {
  const vp = map.querySelector('.map-vp');
  const canvas = map.querySelector('.map-canvas');
  const st = { k: 1, x: 0, y: 0 };
  const MAX = 3.2;
  const pointers = new Map();
  let pinch = 0;
  let moved = 0;
  let fly = null;

  const apply = () => {
    const w = vp.clientWidth, h = vp.clientHeight;
    st.x = clamp(st.x, w - w * st.k, 0);
    st.y = clamp(st.y, h - h * st.k, 0);
    canvas.style.transform = `translate(${st.x}px,${st.y}px) scale(${st.k})`;
    canvas.style.setProperty('--inv', (1 / st.k).toFixed(3));
    map.dataset.zoom = st.k.toFixed(2);
    vp.style.touchAction = st.k > 1.01 ? 'none' : 'pan-y';
    vp.classList.toggle('is-zoomed', st.k > 1.01);
  };
  const stop = () => { if (fly) { fly.kill(); fly = null; } };
  const centerOf = () => {
    const w = vp.clientWidth, h = vp.clientHeight;
    return [(((w / 2) - st.x) / st.k / w) * 100, (((h / 2) - st.y) / st.k / h) * 100];
  };
  // Centre the view on a point given in % of the map, at zoom k.
  const centerOn = (cx, cy, k = st.k) => {
    const w = vp.clientWidth, h = vp.clientHeight;
    st.k = clamp(k, 1, MAX);
    st.x = w / 2 - (cx / 100) * w * st.k;
    st.y = h / 2 - (cy / 100) * h * st.k;
    apply();
  };
  const flyTo = (k, cx, cy, dur = 1.1, done) => {
    stop();
    if (prefersReducedMotion()) { centerOn(cx, cy, k); if (done) done(); return null; }
    const [x0, y0] = centerOf();
    const p = { k: st.k, cx: x0, cy: y0 };
    fly = gsap.to(p, { k, cx, cy, duration: dur, ease: 'power3.inOut', onUpdate: () => centerOn(p.cx, p.cy, p.k), onComplete: () => { fly = null; if (done) done(); } });
    return fly;
  };
  const toLocal = (clientX, clientY) => {
    const r = vp.getBoundingClientRect();
    return [((clientX - r.left - st.x) / st.k / r.width) * 100, ((clientY - r.top - st.y) / st.k / r.height) * 100];
  };
  const zoomAt = (cx, cy, k) => {
    stop();
    k = clamp(k, 1, MAX);
    const r = k / st.k;
    st.x = cx - (cx - st.x) * r;
    st.y = cy - (cy - st.y) * r;
    st.k = k;
    map.dispatchEvent(new CustomEvent('mapmove'));
    apply();
  };
  const center = () => [vp.clientWidth / 2, vp.clientHeight / 2];
  map.querySelector('[data-zoom-in]').addEventListener('click', () => zoomAt(...center(), st.k * 1.5));
  map.querySelector('[data-zoom-out]').addEventListener('click', () => zoomAt(...center(), st.k / 1.5));
  map.querySelector('[data-zoom-reset]').addEventListener('click', () => { map.dispatchEvent(new CustomEvent('mapmove')); flyTo(1, 50, 50, 0.9); });

  vp.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.map-card')) stop();
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0;
    pinch = pointers.size === 2 ? Math.hypot(...[...pointers.values()].reduce((a, p, i) => (i ? [a[0] - p.x, a[1] - p.y] : [p.x, p.y]), [])) : 0;
  });
  vp.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) { const r = vp.getBoundingClientRect(); zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, st.k * (d / pinch)); }
      pinch = d;
    } else if (st.k > 1.01 && moved > 4) {
      vp.setPointerCapture(e.pointerId);
      st.x += dx; st.y += dy;
      map.dispatchEvent(new CustomEvent('mapmove'));
      apply();
      vp.classList.add('is-dragging');
    }
  });
  const up = (e) => { pointers.delete(e.pointerId); pinch = 0; vp.classList.remove('is-dragging'); };
  vp.addEventListener('pointerup', up);
  vp.addEventListener('pointercancel', up);
  // Ctrl / Cmd + scroll zooms toward the cursor (plain scroll still scrolls the page).
  vp.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const r = vp.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, st.k * Math.exp(-e.deltaY * 0.0025));
  }, { passive: false });
  // Double-click: zoom in on that spot, or back out if already close.
  vp.addEventListener('dblclick', (e) => {
    if (e.target.closest('.spot, .map-card')) return;
    if (st.k > 1.6) { map.dispatchEvent(new CustomEvent('mapmove')); flyTo(1, 50, 50, 0.9); return; }
    const [lx, ly] = toLocal(e.clientX, e.clientY);
    map.dispatchEvent(new CustomEvent('mapmove'));
    flyTo(2.2, lx, ly, 0.9);
  });
  // A drag must not count as a click on a lantern.
  vp.addEventListener('click', (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
  addEventListener('resize', apply);
  apply();
  return { flyTo, centerOn, stop, toLocal, get k() { return st.k; } };
}

function initCard(map, cam) {
  const vp = map.querySelector('.map-vp');
  const card = map.querySelector('.map-card');
  const spots = [...map.querySelectorAll('.spot')];
  const foundEl = map.querySelector('[data-found]');
  const bar = map.querySelector('.map-count__bar i');
  const seen = new Set();
  let openSpot = null;

  function updateCount() {
    foundEl.textContent = seen.size;
    bar.style.transform = `scaleX(${seen.size / spots.length})`;
    if (seen.size === spots.length && !map.classList.contains('is-complete')) {
      map.classList.add('is-complete');
      map.querySelector('.map-count__txt').innerHTML = `<b>${spots.length}</b> / ${spots.length} lanterns found &mdash; the whole of Lanternfall is lit ✦`;
    }
  }
  function close(returnFocus = true) {
    if (!openSpot) return;
    card.hidden = true;
    openSpot.setAttribute('aria-expanded', 'false');
    openSpot.classList.remove('is-open');
    if (returnFocus) openSpot.focus({ preventScroll: true });
    openSpot = null;
  }
  function open(spot) {
    close(false);
    const i = spots.indexOf(spot);
    const loc = worldMap.locations.find((l) => l.id === spot.dataset.id);
    const book = books.find((b) => b.slug === loc.book);
    card.innerHTML = `<button class="map-card__x" type="button" data-g="×" aria-label="Close place card"></button>
      <p class="eyebrow">${book.series ? `${book.series} &middot; Book ${book.number}` : 'Standalone'}</p>
      <h3 class="map-card__title" id="map-card-title">${loc.name}</h3>
      <p>${loc.description}</p>
      <blockquote>${loc.quote}</blockquote>
      <button class="map-card__book" type="button">Appears in <em>${book.title}</em> &rarr;</button>
      <div class="map-card__nav"><button type="button" data-step="-1" aria-label="Previous place">&larr;</button><span>${i + 1} / ${spots.length}</span><button type="button" data-step="1" aria-label="Next place">&rarr;</button></div>`;
    card.hidden = false;
    openSpot = spot;
    spot.setAttribute('aria-expanded', 'true');
    spot.classList.add('is-open', 'is-seen');
    seen.add(spot.dataset.id);
    updateCount();
    place();
    gsap.fromTo(card, { opacity: 0, y: 8, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: prefersReducedMotion() ? 0 : 0.4, ease: 'expo.out' });
    card.focus({ preventScroll: true });
    card.querySelector('.map-card__x').addEventListener('click', () => close());
    card.querySelector('.map-card__book').addEventListener('click', (e) => openBook(book, e.currentTarget, e.currentTarget.getBoundingClientRect()));
    card.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => goTo(spots[(i + Number(b.dataset.step) + spots.length) % spots.length])));
  }
  // Fly the camera to a lantern, then unfold its card.
  function goTo(spot) {
    close(false);
    cam.flyTo(Math.max(cam.k, 1.8), parseFloat(spot.style.left), parseFloat(spot.style.top), 0.9, () => open(spot));
  }
  function place() {
    if (!openSpot) return;
    if (matchMedia('(max-width: 767px)').matches) { card.style.left = card.style.top = ''; return; }
    const v = vp.getBoundingClientRect(), s = openSpot.getBoundingClientRect();
    const cw = card.offsetWidth, ch = card.offsetHeight;
    const cx = s.left - v.left + s.width / 2, cy = s.top - v.top + s.height / 2;
    const left = clamp(cx + 26 + cw > v.width ? cx - cw - 26 : cx + 26, 8, v.width - cw - 8);
    const top = clamp(cy - ch / 2, 8, v.height - ch - 8);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }
  spots.forEach((s) => s.addEventListener('click', () => (openSpot === s ? close() : goTo(s))));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (e.key === 'ArrowRight') card.querySelector('[data-step="1"]')?.click();
    if (e.key === 'ArrowLeft') card.querySelector('[data-step="-1"]')?.click();
  });
  map.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openSpot) close(); });
  document.addEventListener('pointerdown', (e) => { if (openSpot && !e.target.closest('.map-card, .spot')) close(false); });
  map.addEventListener('mapmove', () => close(false));
  addEventListener('resize', place);
  return { open, close, goTo };
}

// Book chips (and the reading-order list) light up that book's places and frame them.
function initFilters(section, map, cam, card) {
  const spots = [...map.querySelectorAll('.spot')];
  const chips = [...map.querySelectorAll('[data-focus]')];
  let locked = '';
  let hover = '';
  const paint = () => {
    const f = hover || locked;
    spots.forEach((s) => s.classList.toggle('is-dim', !!f && s.dataset.book !== f));
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.focus === locked)));
    map.classList.toggle('has-focus', !!f);
  };
  chips.forEach((c) => c.addEventListener('click', () => {
    locked = c.dataset.focus === locked ? '' : c.dataset.focus;
    card.close(false);
    const pts = spots.filter((s) => s.dataset.book === locked).map((s) => [parseFloat(s.style.left), parseFloat(s.style.top)]);
    if (pts.length) {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      cam.flyTo(clamp(Math.min(100 / (x1 - x0 + 30), 100 / (y1 - y0 + 30)), 1, 2.4), (x0 + x1) / 2, (y0 + y1) / 2, 1);
    } else cam.flyTo(1, 50, 50, 0.9);
    paint();
  }));
  section.querySelectorAll('.order [data-book]').forEach((b) => {
    const on = () => { hover = b.dataset.book; paint(); };
    const off = () => { hover = ''; paint(); };
    b.addEventListener('pointerenter', on); b.addEventListener('pointerleave', off);
    b.addEventListener('focus', on); b.addEventListener('blur', off);
  });
  paint();
}

// "Lantern light": the map falls dark and only the cursor's glow reveals it.
function initLight(map, cam) {
  const btn = map.querySelector('[data-light]');
  const vp = map.querySelector('.map-vp');
  const canvas = map.querySelector('.map-canvas');
  btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    map.classList.toggle('is-lit', on);
  });
  vp.addEventListener('pointermove', (e) => {
    if (!map.classList.contains('is-lit') || map.classList.contains('is-walking')) return;
    const [x, y] = cam.toLocal(e.clientX, e.clientY);
    canvas.style.setProperty('--lx', `${x}%`);
    canvas.style.setProperty('--ly', `${y}%`);
  });
}

// "Walk the route": a lantern-bearer follows the road and pauses at every place on it.
function initJourney(map, cam, card) {
  const btn = map.querySelector('[data-journey]');
  if (prefersReducedMotion()) { btn.remove(); return; }
  const canvas = map.querySelector('.map-canvas');
  const path = map.querySelector('.map-trail');
  const traveler = map.querySelector('.traveler');
  const total = path.getTotalLength();
  path.style.strokeDasharray = total;
  path.style.strokeDashoffset = total;

  // Which lanterns sit on the road, and how far along it?
  const samples = Array.from({ length: 700 }, (_, i) => { const l = (i / 699) * total; const p = path.getPointAtLength(l); return { l, x: p.x, y: p.y }; });
  const stops = [...map.querySelectorAll('.spot')].map((el) => {
    const x = parseFloat(el.style.left) * 10, y = parseFloat(el.style.top) * 7;
    const best = samples.reduce((a, s) => { const d = Math.hypot(s.x - x, s.y - y); return d < a.d ? { d, l: s.l } : a; }, { d: Infinity, l: 0 });
    return { el, d: best.d, l: best.l };
  }).filter((s) => s.d < 16).sort((a, b) => a.l - b.l);

  let tl = null;
  const label = btn.querySelector('span:last-child');
  const put = (len) => {
    const p = path.getPointAtLength(len);
    const px = p.x / 10, py = p.y / 7;
    traveler.style.left = `${px}%`; traveler.style.top = `${py}%`;
    path.style.strokeDashoffset = total - len;
    if (map.classList.contains('is-lit')) { canvas.style.setProperty('--lx', `${px}%`); canvas.style.setProperty('--ly', `${py}%`); }
    return [px, py];
  };
  function end() {
    if (tl) { tl.kill(); tl = null; }
    traveler.classList.remove('is-on');
    map.classList.remove('is-walking');
    btn.setAttribute('aria-pressed', 'false');
    label.textContent = 'Walk the route';
    card.close(false);
    gsap.to(path, { strokeDashoffset: total, duration: 0.8 });
    cam.flyTo(1, 50, 50, 1.1);
  }
  function start() {
    card.close(false);
    cam.stop();
    map.classList.add('is-walking');
    btn.setAttribute('aria-pressed', 'true');
    label.textContent = 'Stop walking';
    const prog = { l: 0 };
    const [x0, y0] = put(0);
    traveler.classList.add('is-on');
    tl = gsap.timeline();
    tl.call(() => cam.flyTo(2.1, x0, y0, 1.3));
    tl.to({}, { duration: 1.5 });
    let prev = 0;
    stops.forEach((s) => {
      const dur = clamp(((s.l - prev) / total) * 20, 1.4, 5);
      if (s.l > prev) tl.to(prog, { l: s.l, duration: dur, ease: 'sine.inOut', onUpdate: () => { const [px, py] = put(prog.l); cam.centerOn(px, py, 2.1); } });
      tl.call(() => card.open(s.el));
      tl.to({}, { duration: 3.8 });
      tl.call(() => card.close(false));
      prev = s.l;
    });
    tl.call(end);
  }
  btn.addEventListener('click', () => (tl ? end() : start()));
  // Any manual interaction with the map ends the walk.
  map.querySelector('.map-vp').addEventListener('pointerdown', (e) => { if (tl && !e.target.closest('.map-card')) end(); });
  map.querySelector('.map-tools').addEventListener('click', () => { if (tl) end(); });
}

function initDrawOn(section) {
  const q = (s) => section.querySelectorAll(s);
  const coasts = q('.coast'), rivers = q('.river'), peaks = q('.map-peaks path'), trees = q('.map-trees g'), spots = q('.spot');
  const reveal = section.querySelector('.route-reveal');
  const fills = q('.land-fill');
  const line = section.querySelector('.order__line');
  const items = q('.order__item');
  const stamp = section.querySelector('.order__stamp');

  if (prefersReducedMotion()) { gsap.set(line, { scaleY: 1 }); return; }
  gsap.set([coasts, rivers, reveal], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(fills, { fillOpacity: 0 });
  gsap.set([peaks, trees], { opacity: 0 });
  gsap.set(spots, { scale: 0, opacity: 0 });
  gsap.set(section.querySelector('.map-title'), { opacity: 0 });
  gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
  gsap.set(items, { opacity: 0, x: 20 });
  gsap.set(stamp, { opacity: 0, scale: 1.8, rotate: -22 });

  gsap.timeline({ scrollTrigger: { trigger: section.querySelector('.map'), start: 'top 70%', once: true } })
    .to(coasts, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.25 }, 0)
    .to(fills, { fillOpacity: 1, duration: 1.2 }, 1.4)
    .to(rivers, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut', stagger: 0.2 }, 1.2)
    .to(peaks, { opacity: 1, duration: 0.5, stagger: 0.06 }, 1.5)
    .to(trees, { opacity: 0.75, duration: 0.4, stagger: 0.02 }, 1.7)
    .to(section.querySelector('.map-title'), { opacity: 1, duration: 1 }, 1.6)
    .to(reveal, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, 2)
    .to(spots, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.4)', stagger: 0.12 }, 2.1);

  gsap.timeline({ scrollTrigger: { trigger: section.querySelector('.order'), start: 'top 75%', once: true } })
    .to(line, { scaleY: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
    .to(items, { opacity: 1, x: 0, duration: 0.8, stagger: 0.35, ease: 'expo.out' }, 0.1)
    .to(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 0.5, ease: 'back.out(2.2)' }, 0.8);
}

export function initWorldMap() {
  const section = document.getElementById('world');
  if (!section) return;
  section.classList.add('world');
  section.innerHTML = markup();

  section.querySelectorAll('.order__cover').forEach((el, i) => el.append(renderCover(books.find((b) => b.slug === series.order[i]), { label: false })));
  const map = section.querySelector('.map');
  const cam = initPanZoom(map);
  const card = initCard(map, cam);
  initFilters(section, map, cam, card);
  initLight(map, cam);
  initJourney(map, cam, card);
  section.querySelectorAll('[data-book]').forEach((btn) => btn.addEventListener('click', () => {
    const book = books.find((b) => b.slug === btn.dataset.book);
    openBook(book, btn, btn.getBoundingClientRect());
  }));
  initDrawOn(section);
}
