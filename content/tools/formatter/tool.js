const root = document.querySelector('[data-tool="formatter"]');
const $ = (s) => root.querySelector(s);

function run(indent) {
  $("[data-err]").textContent = "";
  try {
    $("[data-out]").textContent = JSON.stringify(JSON.parse($("[data-in]").value), null, indent);
  } catch (e) {
    $("[data-err]").textContent = e.message;
  }
}

root.addEventListener("click", (e) => {
  if (e.target.dataset.act === "format") run(2);
  if (e.target.dataset.act === "minify") run(0);
  if (e.target.dataset.act === "copy") navigator.clipboard.writeText($("[data-out]").textContent);
});
