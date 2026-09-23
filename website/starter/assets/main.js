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

  function syncWhatsAppButtons() {
    const url = buildWhatsAppUrl();
    document.querySelectorAll('[data-whatsapp-button]').forEach(function (btn) {
      btn.setAttribute('href', url);
    });
  }

  syncWhatsAppButtons();

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
    }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.12 });

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
    const heroVideo = document.querySelector('.hero-video-bg');
    if (!heroVideo || !('IntersectionObserver' in window)) return;
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
})();
