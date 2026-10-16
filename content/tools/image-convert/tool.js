const root = document.querySelector('[data-tool="image-convert"]');
const $ = (s) => root.querySelector(s);

async function run() {
  $("[data-err]").textContent = "";
  const file = $("[data-in]").files[0];
  const bgColor = $("[data-backgroundColor]").value;
  const format = $("[data-format]").value;
  
  const quality = $("[data-quality]").value;
  if (quality <= 0 || quality > 1) return;
  
  if (!file) return;
  const btn = $('[data-act="ocr"]');
  btn.disabled = true;
  try {
    $("[data-out]").textContent = "Converting...";


    const bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");

    if (format === "jpeg") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/" + format, quality)
    );

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

$("[data-format]").addEventListener('change', (e) => {
  if ($("[data-format]").value === "jpeg") {
    $("[data-quality-container]").hidden = false;
    $("[data-bgcolor-container]").hidden = false;
  } else {
    $("[data-quality-container]").hidden = true;
    $("[data-bgcolor-container]").hidden = true;
  }
});

if ($("[data-format]").value === "jpeg") {
  $("[data-quality-container]").hidden = false;
  $("[data-bgcolor-container]").hidden = false;
} else {
  $("[data-quality-container]").hidden = true;
  $("[data-bgcolor-container]").hidden = true;
}

root.addEventListener("click", (e) => {
  if (e.target.dataset.act === "ocr") run();
  else if (e.target.dataset.act === "download") {
    const url = e.target.href;
    const link = document.createElement("a");

    link.href = url;
    link.download = e.target.dataset.filename + $("[data-format]")?.value;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});

document.addEventListener("paste", (e) => {
  const file = [...e.clipboardData.files].find(f => f.type.startsWith("image/"));
  if (!file) return;

  const dataTransfer = new DataTransfer;
  dataTransfer.items.add(file);
  $("[data-in]").files = dataTransfer.files;

  run();
});
