/* =========================================================
   GHAM — WHO WE ARE REVEAL
========================================================= */

(() => {
  const section = document.querySelector(".gham-who");

  if (!section) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    section.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        section.classList.add("is-visible");

        observerInstance.unobserve(section);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observer.observe(section);
})();