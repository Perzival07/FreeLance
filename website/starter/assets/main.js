(function () {
  'use strict';

  // ========================================================================
  // WhatsApp Shared URL Builder — single source of truth for every button
  // ========================================================================
  const WHATSAPP_CONFIG = {
    number: '447700900123',
    message: 'Hi Lune & Crumb, I would like to reserve fresh sourdough and pastries for pickup today.'
  };

  function buildWhatsAppUrl(phone = WHATSAPP_CONFIG.number, message = WHATSAPP_CONFIG.message) {
    const phoneStr = String(phone != null ? phone : '').trim();
    const cleanPhone = phoneStr.startsWith('[') ? phoneStr : phoneStr.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(message != null ? String(message) : '');
    return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  }

  // Context-specific prefilled messages, keyed by the data-whatsapp-button value.
  // A bare data-whatsapp-button (no value) gets the default reserve message.
  const WHATSAPP_MESSAGES = {
    'reserve-tomorrow': "Hi Lune & Crumb, I'd like to reserve the following for pickup tomorrow morning: ",
    'occasion-cake': "Hi Lune & Crumb, I'd like a quote for a celebration cake on __ (date). Size / flavour: __",
    'occasion-brunch': "Hi Lune & Crumb, I'd like to order a weekend brunch box for __ people, for pickup on __ (date).",
    'occasion-office': "Hi Lune & Crumb, I'd like a quote for an office pastry platter for __ people on __ (date).",
    'occasion-gift': "Hi Lune & Crumb, I'd like to put together a bread & pastry gift hamper for __ (date). Budget: __",
    'allergens': "Hi Lune & Crumb, could you send me the full allergen sheet for today's bakes?",
    'bread-club': "Hi Lune & Crumb, I'd like to join the Bread Club. Loaf: __, collection day: __",
    'gift-loaf': "Hi Lune & Crumb, I'd like to gift a loaf to __. Please send me a voucher.",
    'question': "Hi Lune & Crumb, I have a quick question: "
  };

  function syncWhatsAppButtons() {
    document.querySelectorAll('[data-whatsapp-button]').forEach(function (btn) {
      const key = btn.getAttribute('data-whatsapp-button');
      const message = WHATSAPP_MESSAGES[key] || WHATSAPP_CONFIG.message;
      btn.setAttribute('href', buildWhatsAppUrl(WHATSAPP_CONFIG.number, message));
    });
  }

  syncWhatsAppButtons();

  // ========================================================================
  // Opening hours — single source of truth (UK time). Index 0 = Sunday.
  // Keep in sync with the JSON-LD openingHoursSpecification in index.html.
  // ========================================================================
  const OPENING_HOURS = [
    { open: '08:00', close: '13:00' }, // Sun
    null,                              // Mon — closed
    { open: '06:30', close: '15:00' }, // Tue
    { open: '06:30', close: '15:00' }, // Wed
    { open: '06:30', close: '15:00' }, // Thu
    { open: '06:30', close: '16:00' }, // Fri
    { open: '07:00', close: '16:00' }  // Sat
  ];
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Current day (0–6) and minutes since midnight in Bath, regardless of the visitor's timezone
  function getBathNow() {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      const get = function (type) { return parts.find(function (p) { return p.type === type; })?.value; };
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      return { day: day, minutes: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      const now = new Date();
      return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
  }

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  function nextOpening(fromDay) {
    for (let i = 1; i <= 7; i++) {
      const d = (fromDay + i) % 7;
      if (OPENING_HOURS[d]) return { day: d, hours: OPENING_HOURS[d], isTomorrow: i === 1 };
    }
    return null;
  }

  function describeOpenStatus() {
    const now = getBathNow();
    const today = OPENING_HOURS[now.day];
    if (today && now.minutes < toMinutes(today.open)) {
      return { label: 'Opens today at ' + today.open, detail: 'Until ' + today.close + ', or until we sell out' };
    }
    if (today && now.minutes < toMinutes(today.close)) {
      return { label: 'Open now, until ' + today.close, detail: 'Sourdough goes by mid-morning' };
    }
    const next = nextOpening(now.day);
    if (!next) return null;
    const when = next.isTomorrow ? 'tomorrow' : DAY_NAMES[next.day];
    return { label: (today ? 'Closed now' : 'Closed today') + ', opens ' + when + ' ' + next.hours.open, detail: 'Reserve tonight for the morning' };
  }

  function setupOpenStatus() {
    const status = describeOpenStatus();
    if (status) {
      document.querySelectorAll('[data-open-status]').forEach(function (el) { el.textContent = status.label; });
      document.querySelectorAll('[data-open-detail]').forEach(function (el) { el.textContent = status.detail; });
    }

    // Contact page: highlight today's row (rows run Monday → Sunday)
    const rows = document.querySelectorAll('.hours-table tbody tr');
    if (rows.length === 7) {
      const rowIndex = (getBathNow().day + 6) % 7;
      rows.forEach(function (row, i) { row.classList.toggle('is-today', i === rowIndex); });
    }
  }
  setupOpenStatus();

  // ========================================================================
  // Seasonal hero copy — swaps only the status pill and tagline text.
  // Ranges are inclusive 'MM-DD'; Easter-relative entries use offsets in days.
  // ========================================================================
  const SEASONAL_COPY = [
    { easterFrom: -14, easterTo: 0, pill: 'Hot cross buns for Easter', tagline: 'Spiced, fruit-studded hot cross buns join the counter for Easter. Reserve a half-dozen before the bank-holiday rush.' },
    { from: '11-20', to: '12-24', pill: 'Stollen now baking', tagline: 'Marzipan-filled stollen joins the counter for the festive weeks, alongside our everyday 36-hour sourdough.' },
    { from: '09-22', to: '11-19', pill: 'Somerset apple season', tagline: 'Cider-apple cake, cardamom buns and dark rye for shorter mornings, with the ovens still hot from 06:30.' }
  ];

  // Anonymous Gregorian algorithm — returns Easter Sunday for a given year
  function easterSunday(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function setupSeasonalHero() {
    const pillText = document.querySelector('[data-seasonal-pill]');
    const tagline = document.querySelector('[data-seasonal-tagline]');
    if (!pillText && !tagline) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const mmdd = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const dayMs = 86400000;

    const season = SEASONAL_COPY.find(function (s) {
      if (s.easterFrom != null) {
        const offset = Math.round((today - easterSunday(now.getFullYear())) / dayMs);
        return offset >= s.easterFrom && offset <= s.easterTo;
      }
      return mmdd >= s.from && mmdd <= s.to;
    });
    if (!season) return;

    if (pillText) {
      pillText.textContent = season.pill;
      pillText.closest('.live-status-pill')?.setAttribute('aria-label', 'Bakery status: ' + season.pill);
    }
    if (tagline) tagline.textContent = season.tagline;
  }
  setupSeasonalHero();

  // ========================================================================
  // Navbar: shrink + shadow on scroll, mobile hamburger, active link
  // ========================================================================
  function setupNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    const mobileMenu = document.querySelector('.navbar-mobile-menu');
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
      });

      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('menu-open');
        });
      });
    }

    // Mark current page's nav link(s) as active
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-links a, .navbar-mobile-links a').forEach(function (link) {
      const linkPath = link.getAttribute('href').split('/').pop() || 'index.html';
      if (linkPath === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  setupNavbar();

  // ========================================================================
  // Scroll progress bar
  // ========================================================================
  function setupScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      bar.style.transform = `scaleX(${pct})`;
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
  setupScrollProgress();

  // ========================================================================
  // Scroll-Reveal Animation (IntersectionObserver)
  // ========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setupScrollReveal() {
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('has-reveal');

    const revealTargets = document.querySelectorAll('[data-reveal]');
    revealTargets.forEach(function (el) { el.classList.add('reveal-section'); });

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    // threshold 0: reveal as soon as the section's top edge is on screen. A ratio
    // threshold never fires on load for very tall sections (e.g. the bread grid).
    }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  setupScrollReveal();

  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      document.documentElement.classList.remove('has-reveal');
      document.querySelectorAll('.reveal-section').forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }
  });

  // ========================================================================
  // Theme detection hook
  // ========================================================================
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  function applySystemTheme(e) {
    document.documentElement.dataset.systemTheme = e.matches ? 'dark' : 'light';
  }
  themeMedia.addEventListener('change', applySystemTheme);
  applySystemTheme(themeMedia);

  // Gracefully collapse optional hero photo wrapper if src is missing or broken
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    function hideHeroPhoto() {
      heroPhoto.classList.add('is-hidden');
      heroPhoto.closest('.hero-media')?.style.setProperty('display', 'none');
    }
    const src = heroPhoto.getAttribute('src');
    if (!src || src.trim() === '') hideHeroPhoto();
    heroPhoto.addEventListener('error', hideHeroPhoto);
  }

  // ========================================================================
  // Scroll-to-top button
  // ========================================================================
  function setupScrollTop() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    });
  }
  setupScrollTop();

  // ========================================================================
  // Animated count-up stats
  // ========================================================================
  function setupCountUpStats() {
    const stats = document.querySelectorAll('.stat-number[data-count-to]');
    if (!stats.length) return;

    function animateStat(el) {
      const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      if (prefersReducedMotion.matches) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      stats.forEach(animateStat);
      return;
    }
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (el) { observer.observe(el); });
  }
  setupCountUpStats();

  // ========================================================================
  // Menu page: category tab scroll-spy filter
  // ========================================================================
  function setupMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab[data-target]');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const targetId = tab.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    const categories = document.querySelectorAll('.menu-category');
    if (!categories.length || !('IntersectionObserver' in window)) return;
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tabs.forEach(function (t) {
            t.classList.toggle('is-active', t.getAttribute('data-target') === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    categories.forEach(function (c) { spy.observe(c); });
  }
  setupMenuTabs();

  // ========================================================================
  // Gallery: filter + lightbox
  // ========================================================================
  function setupGallery() {
    const filterButtons = document.querySelectorAll('.gallery-filter [data-filter], .bread-filter [data-filter]');
    const items = document.querySelectorAll('.gallery-item');
    if (filterButtons.length && items.length) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          const filter = btn.getAttribute('data-filter');
          items.forEach(function (item) {
            const show = filter === 'all' || item.getAttribute('data-category') === filter;
            item.style.display = show ? '' : 'none';
          });
        });
      });
    }

    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(item) {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.setAttribute('src', img.getAttribute('src'));
      lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
      lightboxCaption.textContent = item.querySelector('.gallery-caption')?.textContent || '';
      lightbox.classList.add('is-open');
      document.body.classList.add('menu-open');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      lightboxImg.setAttribute('src', '');
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
    });
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }
  setupGallery();

  // ========================================================================
  // FAQ accordion
  // ========================================================================
  function setupFaq() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('is-open');
        item.parentElement.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('is-open'); });
        if (!wasOpen) item.classList.add('is-open');
      });
    });
  }
  setupFaq();

  // ========================================================================
  // Inline video blocks: click to play/pause, pause offscreen ones
  // ========================================================================
  function setupVideoBlocks() {
    const blocks = document.querySelectorAll('.video-block');
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      const video = block.querySelector('video');
      const playBtn = block.querySelector('.video-play-btn');
      if (!video) return;

      block.addEventListener('click', function () {
        if (video.paused) {
          video.play();
          block.classList.add('is-playing');
        } else {
          video.pause();
          block.classList.remove('is-playing');
        }
      });

      video.addEventListener('play', function () { playBtn?.style.setProperty('opacity', '0'); });
      video.addEventListener('pause', function () { playBtn?.style.removeProperty('opacity'); });
    });

    if ('IntersectionObserver' in window) {
      const pauseObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            const video = entry.target.querySelector('video');
            video?.pause();
          }
        });
      }, { threshold: 0.1 });
      blocks.forEach(function (b) { pauseObserver.observe(b); });
    }
  }
  setupVideoBlocks();

  // ========================================================================
  // Hero background video: pause when scrolled out of view (saves battery)
  // ========================================================================
  function setupHeroVideo() {
    const heroVideo = document.querySelector('.hero-video-bg, [data-hero-video]');
    if (!heroVideo) return;
    // Interior page heroes keep their poster still for reduced-motion visitors
    if (heroVideo.hasAttribute('data-hero-video') && prefersReducedMotion.matches) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          heroVideo.play().catch(function () {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroVideo);
  }
  setupHeroVideo();

  // ========================================================================
  // Contact form (front-end only — hands off to WhatsApp with prefilled msg)
  // ========================================================================
  function setupContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#name')?.value.trim() || '';
      const phone = form.querySelector('#phone')?.value.trim() || '';
      const message = form.querySelector('#message')?.value.trim() || '';
      const composed = `Hi Lune & Crumb, my name is ${name || 'a customer'}.${phone ? ' Phone: ' + phone + '.' : ''} ${message || 'I would like to place an order.'}`;
      window.open(buildWhatsAppUrl(WHATSAPP_CONFIG.number, composed), '_blank', 'noopener,noreferrer');
    });
  }
  setupContactForm();

  // ========================================================================
  // Footer newsletter signup (front-end only — no backend, confirms client-side)
  // ========================================================================
  function setupNewsletterForm() {
    const form = document.querySelector('[data-newsletter-form]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');
      if (!input || !button) return;
      const originalLabel = button.textContent;
      button.textContent = 'Joined!';
      form.querySelector('input')?.setAttribute('disabled', 'true');
      button.setAttribute('disabled', 'true');
      setTimeout(function () {
        button.textContent = originalLabel;
        input.value = '';
        input.removeAttribute('disabled');
        button.removeAttribute('disabled');
      }, 3000);
    });
  }
  setupNewsletterForm();

  // ========================================================================
  // Fade images in once loaded, instead of popping in abruptly
  // ========================================================================
  function setupImageFadeIn() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.closest('.lightbox')) return;
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
        return;
      }
      img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true });
    });
  }
  setupImageFadeIn();

  // ========================================================================
  // Sold out today — edit `date` + `items` each morning (data-item slugs from
  // menu.html). Entries only apply on their own date, so they never go stale.
  // ========================================================================
  const SOLD_OUT_TODAY = {
    date: '',     // e.g. '2026-10-15' (UK date)
    items: []     // e.g. ['kouign-amann', 'almond-croissant']
  };

  function getBathDateKey() {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function setupSoldOut() {
    if (!SOLD_OUT_TODAY.date || SOLD_OUT_TODAY.date !== getBathDateKey()) return;
    SOLD_OUT_TODAY.items.forEach(function (slug) {
      document.querySelectorAll('.menu-item[data-item="' + slug + '"]').forEach(function (item) {
        item.classList.add('is-sold-out');
        const info = item.querySelector('.menu-item-info');
        if (info && !info.querySelector('.sold-out-note')) {
          const note = document.createElement('span');
          note.className = 'sold-out-note';
          note.textContent = 'Sold out today · back tomorrow';
          info.appendChild(note);
        }
      });
    });
  }
  setupSoldOut();

  // ========================================================================
  // Menu: build a reservation — tap items to add them, send one WhatsApp
  // message. Progressive enhancement: controls are injected by JS only.
  // ========================================================================
  const RESERVATION_KEY = 'lc-reservation';
  const RESERVATION_MAX_AGE = 24 * 60 * 60 * 1000;

  function loadReservation() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(RESERVATION_KEY) || 'null');
      if (saved && saved.items && Date.now() - saved.savedAt < RESERVATION_MAX_AGE) return saved.items;
    } catch (e) { /* storage unavailable or corrupt — start empty */ }
    return {};
  }

  function saveReservation(items) {
    try {
      if (Object.keys(items).length) {
        window.localStorage.setItem(RESERVATION_KEY, JSON.stringify({ savedAt: Date.now(), items: items }));
      } else {
        window.localStorage.removeItem(RESERVATION_KEY);
      }
    } catch (e) { /* private mode etc. — the list still works for this visit */ }
  }

  function setupReservationBuilder() {
    const root = document.querySelector('[data-reservation-builder]');
    if (!root) return;
    const stickyBar = document.querySelector('.sticky-bar');
    const sendBtn = stickyBar?.querySelector('.btn-sticky');
    const brand = stickyBar?.querySelector('.sticky-brand');
    if (!stickyBar || !sendBtn || !brand) return;

    const catalogue = {};
    root.querySelectorAll('.menu-item[data-item]').forEach(function (item) {
      if (item.hasAttribute('data-no-add')) return;
      const slug = item.getAttribute('data-item');
      const name = item.querySelector('h4')?.textContent.trim() || slug;
      catalogue[slug] = { name: name, el: item };

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'menu-add';
      btn.setAttribute('aria-label', 'Add ' + name + ' to your reservation list');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span class="menu-add-count" aria-hidden="true"></span>';
      btn.addEventListener('click', function () { change(slug, 1); });
      item.appendChild(btn);
      catalogue[slug].btn = btn;
    });

    root.querySelectorAll('[data-reserve-hint]').forEach(function (h) { h.hidden = false; });

    let items = loadReservation();
    Object.keys(items).forEach(function (slug) {
      if (!catalogue[slug] || catalogue[slug].el.classList.contains('is-sold-out')) delete items[slug];
    });

    // Sticky bar: summary + review toggle, shown only while the list has items
    const defaultBrandHtml = brand.innerHTML;
    const defaultLabel = sendBtn.innerHTML;
    const defaultHref = sendBtn.getAttribute('href');

    const panel = document.createElement('div');
    panel.className = 'reserve-panel';
    panel.id = 'reserve-panel';
    panel.hidden = true;
    panel.innerHTML = '<div class="wrap"><div class="reserve-panel-head"><span class="eyebrow">Your reservation list</span><button type="button" class="reserve-clear">Clear list</button></div><ul class="reserve-list"></ul><p class="reserve-panel-note">We\'ll confirm availability and a pickup time on WhatsApp. Nothing is charged here.</p></div>';
    stickyBar.parentNode.insertBefore(panel, stickyBar);
    const list = panel.querySelector('.reserve-list');
    panel.querySelector('.reserve-clear').addEventListener('click', function () {
      items = {};
      render();
    });

    const live = document.createElement('p');
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    function change(slug, delta) {
      if (catalogue[slug]?.el.classList.contains('is-sold-out')) return;
      const next = (items[slug] || 0) + delta;
      if (next > 0) items[slug] = Math.min(next, 24); else delete items[slug];
      live.textContent = catalogue[slug].name + ': ' + (items[slug] || 0) + ' on your list';
      render();
    }

    function buildMessage() {
      const lines = Object.keys(items).map(function (slug) { return items[slug] + 'x ' + catalogue[slug].name; });
      return "Hi Lune & Crumb, I'd like to reserve for pickup: " + lines.join(', ') + '. Pickup day/time: __';
    }

    function render() {
      saveReservation(items);
      const slugs = Object.keys(items);
      const total = slugs.reduce(function (n, s) { return n + items[s]; }, 0);

      Object.keys(catalogue).forEach(function (slug) {
        const c = catalogue[slug];
        const qty = items[slug] || 0;
        c.btn.classList.toggle('has-items', qty > 0);
        c.btn.querySelector('.menu-add-count').textContent = qty ? qty : '';
        c.btn.disabled = c.el.classList.contains('is-sold-out');
      });

      list.innerHTML = '';
      slugs.forEach(function (slug) {
        const li = document.createElement('li');
        li.className = 'reserve-row';
        li.innerHTML = '<span class="reserve-row-name"></span><span class="reserve-stepper"><button type="button" data-delta="-1">−</button><span class="reserve-qty"></span><button type="button" data-delta="1">+</button></span>';
        li.querySelector('.reserve-row-name').textContent = catalogue[slug].name;
        li.querySelector('.reserve-qty').textContent = items[slug];
        li.querySelectorAll('button').forEach(function (b) {
          const d = Number(b.getAttribute('data-delta'));
          b.setAttribute('aria-label', (d > 0 ? 'Add one ' : 'Remove one ') + catalogue[slug].name);
          b.addEventListener('click', function () { change(slug, d); });
        });
        list.appendChild(li);
      });

      if (total) {
        brand.innerHTML = '<button type="button" class="reserve-toggle" aria-controls="reserve-panel"></button>';
        const toggle = brand.querySelector('.reserve-toggle');
        toggle.textContent = total + (total === 1 ? ' item' : ' items') + ' on your list';
        toggle.setAttribute('aria-expanded', String(!panel.hidden));
        toggle.addEventListener('click', function () {
          panel.hidden = !panel.hidden;
          toggle.setAttribute('aria-expanded', String(!panel.hidden));
        });
        sendBtn.textContent = 'Send list on WhatsApp';
        sendBtn.setAttribute('href', buildWhatsAppUrl(WHATSAPP_CONFIG.number, buildMessage()));
      } else {
        panel.hidden = true;
        brand.innerHTML = defaultBrandHtml;
        sendBtn.innerHTML = defaultLabel;
        sendBtn.setAttribute('href', defaultHref);
      }
    }
    render();
  }
  setupReservationBuilder();

  // ========================================================================
  // Classes: compute each class's next date from its monthly rule, and put
  // that date into the "Ask about a place" WhatsApp message.
  // data-week: 1–4 or "last"; data-weekday: 0 (Sun) – 6 (Sat)
  // ========================================================================
  function nthWeekdayOfMonth(year, month, week, weekday) {
    if (week === 'last') {
      const last = new Date(year, month + 1, 0);
      last.setDate(last.getDate() - ((last.getDay() - weekday + 7) % 7));
      return last;
    }
    const first = new Date(year, month, 1);
    const offset = (weekday - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + (Number(week) - 1) * 7);
  }

  function setupClasses() {
    const cards = document.querySelectorAll('[data-class-rule]');
    if (!cards.length) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

    cards.forEach(function (card) {
      const week = card.getAttribute('data-week');
      const weekday = Number(card.getAttribute('data-weekday'));
      let date = nthWeekdayOfMonth(today.getFullYear(), today.getMonth(), week, weekday);
      if (date < today) date = nthWeekdayOfMonth(today.getFullYear(), today.getMonth() + 1, week, weekday);
      const label = fmt.format(date);

      const chip = card.querySelector('[data-class-next]');
      if (chip) {
        chip.textContent = 'Next: ' + label;
        chip.hidden = false;
      }
      const cta = card.querySelector('[data-class-cta]');
      if (cta) {
        const name = card.querySelector('.highlight-title')?.textContent.trim() || 'class';
        cta.setAttribute('href', buildWhatsAppUrl(WHATSAPP_CONFIG.number,
          "Hi Lune & Crumb, I'd like to ask about a place: " + name + ', ' + label + '.'));
      }
    });
  }
  setupClasses();

  // ========================================================================
  // Optional "Sounds of the bakery" toggle — muted by default, never autoplays.
  // Stays hidden until the audio file named in data-ambience-src exists.
  // ========================================================================
  function setupAmbience() {
    const toggle = document.querySelector('[data-ambience-src]');
    if (!toggle) return;
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0.5;

    fetch(toggle.getAttribute('data-ambience-src'), { method: 'HEAD' }).then(function (res) {
      if (!res.ok) return;
      audio.src = toggle.getAttribute('data-ambience-src');
      toggle.hidden = false;
    }).catch(function () {});

    toggle.addEventListener('click', function () {
      const on = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(on));
      toggle.querySelector('[data-ambience-label]').textContent = on ? 'Sound on' : 'Sounds of the bakery';
      if (on) audio.play().catch(function () {}); else audio.pause();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) audio.pause();
      else if (toggle.getAttribute('aria-pressed') === 'true') audio.play().catch(function () {});
    });
  }
  setupAmbience();

  // ========================================================================
  // Bread Directory: large recipe & pairings pop-up. Mouse users get it on
  // hover (after a short pause); touch and keyboard users open it with the
  // "Recipe & pairings" button, where it behaves as a modal dialog.
  // ========================================================================
  function setupBreadPopup() {
    const cards = document.querySelectorAll('.bread-card');
    if (!cards.length || !document.querySelector('.bread-card-more')) return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    const backdrop = document.createElement('div');
    backdrop.className = 'bread-pop-backdrop';
    const pop = document.createElement('div');
    pop.className = 'bread-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-labelledby', 'bread-pop-title');
    pop.innerHTML =
      '<button type="button" class="bread-pop-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="bread-pop-media"></div>' +
      '<div class="bread-pop-body">' +
        '<span class="bread-card-origin" data-pop="origin"></span>' +
        '<h3 id="bread-pop-title" data-pop="title"></h3>' +
        '<p class="bread-pop-desc" data-pop="desc"></p>' +
        '<div class="bread-card-meta" data-pop="meta"></div>' +
        '<div class="bread-pop-cols">' +
          '<div class="bread-pop-col"><span class="bread-more-label">Bake it at home</span><p class="bread-more-ing" data-pop="ing"></p><ol class="bread-more-steps" data-pop="steps"></ol></div>' +
          '<div class="bread-pop-col"><span class="bread-more-label">Made for</span><ul class="bread-more-uses" data-pop="uses"></ul></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(backdrop);
    document.body.appendChild(pop);
    const slot = function (name) { return pop.querySelector('[data-pop="' + name + '"]'); };
    const closeBtn = pop.querySelector('.bread-pop-close');

    let current = null;
    let isModal = false;
    let openTimer = null;
    let closeTimer = null;

    function fill(card) {
      const media = pop.querySelector('.bread-pop-media');
      media.innerHTML = '';
      const picture = card.querySelector('.bread-card-media picture');
      if (picture) {
        const clone = picture.cloneNode(true);
        const img = clone.querySelector('img');
        if (img) { img.loading = 'eager'; img.classList.add('is-loaded'); }
        media.appendChild(clone);
      }
      const more = card.querySelector('.bread-card-more');
      const text = function (sel, root) { return (root || card).querySelector(sel)?.innerHTML || ''; };
      slot('origin').innerHTML = text('.bread-card-origin');
      slot('title').innerHTML = text('.bread-card-body h3');
      slot('desc').innerHTML = text('.bread-card-desc');
      slot('meta').innerHTML = text('.bread-card-meta');
      slot('ing').innerHTML = text('.bread-more-ing', more);
      slot('steps').innerHTML = text('.bread-more-steps', more);
      slot('uses').innerHTML = text('.bread-more-uses', more);
      closeBtn.setAttribute('aria-label', 'Close ' + slot('title').textContent);
    }

    function open(card, modal) {
      clearTimeout(closeTimer);
      if (current !== card) fill(card);
      current = card;
      isModal = !!modal;
      pop.setAttribute('aria-modal', String(isModal));
      backdrop.classList.toggle('is-modal', isModal);
      backdrop.classList.add('is-visible');
      pop.classList.add('is-open');
      if (isModal) closeBtn.focus();
    }

    function close() {
      clearTimeout(openTimer);
      if (!current) return;
      const wasModal = isModal;
      const card = current;
      pop.classList.remove('is-open');
      backdrop.classList.remove('is-visible', 'is-modal');
      current = null;
      isModal = false;
      if (wasModal) card.querySelector('.bread-more-toggle')?.focus();
    }

    function scheduleClose() {
      if (isModal) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 220);
    }

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        if (!canHover.matches || isModal) return;
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        openTimer = setTimeout(function () { open(card, false); }, current ? 120 : 320);
      });
      card.addEventListener('mouseleave', function () {
        if (!canHover.matches || isModal) return;
        clearTimeout(openTimer);
        scheduleClose();
      });
      card.querySelector('.bread-more-toggle')?.addEventListener('click', function (e) {
        e.stopPropagation();
        clearTimeout(openTimer);
        open(card, true);
      });
    });

    pop.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    pop.addEventListener('mouseleave', scheduleClose);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && current) close();
    });
    window.addEventListener('scroll', function () { if (current && !isModal) close(); }, { passive: true });
  }
  setupBreadPopup();
})();
