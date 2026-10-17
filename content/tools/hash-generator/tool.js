const root = document.querySelector('[data-tool="hash-generator"]');
const $ = (s) => root.querySelector(s);

async function sha(text, algorithm) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);

  return Array.from(new Uint8Array(digest), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

const correctAlgorithms = ["SHA-1", "SHA-256", "SHA-512"];

async function run() {
  $("[data-err]").textContent = "";
  $("[data-comparasion]").hidden = true;
  try {
    const algorithm = $("[data-algorithm]").value;
    
    const input = $("[data-in]").value;

    
    if (correctAlgorithms.includes(algorithm)) {
      $("[data-out]").textContent = await sha(input, algorithm);

      if ($("[data-compare]").value.length > 0) {
        const expected = $("[data-compare]").value.trim().split(/\s+/)[0].toLowerCase();
        const actual = $("[data-out]").textContent.trim().toLowerCase();

        const ok = actual === expected;
        
        $("[data-comparasion]").hidden = false;
        $("[data-comparasion]").classList.toggle("ok", ok);
        $("[data-comparasion]").classList.toggle("bad", !ok);
        $("[data-comparasion]").textContent = ok ? "Match" : "Doesn't match";
      } else {
        $("[data-comparasion]").hidden = true;
      }
      
      
    } else {
      throw new Error("Unknown hashing algorithm!");
    }
  } catch (e) {
    $("[data-err]").textContent = e.message;
  }
}

$("[data-comparasion]").hidden = true;

root.addEventListener("click", (e) => {
  if (e.target.dataset.act === "hash") run();
  if (e.target.dataset.act === "copy") navigator.clipboard.writeText($("[data-out]").textContent);
});
