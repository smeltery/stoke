import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { parseHTML } from "linkedom";

function site(writeText: (value: string) => Promise<void> = async () => {}) {
  const { document, window } = parseHTML(readFileSync("site/index.html", "utf8"));
  runInNewContext(readFileSync("site/demo.js", "utf8"), { document, navigator: { clipboard: { writeText } } });
  return { document, window };
}

test("all three workflow steps update output and selection", () => {
  const { document } = site();
  for (const [step, command] of [["check", "bellows doctor"], ["plan", "bellows run --list --estimate"], ["run", "bellows run"]]) {
    document.querySelector(`[data-step="${step}"]`)!.click();
    expect(document.querySelector("#demo-output")!.textContent).toContain(command);
    expect(document.querySelectorAll('[data-step][aria-pressed="true"]').length).toBe(1);
    expect(document.querySelector(`[data-step="${step}"]`)!.getAttribute("aria-pressed")).toBe("true");
  }
});

test("copy writes exactly the setup commands and reports success", async () => {
  let copied = "";
  const { document } = site(async (value) => { copied = value; });
  document.querySelector("#copy")!.click();
  await Promise.resolve();
  expect(copied).toBe("git clone https://github.com/smeltery/stoke.git\ncd stoke\nbash scripts/fleet.sh setup");
  expect(document.querySelector("#copy-status")!.textContent).toBe("Commands copied.");
});

test("copy denial leaves commands available with a useful fallback", async () => {
  const { document } = site(async () => { throw new Error("Clipboard denied"); });
  document.querySelector("#copy")!.click();
  await Promise.resolve();
  expect(document.querySelector("#copy-status")!.textContent).toContain("Select the commands above");
  expect(document.querySelector("#install-command")!.textContent).toContain("scripts/fleet.sh setup");
});

test("mobile navigation opens, closes on links, and returns focus on Escape", () => {
  const { document, window } = site();
  const toggle = document.querySelector(".nav-toggle")!;
  let focused = false;
  toggle.focus = () => { focused = true; };
  toggle.click();
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(document.querySelector("#nav-links")!.dataset.open).toBe("true");
  document.querySelector("#nav-links a")!.click();
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  toggle.click();
  const escape = new window.Event("keydown");
  Object.defineProperty(escape, "key", { value: "Escape" });
  document.dispatchEvent(escape);
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(focused).toBe(true);
});

test("landing page and brand guide local links and resources exist", () => {
  for (const path of ["site/index.html", "assets/brand/index.html"]) {
    const { document } = parseHTML(readFileSync(path, "utf8"));
    for (const element of document.querySelectorAll("[href], [src]")) {
      const link = element.getAttribute("href") ?? element.getAttribute("src")!;
      if (/^[a-z]+:/i.test(link)) continue;
      if (link.startsWith("#")) {
        expect(document.getElementById(link.slice(1)), `${path}: ${link}`).toBeTruthy();
      } else {
        const base = path.startsWith("site/") && link.startsWith("./assets/") ? "." : resolve(path, "..");
        const target = link.startsWith("/") ? resolve("dist/site", `.${link}`) : resolve(base, link);
        expect(existsSync(target), `${path}: ${link}`).toBe(true);
      }
    }
  }
});
