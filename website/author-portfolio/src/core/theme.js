const KEY = 'ev-theme';
const root = document.documentElement;

function read() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function write(v) {
  try { localStorage.setItem(KEY, v); } catch { /* storage unavailable */ }
}

export function getTheme() {
  return root.dataset.theme === 'night' ? 'night' : 'day';
}

export function setTheme(theme, { persist = true, animate = true } = {}) {
  if (animate) {
    root.classList.add('theme-fade');
    setTimeout(() => root.classList.remove('theme-fade'), 600);
  }
  root.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'night' ? '#0F0D0B' : '#F4ECDD';
  if (persist) write(theme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === 'night' ? 'day' : 'night');
}

export function initTheme() {
  const saved = read();
  // Light is the default; only an explicit choice (the lamp) switches to night.
  setTheme(saved === 'night' ? 'night' : 'day', { persist: false, animate: false });
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleTheme();
      btn.setAttribute('aria-pressed', String(getTheme() === 'night'));
    });
    btn.setAttribute('aria-pressed', String(getTheme() === 'night'));
  });
}

/** A small hint under the lamp on every load, while the page is in light mode, until the visitor has used the lamp once. */
export function initThemeHint() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn || getTheme() === 'night') return;
  try { if (localStorage.getItem('ev-theme-hint') === 'done') return; } catch { /* storage unavailable: show it anyway */ }
  const learned = () => { try { localStorage.setItem('ev-theme-hint', 'done'); } catch { /* ignore */ } };
  const wrap = btn.parentElement;
  wrap.classList.add('has-theme-hint');
  const hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'theme-hint';
  hint.setAttribute('role', 'status');
  hint.innerHTML = '<span>Prefer it dark?</span> <strong>Light the lamp</strong>';
  wrap.append(hint);
  const hide = () => { hint.classList.remove('is-on'); btn.classList.remove('is-nudged'); setTimeout(() => hint.remove(), 400); clearTimeout(t1); clearTimeout(t2); };
  const place = () => hint.style.right = `${Math.max(0, wrap.clientWidth - (btn.offsetLeft + btn.offsetWidth / 2) - 26)}px`;
  place();
  const t1 = setTimeout(() => { place(); hint.classList.add('is-on'); btn.classList.add('is-nudged'); }, 2200);
  const t2 = setTimeout(hide, 15000);
  hint.addEventListener('click', () => { learned(); toggleTheme(); btn.setAttribute('aria-pressed', String(getTheme() === 'night')); hide(); });
  btn.addEventListener('click', () => { learned(); hide(); }, { once: true });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); }, { once: true });
}
