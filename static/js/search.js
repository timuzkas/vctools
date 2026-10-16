const label = document.querySelector("p.search");
const categories = document.querySelectorAll("[data-category]");

const everythingHiddenLabel = document.querySelector(".allHiddenLabel");
everythingHiddenLabel.hidden = true;

const labelPlaceholder = label.textContent;
let query = "";

function render() {
  const q = query.toLowerCase();
  label.textContent = query || labelPlaceholder;
  label.classList.toggle("active", query !== "");
  categories.forEach((category) => {
    const cards = category.querySelectorAll(".tool-card");
    cards.forEach((card) => {
      card.classList.toggle("filtered", !card.textContent.toLowerCase().includes(q));
    });

    const allHidden = [...cards].every(c => c.classList.contains("filtered"));
    category.hidden = allHidden;
  });

  const allCatHidden = [...categories].every(c => c.hidden);
  everythingHiddenLabel.hidden = !allCatHidden;
  
  
}

document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target.matches("input, textarea")) return;

  if (e.key === "Backspace") query = query.slice(0, -1);
  else if (e.key === "Escape") query = "";
  else if (e.key === "Enter" && query.length > 0) {
    const first = document.querySelector(".tool-card:not(.filtered)");
    if (first) location.href = first.href;
    return;
  }
  else if (e.key.length === 1) query += e.key;
  else return;

  if (e.key === " ") e.preventDefault();
  render();
  
});

