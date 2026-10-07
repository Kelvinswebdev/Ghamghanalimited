document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("[data-mobile-toggle]");
  const mobileNav = document.querySelector("#mobile-navigation");
  const menuClose = document.querySelector("[data-mobile-close]");

  if (!menuToggle || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add("is-open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    mobileNav.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open / close from hamburger button
  menuToggle.addEventListener("click", toggleMenu);

  // Close from X button
  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  // Close when a navigation link is clicked
  const mobileLinks = mobileNav.querySelectorAll("a");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
});