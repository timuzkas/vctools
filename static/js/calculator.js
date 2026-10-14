const button = document.querySelector("#calc-button");

button?.addEventListener("click", () => {
  const a = Number(document.querySelector("#calc-a").value);
  const b = Number(document.querySelector("#calc-b").value);

  document.querySelector("#calc-result").textContent = `Result: ${a + b}`;
});

