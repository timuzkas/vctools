const root = document.querySelector('[data-tool="base64"]');
const $ = (s) => root.querySelector(s);

function run(intent) {
  $("[data-err]").textContent = "";
  try {
    $("[data-out]").textContent = (intent === 1 ? btoa($("[data-in]").value) : atob($("[data-in]").value));
  } catch (e) {
    $("[data-err]").textContent = e.message;
  }
}

root.addEventListener("click", (e) => {
  if (e.target.dataset.act === "encode") run(1);
  if (e.target.dataset.act === "decode") run(0);
  if (e.target.dataset.act === "copy") navigator.clipboard.writeText($("[data-out]").textContent);
});
