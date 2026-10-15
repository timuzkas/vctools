---
title: BG remover
description: Remove image background
category: transforms
weight: 10
---

<div class="controls">
  <input data-in type="file" accept="image/*">
  <select data-model aria-label="Model">
    <option value="quality">Quality (44 MB, slower)</option>
    <option value="fast">Fast (4 MB)</option>
  </select>
  <button data-act="remove">Remove</button>
</div>
<p data-out></p>
<img img-out alt="Result">
<button data-dl data-act="download" data-filename="no-bg.png" hidden>Download PNG</button>
<p data-err></p>
