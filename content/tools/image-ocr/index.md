---
title: Image OCR
description: Optical Character Recognition from images
category: image
weight: 10
---

<div class="controls">
  <input data-in type="file" accept="image/*">
  <select data-lang aria-label="Language">
    <option value="eng">English</option>
    <option value="lit">Lithuanian</option>
    <option value="rus">Russian</option>
    <option value="deu">German</option>
    <option value="fra">French</option>
    <option value="spa">Spanish</option>
    <option value="por">Portuguese</option>
  </select>
  <button data-act="ocr">Run OCR</button>
</div>
<div class="result-bar">
  <p class="larger"> results: </p>
  <button data-act="copy">Copy</button>
</div>
<pre data-out></pre>
<p data-err></p>
