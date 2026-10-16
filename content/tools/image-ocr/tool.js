const root = document.querySelector('[data-tool="image-ocr"]');
const $ = (s) => root.querySelector(s);

const BASE = new URL("../../vendor/tesseract/", import.meta.url).href;
const LANG = new URL("../../tessdata/", import.meta.url).href;

let createWorker;
const workers = {};

async function getWorker(lang) {
  if (workers[lang]) return workers[lang];
  ({ default: { createWorker } } = await import(BASE + "tesseract.esm.min.js"));
  return (workers[lang] = await createWorker(lang, 1, {
    workerPath: BASE + "worker.min.js",
    corePath: BASE,
    langPath: LANG,
    gzip: true,
    logger: (m) => {
      if (m.status === "recognizing text") {
        $("[data-out]").textContent = `Recognizing... ${Math.round(m.progress * 100)}%`;
      }
    },
  }));
}

async function run() {
  $("[data-err]").textContent = "";
  const file = $("[data-in]").files[0];
  if (!file) return;
  const btn = $('[data-act="ocr"]');
  btn.disabled = true;
  try {
    $("[data-out]").textContent = "Loading language data...";
    const worker = await getWorker($("[data-lang]").value);
    const { data: { text } } = await worker.recognize(file);
    $("[data-out]").textContent = text;
  } catch (e) {
    $("[data-out]").textContent = "";
    $("[data-err]").textContent = e.message;
  } finally {
    btn.disabled = false;
  }
}

root.addEventListener("click", (e) => {
  if (e.target.dataset.act === "ocr") run();
  else if (e.target.dataset.act === "copy") navigator.clipboard.writeText($("[data-out]").textContent);
});

document.addEventListener("paste", (e) => {
  const file = [...e.clipboardData.files].find(f => f.type.startsWith("image/"));
  if (!file) return;

  const dataTransfer = new DataTransfer;
  dataTransfer.items.add(file);
  $("[data-in]").files = dataTransfer.files;

  run();
});
