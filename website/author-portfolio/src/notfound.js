import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/shell.css';
import './styles/notfound.css';
import { initTheme, setTheme } from './core/theme.js';
import { initShell } from './core/shell.js';
import { initTransitions } from './core/transitions.js';
import { initLantern } from './core/lantern.js';
import { prefersReducedMotion, isTouch, storage } from './core/utils.js';

initTransitions();
initLantern();
initShell();
initTheme();
// The fog looks best at night, unless the visitor has chosen otherwise.
if (!storage('local').get('ev-theme')) setTheme('night', { persist: false, animate: false });

const moth = document.querySelector('.moth');
if (moth && !prefersReducedMotion()) {
  const p = { x: innerWidth * 0.5, y: innerHeight * 0.35 };
  const v = { x: 0, y: 0 };
  const target = { x: p.x, y: p.y };
  let lastMove = 0;
  let heading = 0;

  addEventListener('pointermove', (e) => { target.x = e.clientX; target.y = e.clientY; lastMove = performance.now(); }, { passive: true });
  document.documentElement.classList.add('moth-on');

  const frame = (t) => {
    requestAnimationFrame(frame);
    const idle = isTouch() || t - lastMove > 4000;
    // With no pointer, the moth wanders in a slow figure-eight around the headline.
    const tx = idle ? innerWidth * 0.5 + Math.sin(t / 2300) * innerWidth * 0.28 : target.x + Math.cos(t / 260) * 34;
    const ty = idle ? innerHeight * 0.42 + Math.sin(t / 1500) * innerHeight * 0.18 : target.y + Math.sin(t / 190) * 26;
    v.x += (tx - p.x) * 0.012; v.y += (ty - p.y) * 0.012;
    v.x *= 0.92; v.y *= 0.92;
    p.x += v.x; p.y += v.y;
    const speed = Math.hypot(v.x, v.y);
    if (speed > 0.4) heading += ((Math.atan2(v.y, v.x) * 180) / Math.PI + 90 - heading) * 0.08;
    moth.style.transform = `translate(${p.x - 28}px, ${p.y - 28}px) rotate(${heading * 0.35}deg)`;
  };
  requestAnimationFrame(frame);
}
