document.addEventListener("DOMContentLoaded", () => {

  const hero = document.querySelector("[data-gham-hero]");

  if (!hero) return;


  const track =
    hero.querySelector("[data-hero-track]");

  const slides =
    [...hero.querySelectorAll(".gham-hero__slide")];

  const progress =
    [...hero.querySelectorAll("[data-hero-go]")];

  const current =
    hero.querySelector("[data-hero-current]");

  const next =
    hero.querySelector("[data-hero-next]");

  const previous =
    hero.querySelector("[data-hero-prev]");

  const playButton =
    hero.querySelector("[data-hero-play]");


  if (!track || slides.length === 0) return;


  /* =====================================================
     SETTINGS
  ===================================================== */

  const interval = 7000;

  const transitionTime = 1100;


  /* =====================================================
     STATE
  ===================================================== */

  let index = 0;

  let timer = null;

  let playing = true;

  let startX = 0;

  let startY = 0;

  let isDragging = false;


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    playing = false;
  }


  /* =====================================================
     UPDATE
  ===================================================== */

  function updateSlider() {

    /*
     * Move the actual slider track.
     * This is the main source of truth.
     */

    track.style.transform =
      `translateX(-${index * 100}%)`;


    /*
     * Active slide.
     */

    slides.forEach(
      (slide, i) => {

        slide.classList.toggle(
          "is-active",
          i === index
        );

        slide.setAttribute(
          "aria-hidden",
          i === index
            ? "false"
            : "true"
        );

      }
    );


    /*
     * Counter.
     */

    if (current) {

      current.textContent =
        String(index + 1)
          .padStart(2, "0");

    }


    /*
     * Progress.
     */

    progress.forEach(
      (button, i) => {

        button.classList.toggle(
          "is-active",
          i === index
        );

        button.setAttribute(
          "aria-current",
          i === index
            ? "true"
            : "false"
        );

      }
    );


    /*
     * Restart autoplay.
     */

    restartTimer();

  }


  /* =====================================================
     NEXT
  ===================================================== */

  function nextSlide() {

    index =
      (index + 1) %
      slides.length;

    updateSlider();

  }


  /* =====================================================
     PREVIOUS
  ===================================================== */

  function previousSlide() {

    index =
      (
        index -
        1 +
        slides.length
      ) %
      slides.length;

    updateSlider();

  }


  /* =====================================================
     SPECIFIC SLIDE
  ===================================================== */

  function goToSlide(newIndex) {

    if (
      newIndex < 0 ||
      newIndex >= slides.length
    ) return;

    index = newIndex;

    updateSlider();

  }


  /* =====================================================
     NEXT / PREVIOUS BUTTONS
  ===================================================== */

  if (next) {

    next.addEventListener(
      "click",
      nextSlide
    );

  }


  if (previous) {

    previous.addEventListener(
      "click",
      previousSlide
    );

  }


  /* =====================================================
     PROGRESS BUTTONS
  ===================================================== */

  progress.forEach(
    (button, i) => {

      button.addEventListener(
        "click",
        () => {

          goToSlide(i);

        }
      );

    }
  );


  /* =====================================================
     PLAY / PAUSE
  ===================================================== */

  function updatePlayButton() {

    if (!playButton) return;

    hero.classList.toggle(
      "is-paused",
      !playing
    );

    playButton.setAttribute(
      "aria-label",
      playing
        ? "Pause slideshow"
        : "Play slideshow"
    );

  }


  function pause() {

    playing = false;

    clearTimeout(timer);

    timer = null;

    updatePlayButton();

  }


  function play() {

    if (reducedMotion) return;

    playing = true;

    updatePlayButton();

    restartTimer();

  }


  function togglePlay() {

    if (playing) {

      pause();

    } else {

      play();

    }

  }


  if (playButton) {

    playButton.addEventListener(
      "click",
      togglePlay
    );

  }


  /* =====================================================
     AUTOPLAY
  ===================================================== */

  function restartTimer() {

    clearTimeout(timer);

    timer = null;

    if (!playing) return;

    timer =
      setTimeout(
        nextSlide,
        interval
      );

  }


  /* =====================================================
     PAUSE ON HOVER
  ===================================================== */

  hero.addEventListener(
    "mouseenter",
    () => {

      if (!playing) return;

      clearTimeout(timer);

    }
  );


  hero.addEventListener(
    "mouseleave",
    () => {

      restartTimer();

    }
  );


  /* =====================================================
     KEYBOARD
  ===================================================== */

  hero.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "ArrowRight"
      ) {

        nextSlide();

      }

      if (
        event.key === "ArrowLeft"
      ) {

        previousSlide();

      }

      if (
        event.key === " "
      ) {

        event.preventDefault();

        togglePlay();

      }

    }
  );


  /* =====================================================
     TOUCH START
  ===================================================== */

  hero.addEventListener(
    "touchstart",
    event => {

      if (
        event.touches.length !== 1
      ) return;

      startX =
        event.touches[0].clientX;

      startY =
        event.touches[0].clientY;

      isDragging = true;

    },
    {
      passive: true
    }
  );


  /* =====================================================
     TOUCH END
  ===================================================== */

  hero.addEventListener(
    "touchend",
    event => {

      if (!isDragging) return;

      isDragging = false;


      const endX =
        event.changedTouches[0].clientX;

      const endY =
        event.changedTouches[0].clientY;


      const distanceX =
        endX - startX;

      const distanceY =
        endY - startY;


      /*
       * Ignore vertical scrolling.
       */

      if (
        Math.abs(distanceY) >
        Math.abs(distanceX)
      ) return;


      /*
       * Ignore small movements.
       */

      if (
        Math.abs(distanceX) < 50
      ) return;


      if (distanceX < 0) {

        nextSlide();

      } else {

        previousSlide();

      }

    },
    {
      passive: true
    }
  );


  /* =====================================================
     PAUSE WHEN TAB IS HIDDEN
  ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        clearTimeout(timer);

      } else {

        restartTimer();

      }

    }
  );


  /* =====================================================
     INITIALISE
  ===================================================== */

  updateSlider();

  updatePlayButton();

});