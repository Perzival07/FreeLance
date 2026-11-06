import { storage } from './utils.js';

/**
 * Hover sounds for the World section only, synthesised with the Web Audio API (no audio files to ship).
 * Interactive elements inside #world answer the cursor with a short sound that fits them:
 *   bell  - map lanterns (a different note each)     wood  - book spines on the shelf
 *   pluck - buttons, chips, pills                    chime - icon buttons (theme, menu)
 *   paper - covers, cards, reading-order entries     tick  - links and form fields
 * Browsers only allow audio after a user gesture, so the context is created on the
 * first click / key press; until then hovering is silent. A mute toggle lives in the header.
 */
const store = storage('local');
const KEY = 'ev-sound';
const VOLUME = 0.5;

let ctx = null;
let master = null;
let noise = null;
let last = 0;
let enabled = store.get(KEY) !== 'off';

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = VOLUME;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp).connect(ctx.destination);
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

/** One enveloped oscillator. */
function tone({ f, to, type = 'sine', gain = 0.06, attack = 0.004, decay = 0.1, delay = 0 }) {
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + decay);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + attack + decay + 0.05);
}

/** A filtered noise burst. */
function hiss({ freq, q = 1, type = 'bandpass', gain = 0.08, attack = 0.01, decay = 0.12 }) {
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  s.connect(f).connect(g).connect(master);
  s.start(t, Math.random() * 0.5, attack + decay + 0.05);
}

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
const jitter = (v, amt = 0.04) => v * (1 + (Math.random() * 2 - 1) * amt);

const SOUNDS = {
  tick: () => tone({ f: jitter(1500), to: 900, type: 'triangle', gain: 0.035, decay: 0.035 }),
  pluck: () => {
    const f = jitter(520, 0.12);
    tone({ f, to: f * 0.96, type: 'triangle', gain: 0.07, decay: 0.16 });
    tone({ f: f * 2, type: 'sine', gain: 0.025, decay: 0.09 });
  },
  chime: () => {
    tone({ f: 784, type: 'sine', gain: 0.05, decay: 0.35 });
    tone({ f: 1176, type: 'sine', gain: 0.03, decay: 0.5, delay: 0.045 });
  },
  wood: () => {
    tone({ f: jitter(150, 0.1), to: 70, type: 'sine', gain: 0.16, decay: 0.14 });
    hiss({ freq: 420, type: 'lowpass', gain: 0.09, decay: 0.05 });
  },
  paper: () => hiss({ freq: jitter(4200, 0.25), q: 0.7, gain: 0.09, attack: 0.025, decay: 0.14 }),
  bell: (el) => {
    const i = el ? [...(el.parentElement?.querySelectorAll('.spot') ?? [])].indexOf(el) : 0;
    const f = PENTATONIC[Math.max(0, i) % PENTATONIC.length];
    tone({ f, type: 'sine', gain: 0.09, decay: 1.1 });
    tone({ f: f * 2.76, type: 'sine', gain: 0.025, decay: 0.45 });
    tone({ f: f * 5.4, type: 'sine', gain: 0.01, decay: 0.2 });
  },
};

// First match wins, so the specific kinds come before the generic ones.
const RULES = [
  ['.spot', 'bell'],
  ['.shelf-slot', 'wood'],
  ['.icon-btn, .menu-btn, .map-tools button, .map-card__nav button, .map-card__x', 'chime'],
  ['.chip, .map-btn, .btn, button, [role="button"], summary', 'pluck'],
  ['.order__item, .cover, .book-card, .journal-card, .event, article, [data-cursor]', 'paper'],
  ['a[href], input, select, textarea, label', 'tick'],
];

// The highest-priority rule that matches the hovered element or one of its ancestors.
function resolve(node) {
  if (!node.closest?.('#world')) return null; // sounds belong to the World section only
  for (const [sel, kind] of RULES) {
    const el = node.closest?.(sel);
    if (el) return { el, kind };
  }
  return null;
}

export const isEnabled = () => enabled;

export function play(kind, el) {
  if (!enabled || !ctx || ctx.state !== 'running' || document.hidden) return;
  SOUNDS[kind]?.(el);
}

function onHover(e) {
  if (!enabled || !ctx || e.pointerType === 'touch') return;
  const hit = resolve(e.target);
  if (!hit) return;
  const { el, kind } = hit;
  if (el.contains(e.relatedTarget) || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
  const now = performance.now();
  if (now - last < 40) return;
  last = now;
  play(kind, el);
}

const ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="snd-w1" d="M16.5 9a4 4 0 0 1 0 6"/><path class="snd-w2" d="M19 6.5a8 8 0 0 1 0 11"/><path class="snd-x" d="M17 9l5 6M22 9l-5 6"/></svg>';

export const SOUND_BUTTON = `<button class="icon-btn sound__btn" type="button" data-sound-toggle aria-pressed="true" aria-label="Hover sounds on">${ICON}</button>`;

export function initSound() {
  const btn = document.querySelector('[data-sound-toggle]');
  const wake = () => {
    if (!enabled) return;
    const c = ensureContext();
    if (c && c.state === 'suspended') c.resume();
  };
  const paint = () => {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(enabled));
    btn.setAttribute('aria-label', enabled ? 'Hover sounds on' : 'Hover sounds off');
    btn.classList.toggle('is-on', enabled);
  };
  // Audio may only start from a gesture; any click, tap or key press unlocks it.
  ['pointerdown', 'keydown', 'touchend'].forEach((ev) => document.addEventListener(ev, wake, { passive: true }));
  document.addEventListener('pointerover', onHover, { passive: true });
  btn?.addEventListener('click', () => {
    enabled = !enabled;
    store.set(KEY, enabled ? 'on' : 'off');
    paint();
    if (enabled) { wake(); setTimeout(() => play('chime'), 30); }
  });
  paint();
}
