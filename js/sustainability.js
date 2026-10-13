
document.querySelectorAll(".gham-sustainability").forEach(section => {
  const cards = section.querySelectorAll(".gham-sustainability__card");

  cards.forEach(card => {
    const button = card.querySelector(".gham-sustainability__trigger");

    button.addEventListener("click", () => {
      const wasActive = card.classList.contains("is-active");

      cards.forEach(item => {
        item.classList.remove("is-active");
        item.querySelector(".gham-sustainability__trigger")
          .setAttribute("aria-expanded", "false");
      });

      if (!wasActive) {
        card.classList.add("is-active");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
});
