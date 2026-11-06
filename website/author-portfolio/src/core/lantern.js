import { prefersReducedMotion } from './utils.js';

/**
 * Easter egg: type "lantern" anywhere to light a lantern that follows the cursor
 * over a darkened page. Type it again (or press Esc) to put it out.
 */
export function initLantern() {
  const WORD = 'lantern';
  let typed = '';
  let on = false;
  let overlay = null;
  let toast = null;
  let raf = 0;
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const cur = { ...pos };
  const reduced = prefersReducedMotion();

  function frame(t) {
    raf = requestAnimationFrame(frame);
    cur.x += (pos.x - cur.x) * (reduced ? 1 : 0.18);
    cur.y += (pos.y - cur.y) * (reduced ? 1 : 0.18);
    const flicker = reduced ? 0 : Math.sin(t / 130) * 4 + Math.sin(t / 47) * 2;
    overlay.style.setProperty('--lx', `${cur.x.toFixed(1)}px`);
    overlay.style.setProperty('--ly', `${cur.y.toFixed(1)}px`);
    overlay.style.setProperty('--lr', `${(Math.min(innerWidth, 900) * 0.2 + 80 + flicker).toFixed(1)}px`);
  }
  const move = (e) => { pos.x = e.clientX; pos.y = e.clientY; };

  function say(text) {
    toast?.remove();
    toast = document.createElement('div');
    toast.className = 'lantern-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = text;
    document.body.append(toast);
    setTimeout(() => toast?.classList.add('is-gone'), 3200);
    setTimeout(() => { toast?.remove(); toast = null; }, 3800);
  }

  function set(next) {
    on = next;
    document.documentElement.classList.toggle('lantern-mode', on);
    if (on) {
      overlay = document.createElement('div');
      overlay.className = 'lantern-light';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.append(overlay);
      addEventListener('pointermove', move, { passive: true });
      addEventListener('pointerdown', move, { passive: true });
      raf = requestAnimationFrame(frame);
      say('A lantern is lit. Type “lantern” again to put it out.');
    } else {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('pointerdown', move);
      overlay?.remove(); overlay = null;
      say('The lantern is out.');
    }
  }

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && on) { set(false); return; }
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const t = e.target;
    if (t.closest?.('input, textarea, select, [contenteditable="true"]')) { typed = ''; return; }
    typed = (typed + e.key.toLowerCase()).slice(-WORD.length);
    if (typed === WORD) { typed = ''; set(!on); }
  });
  return { toggle: () => set(!on), isOn: () => on };
}
