import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { author, books } from '../data/author.js';
import { createBook3D } from '../components/book3d.js';
import { prefersReducedMotion, isTouch } from '../core/utils.js';
import { ready } from '../core/preloader.js';

gsap.registerPlugin(ScrollTrigger);

// Three trilogy volumes at different depths (position % of the stage, scale, parallax depth).
const STAGE = [
  { slug: 'the-last-wick', x: 67, y: 2, s: 0.72, depth: 0.4 },
  { slug: 'the-lantern-keeper', x: 23, y: 14, s: 1, depth: 0.8 },
  { slug: 'a-city-of-paper-moths', x: 52, y: 46, s: 0.86, depth: 1.2 },
];
const STAGE_W = 600;
const BASE_SIZE = 240;

/** Ink-bleed reveal: blobby blurred ink resolves to crisp type. */
function inkBleed(name, tl, at) {
  const blur = document.querySelector('#ink-bleed feGaussianBlur');
  const disp = document.querySelector('#ink-bleed feDisplacementMap');
  const state = { blur: 11, disp: 70 };
  const paint = () => { blur.setAttribute('stdDeviation', state.blur); disp.setAttribute('scale', state.disp); };
  paint();
  tl.to(state, { blur: 0, disp: 0, duration: 1.5, ease: 'power3.out', onUpdate: paint, onComplete: () => document.documentElement.classList.remove('intro') }, at);
}

function typeTagline(el, text, tl, at) {
  const typed = el.querySelector('.hero__typed');
  typed.textContent = '';
  const counter = { n: 0 };
  tl.to(counter, {
    n: text.length, duration: text.length * 0.04, ease: 'none',
    onUpdate: () => { typed.textContent = text.slice(0, Math.round(counter.n)); },
  }, at);
}

function buildBooks(stage) {
  const items = STAGE.map((cfg) => {
    const book = books.find((b) => b.slug === cfg.slug);
    const wrap = document.createElement('div');
    wrap.className = 'hero-book';
    wrap.style.left = `${cfg.x}%`;
    wrap.style.top = `${cfg.y}%`;
    wrap.style.setProperty('--s', cfg.s);
    wrap.innerHTML = '<div class="hb-scroll"><div class="hb-pointer"><div class="hb-float"></div></div></div>';
    const b3d = createBook3D(book, { size: BASE_SIZE, rotateY: 24, rotateX: -4, interactive: true, global: true, range: 7 });
    wrap.querySelector('.hb-float').append(b3d.el);
    stage.append(wrap);
    return { cfg, wrap, scroll: wrap.querySelector('.hb-scroll'), pointer: wrap.querySelector('.hb-pointer'), float: wrap.querySelector('.hb-float') };
  });
  const fit = () => stage.style.setProperty('--k', (stage.clientWidth / STAGE_W).toFixed(3));
  fit();
  new ResizeObserver(fit).observe(stage);
  return items;
}

function initInkTrail(hero, canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let last = null, width = 2, raf = 0, idleSince = 0, visible = true, color = '30,26,22';

  const readColor = () => {
    const night = document.documentElement.dataset.theme === 'night';
    color = night ? '232,168,74' : '30,26,22';
  };
  const resize = () => {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); readColor();
  new ResizeObserver(resize).observe(hero);
  addEventListener('themechange', readColor);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible) { cancelAnimationFrame(raf); raf = 0; } }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } });

  const frame = (now) => {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    if (now - idleSince > 2500) { ctx.clearRect(0, 0, w, h); raf = 0; return; }
    raf = requestAnimationFrame(frame);
  };
  const kick = () => { idleSince = performance.now(); if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (y < 0 || y > r.height || x < 0 || x > r.width) { last = null; return; }
    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y);
      width += (Math.min(2 + dist * 0.16, 13) - width) * 0.25;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = `rgba(${color},0.5)`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(x, y); ctx.stroke();
    }
    last = { x, y };
    kick();
  }, { passive: true });
}

export function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const reduced = prefersReducedMotion();
  if (!reduced) document.documentElement.classList.add('intro');
  const name = hero.querySelector('.hero__name');
  const tagline = hero.querySelector('.hero__tagline');
  const stage = hero.querySelector('.hero__books');
  const split = { chars: [...name.querySelectorAll('.split-char')] }; // pre-split at build time (keeps the LCP element stable)
  const items = buildBooks(stage);

  if (reduced) {
    hero.querySelector('.hero__caret').style.display = 'none';
    return;
  }

  // Resting states (set from JS so content is fully visible if scripts fail).
  const eyebrow = hero.querySelector('.hero__eyebrow');
  const ctas = hero.querySelector('.hero__ctas');
  const cue = hero.querySelector('.hero__cue');
  const bg = hero.querySelector('.hero__bg img');
  gsap.set(eyebrow, { y: 16 });
  gsap.set(split.chars, { yPercent: 20 });
  gsap.set(ctas.children, { y: 20 });
  gsap.set(bg, { opacity: 0 });
  gsap.set(items.map((i) => i.wrap), { opacity: 0, y: 70 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  tl.to(bg, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
    .to(eyebrow, { opacity: 1, y: 0, duration: 0.9 }, 0.1)
    .to(split.chars, { yPercent: 0, duration: 0.9, stagger: 0.05 }, 0.2);
  inkBleed(name, tl, 0.2);
  tl.to(tagline, { opacity: 1, duration: 0.2 }, 0.9);
  typeTagline(tagline, author.tagline, tl, 0.9);
  tl.to(ctas.children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.5)
    .to(items.map((i) => i.wrap), { opacity: 1, y: 0, duration: 1.4, stagger: 0.18 }, 0.3)
    .to(cue, { opacity: 1, duration: 0.8 }, 2);
  ready.then(() => tl.play());

  // Floating drift + pointer parallax + scroll parallax, each on its own wrapper.
  const floats = items.map((it, i) => gsap.to(it.float, { y: 12 + i * 5, duration: 3 + i * 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.4 }));
  items.forEach((it) => {
    gsap.to(it.scroll, { y: -140 * it.cfg.depth, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
  });
  gsap.to(hero.querySelector('.hero__inner'), { y: 60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: '30% top', end: 'bottom top', scrub: true } });
  ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: (self) => floats.forEach((f) => (self.isActive ? f.resume() : f.pause())) });

  if (!isTouch()) {
    const movers = items.map((it) => ({ x: gsap.quickTo(it.pointer, 'x', { duration: 1.2, ease: 'power3.out' }), y: gsap.quickTo(it.pointer, 'y', { duration: 1.2, ease: 'power3.out' }), d: it.cfg.depth }));
    addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      movers.forEach((m) => { m.x(-nx * 50 * m.d); m.y(-ny * 36 * m.d); });
    }, { passive: true });
    initInkTrail(hero, hero.querySelector('.hero__ink'));
  }
}
