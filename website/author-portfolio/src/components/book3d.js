import { author } from '../data/author.js';
import { renderCover, renderSpineFace } from './cover.js';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * CSS 3D book.
 * opts: size (width px), rotateX, rotateY (resting angles), interactive,
 *       range (max tilt deg), global (track pointer across the window).
 * Returns { el, setRotation, destroy }.
 */
export function createBook3D(book, { size = 220, rotateX = 0, rotateY = 28, interactive = true, range = 18, global = false, thickness: thicknessOpt } = {}) {
  const flat = reducedMotion();
  const thickness = thicknessOpt || Math.round(size * (0.1 + Math.min(book.pages || 320, 480) / 480 * 0.08));

  const el = document.createElement('div');
  el.className = 'book3d' + (flat ? ' book3d--flat' : '');
  el.style.setProperty('--w', `${size}px`);
  el.style.setProperty('--h', `${Math.round(size * 1.5)}px`);
  el.style.setProperty('--t', `${thickness}px`);

  const inner = document.createElement('div');
  inner.className = 'book3d__inner';

  const face = (cls, child) => {
    const f = document.createElement('div');
    f.className = `book3d__face book3d__${cls}`;
    if (child) f.append(child);
    return f;
  };
  const front = face('front', renderCover(book, { label: false }));
  const spineFace = face('spine', renderSpineFace(book));
  const back = face('back');
  back.style.background = book.cover.palette[0];
  back.innerHTML = `<p class="book3d__blurb">${book.logline || ''}</p><span class="book3d__author">${book.author || author.name}</span>`;
  const pages = face('pages');
  const top = face('top');
  const bottom = face('bottom');
  inner.append(front, spineFace, back, pages, top, bottom);

  const shadow = document.createElement('div');
  shadow.className = 'book3d__shadow';
  el.append(shadow, inner);
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `${book.title} by ${book.author || author.name}`);

  let base = flat ? { x: 0, y: 0 } : { x: rotateX, y: rotateY };
  const cur = { ...base };
  const target = { ...base };
  let raf = 0;

  function apply() {
    inner.style.setProperty('--rx', `${cur.x.toFixed(2)}deg`);
    inner.style.setProperty('--ry', `${cur.y.toFixed(2)}deg`);
    shadow.style.setProperty('--shx', `${(-cur.y * size * 0.004).toFixed(1)}px`);
  }
  function tick() {
    cur.x = lerp(cur.x, target.x, 0.1);
    cur.y = lerp(cur.y, target.y, 0.1);
    apply();
    raf = Math.abs(cur.x - target.x) > 0.05 || Math.abs(cur.y - target.y) > 0.05 ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  function setRotation(x, y, { snap = false } = {}) {
    base = { x, y };
    target.x = x; target.y = y;
    if (snap) { cur.x = x; cur.y = y; apply(); } else kick();
  }

  const cleanups = [];
  if (interactive && !flat) {
    const area = global ? window : el;
    const move = (e) => {
      let nx, ny;
      if (global) { nx = e.clientX / innerWidth - 0.5; ny = e.clientY / innerHeight - 0.5; }
      else { const r = el.getBoundingClientRect(); nx = (e.clientX - r.left) / r.width - 0.5; ny = (e.clientY - r.top) / r.height - 0.5; }
      target.y = base.y + nx * range * 2;
      target.x = base.x - ny * range * 2;
      kick();
    };
    const leave = () => { target.x = base.x; target.y = base.y; kick(); };
    area.addEventListener('pointermove', move);
    area.addEventListener(global ? 'blur' : 'pointerleave', leave);
    cleanups.push(() => { area.removeEventListener('pointermove', move); area.removeEventListener(global ? 'blur' : 'pointerleave', leave); });
  }

  apply();
  return {
    el,
    thickness,
    setRotation,
    destroy() { cancelAnimationFrame(raf); cleanups.forEach((fn) => fn()); el.remove(); },
  };
}

/** Flat spine for the bookshelf. */
export function createSpine(book, { width = 56, height = 300 } = {}) {
  const el = renderSpineFace(book);
  el.style.setProperty('--sw', `${width}px`);
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  return el;
}
