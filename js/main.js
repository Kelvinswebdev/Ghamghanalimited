/* =========================================================
   GHAM GHANA LTD
   HERO SLIDER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const hero = document.querySelector("[data-hero]");

  if (!hero) return;


  /* =======================================================
     ELEMENTS
  ======================================================= */

  const slides = [
    ...hero.querySelectorAll("[data-hero-slide]")
  ];

  const progressButtons = [
    ...hero.querySelectorAll("[data-hero-goto]")
  ];

  const progressSegments = [
    ...hero.querySelectorAll(".hero-progress__seg")
  ];

  const currentCounter =
    hero.querySelector("[data-hero-count]");

  const nextButton =
    hero.querySelector("[data-hero-next]");

  const previousButton =
    hero.querySelector("[data-hero-prev]");

  const toggleButton =
    hero.querySelector("[data-hero-toggle]");


  if (!slides.length) return;


  /* =======================================================
     SETTINGS
  ======================================================= */

  const INTERVAL = 2500;
  const TRANSITION = 1000;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =======================================================
     STATE
  ======================================================= */

  let currentIndex = 0;

  let autoplay = !reducedMotion;

  let timer = null;

  let isTransitioning = false;

  let isHovered = false;

  let isFocused = false;

  let isVisible = true;

  let touchStartX = 0;

  let touchStartY = 0;


  /* =======================================================
     FORMAT NUMBER
  ======================================================= */

  function formatNumber(number) {

    return String(number + 1)
      .padStart(2, "0");

  }


  /* =======================================================
     UPDATE COUNTER
  ======================================================= */

  function updateCounter() {

    if (!currentCounter) return;

    currentCounter.textContent =
      formatNumber(currentIndex);

  }


  /* =======================================================
     RESET PROGRESS
  ======================================================= */

  function resetProgress() {

    progressSegments.forEach(
      (segment, index) => {

        segment.classList.remove(
          "is-current",
          "is-done"
        );

        const fill =
          segment.querySelector(
            ".hero-progress__fill"
          );

        if (fill) {

          fill.style.animation = "none";

          /*
           * Force browser reflow.
           * This allows the animation to restart.
           */

          void fill.offsetWidth;

          fill.style.animation = "";

        }

        if (index < currentIndex) {

          segment.classList.add(
            "is-done"
          );

        }

        if (index === currentIndex) {

          segment.classList.add(
            "is-current"
          );

        }

      }
    );

  }


  /* =======================================================
     UPDATE ARIA
  ======================================================= */

  function updateAria() {

    slides.forEach(
      (slide, index) => {

        slide.setAttribute(
          "aria-hidden",
          index === currentIndex
            ? "false"
            : "true"
        );

      }
    );

  }


  /* =======================================================
     RESET TEXT ANIMATION
  ======================================================= */

  function resetSlide(slide) {

    const titleLines =
      slide.querySelectorAll(
        ".hero-title__line span"
      );

    const copy =
      slide.querySelector(
        ".hero-copy"
      );

    const cta =
      slide.querySelector(
        ".hero-cta"
      );

    const eyebrow =
      slide.querySelector(
        ".hero-eyebrow"
      );


    titleLines.forEach(
      line => {

        line.style.transition = "none";

        line.style.transform =
          "translateY(110%)";

      }
    );


    if (eyebrow) {

      eyebrow.style.animation =
        "none";

    }


    if (copy) {

      copy.style.animation =
        "none";

      copy.style.opacity =
        "0";

      copy.style.transform =
        "translateY(1rem)";

    }


    if (cta) {

      cta.style.animation =
        "none";

      cta.style.opacity =
        "0";

      cta.style.transform =
        "translateY(1rem)";

    }

  }


  /* =======================================================
     PREPARE SLIDE
  ======================================================= */

  function prepareSlide(slide, direction) {

    const image =
      slide.querySelector(
        ".hero-slide__media img"
      );

    if (
      image &&
      !reducedMotion
    ) {

      image.style.transition =
        "none";

      image.style.transform =
        direction > 0
          ? "scale(1.08) translateX(3%)"
          : "scale(1.08) translateX(-3%)";

    }

  }


  /* =======================================================
     ANIMATE SLIDE
  ======================================================= */

  function animateSlide(slide) {

    const titleLines =
      slide.querySelectorAll(
        ".hero-title__line span"
      );

    const eyebrow =
      slide.querySelector(
        ".hero-eyebrow"
      );

    const copy =
      slide.querySelector(
        ".hero-copy"
      );

    const cta =
      slide.querySelector(
        ".hero-cta"
      );

    const image =
      slide.querySelector(
        ".hero-slide__media img"
      );


    requestAnimationFrame(() => {

      /* Image */

      if (
        image &&
        !reducedMotion
      ) {

        image.style.transition =
          `transform 1800ms cubic-bezier(0.23, 1, 0.32, 1)`;

        image.style.transform =
          "scale(1.02) translateX(0)";

      }


      /* Title */

      titleLines.forEach(
        (line, index) => {

          line.style.transition =
            `transform 900ms cubic-bezier(0.23, 1, 0.32, 1) ${
              350 + index * 100
            }ms`;

          line.style.transform =
            "translateY(0)";

        }
      );


      /* Eyebrow */

      if (eyebrow) {

        eyebrow.style.animation =
          "heroFadeUp 700ms cubic-bezier(0.23, 1, 0.32, 1) 200ms forwards";

      }


      /* Copy */

      if (copy) {

        copy.style.animation =
          "heroFadeUp 700ms cubic-bezier(0.23, 1, 0.32, 1) 600ms forwards";

      }


      /* CTA */

      if (cta) {

        cta.style.animation =
          "heroFadeUp 700ms cubic-bezier(0.23, 1, 0.32, 1) 750ms forwards";

      }

    });

  }


  /* =======================================================
     GO TO SLIDE
  ======================================================= */

  function goToSlide(
    newIndex,
    direction = 1
  ) {

    if (isTransitioning) return;

    if (
      newIndex === currentIndex
    ) {

      restartAutoplay();

      return;

    }


    const oldSlide =
      slides[currentIndex];

    const newSlide =
      slides[newIndex];


    if (!newSlide) return;


    isTransitioning = true;


    /* Reset incoming slide */

    resetSlide(
      newSlide
    );

    prepareSlide(
      newSlide,
      direction
    );


    /* Put incoming slide above */

    newSlide.style.zIndex = "3";

    oldSlide.style.zIndex = "2";

    newSlide.classList.add(
      "is-active"
    );


    /*
     * Update state immediately.
     */

    currentIndex =
      newIndex;


    updateCounter();

    updateAria();

    resetProgress();


    /*
     * Trigger animation.
     */

    animateSlide(
      newSlide
    );


    /*
     * Finish transition.
     */

    setTimeout(() => {

      oldSlide.classList.remove(
        "is-active"
      );

      oldSlide.style.zIndex = "";

      newSlide.style.zIndex = "";

      isTransitioning = false;

      preloadAdjacentSlides();

      restartAutoplay();

    }, TRANSITION);

  }


  /* =======================================================
     NEXT SLIDE
  ======================================================= */

  function nextSlide() {

    const nextIndex =
      (
        currentIndex + 1
      ) % slides.length;

    goToSlide(
      nextIndex,
      1
    );

  }


  /* =======================================================
     PREVIOUS SLIDE
  ======================================================= */

  function previousSlide() {

    const previousIndex =
      (
        currentIndex -
        1 +
        slides.length
      ) % slides.length;

    goToSlide(
      previousIndex,
      -1
    );

  }


  /* =======================================================
     PROGRESS BUTTONS
  ======================================================= */

  progressButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(
              button.dataset.heroGoto
            );

          if (
            Number.isNaN(index)
          ) return;


          const direction =
            index > currentIndex
              ? 1
              : -1;


          goToSlide(
            index,
            direction
          );

        }
      );

    }
  );


  /* =======================================================
     NEXT / PREVIOUS BUTTONS
  ======================================================= */

  if (nextButton) {

    nextButton.addEventListener(
      "click",
      nextSlide
    );

  }


  if (previousButton) {

    previousButton.addEventListener(
      "click",
      previousSlide
    );

  }


  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  function updatePlayButton() {

    if (!toggleButton) return;

    toggleButton.setAttribute(
      "aria-label",
      autoplay
        ? "Pause slideshow"
        : "Play slideshow"
    );


    hero.classList.toggle(
      "is-paused",
      !autoplay
    );

  }


  function pauseSlider() {

    autoplay = false;

    clearTimeout(timer);

    timer = null;

    updatePlayButton();

  }


  function playSlider() {

    if (reducedMotion) return;

    autoplay = true;

    updatePlayButton();

    restartAutoplay();

  }


  function toggleSlider() {

    if (autoplay) {

      pauseSlider();

    } else {

      playSlider();

    }

  }


  if (toggleButton) {

    toggleButton.addEventListener(
      "click",
      toggleSlider
    );

  }


  /* =======================================================
     AUTOPLAY
  ======================================================= */

  function canAutoplay() {

    return (
      autoplay &&
      isVisible &&
      !isHovered &&
      !isFocused &&
      !document.hidden &&
      !reducedMotion
    );

  }


  function restartAutoplay() {

    clearTimeout(timer);

    timer = null;


    if (!canAutoplay()) return;


    timer =
      setTimeout(
        () => {

          nextSlide();

        },
        INTERVAL
      );

  }


  /* =======================================================
     PAUSE ON HOVER
  ======================================================= */

  hero.addEventListener(
    "mouseenter",
    () => {

      isHovered = true;

      restartAutoplay();

    }
  );


  hero.addEventListener(
    "mouseleave",
    () => {

      isHovered = false;

      restartAutoplay();

    }
  );


  /* =======================================================
     PAUSE WHEN FOCUSED
  ======================================================= */

  hero.addEventListener(
    "focusin",
    () => {

      isFocused = true;

      restartAutoplay();

    }
  );


  hero.addEventListener(
    "focusout",
    event => {

      if (
        !hero.contains(
          event.relatedTarget
        )
      ) {

        isFocused = false;

        restartAutoplay();

      }

    }
  );


  /* =======================================================
     PAUSE WHEN TAB IS HIDDEN
  ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      restartAutoplay();

    }
  );


  /* =======================================================
     PAUSE WHEN HERO IS OFF SCREEN
  ======================================================= */

  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          const entry =
            entries[0];

          isVisible =
            entry.isIntersecting;

          restartAutoplay();

        },
        {
          threshold: 0.15
        }
      );


    observer.observe(
      hero
    );

  }


  /* =======================================================
     KEYBOARD CONTROLS
  ======================================================= */

  hero.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "ArrowRight"
      ) {

        event.preventDefault();

        nextSlide();

      }


      if (
        event.key === "ArrowLeft"
      ) {

        event.preventDefault();

        previousSlide();

      }


      if (
        event.key === " "
      ) {

        event.preventDefault();

        toggleSlider();

      }

    }
  );


  /* =======================================================
     TOUCH / SWIPE
  ======================================================= */

  hero.addEventListener(
    "touchstart",
    event => {

      if (
        event.touches.length !== 1
      ) return;


      touchStartX =
        event.touches[0].clientX;

      touchStartY =
        event.touches[0].clientY;

    },
    {
      passive: true
    }
  );


  hero.addEventListener(
    "touchend",
    event => {

      if (
        event.changedTouches.length !== 1
      ) return;


      const touchEndX =
        event.changedTouches[0].clientX;

      const touchEndY =
        event.changedTouches[0].clientY;


      const deltaX =
        touchEndX -
        touchStartX;

      const deltaY =
        touchEndY -
        touchStartY;


      /*
       * Ignore vertical scrolling.
       */

      if (
        Math.abs(deltaY) >
        Math.abs(deltaX)
      ) return;


      /*
       * Ignore tiny movements.
       */

      if (
        Math.abs(deltaX) < 50
      ) return;


      if (deltaX < 0) {

        nextSlide();

      } else {

        previousSlide();

      }

    },
    {
      passive: true
    }
  );


  /* =======================================================
     LAZY LOAD HERO IMAGES
  ======================================================= */

  function loadImage(img) {

    if (!img) return;

    if (img.dataset.src) {

      img.src =
        img.dataset.src;

      img.removeAttribute(
        "data-src"
      );

    }


    if (img.dataset.srcset) {

      img.srcset =
        img.dataset.srcset;

      img.removeAttribute(
        "data-srcset"
      );

    }

  }


  /* =======================================================
     PRELOAD SLIDE
  ======================================================= */

  function preloadSlide(index) {

    const slide =
      slides[index];

    if (!slide) return;


    const image =
      slide.querySelector(
        "img"
      );

    if (!image) return;


    loadImage(
      image
    );

  }


  /* =======================================================
     PRELOAD ADJACENT SLIDES
  ======================================================= */

  function preloadAdjacentSlides() {

    const nextIndex =
      (
        currentIndex + 1
      ) % slides.length;


    const previousIndex =
      (
        currentIndex -
        1 +
        slides.length
      ) % slides.length;


    preloadSlide(
      nextIndex
    );

    preloadSlide(
      previousIndex
    );

  }


  /* =======================================================
     INITIALISE
  ======================================================= */

  slides.forEach(
    (slide, index) => {

      slide.classList.toggle(
        "is-active",
        index === 0
      );

      slide.setAttribute(
        "aria-hidden",
        index === 0
          ? "false"
          : "true"
      );

    }
  );


  /*
   * Load first slide immediately.
   */

  preloadSlide(0);

  preloadSlide(1);


  /*
   * Initial UI.
   */

  updateCounter();

  resetProgress();

  updatePlayButton();

  preloadAdjacentSlides();

  restartAutoplay();


  /* =======================================================
     RESIZE
  ======================================================= */

  let resizeTimer = null;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(() => {

          restartAutoplay();

        }, 200);

    }
  );

});