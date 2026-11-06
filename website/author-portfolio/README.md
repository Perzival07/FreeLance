# Elara Voss: Author Portfolio

A long-scroll author website built with **Vite** (vanilla JS, multi-page), **GSAP + ScrollTrigger + Flip** and **Lenis**.
The sample author, **Elara Voss**, her books, quotes, events and press are all fictional and original.
To use it for a real author, edit one data file and swap the images.

> Mood: an old library at night, lit by a single lantern. Day mode is parchment and ink; night mode is ink and candle.

## Run it

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
npm run build      # production build -> dist/
npm run preview    # serve the built site locally
npm run presskit   # regenerate public/press-kit/bio.txt + fact-sheet.txt from the data file
```

Requires Node 18+.

## Pages

| Page | File | What it is |
| --- | --- | --- |
| Home | `index.html` + `src/main.js` | 11 sections: hero, upcoming release, bookshelf, world map, quiz, about + timeline, praise, events, journal, newsletter, press kit + contact |
| Book detail | `book.html?id=<slug>` + `src/book.js` | Rendered from the data file; unknown ids redirect to the 404 |
| Not found | `404.html` + `src/notfound.js` | "Lost to the fog" with a moth that follows the cursor |

## Features

- **Hero**: static HTML (paints instantly), ink-bleed name reveal, typed tagline, three floating 3D books with pointer + scroll parallax, ink cursor trail
- **Code-designed book covers** (CSS + inline SVG, five motifs) and a **CSS 3D book** component
- **Pinned scroll scene** for the upcoming book: cover swings open, opening lines type in, a map draws itself, live flip **countdown**, `.ics` calendar download
- **Bookshelf**: 3D spines that slide out on hover, Flip-animated filters, an **open-book reader** with page-turn animation (mobile gets a swipe carousel and a scrolling sheet)
- **Illustrated world map** that inks itself, accessible lantern hotspots, drag/pinch/zoom, plus a reading-order path
- **"Which book should you read first?" quiz** with scoring, a share button and a retake
- **About** with a duotone portrait, line-by-line bio reveal, a self-drawing signature, and a **horizontal pinned timeline**
- **Praise**: seamless two-row marquee (scroll-velocity aware, pausable), count-up stats, tilting laurel seals
- **Events**: next-event card with countdown, ticket-stub list, type filters, past-events toggle, per-event `.ics`
- **Journal** masonry with a reading overlay, **newsletter** with an envelope + wax-seal animation
- **Press kit** (copy buttons, downloadable headshots and text files) and a tabbed **contact form**
- **Extras**: synthesised **hover sounds** in the World section (bell, wood, pluck, paper, tick; unlock on first click, mute toggle in the header), type `lantern` anywhere for a lantern-light easter egg, page transitions (View Transitions API with an ink-wipe fallback), day/night theme, reading-progress bookmark, custom cursor

## Edit the content

Everything lives in **`src/data/author.js`**:

- `author`: name, tagline, bios, socials, agent / publicist contacts, portrait
- `books[]`: title, series, dates, blurb, excerpt, cover design (`palette`, `motif`), reviews, retailers, awards
- `series`, `worldMap`, `quiz`, `timeline`, `praise`, `awards`, `events`, `journal`, `newsletter`
- `images`: every photo URL used on the site (Unsplash). Replace them with your own. **Check each URL returns HTTP 200.**

Upcoming vs. past events and the featured "next release" are worked out from today's date, so nothing needs to be flipped by hand.

Then run `npm run presskit` to refresh the downloadable bio and fact sheet, and drop real headshots into `public/press-kit/` (`headshot-1.jpg`, `headshot-2.jpg`).

### Swap in a real author: checklist

1. Edit `src/data/author.js` (replace all fictional text and URLs).
2. Replace `public/press-kit/headshot-*.jpg`, `public/images/og.jpg` (1200x630) and the favicon set in `public/`.
3. Set the real domain (see Deploy) and replace the placeholder `Sitemap:` line in `public/robots.txt`.
4. Replace the `#` retailer / social / ticket links.
5. Wire the forms (below) to a real service.

## The forms are demos

The newsletter and the contact form **do not send anything**: they validate, wait a moment, then show a success state.
The contact form includes an **"or open in your email app"** link that builds a `mailto:` from what the visitor typed, so it is usable as-is.
To go live, post the form data to your provider (Formspree, Buttondown, Mailchimp, Resend, a serverless function...) inside the `submit` handlers in
`src/sections/newsletter.js` and `src/sections/presskit-contact.js`.

## Deploy (Vercel)

The Git repo root is `/Users/kd/Desktop/FreeLance` and also holds other projects (`mid/`, `starter/`) that have their own `vercel.json`.
**Deploy this site as its own Vercel project with the Root Directory set to `website/author-portfolio`.**

1. Vercel dashboard, then *Add New Project*, then import the repo.
2. *Root Directory*: `website/author-portfolio`. Framework preset: **Vite** (the included `vercel.json` already sets the build command and `dist` output).
3. Add an environment variable **`SITE_URL`** with your real origin, e.g. `https://www.yourname.com`. It is used for canonical links, Open Graph, JSON-LD and `sitemap.xml`. Without it the build uses the placeholder `https://elaravoss.example`.
4. Deploy. Unknown URLs are served `404.html` automatically.

Local production check: `SITE_URL=https://example.com npm run build && npm run preview`.

## Accessibility, performance and SEO

- Semantic landmarks, one `h1` per page, no skipped heading levels, alt text on every image, 44px minimum tap targets, visible focus rings, keyboard-operable everywhere (modals trap focus and restore it, tabs follow the ARIA pattern, `inert` on the page behind modals)
- Colour contrast is AA in both themes (tokens were checked; the day accent is `#A93F24`)
- `prefers-reduced-motion`: smooth scroll, cursor effects, parallax, pinning, page transitions, marquee and animated intros are all switched off; content is fully visible and static
- Self-hosted variable fonts (Fraunces, Newsreader, Inter Tight via Fontsource) with preload for the first-paint faces; the hero is static HTML; below-the-fold sections initialise in idle time
- Per-page `<title>` / description / Open Graph, JSON-LD (`Person`, `WebSite`, `Book`), `sitemap.xml`, `robots.txt`, favicon set + web manifest
- No horizontal scroll from 320px to 1920px

## Project structure

```
index.html  book.html  404.html
public/            favicons, manifest, robots.txt, images/og.jpg, press-kit/
scripts/           build-press-kit.mjs
src/
  main.js book.js notfound.js          page entries
  data/author.js                       ALL content
  core/    smooth-scroll shell theme cursor progress preloader transitions
           split-text sound lantern utils
  components/  cover book3d modal countdown marquee
  sections/    hero featured bookshelf world-map quiz about praise events
               journal newsletter presskit-contact
  styles/      tokens base layout shell book3d notfound sections/*.css
vite.config.js     multi-page build + SEO plugin (JSON-LD, sitemap, font preload)
```

## Credits

- Photographs are placeholder stock images from [Unsplash](https://unsplash.com); replace them with your own before launch. The "headshots" are stock photos of a stranger standing in for the fictional author.
- Fonts: Fraunces, Newsreader, Inter Tight (SIL Open Font License) via [Fontsource](https://fontsource.org).
- Motion: [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering).
- All names, books, quotes, outlets, prizes and events are invented. Any resemblance to real people or titles is coincidental.
