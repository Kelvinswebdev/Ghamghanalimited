document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".premium-carousel");

  if (!carousel) return;

  const slides = carousel.querySelectorAll(
    ".premium-carousel__slide"
  );

  const nextButton = carousel.querySelector(
    ".premium-carousel__next"
  );

  const prevButton = carousel.querySelector(
    ".premium-carousel__prev"
  );

  const progressBar = carousel.querySelector(
    ".premium-carousel__progress-bar"
  );

  const currentNumber = carousel.querySelector(
    ".premium-carousel__number span:first-child"
  );

  let current = 0;
  let timer;

  const duration = 6000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    current = index;

    if (currentNumber) {
      currentNumber.textContent = String(current + 1).padStart(2, "0");
    }

    // Restart progress animation
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressBar.style.transition =
            `width ${duration}ms linear`;

          progressBar.style.width = "100%";
        });
      });
    }
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
    restartTimer();
  }

  function previousSlide() {
    const previous =
      (current - 1 + slides.length) % slides.length;

    showSlide(previous);
    restartTimer();
  }

  function restartTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
      const next = (current + 1) % slides.length;
      showSlide(next);
    }, duration);
  }

  nextButton?.addEventListener("click", nextSlide);
  prevButton?.addEventListener("click", previousSlide);

  // Pause while hovering
  carousel.addEventListener("mouseenter", () => {
    clearInterval(timer);
  });

  carousel.addEventListener("mouseleave", restartTimer);

  // Keyboard navigation
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextSlide();
    }

    if (event.key === "ArrowLeft") {
      previousSlide();
    }
  });

  // Start
  showSlide(0);
  restartTimer();
});