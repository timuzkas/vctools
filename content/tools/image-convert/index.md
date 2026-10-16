---
title: Image Convert
description: Convert image formats
category: image
weight: 10
---

<div class="controls">
  <input data-in type="file" accept="image/*">
  <select data-format aria-label="Output">
    <option value="png">PNG</option>
    <option value="jpeg">JPEG</option>
    <option value="webp">WebP</option>
    <option value="ico">ICO</option>
  </select>
  <label data-quality-container>
    Quality
    <input data-quality type="range" min="0" max="1" step="0.01" value="0.8">
  </label>
  <label data-bgcolor-container>
    Background Color
    <input data-backgroundColor type="color" name="bg-color" value="#ffffff">
  </label>
  <button data-act="ocr">Convert</button>
</div>
<div class="result-bar">
  <p class="larger"> results: </p>
  <button data-dl data-act="download" data-filename="converted.">Download</button>
</div>
<p data-out></p>
<p data-err></p>
<img img-out alt="Result">

