const root = document.querySelector('[data-tool="bg-remover"]');
const $ = (s) => root.querySelector(s);

const ORT_BASE = new URL("../../vendor/ort/", import.meta.url).href;
const MODEL_URL = new URL("../../models/u2netp.onnx", import.meta.url).href;
const SIZE = 320;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

let ort, session;

async function loadModel() {
  if (session) return;
  ort = await import(ORT_BASE + "ort.wasm.min.mjs");
  ort.env.wasm.wasmPaths = ORT_BASE;
  ort.env.wasm.numThreads = 1;
  session = await ort.InferenceSession.create(MODEL_URL, { executionProviders: ["wasm"] });
}

function toTensor(bitmap) {
  const c = new OffscreenCanvas(SIZE, SIZE);
  const ctx = c.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  let max = 1;
  for (let i = 0; i < data.length; i += 4) max = Math.max(max, data[i], data[i + 1], data[i + 2]);

  const plane = SIZE * SIZE;
  const out = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    for (let ch = 0; ch < 3; ch++) {
      out[ch * plane + i] = (data[i * 4 + ch] / max - MEAN[ch]) / STD[ch];
    }
  }
  return new ort.Tensor("float32", out, [1, 3, SIZE, SIZE]);
}

function applyMask(bitmap, pred) {
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
    $("[data-out]").textContent = session ? "Processing..." : "Loading model (~16 MB)...";
    await loadModel();
    $("[data-out]").textContent = "Processing...";

    const bitmap = await createImageBitmap(file);
    const results = await session.run({ [session.inputNames[0]]: toTensor(bitmap) });
    const blob = await applyMask(bitmap, results[session.outputNames[0]].data);

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
