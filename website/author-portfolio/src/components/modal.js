import { lockScroll } from '../core/utils.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
const CLOSE_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>';

let current = null;

/**
 * Accessible modal: focus trap, Esc, backdrop click, scroll lock, focus restore.
 * opts: content (Element), label, trigger (element to refocus), className,
 *       onOpen(api), animateOut(done, api) — call done() when the exit animation ends, onClose().
 */
export function openModal({ content, label, trigger, className = '', onOpen, animateOut, onClose }) {
  if (current) return current;
  const root = document.createElement('div');
  root.className = `modal ${className}`.trim();
  root.innerHTML = `<div class="modal__backdrop" data-close></div>
    <div class="modal__dialog" role="dialog" aria-modal="true" aria-label="${label}" tabindex="-1">
      <button class="modal__close" type="button" aria-label="Close" data-close data-cursor="Close">${CLOSE_ICON}</button>
    </div>`;
  const dialog = root.querySelector('.modal__dialog');
  dialog.append(content);
  document.body.append(root);

  const background = ['site-header', 'main', 'site-footer'].map((id) => document.getElementById(id)).filter(Boolean);
  background.forEach((el) => el.setAttribute('inert', ''));
  lockScroll(true);
  stopScroll();
  const returnTo = trigger || document.activeElement;
  let closing = false;

  const api = {
    root, dialog,
    close() {
      if (closing) return;
      closing = true;
      const finish = () => {
        document.removeEventListener('keydown', onKey, true);
        root.remove();
        background.forEach((el) => el.removeAttribute('inert'));
        lockScroll(false);
        startScroll();
        current = null;
        returnTo?.focus?.({ preventScroll: true });
        onClose?.();
      };
      if (animateOut) animateOut(finish, api); else finish();
    },
  };

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); api.close(); return; }
    if (e.key !== 'Tab') return;
    const f = [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!f.length) { e.preventDefault(); dialog.focus(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', onKey, true);
  root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) api.close(); });

  current = api;
  dialog.focus({ preventScroll: true });
  onOpen?.(api);
  return api;
}

export const isModalOpen = () => !!current;
