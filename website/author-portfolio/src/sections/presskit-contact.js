import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { author } from '../data/author.js';
import { prefersReducedMotion, EMAIL_RE } from '../core/utils.js';
import { copyText } from './presskit.js';

gsap.registerPlugin(ScrollTrigger);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const TABS = [
  { id: 'readers', label: 'Readers', subject: 'A note for Elara', intro: 'Letters from readers are my favourite post. I read every one myself, usually within a month.' },
  { id: 'press', label: 'Media & Press', subject: 'Press or interview request', intro: 'For interviews, review copies, events and press images, please write to my publicist.' },
  { id: 'agent', label: 'Rights & Agent', subject: 'Rights enquiry', intro: 'For translation, film and audio rights, and speaking enquiries, please write to my agent.' },
];

function recipient(id) {
  const c = author.contacts[id === 'press' ? 'press' : id === 'agent' ? 'agent' : 'readers'];
  return id === 'readers' ? { name: 'Elara Voss', org: 'Reader letters', email: c.email, note: c.note } : { name: c.name, org: c.org, email: c.email };
}

function markup() {
  return `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow"><span class="section-head__num">11</span> Contact</p>
      <h2 class="section-title">Let&rsquo;s <em>talk.</em></h2>
    </header>
    <div class="contact-grid contact-grid--solo">

      <div class="contact">
        <p class="copy-status sr-only" role="status" aria-live="polite"></p>
        <div class="tabs" role="tablist" aria-label="Who would you like to contact?">
          ${TABS.map((t, i) => `<button class="tab" role="tab" type="button" id="tab-${t.id}" aria-selected="${i === 0}" aria-controls="contact-panel" tabindex="${i === 0 ? 0 : -1}">${t.label}</button>`).join('')}
        </div>
        <div class="panel" id="contact-panel" role="tabpanel" aria-labelledby="tab-readers" tabindex="-1">
          <div class="who"></div>
          <form class="cform" novalidate>
            <div class="field"><input id="cf-name" name="name" type="text" autocomplete="name" placeholder=" " required aria-describedby="cf-name-err" /><label for="cf-name">Your name</label><p class="field__err" id="cf-name-err"></p></div>
            <div class="field"><input id="cf-email" name="email" type="email" autocomplete="email" placeholder=" " required aria-describedby="cf-email-err" /><label for="cf-email">Your email</label><p class="field__err" id="cf-email-err"></p></div>
            <div class="field field--wide"><input id="cf-subject" name="subject" type="text" placeholder=" " required aria-describedby="cf-subject-err" /><label for="cf-subject">Subject</label><p class="field__err" id="cf-subject-err"></p></div>
            <div class="field field--wide"><textarea id="cf-message" name="message" rows="5" placeholder=" " required aria-describedby="cf-message-err"></textarea><label for="cf-message">Message</label><p class="field__err" id="cf-message-err"></p></div>
            <div class="cform__foot">
              <button class="btn btn--primary" type="submit"><span>Send message</span></button>
              <a class="cform__mailto" href="#">or open in your email app</a>
            </div>
          </form>
          <div class="sent" role="status" aria-live="polite" hidden>
            <h3>Message sent.</h3>
            <p class="sent__to"></p>
            <button class="sent__again" type="button">Write another</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function initContact() {
  const section = document.getElementById('contact');
  if (!section) return;
  section.classList.add('contactsec');
  section.innerHTML = markup();
  const reduced = prefersReducedMotion();
  const $ = (s) => section.querySelector(s);
  const status = $('.copy-status');

  // ---- Copy buttons (bios + emails) ----
  const flash = (btn, text = 'Copied') => {
    const old = btn.dataset.label || btn.textContent;
    btn.dataset.label = old;
    btn.textContent = text;
    btn.classList.add('is-ok');
    status.textContent = text;
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.textContent = old; btn.classList.remove('is-ok'); status.textContent = ''; }, 1800);
  };
  section.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const v = b.dataset.copy;
    flash(b, (await copyText(v)) ? 'Copied' : 'Copy failed');
  });

  // ---- Tabs ----
  const tabs = [...section.querySelectorAll('.tab')];
  const panel = $('#contact-panel');
  const who = $('.who');
  const form = $('.cform');
  const subject = form.elements.subject;
  let current = TABS[0];
  let subjectDirty = false;

  function renderWho() {
    const r = recipient(current.id);
    who.innerHTML = `<p class="who__intro">${esc(current.intro)}</p>
      <div class="who__card"><div><p class="who__name">${esc(r.name)}</p><p class="who__org">${esc(r.org)}</p>${r.note ? `<p class="who__note">${esc(r.note)}</p>` : ''}</div>
      <div class="who__mail"><a href="mailto:${r.email}">${r.email}</a><button class="copy" type="button" data-copy="${r.email}" aria-label="Copy email address for ${esc(r.name)}">Copy email</button></div></div>`;
  }
  function select(tab, focus = true) {
    const t = TABS.find((x) => `tab-${x.id}` === tab.id);
    current = t;
    tabs.forEach((el) => { const on = el === tab; el.setAttribute('aria-selected', String(on)); el.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    if (!subjectDirty) subject.value = t.subject;
    renderWho();
    sent.hidden = true; form.hidden = false;
    if (focus) tab.focus();
    if (!reduced) gsap.fromTo(who.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out' });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      select(tabs[(map[e.key] + tabs.length) % tabs.length]);
    });
  });

  // ---- Form ----
  const sent = $('.sent');
  const fields = ['name', 'email', 'subject', 'message'];
  const rules = {
    name: (v) => (v.trim().length < 2 ? 'Please tell me your name.' : ''),
    email: (v) => (!v.trim() ? 'Please add your email so I can reply.' : !EMAIL_RE.test(v.trim()) ? 'That email doesn’t look right.' : ''),
    subject: (v) => (!v.trim() ? 'Please add a subject.' : ''),
    message: (v) => (v.trim().length < 10 ? 'A few more words, please (at least 10 characters).' : ''),
  };
  const check = (name) => {
    const el = form.elements[name];
    const msg = rules[name](el.value);
    $(`#cf-${name}-err`).textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.field').classList.toggle('has-error', !!msg);
    return !msg;
  };
  fields.forEach((n) => {
    const el = form.elements[n];
    el.addEventListener('blur', () => { if (el.value || el.dataset.touched) check(n); el.dataset.touched = '1'; });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') check(n); });
  });
  subject.addEventListener('input', () => { subjectDirty = true; });

  const mailtoLink = $('.cform__mailto');
  const updateMailto = () => {
    const r = recipient(current.id);
    mailtoLink.href = `mailto:${r.email}?subject=${encodeURIComponent(form.elements.subject.value)}&body=${encodeURIComponent(`${form.elements.message.value}\n\n${form.elements.name.value}`)}`;
  };
  mailtoLink.addEventListener('focus', updateMailto);
  mailtoLink.addEventListener('pointerdown', updateMailto);
  mailtoLink.addEventListener('click', updateMailto);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = fields.filter((n) => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.firstElementChild.textContent = 'Sending…';
    setTimeout(() => {
      const r = recipient(current.id);
      $('.sent__to').textContent = `Your note is on its way to ${r.name}. (This demo sends nothing; use the email link to write for real.)`;
      form.hidden = true; sent.hidden = false;
      form.reset();
      subjectDirty = false; subject.value = current.subject;
      btn.disabled = false; btn.firstElementChild.textContent = 'Send message';
      fields.forEach((n) => { form.elements[n].setAttribute('aria-invalid', 'false'); delete form.elements[n].dataset.touched; });
      if (!reduced) gsap.from(sent.children, { opacity: 0, y: 14, duration: 0.6, stagger: 0.08, ease: 'expo.out' });
      sent.querySelector('h3').setAttribute('tabindex', '-1'); sent.querySelector('h3').focus();
    }, 900);
  });
  $('.sent__again').addEventListener('click', () => { sent.hidden = true; form.hidden = false; form.elements.name.focus(); });

  subject.value = current.subject;
  renderWho();
  if (!reduced) gsap.from(section.querySelectorAll('.contact'), { opacity: 0, y: 50, duration: 1, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '.contact-grid', start: 'top 85%', once: true } });
}
