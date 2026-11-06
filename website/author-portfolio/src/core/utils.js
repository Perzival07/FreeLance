export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function storage(kind = 'local') {
  const store = () => (kind === 'session' ? sessionStorage : localStorage);
  return {
    get(key) { try { return store().getItem(key); } catch { return null; } },
    set(key, value) { try { store().setItem(key, value); } catch { /* unavailable */ } },
  };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function lockScroll(locked) {
  document.documentElement.classList.toggle('scroll-locked', locked);
}

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsDay = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
const icsEscape = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => `\\${m}`);

/** Build an .ics string. Pass allDay with a YYYY-MM-DD `start`, or a timed ISO `start` (+ optional `end`, default 1h). */
export function buildICS({ title, start, end, allDay = false, location = '', description = '', uid }) {
  const s = new Date(start);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Elara Voss//Author Site//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${uid || `${icsDate(s)}-${title.length}@elaravoss.example`}`, `DTSTAMP:${icsDate(new Date())}`];
  if (allDay) {
    const e = new Date(s.getTime() + 86400000);
    lines.push(`DTSTART;VALUE=DATE:${icsDay(s)}`, `DTEND;VALUE=DATE:${icsDay(e)}`);
  } else {
    lines.push(`DTSTART:${icsDate(s)}`, `DTEND:${icsDate(end ? new Date(end) : new Date(s.getTime() + 3600000))}`);
  }
  lines.push(`SUMMARY:${icsEscape(title)}`);
  if (location) lines.push(`LOCATION:${icsEscape(location)}`);
  if (description) lines.push(`DESCRIPTION:${icsEscape(description)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(opts, filename = 'event.ics') {
  const blob = new Blob([buildICS(opts)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const formatDate = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-GB', opts).format(new Date(iso));
