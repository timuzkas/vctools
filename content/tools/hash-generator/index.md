---
title: Hash Generator
description: Generate SHA-1, SHA-256 and SHA-512 hashes.
category: encoding
weight: 10
---
<div class="controls">
  <textarea data-in rows="3" placeholder="Paste Input"></textarea>
  <textarea data-compare rows="3" class="optional" placeholder="Compare to this (optional)"></textarea>
  <select data-algorithm aria-label="Algorithms">
    <option value="SHA-1">SHA-1</option>
    <option value="SHA-256">SHA-256</option>
    <option value="SHA-512">SHA-512</option>
  </select>
  <button data-act="hash">Hash</button>
</div>

<div class="result-bar">
  <p class="larger"> results: </p>
  <p data-comparasion>match</p>
  <button data-act="copy">Copy</button>
</div>
<pre data-out></pre>
<p data-err></p>

