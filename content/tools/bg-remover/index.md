---
title: BG remover
description: Remove image background
category: image
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
<p class="notice">* This model isn't hosted by us.</p>
<div class="result-bar">
  <p class="larger"> results: </p>
  <button data-dl data-act="download" data-filename="no-bg.png">Download PNG</button>
</div>
<p data-out></p>
<p data-err></p>
<img img-out alt="Result">
