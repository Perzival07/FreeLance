import { gsap } from 'gsap';
import { quiz, books } from '../data/author.js';
import { createBook3D } from '../components/book3d.js';
import { openBook } from './bookshelf.js';
import { prefersReducedMotion } from '../core/utils.js';

/** Pure scoring so it can be tested: highest total wins; ties go to the strongest single answer, then shelf order. */
export function scoreQuiz(picks) {
  const total = Object.fromEntries(books.map((b) => [b.slug, 0]));
  const peak = { ...total };
  picks.forEach((ans, q) => {
    const a = quiz.questions[q].answers[ans];
    Object.entries(a.weights).forEach(([slug, w]) => { total[slug] += w; peak[slug] = Math.max(peak[slug], w); });
  });
  return [...books].sort((x, y) => total[y.slug] - total[x.slug] || peak[y.slug] - peak[x.slug] || books.indexOf(x) - books.indexOf(y))[0];
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initQuiz() {
  const section = document.getElementById('quiz');
  if (!section) return;
  section.classList.add('quizsec');
  const total = quiz.questions.length;
  section.innerHTML = `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow"><span class="section-head__num">05</span> A small quiz</p>
      <h2 class="section-title">${quiz.title}</h2>
    </header>
    <div class="quiz">
      <div class="quiz-stage">
        <div class="quiz-stack">
          <div class="quiz-ghost quiz-ghost--2" aria-hidden="true"></div>
          <div class="quiz-ghost quiz-ghost--1" aria-hidden="true"></div>
          <div class="quiz-card"></div>
        </div>
        <div class="quiz-result" hidden role="region" aria-label="Your result" aria-live="polite"></div>
      </div>
      <div class="quiz-foot">
        <div class="quiz-dots" aria-hidden="true">${quiz.questions.map(() => '<i></i>').join('')}</div>
        <p class="quiz-count eyebrow"></p>
        <button class="quiz-back" type="button">&larr; Back</button>
      </div>
    </div>
  </div>`;

  const $ = (s) => section.querySelector(s);
  const card = $('.quiz-card'), stack = $('.quiz-stack'), result = $('.quiz-result'), foot = $('.quiz-foot');
  const dots = [...section.querySelectorAll('.quiz-dots i')];
  const count = $('.quiz-count'), back = $('.quiz-back');
  const reduced = prefersReducedMotion();
  let picks = [];
  let busy = false;
  let bookHandle = null;

  function paintFoot(step) {
    dots.forEach((d, i) => { d.classList.toggle('is-done', i < step); d.classList.toggle('is-now', i === step); });
    count.textContent = `Question ${Math.min(step + 1, total)} of ${total}`;
    back.hidden = step === 0;
  }

  function questionHTML(step) {
    const q = quiz.questions[step];
    return `<p class="quiz-card__n eyebrow">0${step + 1} / 0${total}</p>
      <h3 class="quiz-card__q" id="quiz-q" tabindex="-1">${esc(q.q)}</h3>
      <div class="quiz-answers" role="group" aria-labelledby="quiz-q">
        ${q.answers.map((a, i) => `<button class="quiz-answer" type="button" data-i="${i}" data-cursor="Pick"><kbd aria-hidden="true">${i + 1}</kbd><span>${esc(a.text)}</span></button>`).join('')}
      </div>`;
  }

  function showQuestion(step, dir = 1, focus = false) {
    card.innerHTML = questionHTML(step);
    paintFoot(step);
    if (focus) card.querySelector('#quiz-q').focus({ preventScroll: true });
    if (reduced) return;
    gsap.fromTo(card, { x: 60 * dir, opacity: 0, rotate: 2 * dir }, { x: 0, opacity: 1, rotate: 0, duration: 0.7, ease: 'expo.out', clearProps: 'transform' });
    gsap.fromTo(card.querySelectorAll('.quiz-answer'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, delay: 0.15, ease: 'power3.out' });
  }

  function leave(dir, done) {
    if (reduced) return done();
    busy = true;
    gsap.to(card, { x: -140 * dir, rotate: -7 * dir, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => { busy = false; done(); } });
  }

  function pick(i) {
    if (busy) return;
    picks[picks.length] = i;
    const step = picks.length;
    leave(1, () => { gsap.set(card, { clearProps: 'all' }); step < total ? showQuestion(step, 1, true) : showResult(); });
  }

  function goBack() {
    if (busy || !picks.length) return;
    picks.pop();
    leave(-1, () => { gsap.set(card, { clearProps: 'all' }); showQuestion(picks.length, -1, true); });
  }

  function showResult() {
    const book = scoreQuiz(picks);
    const buy = book.retailers[0];
    const line = quiz.results[book.slug];
    const shareText = `My first Elara Voss book is ${book.title}. Find yours: ${location.origin}${location.pathname}#quiz`;
    stack.hidden = true;
    foot.hidden = true;
    result.hidden = false;
    result.innerHTML = `
      <div class="quiz-result__art" aria-hidden="true"><div class="burst"></div><div class="flash"></div><div class="quiz-result__book"></div></div>
      <div class="quiz-result__copy">
        <p class="eyebrow">Your match</p>
        <h3 class="quiz-result__title" tabindex="-1">${esc(book.title)}</h3>
        <p class="quiz-result__line">${esc(line)}</p>
        <p class="quiz-result__logline">${esc(book.logline)}</p>
        <div class="quiz-result__actions">
          <button class="btn btn--primary" type="button" data-excerpt data-cursor="Read">Read the excerpt</button>
          <a class="btn btn--ghost" href="${buy.url}" rel="noopener">${book.status === 'upcoming' ? 'Pre-order' : 'Buy'} &middot; ${buy.name}</a>
        </div>
        <div class="quiz-result__more">
          <button type="button" data-share>Share my result</button>
          <button type="button" data-retake>Retake the quiz</button>
          <span class="quiz-copied" role="status" aria-live="polite"></span>
        </div>
      </div>`;
    bookHandle = createBook3D(book, { size: 230, rotateY: 22, rotateX: -4, interactive: true, range: 14 });
    result.querySelector('.quiz-result__book').append(bookHandle.el);
    result.querySelector('[data-excerpt]').addEventListener('click', (e) => openBook(book, e.currentTarget, e.currentTarget.getBoundingClientRect()));
    result.querySelector('[data-retake]').addEventListener('click', retake);
    result.querySelector('[data-share]').addEventListener('click', async () => {
      const msg = result.querySelector('.quiz-copied');
      try { await navigator.clipboard.writeText(shareText); }
      catch {
        const t = Object.assign(document.createElement('textarea'), { value: shareText });
        document.body.append(t); t.select(); try { document.execCommand('copy'); } catch { /* ignore */ } t.remove();
      }
      msg.textContent = 'Copied to clipboard';
      setTimeout(() => { msg.textContent = ''; }, 2500);
    });
    result.querySelector('.quiz-result__title').focus({ preventScroll: true });

    if (!reduced) {
      gsap.fromTo(result.querySelector('.quiz-result__book'), { y: 160, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'expo.out' });
      gsap.fromTo(result.querySelector('.flash'), { scale: 0, opacity: 0.9 }, { scale: 3.2, opacity: 0, duration: 1.1, ease: 'power2.out' });
      gsap.fromTo(result.querySelector('.burst'), { scale: 0.2, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.6, ease: 'expo.out' });
      gsap.fromTo(result.querySelector('.quiz-result__copy').children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'expo.out' });
    }
  }

  function retake() {
    bookHandle?.destroy();
    bookHandle = null;
    picks = [];
    result.hidden = true;
    result.innerHTML = '';
    stack.hidden = false;
    foot.hidden = false;
    showQuestion(0, 1, true);
  }

  card.addEventListener('click', (e) => { const b = e.target.closest('.quiz-answer'); if (b) pick(+b.dataset.i); });
  back.addEventListener('click', goBack);
  section.addEventListener('keydown', (e) => {
    if (!/^[1-9]$/.test(e.key) || stack.hidden || !card.contains(document.activeElement)) return;
    const b = card.querySelector(`.quiz-answer[data-i="${+e.key - 1}"]`);
    if (b) { e.preventDefault(); b.click(); }
  });

  showQuestion(0);
}
