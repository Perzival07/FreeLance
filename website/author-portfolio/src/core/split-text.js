/**
 * Split an element's text into words, chars and (optionally) lines.
 * The parent keeps the full text in aria-label; every generated span is aria-hidden.
 * Returns { words, chars, lines, revert }.
 */
export function splitText(el, { lines = false, chars = true, srOnly = false } = {}) {
  const original = el.innerHTML;
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  if (srOnly) {
    // Paragraphs: a visually-hidden copy is read instead of aria-label (labels on <p> are often ignored).
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    el.append(sr);
  } else {
    el.setAttribute('aria-label', text);
    el.textContent = '';
  }

  const words = [];
  const charEls = [];
  text.split(' ').forEach((w, i, all) => {
    const word = document.createElement('span');
    word.className = 'split-word';
    word.setAttribute('aria-hidden', 'true');
    if (chars) {
      for (const ch of w) {
        const c = document.createElement('span');
        c.className = 'split-char';
        c.textContent = ch;
        word.append(c);
        charEls.push(c);
      }
    } else word.textContent = w;
    el.append(word);
    words.push(word);
    if (i < all.length - 1) el.append(' ');
  });

  const lineEls = [];
  if (lines) {
    // Group words by their rendered row, then wrap each row in a clipping line span.
    const rows = [];
    words.forEach((w) => {
      const top = w.offsetTop;
      const row = rows[rows.length - 1];
      if (row && Math.abs(row.top - top) < 4) row.words.push(w);
      else rows.push({ top, words: [w] });
    });
    rows.forEach((row) => {
      const line = document.createElement('span');
      line.className = 'split-line';
      line.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'split-line__inner';
      row.words[0].before(line);
      row.words.forEach((w, i) => { if (i) inner.append(' '); inner.append(w); });
      line.append(inner);
      lineEls.push(inner);
    });
    [...el.childNodes].forEach((n) => { if (n.nodeType === 3) n.remove(); });
  }

  return {
    words,
    chars: charEls,
    lines: lineEls,
    revert() { el.innerHTML = original; el.removeAttribute('aria-label'); },
  };
}
