// Regenerates public/press-kit/bio.txt and fact-sheet.txt from src/data/author.js.
// Run with: npm run presskit
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { author, books, series, awards } from '../src/data/author.js';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'press-kit');
mkdirSync(out, { recursive: true });

const wrap = (t) => t.replace(/(.{1,78})(\s+|$)/g, '$1\n').trimEnd();

writeFileSync(join(out, 'bio.txt'), [
  `${author.name.toUpperCase()}  |  AUTHOR BIOGRAPHY`, '='.repeat(60), '',
  'SHORT BIO (about 60 words)', '-'.repeat(60), wrap(author.shortBio), '',
  'LONG BIO (about 250 words)', '-'.repeat(60), ...author.longBio.map((p) => `${wrap(p)}\n`),
  `Based in ${author.location}.`,
  `Press: ${author.contacts.press.name}, ${author.contacts.press.org}, ${author.contacts.press.email}`,
  `Rights: ${author.contacts.agent.name}, ${author.contacts.agent.org}, ${author.contacts.agent.email}`, '',
].join('\n'));

const line = (b) => `  ${b.title} (${b.status === 'upcoming' ? `forthcoming ${b.releaseDate}` : b.year}) - ${b.series ? `${b.series} #${b.number}` : 'standalone'}, ${b.pages} pp.\n    ${b.logline}`;
writeFileSync(join(out, 'fact-sheet.txt'), [
  `${author.name.toUpperCase()}  |  FACT SHEET`, '='.repeat(60), '',
  `Tagline:   ${author.tagline}`, `Genre:     Literary fantasy / magical realism`, `Based in:  ${author.location}`, '',
  'BY THE NUMBERS', '-'.repeat(60), ...awards.stats.map((s) => `  ${s.value}${s.suffix} ${s.label}`), '',
  'BOOKS', '-'.repeat(60), ...books.map(line), '',
  `SERIES`, '-'.repeat(60), `  ${wrap(series.description)}`, '',
  'AWARDS', '-'.repeat(60), ...awards.items.map((a) => `  ${a.year}  ${a.name} - ${a.book}`), '',
  'CONTACT', '-'.repeat(60),
  `  Readers:    ${author.contacts.readers.email}`,
  `  Publicist:  ${author.contacts.press.name}, ${author.contacts.press.org}, ${author.contacts.press.email}`,
  `  Agent:      ${author.contacts.agent.name}, ${author.contacts.agent.org}, ${author.contacts.agent.email}`, '',
  'All names, books and quotes are fictional sample content.', '',
].join('\n'));
console.log('Press kit written to', out);
