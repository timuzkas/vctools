const label = document.querySelector("p.search");
const cards = document.querySelectorAll(".tool-card");

const labelPlaceholder = label.textContent;
let query = "";

function render() {
  const q = query.toLowerCase();
  label.textContent = query || labelPlaceholder;
  label.classList.toggle("active", query !== "");
  cards.forEach((card) => {
    card.classList.toggle("filtered", !card.textContent.toLowerCase().includes(q));
  });
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

