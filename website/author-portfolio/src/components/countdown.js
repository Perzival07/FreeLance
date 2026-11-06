const UNITS = [['days', 'Days'], ['hours', 'Hours'], ['mins', 'Mins'], ['secs', 'Secs']];

export function remaining(target, now = Date.now()) {
  const ms = Math.max(0, target.getTime() - now);
  return {
    done: ms === 0,
    days: Math.floor(ms / 864e5),
    hours: Math.floor(ms / 36e5) % 24,
    mins: Math.floor(ms / 6e4) % 60,
    secs: Math.floor(ms / 1e3) % 60,
  };
}

/** Live countdown with a flip on every change. Returns { el, destroy }. */
export function createCountdown(target, { doneText = 'Out now' } = {}) {
  const el = document.createElement('div');
  el.className = 'countdown';
  el.setAttribute('role', 'timer');
  el.innerHTML = UNITS.map(([k, label]) => `<div class="countdown__unit" data-unit="${k}"><span class="countdown__num" aria-hidden="true">00</span><span class="countdown__label">${label}</span></div>`).join('')
    + '<span class="sr-only countdown__sr"></span>';
  const nums = Object.fromEntries(UNITS.map(([k]) => [k, el.querySelector(`[data-unit="${k}"] .countdown__num`)]));
  const sr = el.querySelector('.countdown__sr');
  let timer = 0;
  let lastMin = -1;

  function paint(first) {
    const r = remaining(target);
    if (r.done) { el.textContent = doneText; el.classList.add('is-done'); clearInterval(timer); return; }
    for (const [k] of UNITS) {
      const text = String(r[k]).padStart(2, '0');
      if (nums[k].textContent !== text) {
        nums[k].textContent = text;
        if (!first) { nums[k].classList.remove('flip'); void nums[k].offsetWidth; nums[k].classList.add('flip'); }
      }
    }
    if (r.mins !== lastMin) { lastMin = r.mins; sr.textContent = `${r.days} days, ${r.hours} hours and ${r.mins} minutes to go`; }
  }
  paint(true);
  timer = setInterval(() => paint(false), 1000);
  return { el, destroy() { clearInterval(timer); el.remove(); } };
}
