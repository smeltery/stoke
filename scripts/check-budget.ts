import { $ } from "bun";
const budget = await Bun.file("budget.json").json();
const files = (await $`git ls-files --cached --others --exclude-standard`.text()).trim().split("\n");
let total = 0;
for (const file of files) {
  if (file.endsWith(".svg")) continue;
  if (!/\.(?:sh|tsx?|js|html|css)$/.test(file)) continue;
  const lines = (await Bun.file(file).text()).trimEnd().split("\n").length;
  total += lines;
  const limit = budget.files[file] ?? budget.perFile;
  if (lines > limit) throw new Error(`${file}: ${lines} lines exceeds ${limit}`);
}
if (total > budget.total) throw new Error(`Total ${total} exceeds ${budget.total}`);
console.log(`LOC budget: ${total}/${budget.total}; per-file limits passed`);
