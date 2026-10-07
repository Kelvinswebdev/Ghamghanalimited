/* =========================================
   GHAM HERO CAROUSEL
========================================= */

const heroSlides = document.querySelectorAll(".hero-slide");
const heroControls = document.querySelectorAll(".hero-control");
const playButton = document.querySelector(".hero-play");

const slideDuration = 7000;

let currentSlide = 0;
let autoplayTimer = null;
let isPaused = false;


/* -----------------------------------------
   SHOW SLIDE
----------------------------------------- */

function showSlide(index) {

    heroSlides.forEach((slide) => {
        slide.classList.remove("is-active");
    });

    heroControls.forEach((control) => {
        control.classList.remove("is-active");

        const progress = control.querySelector(".progress span");

        if (progress) {
            progress.style.animation = "none";
            progress.offsetHeight;
            progress.style.animation = "";
        }
    });


    currentSlide = index;

    heroSlides[currentSlide].classList.add("is-active");
    heroControls[currentSlide].classList.add("is-active");

    if (!isPaused) {
        startAutoplay();
    }
}


/* -----------------------------------------
   NEXT SLIDE
----------------------------------------- */

function nextSlide() {

    const next =
        (currentSlide + 1) % heroSlides.length;

    showSlide(next);
}


/* -----------------------------------------
   AUTOPLAY
----------------------------------------- */

function startAutoplay() {

    clearTimeout(autoplayTimer);

    if (isPaused) return;

    autoplayTimer = setTimeout(() => {
        nextSlide();
    }, slideDuration);
}


/* -----------------------------------------
   MANUAL CONTROLS
----------------------------------------- */

heroControls.forEach((control, index) => {

    control.addEventListener("click", () => {

        showSlide(index);

    });

});


/* -----------------------------------------
   PLAY / PAUSE
----------------------------------------- */

playButton.addEventListener("click", () => {

    isPaused = !isPaused;

    playButton.setAttribute(
        "aria-pressed",
        isPaused
    );

    playButton.setAttribute(
        "aria-label",
        isPaused
            ? "Play slideshow"
            : "Pause slideshow"
    );

    playButton.querySelector(".play-icon").textContent =
        isPaused ? "▶" : "Ⅱ";


    if (isPaused) {

        clearTimeout(autoplayTimer);

    } else {

        startAutoplay();

    }

});


/* -----------------------------------------
   KEYBOARD NAVIGATION
----------------------------------------- */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        nextSlide();
    }

    if (event.key === "ArrowLeft") {

        const previous =
            (currentSlide - 1 + heroSlides.length) %
            heroSlides.length;

        showSlide(previous);
    }

});


/* -----------------------------------------
   INITIALIZE
----------------------------------------- */

showSlide(0);