import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Change this to the real domain before deploying (used for canonical, Open Graph and the sitemap).
const SITE = process.env.SITE_URL || 'https://elaravoss.example';

const { author, books, images, ...rest } = await import('./src/data/author.js');
const socials = author.socials;


/** The hero is real HTML (not built by JS) so first paint never waits on the bundle. Content comes from src/data/author.js. */
function heroHTML() {
  const nameHTML = author.name.split(' ').map((w) => `<span class="split-word" aria-hidden="true">${[...w].map((c) => `<span class="split-char">${c}</span>`).join('')}</span>`).join(' ');
  const bg = (w) => `${images.libraryNight.replace(/w=\d+/, `w=${w}`)} ${w}w`;
  return `
    <svg class="hero__defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="ink-bleed" x="-10%" y="-15%" width="120%" height="130%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="3" seed="4" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" xChannelSelector="R" yChannelSelector="G" result="disp"/>
        <feGaussianBlur in="disp" stdDeviation="11" result="blur"/>
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"/>
      </filter>
    </svg>
    <div class="hero__bg" aria-hidden="true"><img srcset="${bg(640)}, ${bg(1000)}, ${bg(1600)}" sizes="100vw" src="${bg(1000).replace(' 1000w', '')}" alt="" width="1600" height="1067" decoding="async" fetchpriority="low" /></div>
    <canvas class="hero__ink" aria-hidden="true"></canvas>
    <div class="hero__books" aria-hidden="true"></div>
    <div class="container hero__inner">
      <p class="eyebrow hero__eyebrow">${author.eyebrow}</p>
      <h1 class="hero__name" aria-label="${author.name}">${nameHTML}</h1>
      <p class="hero__tagline"><span class="sr-only">${author.tagline}</span><span class="hero__typed" aria-hidden="true">${author.tagline}</span><span class="hero__caret" aria-hidden="true"></span></p>
      <div class="hero__ctas">
        <a class="btn btn--primary" href="/#books" data-cursor="Open">Explore the books</a>
        <a class="btn btn--ghost" href="/book.html?id=the-lantern-keeper#excerpt" data-cursor="Read">Read an excerpt</a>
      </div>
    </div>
    <a class="hero__cue" href="/#featured" aria-label="Scroll to the next section">
      <span class="hero__cue-label eyebrow">Scroll</span>
      <svg viewBox="0 0 24 96" width="24" height="96" aria-hidden="true" focusable="false">
        <path class="hero__cue-line" d="M12 2v78" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" pathLength="1"/>
        <g class="hero__cue-quill" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 80c-4-3-5-8-3-14 5 2 8 7 3 14z"/><path d="M12 80 12 88"/></g>
      </svg>
    </a>`;
}

/** Injects the site URL + JSON-LD into the built HTML and emits sitemap.xml. */
function seo() {
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': `${SITE}/#author`, name: author.name, jobTitle: 'Author', url: `${SITE}/`,
        description: author.shortBio, image: `${SITE}/images/og.jpg`,
        homeLocation: { '@type': 'Place', name: author.location },
        sameAs: socials.map((s) => s.url).filter((u) => /^https?:/.test(u)),
      },
      { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: `${author.name}, Author`, publisher: { '@id': `${SITE}/#author` } },
      ...books.map((b) => ({
        '@type': 'Book', name: b.title, url: `${SITE}/book.html?id=${b.slug}`, author: { '@id': `${SITE}/#author` },
        datePublished: b.releaseDate, numberOfPages: b.pages, genre: b.genres, description: b.logline,
        ...(b.series ? { isPartOf: { '@type': 'BookSeries', name: b.series }, position: b.number } : {}),
      })),
    ],
  };
  const pre = {
    name: 'ev-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replaceAll('%SITE%', SITE)
          .replace('<!--HERO-->', heroHTML())
          .replace('<!--JSONLD-->', `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`);
      },
    },
    generateBundle() {
      const urls = [`${SITE}/`, ...books.map((b) => `${SITE}/book.html?id=${b.slug}`)];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map((u, i) => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc><changefreq>monthly</changefreq><priority>${i ? '0.7' : '1.0'}</priority></url>`)
        .join('\n')}\n</urlset>\n`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
    },
  };
  // Preload the faces used in the first viewport (Latin subsets only).
  const preload = {
    name: 'ev-font-preload',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html; // dev server
        const wanted = /assets\/(fraunces-latin-full-normal|newsreader-latin-wght-normal|inter-tight-latin-wght-normal)-[\w-]+\.woff2$/;
        const tags = Object.keys(ctx.bundle).filter((f) => wanted.test(f)).map((f) => ({
          tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' }, injectTo: 'head-prepend',
        }));
        return { html, tags };
      },
    },
  };
  return [pre, preload];
}

export default defineConfig({
  plugins: seo(),
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        book: resolve(import.meta.dirname, 'book.html'),
        press: resolve(import.meta.dirname, 'press.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
