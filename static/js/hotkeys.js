document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !document.body.hasAttribute("data-home")) {
    e.preventDefault();
    location.href = document.querySelector("aside nav a").href;
  } else if (e.key === "/" && !document.body.hasAttribute("data-home")
          && !e.target.matches("input, textarea, select")) {
    e.preventDefault();
    document.querySelector("[data-in]")?.focus();
  }
});
