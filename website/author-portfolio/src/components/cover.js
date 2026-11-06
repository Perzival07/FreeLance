import { author } from '../data/author.js';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];

const S = 'fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"';

// Line-art motifs on a 100x100 canvas, drawn in currentColor.
const MOTIFS = {
  lantern: `<svg viewBox="0 0 100 100" ${S}>
    <path d="M38 24Q50 4 62 24"/><path d="M33 26h34l-3 7H36z"/>
    <path d="M36 33l-4 38h36l-4-38"/><path d="M42 33l-2 38M58 33l2 38"/>
    <path d="M31 71h38v7H31z"/>
    <path d="M50 44c-7 6-7 13 0 18 7-5 7-12 0-18z" fill="currentColor" fill-opacity=".85"/>
    <path d="M50 8v-5M22 40l-5-3M78 40l5-3M18 58l-6 1M82 58l6 1" opacity=".5"/>
  </svg>`,
  moth: `<svg viewBox="0 0 100 100" ${S}>
    <ellipse cx="50" cy="55" rx="3" ry="15" fill="currentColor" fill-opacity=".8"/>
    <circle cx="50" cy="38" r="3.5"/>
    <path d="M48 35Q42 24 35 26M52 35Q58 24 65 26"/>
    <path d="M47 46C30 26 8 30 7 45c0 12 22 14 40 7z"/><path d="M53 46C70 26 92 30 93 45c0 12-22 14-40 7z"/>
    <path d="M47 55C33 56 21 70 29 82c11 3 17-13 18-24z"/><path d="M53 55c14 1 26 15 18 27-11 3-17-13-18-24z"/>
    <circle cx="26" cy="43" r="4"/><circle cx="74" cy="43" r="4"/>
    <path d="M18 40q8 2 12 8M82 40q-8 2-12 8" opacity=".5"/>
  </svg>`,
  wick: `<svg viewBox="0 0 100 100" ${S}>
    <circle cx="50" cy="34" r="25" stroke-dasharray="2 4" opacity=".55"/>
    <path d="M50 14c-9 9-9 19 0 24 9-5 9-15 0-24z" fill="currentColor" fill-opacity=".85"/>
    <path d="M50 38v9"/>
    <rect x="39" y="47" width="22" height="38" rx="2"/>
    <path d="M39 57c0 7 5 7 5 0M56 54c0 9 5 9 5 0"/>
    <path d="M30 85h40" opacity=".6"/>
  </svg>`,
  wave: `<svg viewBox="0 0 100 100" ${S}>
    <circle cx="50" cy="38" r="16" fill="currentColor" fill-opacity=".2"/><circle cx="50" cy="38" r="16"/>
    <path d="M6 58q11-11 22 0t22 0 22 0 22 0"/>
    <path d="M6 68q11-11 22 0t22 0 22 0 22 0" opacity=".75"/>
    <path d="M6 78q11-11 22 0t22 0 22 0 22 0" opacity=".5"/>
    <path d="M6 88q11-11 22 0t22 0 22 0 22 0" opacity=".3"/>
  </svg>`,
  compass: `<svg viewBox="0 0 100 100" ${S}>
    <circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="31" opacity=".5"/>
    <path d="M50 12L57 43 88 50 57 57 50 88 43 57 12 50 43 43z" fill="currentColor" fill-opacity=".18"/>
    <path d="M50 12L57 43 88 50 57 57 50 88 43 57 12 50 43 43z"/>
    <path d="M27 27l14 14M73 27L59 41M27 73l14-14M73 73L59 59" opacity=".5"/>
    <circle cx="50" cy="50" r="3" fill="currentColor"/><path d="M50 3v6" stroke-width="2"/>
  </svg>`,
};

/** Group a title into display lines (short words join their neighbour). */
export function titleLines(title) {
  const words = title.split(/\s+/);
  const lines = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (w === '&' && last !== undefined) lines[lines.length - 1] = `${last} &`;
    else if (last !== undefined && (last.length <= 3 || w.length <= 3) && last.length + w.length < 11) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
  }
  return lines;
}

function paletteVars(el, palette) {
  el.style.setProperty('--c1', palette[0]);
  el.style.setProperty('--c2', palette[1]);
  el.style.setProperty('--c3', palette[2]);
}

function ribbonText(book) {
  if (!book.series) return '';
  return book.number ? `${book.series} · ${ROMAN[book.number] || book.number}` : book.series;
}

/** Front cover. Scales with its container width (cqw units). */
export function renderCover(book, { label = true } = {}) {
  const spec = book.cover;
  const lines = titleLines(book.title);
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(15, 150 / longest);

  const el = document.createElement('div');
  el.className = `cover cover--${spec.titleLayout} cover--${spec.motif}`;
  paletteVars(el, spec.palette);
  el.style.setProperty('--ts', `${size.toFixed(2)}cqw`);
  if (label) {
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Cover of ${book.title} by ${book.author || author.name}`);
  } else el.setAttribute('aria-hidden', 'true');

  const ribbon = ribbonText(book);
  el.innerHTML = `
    <div class="cover__frame"></div>
    <div class="cover__art">${MOTIFS[spec.motif]}</div>
    ${ribbon ? `<div class="cover__ribbon">${ribbon}</div>` : ''}
    <div class="cover__title">${lines.map((l) => `<span>${l}</span>`).join('')}</div>
    <div class="cover__author">${book.author || author.name}</div>
    <div class="cover__sheen"></div>`;
  return el;
}

/** Spine face: vertical title, series number, motif, author. Scales with container height. */
export function renderSpineFace(book) {
  const spec = book.cover;
  const el = document.createElement('div');
  el.className = 'spine';
  paletteVars(el, spec.palette);
  el.style.setProperty('--len', book.title.length);
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="spine__top">${book.number ? ROMAN[book.number] : '✦'}</div>
    <div class="spine__title">${book.title}</div>
    <div class="spine__art">${MOTIFS[spec.motif]}</div>
    <div class="spine__author">${(book.author || author.name).split(' ').pop()}</div>`;
  return el;
}

export const motifNames = Object.keys(MOTIFS);
