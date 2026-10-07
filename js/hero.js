document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".premium-carousel");

  if (!carousel) return;

  const slides = Array.from(
    carousel.querySelectorAll(".premium-carousel__slide")
  );

  const nextButton = carousel.querySelector(".premium-carousel__next");
  const prevButton = carousel.querySelector(".premium-carousel__prev");
  const progressBar = carousel.querySelector(".premium-carousel__progress-bar");
  const currentNumber = carousel.querySelector(
    ".premium-carousel__number span:first-child"
  );

  if (slides.length < 2) return;

  let currentSlide = 0;
  let autoplayTimer = null;

  const slideDuration = 4000;


  /* ================================
     SHOW SLIDE
  ================================= */

  function showSlide(index) {

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    currentSlide = index;

    /* Counter */

    if (currentNumber) {
      currentNumber.textContent =
        String(index + 1).padStart(2, "0");
    }

    /* Progress bar */

    if (progressBar) {

      progressBar.style.transition = "none";
      progressBar.style.width = "0%";

      // Force browser repaint
      progressBar.offsetWidth;

      progressBar.style.transition =
        `width ${slideDuration}ms linear`;

      progressBar.style.width = "100%";
    }
  }


  /* ================================
     NEXT SLIDE
  ================================= */

  function nextSlide() {

    const nextIndex =
      (currentSlide + 1) % slides.length;

    showSlide(nextIndex);
  }


  /* ================================
     PREVIOUS SLIDE
  ================================= */

  function previousSlide() {

    const previousIndex =
      (currentSlide - 1 + slides.length) %
      slides.length;

    showSlide(previousIndex);
  }


  /* ================================
     START AUTOPLAY
  ================================= */

  function startAutoplay() {

    clearInterval(autoplayTimer);

    autoplayTimer = setInterval(() => {
      nextSlide();
    }, slideDuration);
  }


  /* ================================
     BUTTON CONTROLS
  ================================= */

  nextButton?.addEventListener("click", () => {

    nextSlide();

    // Restart the 6-second countdown
    startAutoplay();

  });


  prevButton?.addEventListener("click", () => {

    previousSlide();

    // Restart the 6-second countdown
    startAutoplay();

  });


  /* ================================
     KEYBOARD
  ================================= */

  carousel.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {

      nextSlide();
      startAutoplay();

    }

    if (event.key === "ArrowLeft") {

      previousSlide();
      startAutoplay();

    }

  });


  /* ================================
     INITIALIZE
  ================================= */

  showSlide(0);

  // IMPORTANT:
  // Start autoplay immediately on page load.
  startAutoplay();

});