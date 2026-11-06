import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { events } from '../data/author.js';
import { createCountdown } from '../components/countdown.js';
import { prefersReducedMotion, isTouch, downloadICS } from '../core/utils.js';

gsap.registerPlugin(Flip, ScrollTrigger);

const TZ = 'Europe/London';
const TYPE_LABEL = { signing: 'Signing', festival: 'Festival', talk: 'Talk', virtual: 'Virtual' };
const fmt = (opts) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts });
const F = {
  day: fmt({ day: 'numeric' }), mon: fmt({ month: 'short' }), yr: fmt({ year: 'numeric' }),
  long: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  time: fmt({ hour: '2-digit', minute: '2-digit', hour12: false }),
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Pure: split all events into upcoming (soonest first) and past (latest first) relative to `now`. */
export function splitEvents(now = Date.now()) {
  const all = [...events.upcoming, ...events.past];
  const t = (e) => new Date(e.date).getTime();
  return {
    upcoming: all.filter((e) => t(e) >= now).sort((a, b) => t(a) - t(b)),
    past: all.filter((e) => t(e) < now).sort((a, b) => t(b) - t(a)),
  };
}

const addToCalendar = (e) => downloadICS({
  title: `${e.title} (Elara Voss)`, start: e.date, end: new Date(new Date(e.date).getTime() + 2 * 3600000).toISOString(),
  location: `${e.venue}, ${e.city}`, description: `${TYPE_LABEL[e.type]} with Elara Voss. Tickets: ${e.ticketUrl}`, uid: `${e.id}@elaravoss.example`,
}, `${e.id}.ics`);

const stub = (e, past) => {
  const d = new Date(e.date);
  return `<li class="stub${past ? ' is-past' : ''}" data-type="${e.type}" data-id="${e.id}" data-img="${e.image}">
    <time class="stub__date" datetime="${e.date}"><span class="stub__day">${F.day.format(d)}</span><span class="stub__mon">${F.mon.format(d)}</span><span class="stub__yr">${F.yr.format(d)}</span></time>
    <div class="stub__main">
      <h4 class="stub__title">${esc(e.title)}</h4>
      <p class="stub__where">${esc(e.venue)} &middot; <strong>${esc(e.city)}</strong></p>
      <p class="stub__meta"><span class="tag tag--${e.type}">${TYPE_LABEL[e.type]}</span> <span>${F.time.format(d)} UK time</span></p>
    </div>
    <div class="stub__actions">${past ? '<span class="stub__done">Past event</span>' : `<a class="btn btn--primary btn--sm" href="${e.ticketUrl}" rel="noopener" data-cursor="Tickets">Tickets</a><button class="stub__cal" type="button" data-cal="${e.id}">Add to calendar</button>`}</div>
  </li>`;
};

export function initEvents() {
  const section = document.getElementById('events');
  if (!section) return;
  section.classList.add('eventsec');
  const { upcoming, past } = splitEvents();
  const next = upcoming[0];
  const byId = Object.fromEntries([...upcoming, ...past].map((e) => [e.id, e]));

  section.innerHTML = `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow"><span class="section-head__num">08</span> Events &amp; tour</p>
      <h2 class="section-title">Come say <em>hello.</em></h2>
    </header>
    ${next ? `<article class="next" aria-labelledby="next-title">
      <p class="eyebrow next__label">Next event</p>
      <h3 class="next__title" id="next-title">${esc(next.title)}</h3>
      <p class="next__when"><time datetime="${next.date}">${F.long.format(new Date(next.date))}, ${F.time.format(new Date(next.date))} UK time</time></p>
      <p class="next__where">${esc(next.venue)}, ${esc(next.city)} <span class="tag tag--${next.type}">${TYPE_LABEL[next.type]}</span></p>
      <div class="next__cd"></div>
      <div class="next__actions"><a class="btn btn--primary" href="${next.ticketUrl}" rel="noopener" data-cursor="Tickets">Get tickets</a><button class="stub__cal" type="button" data-cal="${next.id}">Add to calendar</button></div>
    </article>` : '<p class="events__none">No events are scheduled right now. Join the newsletter to hear first.</p>'}
    <div class="events__bar">
      <div class="events__filters" role="group" aria-label="Filter events by type">
        <button class="chip" type="button" data-type="all" aria-pressed="true">All</button>
        ${events.types.map((t) => `<button class="chip" type="button" data-type="${t}" aria-pressed="false">${TYPE_LABEL[t]}</button>`).join('')}
      </div>
      <button class="events__past-toggle" type="button" aria-pressed="false" aria-controls="past-list">Show past events <span>(${past.length})</span></button>
    </div>
    <ul class="stubs" id="upcoming-list" aria-label="Upcoming events">${upcoming.map((e) => stub(e, false)).join('')}</ul>
    <p class="events__empty" role="status" hidden>No events of this type right now.</p>
    <ul class="stubs stubs--past" id="past-list" aria-label="Past events" hidden>${past.map((e) => stub(e, true)).join('')}</ul>
  </div>
  <div class="stub-preview" aria-hidden="true"><img alt="" width="260" height="180" /></div>`;

  if (next) section.querySelector('.next__cd').append(createCountdown(new Date(next.date)).el);

  section.addEventListener('click', (e) => {
    const cal = e.target.closest('[data-cal]');
    if (cal) addToCalendar(byId[cal.dataset.cal]);
  });

  // Filters (+ past toggle)
  const lists = [...section.querySelectorAll('.stubs')];
  const items = () => [...section.querySelectorAll('.stub')];
  const empty = section.querySelector('.events__empty');
  const pastList = section.querySelector('.stubs--past');
  const toggle = section.querySelector('.events__past-toggle');
  let type = 'all';
  const reduced = prefersReducedMotion();

  function apply(animate = true) {
    const state = animate && !reduced ? Flip.getState(items()) : null;
    items().forEach((li) => li.classList.toggle('is-hidden', type !== 'all' && li.dataset.type !== type));
    const anyUpcoming = [...section.querySelectorAll('#upcoming-list .stub')].some((li) => !li.classList.contains('is-hidden'));
    empty.hidden = anyUpcoming;
    if (state) Flip.from(state, { duration: 0.6, ease: 'power3.inOut', stagger: 0.04, absolute: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }), onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }) });
  }
  section.querySelectorAll('.events__filters .chip').forEach((chip) => chip.addEventListener('click', () => {
    type = chip.dataset.type;
    section.querySelectorAll('.events__filters .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    apply();
  }));
  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(on));
    toggle.firstChild.textContent = on ? 'Hide past events ' : 'Show past events ';
    pastList.hidden = !on;
    if (on && !reduced) gsap.from(pastList.children, { opacity: 0, y: 24, duration: 0.6, stagger: 0.08, ease: 'expo.out' });
  });

  if (!reduced) gsap.from(section.querySelectorAll('.next, #upcoming-list .stub'), { opacity: 0, y: 40, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: section.querySelector('.next, .stubs'), start: 'top 85%', once: true } });

  // Hover preview that follows the cursor.
  if (!isTouch() && !reduced) {
    const prev = section.querySelector('.stub-preview');
    const img = prev.querySelector('img');
    const mx = gsap.quickTo(prev, 'x', { duration: 0.5, ease: 'power3.out' });
    const my = gsap.quickTo(prev, 'y', { duration: 0.5, ease: 'power3.out' });
    section.addEventListener('pointermove', (e) => { mx(e.clientX + 24); my(e.clientY - 90); });
    section.addEventListener('pointerover', (e) => {
      const li = e.target.closest('.stub');
      if (!li) return;
      if (img.dataset.src !== li.dataset.img) { img.src = li.dataset.img; img.dataset.src = li.dataset.img; }
      prev.classList.add('is-on');
    });
    section.addEventListener('pointerout', (e) => { if (!e.relatedTarget?.closest?.('.stub')) prev.classList.remove('is-on'); });
  }
}
