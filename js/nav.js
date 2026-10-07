/* =========================================================
   GHAM HEADER INTERACTIONS
========================================================= */

(() => {

  /* ---------------------------------------------
     Dropdowns
  --------------------------------------------- */

  const dropdownItems = document.querySelectorAll(
    ".nav-item--dropdown"
  );

  dropdownItems.forEach((item) => {

    const button = item.querySelector(
      ".nav-dropdown-toggle"
    );

    if (!button) return;

    button.addEventListener("click", (event) => {

      event.stopPropagation();

      const isOpen = item.classList.contains("is-open");

      // Close all dropdowns
      dropdownItems.forEach((otherItem) => {
        otherItem.classList.remove("is-open");

        const otherButton =
          otherItem.querySelector(
            ".nav-dropdown-toggle"
          );

        if (otherButton) {
          otherButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      });

      // Open selected dropdown
      if (!isOpen) {

        item.classList.add("is-open");

        button.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    });

  });


  /* Close dropdown when clicking outside */

  document.addEventListener("click", () => {

    dropdownItems.forEach((item) => {

      item.classList.remove("is-open");

      const button =
        item.querySelector(
          ".nav-dropdown-toggle"
        );

      if (button) {
        button.setAttribute(
          "aria-expanded",
          "false"
        );
      }

    });

  });


  /* ---------------------------------------------
     Search
  --------------------------------------------- */

  const searchButton =
    document.querySelector(".header-search");

  const searchOverlay =
    document.querySelector(".search-overlay");

  const searchClose =
    document.querySelector(".search-overlay__close");

  const searchInput =
    document.querySelector(".search-form input");


  const openSearch = () => {

    if (!searchOverlay) return;

    searchOverlay.classList.add("is-open");

    searchOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      searchInput?.focus();
    });

  };


  const closeSearch = () => {

    if (!searchOverlay) return;

    searchOverlay.classList.remove("is-open");

    searchOverlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

  };


  searchButton?.addEventListener(
    "click",
    openSearch
  );

  searchClose?.addEventListener(
    "click",
    closeSearch
  );


  /* Escape closes search */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      closeSearch();

      dropdownItems.forEach((item) => {
        item.classList.remove("is-open");
      });

    }

  });


  /* ---------------------------------------------
     Mobile navigation
  --------------------------------------------- */

  const mobileToggle =
    document.querySelector(
      ".mobile-menu-toggle"
    );

  const mobileNav =
    document.querySelector(".mobile-nav");


  mobileToggle?.addEventListener(
    "click",
    () => {

      const isOpen =
        mobileNav.classList.contains(
          "is-open"
        );

      mobileNav.classList.toggle(
        "is-open"
      );

      mobileNav.setAttribute(
        "aria-hidden",
        String(isOpen)
      );

      mobileToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      document.body.style.overflow =
        isOpen ? "" : "hidden";

    }
  );


  /* ---------------------------------------------
     Dark mode
  --------------------------------------------- */

  const darkToggle =
    document.querySelector(".dark-toggle");

  const savedTheme =
    localStorage.getItem("gham-theme");

  if (savedTheme === "dark") {

    document.documentElement.classList.add(
      "dark-mode"
    );

    darkToggle?.setAttribute(
      "aria-pressed",
      "true"
    );

  }


  darkToggle?.addEventListener(
    "click",
    () => {

      const isDark =
        document.documentElement.classList.toggle(
          "dark-mode"
        );

      darkToggle.setAttribute(
        "aria-pressed",
        String(isDark)
      );

      localStorage.setItem(
        "gham-theme",
        isDark ? "dark" : "light"
      );

    }
  );


})();