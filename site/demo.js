const output = document.querySelector("#demo-output");
const initial = output.textContent;
const steps = {
  check: initial,
  plan: '$ bellows run --list --estimate\n\nWorkflow: ci.yml\n  lint  → local runner\n  test  → local runner\n\nRunner: ghcr.io/smeltery/kiln\nPlan only · no containers started',
  run: '$ bellows run\n\nact starts the configured Kiln runner\n  ✓ lint\n  ✓ test\n\nLocal feedback, before the push.\nHosted CI keeps its required checks.',
};
for (const button of document.querySelectorAll("[data-step]")) {
  button.addEventListener("click", () => {
    output.textContent = steps[button.dataset.step];
    for (const other of document.querySelectorAll("[data-step]")) {
      other.setAttribute("aria-pressed", String(other === button));
    }
  });
}
document.querySelector("#copy").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(document.querySelector("#install-command").textContent);
    document.querySelector("#copy").textContent = "Copied";
    status.textContent = "Commands copied.";
  } catch {
    status.textContent = "Copy unavailable. Select the commands above to copy manually.";
  }
});

const menuButton = document.querySelector(".nav-toggle");
const menu = document.querySelector("#nav-links");
function setMenu(open) {
  menu.dataset.open = String(open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "Close" : "Menu";
}
menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});
