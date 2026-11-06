import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { author, timeline } from '../data/author.js';
import { splitText } from '../core/split-text.js';
import { prefersReducedMotion } from '../core/utils.js';

gsap.registerPlugin(ScrollTrigger);

// Hand-drawn, single-stroke signature (drawn on with stroke-dashoffset).
const SIGNATURE = `
<svg class="sig" viewBox="0 0 270 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Signature of ${author.name}">
  <path class="sig__a" pathLength="1" d="M24 30C8 26 6 44 24 42 10 42 8 58 28 56 40 52 46 14 52 18 58 22 46 50 56 52 62 52 66 40 70 40 74 40 66 54 78 52 82 50 84 38 88 40 90 42 90 46 98 44 102 44 100 54 108 50 114 46 112 40 118 42 122 44 116 54 126 52 132 50 140 24 146 22 150 30 150 44 160 28 164 30 158 50 170 48 180 46 176 36 172 38 178 38 186 40 184 44 182 50 190 50 196 46 198 44 202 40 206 42 212 46 204 52 216 50 226 46 236 38 250 30"/>
  <path class="sig__b" pathLength="1" d="M30 68C100 58 180 66 252 52"/>
</svg>`;

function markup() {
  return `
  <div class="container about">
    <div class="about__grid">
      <figure class="portrait">
        <div class="portrait__frame">
          <img src="${author.portrait}" alt="${author.portraitAlt}" width="900" height="1200" loading="lazy" decoding="async" />
        </div>
        <figcaption class="eyebrow">${author.location}</figcaption>
      </figure>
      <div class="about__copy">
        <header class="section-head">
          <p class="eyebrow"><span class="section-head__num">06</span> About</p>
          <h2 class="section-title">Hello, I&rsquo;m Elara.</h2>
        </header>
        <div class="about__bio">${author.longBio.map((p) => `<p>${p}</p>`).join('')}</div>
        <div class="about__sig">${SIGNATURE}</div>
        <ul class="facts" aria-label="Fun facts">${author.funFacts.map((f) => `<li class="fact">${f}</li>`).join('')}</ul>
      </div>
    </div>
  </div>
  <div class="timeline" aria-label="Career milestones">
    <div class="timeline__pin">
      <header class="timeline__head container">
        <p class="eyebrow">Milestones</p>
        <h3 class="timeline__title">A life in chapters</h3>
      </header>
      <div class="timeline__vp">
        <ol class="timeline__track">
          ${timeline.map((t, i) => `
          <li class="tl-card" data-i="${i}">
            <span class="tl-card__year" aria-hidden="true">${t.year}</span>
            <div class="tl-card__body">
              <img src="${t.image}" alt="" width="520" height="340" loading="lazy" decoding="async" />
              <p class="eyebrow tl-card__yr">${t.year}</p>
              <h4>${t.title}</h4>
              <p>${t.text}</p>
            </div>
          </li>`).join('')}
        </ol>
      </div>
      <div class="timeline__bar" aria-hidden="true"><i class="timeline__fill"></i>${timeline.map((t) => `<b>${t.year}</b>`).join('')}</div>
    </div>
  </div>`;
}

function initBio(section) {
  const paras = [...section.querySelectorAll('.about__bio p')];
  const original = paras.map((p) => p.innerHTML);
  let triggers = [];
  let revealed = false;
  let lastWidth = 0;

  const build = () => {
    triggers.forEach((t) => t.kill());
    triggers = [];
    const w = section.querySelector('.about__bio').clientWidth;
    lastWidth = w;
    paras.forEach((p, i) => {
      p.innerHTML = original[i];
      const split = splitText(p, { lines: true, chars: false, srOnly: true });
      if (revealed) return;
      gsap.set(split.lines, { yPercent: 110 });
      const tween = gsap.to(split.lines, {
        yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: p, start: 'top 88%', once: true, onEnter: () => { if (i === paras.length - 1) revealed = true; } },
      });
      triggers.push(tween.scrollTrigger);
    });
  };
  build();
  let timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (Math.abs(section.querySelector('.about__bio').clientWidth - lastWidth) > 2) build(); }, 250);
  }).observe(section.querySelector('.about__bio'));
}

function initPortrait(section) {
  const img = section.querySelector('.portrait__frame img');
  gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: section.querySelector('.portrait'), start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from(section.querySelector('.portrait__frame'), { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 12px 12px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: section.querySelector('.portrait'), start: 'top 80%', once: true } });
}

function initSignature(section) {
  const a = section.querySelector('.sig__a'), b = section.querySelector('.sig__b');
  gsap.set([a, b], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.timeline({ scrollTrigger: { trigger: section.querySelector('.about__sig'), start: 'top 90%', once: true } })
    .to(a, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut' })
    .to(b, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, '-=0.3');
}

function initFacts(section) {
  gsap.from(section.querySelectorAll('.fact'), { opacity: 0, y: 18, scale: 0.92, duration: 0.7, stagger: 0.08, ease: 'back.out(1.8)', scrollTrigger: { trigger: section.querySelector('.facts'), start: 'top 92%', once: true } });
}

function initTimeline(section) {
  const root = section.querySelector('.timeline');
  const track = root.querySelector('.timeline__track');
  const fill = root.querySelector('.timeline__fill');
  const years = [...root.querySelectorAll('.timeline__bar b')];
  const cards = [...root.querySelectorAll('.tl-card')];
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px)', () => {
    const dist = () => Math.max(0, track.scrollWidth - root.querySelector('.timeline__vp').clientWidth);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root, start: 'top top', end: () => `+=${dist() * 1.1}`, pin: root.querySelector('.timeline__pin'), scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.round(self.progress * (cards.length - 1));
          years.forEach((y, k) => y.classList.toggle('is-now', k === i));
          cards.forEach((c, k) => c.classList.toggle('is-now', k === i));
        },
      },
    });
    tl.to(track, { x: () => -dist() }, 0).to(fill, { scaleX: 1 }, 0);
    // Giant year drifts a little faster than its card for depth.
    cards.forEach((c) => tl.to(c.querySelector('.tl-card__year'), { x: -90 }, 0));
  });

  mm.add('(max-width: 1023px)', () => {
    cards.forEach((c) => gsap.from(c, { opacity: 0, y: 40, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } }));
  });
}

export function initAbout() {
  const section = document.getElementById('about');
  if (!section) return;
  section.classList.add('aboutsec');
  section.innerHTML = markup();

  if (prefersReducedMotion()) {
    // Static: vertical timeline (CSS), plain bio, finished signature.
    section.classList.add('is-static');
    return;
  }
  initPortrait(section);
  initSignature(section);
  initFacts(section);
  initTimeline(section);
  document.fonts.ready.then(() => initBio(section));
}
