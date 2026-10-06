/* ==========================================================================
   GHAM Ghana Ltd — main script
   ========================================================================== */

(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  if (!header) return;

  const toggle = header.querySelector('[data-menu-toggle]');
  const label = header.querySelector('[data-menu-label]');
  const nav = header.querySelector('[data-nav]');
  const desktop = window.matchMedia('(min-width: 68.75em)');
  const root = document.documentElement;

  /* ---------- Mobile / tablet menu ---------- */

  let isOpen = false;

  // While the menu is open, everything outside the header is inert,
  // so keyboard and screen-reader focus stays within the header.
  function setOutsideInert(inert) {
    for (const el of document.body.children) {
      if (el !== header && el.tagName !== 'SCRIPT') el.inert = inert;
    }
  }

  function openMenu() {
    isOpen = true;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    label.textContent = 'Close';
    root.classList.add('menu-open');
    setOutsideInert(true);
  }

  function closeMenu({ returnFocus = false } = {}) {
    isOpen = false;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    label.textContent = 'Menu';
    root.classList.remove('menu-open');
    setOutsideInert(false);
    if (returnFocus) toggle.focus();
  }

  if (toggle && nav && label) {
    toggle.addEventListener('click', () => (isOpen ? closeMenu() : openMenu()));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) closeMenu({ returnFocus: true });
    });

    nav.addEventListener('click', (event) => {
      if (isOpen && event.target.closest('a')) closeMenu();
    });
  }

  /* ---------- Condensed header on scroll (desktop) ---------- */

  const CONDENSE_AT = 24;
  let condensed = false;
  let ticking = false;

  function updateCondensed() {
    ticking = false;
    const next = desktop.matches && window.scrollY > CONDENSE_AT;
    if (next !== condensed) {
      condensed = next;
      header.classList.toggle('is-condensed', next);
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateCondensed);
    }
  }, { passive: true });

  desktop.addEventListener('change', (event) => {
    if (event.matches && isOpen) closeMenu();
    updateCondensed();
  });

  updateCondensed();
})();

/* ==========================================================================
   Hero carousel
   ========================================================================== */

