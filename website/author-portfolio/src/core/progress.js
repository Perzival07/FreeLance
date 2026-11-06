import { clamp } from './utils.js';

export function initProgress() {
  const sections = [...document.querySelectorAll('main > section[aria-label]')];
  if (!sections.length) return;

  const el = document.createElement('div');
  el.className = 'bookmark';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="bookmark__name"></span><span class="bookmark__ribbon"><i class="bookmark__fill"></i></span>';
  document.body.append(el);
  const fill = el.querySelector('.bookmark__fill');
  const name = el.querySelector('.bookmark__name');
  let current = '';
  let ticking = false;

  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    fill.style.transform = `scaleY(${p})`;
    el.classList.toggle('is-visible', scrollY > 120);
    let active = '';
    for (const s of sections) if (s.getBoundingClientRect().top <= innerHeight * 0.45) active = s.dataset.name || s.getAttribute('aria-label');
    if (active !== current) { current = active; name.textContent = active; }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}
