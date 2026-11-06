import { prefersReducedMotion } from '../core/utils.js';

/**
 * Seamless two-copy marquee. `items` are HTML strings for <li> contents.
 * The first copy is the real (accessible) list; the second is aria-hidden filler for the loop.
 * Speed (px/s) is boosted by scroll velocity; hover/focus or the shared `paused` flag stops it.
 * Returns { el, setPaused, destroy }.
 */
export function createMarquee(items, { direction = 1, speed = 45, label = '' } = {}) {
  const reduced = prefersReducedMotion();
  const el = document.createElement('div');
  el.className = 'marquee';
  el.innerHTML = `<div class="marquee__track"><ul class="marquee__copy" ${label ? `aria-label="${label}"` : ''}>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`;
  const track = el.firstElementChild;
  const first = track.firstElementChild;
  if (reduced) { el.classList.add('is-static'); return { el, setPaused() {}, destroy() {}, start() {} }; }

  let copyW = 0, x = 0, raf = 0, last = 0, hovered = false, paused = false, visible = false, lastScroll = scrollY, vel = 0;

  function fill() {
    // Repeat items until one copy is at least as wide as the viewport, then clone it once for the loop.
    track.querySelectorAll('.marquee__copy[aria-hidden]').forEach((n) => n.remove());
    first.querySelectorAll('[data-dup]').forEach((n) => n.remove());
    let guard = 0;
    while (first.scrollWidth < el.clientWidth * 1.1 && guard++ < 6) items.forEach((i) => {
      const li = document.createElement('li');
      li.dataset.dup = '1'; li.setAttribute('aria-hidden', 'true'); li.innerHTML = i;
      first.append(li);
    });
    const clone = first.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('aria-label');
    clone.querySelectorAll('a, button').forEach((n) => n.setAttribute('tabindex', '-1'));
    track.append(clone);
    copyW = first.getBoundingClientRect().width;
    x = direction > 0 ? x % (copyW || 1) : x;
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    const dy = Math.abs(scrollY - lastScroll);
    lastScroll = scrollY;
    vel += (dy / Math.max(dt, 0.001) - vel) * 0.08; // smoothed px/s
    if (hovered || paused || !copyW) return;
    const boost = 1 + Math.min(vel / 500, 5);
    x -= direction * speed * boost * dt;
    if (x <= -copyW) x += copyW;
    if (x > 0) x -= copyW;
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  }
  const start = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
  io.observe(el);
  const ro = new ResizeObserver(() => { fill(); });
  ro.observe(el);
  el.addEventListener('pointerenter', () => { hovered = true; });
  el.addEventListener('pointerleave', () => { hovered = false; });
  el.addEventListener('focusin', () => { hovered = true; });
  el.addEventListener('focusout', () => { hovered = false; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  if (direction < 0) x = 0;
  fill();
  return { el, setPaused(p) { paused = p; }, start, destroy() { stop(); io.disconnect(); ro.disconnect(); } };
}
