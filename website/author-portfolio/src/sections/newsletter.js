import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { newsletter } from '../data/author.js';
import { createBook3D } from '../components/book3d.js';
import { prefersReducedMotion, storage, EMAIL_RE } from '../core/utils.js';

gsap.registerPlugin(ScrollTrigger);
const store = storage('local');
const KEY = 'ev-subscribed';

const ENVELOPE = `
<div class="env" aria-hidden="true">
  <div class="env__back"></div>
  <div class="env__letter"><i></i><i></i><i></i></div>
  <div class="env__front"></div>
  <div class="env__flap"></div>
  <div class="env__seal"><span>EV</span></div>
</div>`;

export function initNewsletter() {
  const section = document.getElementById('newsletter');
  if (!section) return;
  section.classList.add('newssec');
  const n = newsletter;
  section.innerHTML = `
  <div class="container news">
    <div class="news__art"></div>
    <div class="news__copy">
      <p class="eyebrow"><span class="section-head__num">10</span> ${n.eyebrow}</p>
      <h2 class="section-title news__title">${n.headline}</h2>
      <p class="news__text">${n.text}</p>
      <p class="news__lead">Free story: <em>${n.leadMagnet.title}</em>. ${n.leadMagnet.description}</p>
      <div class="news__stage">
        <form class="news__form" novalidate>
          <label class="news__label" for="news-email">Your email</label>
          <div class="news__row">
            <input id="news-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required aria-describedby="news-err" />
            <button class="btn btn--primary" type="submit" data-cursor="Send"><span>Send me the story</span></button>
          </div>
          <p class="news__err" id="news-err" role="alert"></p>
          <p class="news__fine">One email a month. Unsubscribe any time. Nothing is stored on this demo site.</p>
        </form>
        ${ENVELOPE}
        <div class="news__done" role="status" aria-live="polite" hidden>
          <h3>Check your inbox.</h3>
          <p><em>${n.leadMagnet.title}</em> is on its way to <strong class="news__who"></strong>.</p>
          <button class="news__again" type="button">Use a different email</button>
        </div>
      </div>
    </div>
  </div>`;

  const book = { ...n.leadMagnet, slug: 'lead', pages: 60, series: null, number: null, logline: n.leadMagnet.description };
  const b3d = createBook3D(book, { size: 240, rotateY: 24, rotateX: -4, interactive: true, range: 14 });
  section.querySelector('.news__art').append(b3d.el);

  const form = section.querySelector('.news__form');
  const input = form.elements.email;
  const err = section.querySelector('.news__err');
  const env = section.querySelector('.env');
  const done = section.querySelector('.news__done');
  const who = section.querySelector('.news__who');
  const btnLabel = form.querySelector('button span');
  const reduced = prefersReducedMotion();
  let sending = false;

  const validate = (showEmpty) => {
    const v = input.value.trim();
    let msg = '';
    if (!v) msg = showEmpty ? 'Please enter your email address.' : '';
    else if (!EMAIL_RE.test(v)) msg = 'That email doesn’t look right. Check for a missing @ or domain.';
    err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg && !!v;
  };
  input.addEventListener('blur', () => validate(false));
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validate(false); });

  function showDone(email, animate) {
    who.textContent = email;
    form.hidden = true;
    done.hidden = false;
    if (animate && !reduced) gsap.from(done.children, { opacity: 0, y: 16, duration: 0.7, stagger: 0.1, ease: 'expo.out' });
  }

  function reset() {
    store.set(KEY, '');
    done.hidden = true;
    form.hidden = false;
    form.reset();
    err.textContent = '';
    input.setAttribute('aria-invalid', 'false');
    gsap.set(env, { clearProps: 'all' });
    env.classList.remove('is-on');
    btnLabel.textContent = 'Send me the story';
    form.querySelector('button').disabled = false;
    sending = false;
    input.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (sending) return;
    if (!validate(true)) { input.focus(); return; }
    sending = true;
    const email = input.value.trim();
    const submit = form.querySelector('button');
    submit.disabled = true;
    btnLabel.textContent = 'Sending…';
    setTimeout(() => {
      store.set(KEY, email);
      if (reduced) { showDone(email, false); return; }
      // Envelope folds closed, wax seal stamps, then it flies off.
      gsap.to(form, { opacity: 0, y: -16, duration: 0.35, onComplete: () => { form.hidden = true; gsap.set(form, { clearProps: 'all' }); } });
      env.classList.add('is-on');
      const flap = env.querySelector('.env__flap'), letter = env.querySelector('.env__letter'), seal = env.querySelector('.env__seal');
      gsap.set(flap, { rotateX: 180 }); gsap.set(letter, { y: -70 }); gsap.set(seal, { scale: 0, opacity: 0 });
      gsap.timeline({ delay: 0.3, onComplete: () => { env.classList.remove('is-on'); showDone(email, true); } })
        .fromTo(env, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' })
        .to(letter, { y: 0, duration: 0.5, ease: 'power2.inOut' })
        .to(flap, { rotateX: 0, duration: 0.6, ease: 'power2.inOut', onUpdate() { flap.style.zIndex = gsap.getProperty(flap, 'rotateX') < 90 ? 5 : 1; } }, '-=0.1')
        .to(seal, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(3)' })
        .fromTo(seal, { rotate: -25 }, { rotate: 0, duration: 0.45, ease: 'back.out(3)' }, '<')
        .to(env, { x: 340, y: -150, rotate: 14, scale: 0.6, opacity: 0, duration: 0.9, ease: 'power3.in' }, '+=0.45');
    }, 800);
  });
  section.querySelector('.news__again').addEventListener('click', reset);

  const saved = store.get(KEY);
  if (saved) showDone(saved, false);

  if (!reduced) {
    gsap.from(section.querySelector('.news__art'), { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 75%', once: true } });
    gsap.from(section.querySelector('.news__copy').children, { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 75%', once: true } });
  }
}