(() => {
  'use strict';

  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('[data-hero-slide]')];
  const live = hero.querySelector('[data-hero-slides]');
  const segs = [...hero.querySelectorAll('[data-hero-goto]')];
  const count = hero.querySelector('[data-hero-count]');
  const toggle = hero.querySelector('[data-hero-toggle]');
  const prevBtn = hero.querySelector('[data-hero-prev]');
  const nextBtn = hero.querySelector('[data-hero-next]');
  if (slides.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = navigator.connection && navigator.connection.saveData;

  // Matches the CSS: curtain (950ms) plus a little room; crossfade when reduced.
  const transitionMs = () => (reducedMotion.matches ? 450 : 1000);

  let current = 0;
  let target = 0; // where the carousel is heading (differs from current mid-transition)
  let busy = false;
  let queued = null;
  let leaving = null;
  let leaveTimer = 0;

  // Autoplay: on by default, off for reduced-motion visitors (they can press play).
  // "Holds" are temporary pauses (hover, keyboard focus, tab hidden, off-screen);
  // the visitor's own play/pause choice outlasts all of them.
  let playing = !reducedMotion.matches;
  const holds = new Set();

  const pad = (n) => String(n + 1).padStart(2, '0');

  /* ---------- Lazy media ---------- */

  function hydrate(slide) {
    if (!slide || slide.dataset.hydrated) return;
    slide.dataset.hydrated = 'true';

    slide.querySelectorAll('[data-srcset]').forEach((el) => {
      el.srcset = el.dataset.srcset;
      el.removeAttribute('data-srcset');
    });
    slide.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });

    // Optional video: added only when motion and data allow; the image stays
    // underneath as poster and fallback.
    const media = slide.querySelector('.hero-slide__media');
    const src = media && media.dataset.video;
    if (src && !reducedMotion.matches && !saveData) {
      const video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-hidden', 'true');
      video.src = src;
      const img = media.querySelector('img');
      if (img) video.poster = img.currentSrc || img.src;
      video.addEventListener('error', () => video.remove(), { once: true });
      media.append(video);
    }
  }

  // Resolves once the slide image can paint, so the curtain never reveals a blank.
  function ready(slide) {
    hydrate(slide);
    const img = slide.querySelector('img');
    if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
    const decoded = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
    return Promise.race([decoded, timeout]);
  }

  function syncVideo() {
    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (!video) return;
      if (i === current && !holds.has('hidden')) video.play().catch(() => {});
      else video.pause();
    });
  }

  /* ---------- State to DOM ---------- */

  function renderProgress() {
    segs.forEach((seg, i) => {
      seg.classList.toggle('is-done', i < current);
      seg.classList.toggle('is-current', i === current);
      if (i === current) seg.setAttribute('aria-current', 'true');
      else seg.removeAttribute('aria-current');
    });
  }

  function restartFill() {
    const fill = segs[current] && segs[current].querySelector('.hero-progress__fill');
    if (!fill) return;
    fill.style.animation = 'none';
    void fill.offsetWidth; // reflow so the fill starts again from zero
    fill.style.animation = '';
  }

  function renderCount() {
    if (!count) return;
    count.textContent = pad(current);
    if (!reducedMotion.matches && count.animate) {
      count.animate(
        [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 600, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', delay: 250, fill: 'backwards' }
      );
    }
  }

  function renderAutoplay() {
    hero.dataset.autoplay = playing ? 'on' : 'off';
    hero.classList.toggle('is-held', holds.size > 0);
    if (toggle) toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    // Announce slide changes only when the visitor is driving
    live.setAttribute('aria-live', playing && holds.size === 0 ? 'off' : 'polite');
  }

  function renderSlideAccess() {
    slides.forEach((slide, i) => {
      const hidden = i !== current;
      slide.inert = hidden;
      if (hidden) slide.setAttribute('aria-hidden', 'true');
      else slide.removeAttribute('aria-hidden');
    });
  }

  /* ---------- Navigation ---------- */

  async function goTo(index, dir) {
    index = (index + slides.length) % slides.length;
    if (busy) { queued = { index, dir }; return; }
    if (index === current) return;

    busy = true;
    target = index;
    const incoming = slides[index];
    await ready(incoming);

    // A leftover outgoing slide from an earlier transition is retired immediately
    clearTimeout(leaveTimer);
    if (leaving) leaving.classList.remove('is-leaving');

    hero.classList.remove('is-intro');
    hero.dataset.dir = dir || (index > current ? 'next' : 'prev');
    void incoming.offsetWidth; // commit the closed-curtain start state for this direction

    const outgoing = slides[current];
    outgoing.classList.remove('is-active');
    outgoing.classList.add('is-leaving');
    incoming.classList.add('is-active');
    leaving = outgoing;
    current = index;

    renderSlideAccess();
    renderProgress();
    renderCount();
    syncVideo();
    hydrate(slides[(current + 1) % slides.length]); // warm the next one

    leaveTimer = setTimeout(() => {
      outgoing.classList.remove('is-leaving');
      if (leaving === outgoing) leaving = null;
      busy = false;
      if (queued) {
        const q = queued;
        queued = null;
        if (q.index !== current) goTo(q.index, q.dir);
      }
    }, transitionMs());
  }

  // Steps count from the latest destination, so quick repeated presses add up
  const base = () => (queued ? queued.index : target);
  const next = () => goTo(base() + 1, 'next');
  const prev = () => goTo(base() - 1, 'prev');

  /* ---------- Autoplay ---------- */

  // The progress fill is the timer: when it finishes, advance.
  hero.addEventListener('animationend', (event) => {
    if (event.animationName !== 'hero-fill') return;
    if (playing && holds.size === 0) next();
  });

  function hold(reason) {
    if (holds.has(reason)) return;
    holds.add(reason);
    renderAutoplay();
    if (reason === 'hidden') syncVideo();
  }

  function release(reason) {
    if (!holds.delete(reason)) return;
    renderAutoplay();
    if (reason === 'hidden') syncVideo();
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      playing = !playing;
      if (playing) {
        holds.delete('focus'); // pressing play is an explicit "go"
        restartFill();
      }
      renderAutoplay();
    });
  }

  // Pause while reading the text or using the controls (mouse only)
  if (finePointer.matches) {
    hero.querySelectorAll('[data-hero-hover]').forEach((zone) => {
      zone.addEventListener('mouseenter', () => hold('hover'));
      zone.addEventListener('mouseleave', () => release('hover'));
    });
  }

  // Pause while keyboard focus is inside the hero
  hero.addEventListener('focusin', (event) => {
    if (event.target.matches(':focus-visible')) hold('focus');
  });
  hero.addEventListener('focusout', (event) => {
    if (!hero.contains(event.relatedTarget)) release('focus');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hold('hidden');
    else release('hidden');
  });
  if (document.hidden) holds.add('hidden'); // opened in a background tab

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) release('offscreen');
      else hold('offscreen');
    }, { threshold: 0.35 }).observe(hero);
  }

  /* ---------- Controls ---------- */

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  segs.forEach((seg) => {
    seg.addEventListener('click', () => goTo(Number(seg.dataset.heroGoto)));
  });

  hero.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
  });

  /* ---------- Swipe ---------- */

  let start = null;

  hero.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    start = { x: event.clientX, y: event.clientY, t: event.timeStamp };
  }, { passive: true });

  hero.addEventListener('pointerup', (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const quick = event.timeStamp - start.t < 600;
    start = null;
    // Horizontal, deliberate, and either long enough or quick enough to be a flick
    if (Math.abs(dx) > Math.abs(dy) * 1.5 && (Math.abs(dx) > 60 || (quick && Math.abs(dx) > 30))) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

  hero.addEventListener('pointercancel', () => { start = null; }, { passive: true });

  /* ---------- Start ---------- */

  renderSlideAccess();
  renderProgress();
  renderAutoplay();
  if (count) count.textContent = pad(current);

  // Commit the text's resting styles, then play the intro reveal. A forced style
  // flush rather than requestAnimationFrame: rAF is paused in background tabs,
  // which would leave the headline hidden until the tab is shown.
  hero.classList.add('is-intro');
  void hero.offsetWidth;
  hero.classList.add('is-ready');

  // Slide 1 is the priority; fetch slide 2 only once the page has settled
  const warm = () => hydrate(slides[1]);
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  if (document.readyState === 'complete') idle(warm);
  else window.addEventListener('load', () => idle(warm), { once: true });

  syncVideo();
})();
