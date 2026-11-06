import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { books } from '../data/author.js';
import { renderCover } from '../components/cover.js';
import { createCountdown } from '../components/countdown.js';
import { prefersReducedMotion, downloadICS, formatDate } from '../core/utils.js';

gsap.registerPlugin(ScrollTrigger);

const MAP = `
<svg class="featured__map" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <g class="map-contours" stroke-width="1.2">
    <path pathLength="1" d="M-20 520C120 470 180 560 300 520S480 400 560 450 700 560 820 500 1000 380 1220 430"/>
    <path pathLength="1" d="M-20 560C120 510 190 600 310 560S490 450 570 495 710 600 830 545 1010 430 1220 475" opacity=".7"/>
    <path pathLength="1" d="M-20 600C120 550 200 640 320 600S500 500 580 540 720 640 840 590 1020 480 1220 520" opacity=".45"/>
    <path pathLength="1" d="M880 150c40-40 120-30 140 20s-10 90-70 100-110-20-70-120z"/>
    <path pathLength="1" d="M905 165c30-25 85-18 98 15s-8 62-50 68-76-14-48-83z" opacity=".5"/>
    <path pathLength="1" d="M60 120c30-30 90-20 100 20s-20 70-70 60-60-50-30-80z" opacity=".6"/>
  </g>
  <path class="map-route" pathLength="1" stroke-width="1.8" stroke-dasharray="1" d="M120 620C300 530 360 310 560 350S800 270 900 190 1050 130 1100 90"/>
  <g class="map-x" stroke-width="2.2"><path d="M1086 76l28 28M1114 76l-28 28"/></g>
  <g class="map-compass" stroke-width="1.2" transform="translate(1080 560)">
    <circle r="40"/><circle r="30" opacity=".5"/><path d="M0-52 8-8 52 0 8 8 0 52-8 8-52 0-8-8z" opacity=".8"/>
  </g>
</svg>`;

function openingText(book, short) {
  const [p1, p2] = book.excerpt.split('\n\n');
  const firstSentence = p2.match(/^.*?[.!?](?=\s|$)/)[0];
  // On small screens the page is tiny, so stop at the first clause.
  const sentence = short ? `${firstSentence.split(',')[0]}.` : firstSentence;
  return `${p1} ${sentence}`;
}

function markup(book, opening) {
  const d = formatDate(book.releaseDate);
  return `
  ${MAP}
  <div class="featured__stage">
    <div class="featured__scene" aria-hidden="true">
      <div class="ob">
        <div class="ob__wrap">
          <div class="ob__page ob__page--right">
            <p class="ob__chapter">One</p>
            <p class="ob__text"><span class="ob__typed"></span></p>
          </div>
          <div class="ob__cover">
            <div class="ob__face ob__face--front"></div>
            <div class="ob__face ob__face--back"><p>For everyone who draws their own edges.</p></div>
          </div>
        </div>
      </div>
    </div>
    <div class="featured__panel">
      <p class="eyebrow featured__eyebrow"><span class="section-head__num">02</span> Coming ${d}</p>
      <h2 class="featured__title">${book.title}</h2>
      <p class="featured__logline">${book.logline}</p>
      <p class="sr-only">Opening lines: ${opening}</p>
      <div class="featured__cd"></div>
      <div class="featured__buy">
        ${book.retailers.map((r, i) => `<a class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}" href="${r.url}" rel="noopener" data-cursor="Pre-order">Pre-order ${r.name}</a>`).join('')}
      </div>
      <button class="featured__cal" type="button">Add release day to calendar</button>
    </div>
  </div>`;
}

export function initFeatured() {
  const section = document.getElementById('featured');
  if (!section) return;
  const book = books.find((b) => b.status === 'upcoming');
  const opening = openingText(book, matchMedia('(max-width: 1023px)').matches);
  section.classList.add('featured');
  section.innerHTML = markup(book, opening);

  section.querySelector('.ob__face--front').append(renderCover(book, { label: false }));
  section.querySelector('.featured__cd').append(createCountdown(new Date(`${book.releaseDate}T00:00:00`)).el);
  section.querySelector('.featured__cal').addEventListener('click', () =>
    downloadICS({ title: `Release day: ${book.title}`, start: book.releaseDate, allDay: true, description: `${book.title} by Elara Voss is published today.` }, 'the-cartographers-daughter-release.ics'));

  const typed = section.querySelector('.ob__typed');
  const cover = section.querySelector('.ob__cover');
  const wrap = section.querySelector('.ob__wrap');
  const paths = section.querySelectorAll('.map-contours path, .map-route');
  const x = section.querySelector('.map-x');
  const panel = section.querySelectorAll('.featured__panel > *');

  if (prefersReducedMotion()) {
    gsap.set(cover, { rotateY: -180 });
    typed.textContent = opening;
    return;
  }

  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(x, { opacity: 0, scale: 0.4, transformOrigin: '1100px 90px' });
  gsap.set(cover, { rotateY: 0 });
  gsap.set(wrap, { xPercent: -25 });

  const counter = { n: 0 };
  const build = (tl) => {
    tl.to(wrap, { xPercent: 0, duration: 0.4, ease: 'power2.inOut' }, 0.05)
      .to(cover, { rotateY: -180, duration: 0.4, ease: 'power2.inOut' }, 0.05)
      .to(counter, { n: opening.length, duration: 0.5, ease: 'none', onUpdate: () => { typed.textContent = opening.slice(0, Math.round(counter.n)); } }, 0.42)
      .to(paths, { strokeDashoffset: 0, duration: 0.9, ease: 'none', stagger: 0.08 }, 0)
      .to(x, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(2)' }, 1.3)
      .to({}, { duration: 0.15 }, 1.45);
    return tl;
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    // Pinned, scrubbed scene — fully reversible.
    build(gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: section, start: 'top top', end: '+=1600', pin: true, scrub: 0.6, anticipatePin: 1 },
    }));
  });
  mm.add('(max-width: 1023px)', () => {
    // No pin: a simple timed reveal once it scrolls into view.
    gsap.set(panel, { opacity: 0, y: 24 });
    const tl = build(gsap.timeline({ paused: true }));
    tl.duration(3.6);
    ScrollTrigger.create({
      trigger: section.querySelector('.featured__scene'), start: 'top 75%', once: true,
      onEnter: () => { tl.play(); gsap.to(panel, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' }); },
    });
  });
}
