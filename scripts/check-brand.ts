import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = "assets/brand";
async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`Unexpected brand symlink: ${path}`);
    return entry.isDirectory() ? files(path) : [path];
  }));
  return groups.flat();
}
const paths = (await files(root)).filter((path) => !path.endsWith(".md") && path !== `${root}/checksums.json`).sort();
const hashes = Object.fromEntries(await Promise.all(paths.map(async (path) => [
  path.slice(root.length + 1), createHash("sha256").update(await readFile(path)).digest("hex"),
])));
const manifest = `${root}/checksums.json`;
if (process.argv.includes("--update")) {
  await Bun.write(manifest, JSON.stringify(hashes, null, 2) + "\n");
  console.log(`Recorded ${paths.length} brand files`);
} else {
  const expected = await Bun.file(manifest).json();
  const changed = [...new Set([...Object.keys(hashes), ...Object.keys(expected)])]
    .filter((path) => hashes[path] !== expected[path]);
  if (changed.length) throw new Error(`Brand files changed, added or missing: ${changed.join(", ")}. Review, then run bun run brand:update.`);
  console.log(`Verified ${paths.length} brand files`);
}
