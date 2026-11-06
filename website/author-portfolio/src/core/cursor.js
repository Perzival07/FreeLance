import { gsap } from 'gsap';
import { prefersReducedMotion, isTouch } from './utils.js';

const INTERACTIVE = 'a[href], button, [role="button"], summary, label, [data-cursor]';
const TEXT = 'input, textarea, select, [contenteditable]';

export function initCursor() {
  if (prefersReducedMotion() || isTouch()) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.innerHTML = '<span class="cursor-label"></span>';
  const label = ring.firstChild;
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  document.documentElement.classList.add('has-cursor');

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    document.documentElement.classList.add('cursor-active');
    dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
  }, { passive: true });
  document.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-active'));
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));

  document.addEventListener('pointerover', (e) => {
    const t = e.target;
    if (t.closest?.(TEXT)) { ring.dataset.state = 'text'; label.textContent = ''; return; }
    const el = t.closest?.(INTERACTIVE);
    if (!el) { ring.dataset.state = ''; label.textContent = ''; return; }
    const text = el.dataset.cursor || '';
    ring.dataset.state = text ? 'label' : 'hover';
    label.textContent = text;
  });
}
