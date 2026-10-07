/* =========================================================
   GHAM MOBILE NAVIGATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".gham-header");
  const menuToggle = document.querySelector(".gham-menu-toggle");
  const mobileMenu = document.querySelector(".gham-mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll("a");

  /* -------------------------------------------------------
     OPEN / CLOSE MENU
     ------------------------------------------------------- */

  function openMenu() {
    menuToggle.classList.add("is-active");
    mobileMenu.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");

    if (header) {
      header.classList.add("menu-is-open");
    }
  }

  function closeMenu() {
    menuToggle.classList.remove("is-active");
    mobileMenu.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");

    if (header) {
      header.classList.remove("menu-is-open");
    }
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }


  /* -------------------------------------------------------
     MENU BUTTON
     ------------------------------------------------------- */

  menuToggle.addEventListener("click", toggleMenu);


  /* -------------------------------------------------------
     CLOSE WHEN A LINK IS CLICKED
     ------------------------------------------------------- */

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });


  /* -------------------------------------------------------
     ESCAPE KEY
     ------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });


  /* -------------------------------------------------------
     CLOSE WHEN RESIZING TO DESKTOP
     ------------------------------------------------------- */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });


  /* -------------------------------------------------------
     PREVENT BACKGROUND SCROLLING
     ------------------------------------------------------- */

  document.addEventListener("touchmove", (event) => {
    if (mobileMenu.classList.contains("is-open")) {
      if (!mobileMenu.contains(event.target)) {
        event.preventDefault();
      }
    }
  }, {
    passive: false
  });


  /* -------------------------------------------------------
     MOBILE DROPDOWNS
     ------------------------------------------------------- */

  const dropdownToggles = mobileMenu.querySelectorAll(
    "[data-mobile-dropdown]"
  );

  dropdownToggles.forEach((toggle) => {

    toggle.addEventListener("click", (event) => {
      event.preventDefault();

      const parent = toggle.closest(".gham-mobile-dropdown");

      if (!parent) return;

      const dropdown = parent.querySelector(
        ".gham-mobile-dropdown__content"
      );

      if (!dropdown) return;

      const isOpen = parent.classList.contains("is-open");

      /* Close other dropdowns */
      mobileMenu
        .querySelectorAll(".gham-mobile-dropdown.is-open")
        .forEach((item) => {
          if (item !== parent) {
            item.classList.remove("is-open");

            const button = item.querySelector(
              "[data-mobile-dropdown]"
            );

            if (button) {
              button.setAttribute("aria-expanded", "false");
            }
          }
        });

      /* Toggle current dropdown */
      parent.classList.toggle("is-open", !isOpen);

      toggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );
    });

  });

});