const btn = document.querySelector(".menu-btn");
const bar = document.querySelector(".sidebar");
btn.addEventListener("click", () => {
  const open = bar.classList.toggle("open");
  btn.classList.toggle("open", open);

  btn.textContent = open ? "<" : ">";
  
  btn.setAttribute("aria-expanded", open);
});
bar.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    bar.classList.remove("open"); 
    btn.classList.remove("open");
  }
});
