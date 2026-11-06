import { author } from '../data/author.js';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const t = Object.assign(document.createElement('textarea'), { value: text });
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.append(t); t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* ignore */ }
    t.remove();
    return ok;
  }
}

export function pressKitHTML() {
  return `
  <div class="container">
    <header class="section-head">
      <p class="eyebrow">Press kit</p>
      <h1 class="section-title">Everything you need to <em>write about Elara.</em></h1>
      <p class="presskit__lede">Photos, bios and facts, free to use with credit. For interviews or review copies, <a href="/#contact">get in touch</a>.</p>
    </header>
      <article class="kit" aria-labelledby="kit-title">
        <h2 class="kit__title" id="kit-title">Downloads &amp; bios</h2>
        <ul class="kit__shots">
          ${[1, 2].map((n) => `<li><a class="shot" href="/press-kit/headshot-${n}.jpg" download="elara-voss-headshot-${n}.jpg" data-cursor="Download"><img src="${n === 1 ? author.portrait : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=660&q=75&auto=format&fit=crop&crop=faces'}" alt="Headshot ${n} of ${esc(author.name)}, thumbnail" width="200" height="260" loading="lazy" /><span>Headshot ${n} &middot; JPG</span></a></li>`).join('')}
        </ul>
        <div class="kit__bio">
          <div class="kit__bio-head"><h3>Short bio</h3><button class="copy" type="button" data-copy="short" aria-label="Copy short bio">Copy</button></div>
          <p>${esc(author.shortBio)}</p>
        </div>
        <details class="kit__bio kit__long">
          <summary><h3>Long bio</h3><span>Show</span></summary>
          <div class="kit__bio-head"><span class="eyebrow">About 250 words</span><button class="copy" type="button" data-copy="long" aria-label="Copy long bio">Copy</button></div>
          ${author.longBio.map((p) => `<p>${esc(p)}</p>`).join('')}
        </details>
        <ul class="kit__files">
          <li><a href="/press-kit/bio.txt" download>bio.txt <span>short + long bio</span></a></li>
          <li><a href="/press-kit/fact-sheet.txt" download>fact-sheet.txt <span>books, awards, numbers</span></a></li>
        </ul>
        <p class="copy-status sr-only" role="status" aria-live="polite"></p>
      </article>
  </div>`;
}

export function initPressKit(root) {
  const status = root.querySelector('.copy-status');
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const v = b.dataset.copy;
    const text = v === 'short' ? author.shortBio : author.longBio.join('\n\n');
    const ok = await copyText(text);
    const old = b.dataset.label || b.textContent;
    b.dataset.label = old;
    b.textContent = ok ? 'Copied' : 'Copy failed';
    b.classList.add('is-ok');
    status.textContent = b.textContent;
    clearTimeout(b._t);
    b._t = setTimeout(() => { b.textContent = old; b.classList.remove('is-ok'); status.textContent = ''; }, 1800);
  });
}
