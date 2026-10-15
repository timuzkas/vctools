const root = document.querySelector('[data-tool="bg-remover"]');
const $ = (s) => root.querySelector(s);

const ORT_BASE = new URL("../../vendor/ort/", import.meta.url).href;

const HF = "https://huggingface.co/briaai/RMBG-1.4/resolve/2ceba5a5efaec153162aedea169f76caf9b46cf8/onnx/";
const MODELS = {
  fast: {
    url: new URL("../../models/u2netp.onnx", import.meta.url).href,
    label: "~16 MB",
    size: 320,
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225],
    scaleByMax: true,
  },
  quality: {
    url: HF + "model_quantized.onnx",
    label: "~60 MB",
    size: 1024,
    mean: [0.5, 0.5, 0.5],
    std: [1, 1, 1],
    scaleByMax: false,
  },
};

let ort;
const sessions = {};

async function loadModel(key) {
  if (!ort) {
    ort = await import(ORT_BASE + "ort.wasm.min.mjs");
    ort.env.wasm.wasmPaths = ORT_BASE;
    ort.env.wasm.numThreads = 1;
  }
  return (sessions[key] ??= await ort.InferenceSession.create(MODELS[key].url, { executionProviders: ["wasm"] }));
}

function toTensor(bitmap, { size: SIZE, mean: MEAN, std: STD, scaleByMax }) {
  const c = new OffscreenCanvas(SIZE, SIZE);
  const ctx = c.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  let max = 255;
  if (scaleByMax) {
    max = 1;
    for (let i = 0; i < data.length; i += 4) max = Math.max(max, data[i], data[i + 1], data[i + 2]);
  }

  const plane = SIZE * SIZE;
  const out = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    for (let ch = 0; ch < 3; ch++) {
      out[ch * plane + i] = (data[i * 4 + ch] / max - MEAN[ch]) / STD[ch];
    }
  }
  return new ort.Tensor("float32", out, [1, 3, SIZE, SIZE]);
}

function applyMask(bitmap, pred, SIZE) {
  let min = Infinity, max = -Infinity;
  for (const v of pred) { if (v < min) min = v; if (v > max) max = v; }
  const range = max - min || 1;

  const small = new OffscreenCanvas(SIZE, SIZE);
  const sctx = small.getContext("2d");
  const m = sctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < pred.length; i++) {
    const v = ((pred[i] - min) / range) * 255;
    m.data[i * 4] = m.data[i * 4 + 1] = m.data[i * 4 + 2] = v;
    m.data[i * 4 + 3] = 255;
  }
  sctx.putImageData(m, 0, 0);

  const { width: w, height: h } = bitmap;
  const mc = new OffscreenCanvas(w, h);
  const mctx = mc.getContext("2d");
  mctx.imageSmoothingQuality = "high";
  mctx.drawImage(small, 0, 0, w, h);
  const mask = mctx.getImageData(0, 0, w, h).data;

  const oc = new OffscreenCanvas(w, h);
  const octx = oc.getContext("2d");
  octx.drawImage(bitmap, 0, 0);
  const img = octx.getImageData(0, 0, w, h);
  for (let i = 0; i < w * h; i++) img.data[i * 4 + 3] = mask[i * 4];
  octx.putImageData(img, 0, 0);
  return oc.convertToBlob({ type: "image/png" });
}

async function run() {
  $("[data-err]").textContent = "";
  const file = $("[data-in]").files[0];
  if (!file) return;
  const btn = $('[data-act="remove"]');
  btn.disabled = true;
  try {
    const key = $("[data-model]").value;
    const model = MODELS[key];
    $("[data-out]").textContent = sessions[key] ? "Processing..." : `Loading model (${model.label}, cached after first use)...`;
    const session = await loadModel(key);
    $("[data-out]").textContent = "Processing...";

    const bitmap = await createImageBitmap(file);
    const results = await session.run({ [session.inputNames[0]]: toTensor(bitmap, model) });
    const blob = await applyMask(bitmap, results[session.outputNames[0]].data, model.size);

    const url = URL.createObjectURL(blob);
    $("[img-out]").src = url;
    const dl = $("[data-dl]");
    dl.href = url;
    dl.hidden = false;
    $("[data-out]").textContent = "Done!";
  } catch (e) {
    $("[data-out]").textContent = "";
    $("[data-err]").textContent = e.message;
  } finally {
    btn.disabled = false;
  }
}

root.addEventListener("click", (e) => {
  if (e.target.dataset.act === "remove") run();
  else if (e.target.dataset.act === "download") {
    const url = e.target.href;
    const link = document.createElement("a");

    link.href = url;
    link.download = e.target.dataset.filename;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});

$("[data-model]").addEventListener('change', (e) => {
  if ($("[data-model]").value === "quality") {
    $("p.notice").classList.toggle("hidden", false);
  } else {
     $("p.notice").classList.toggle("hidden", true);
  }
});

// ran on loading
if ($("[data-model]").value === "quality") {
  $("p.notice").classList.toggle("hidden", false);
} else {
   $("p.notice").classList.toggle("hidden", true);
}
