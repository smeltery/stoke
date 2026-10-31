import { mkdir } from "node:fs/promises";
import { dirname, posix } from "node:path";
import { members } from "../web/docs/catalog";

const snapshots: Record<string, string> = {};
for (const [member, entries] of Object.entries(members)) {
  const git = (...args: string[]) => {
    const result = Bun.spawnSync(["git", "-C", member, ...args]);
    if (result.exitCode) throw new Error(result.stderr.toString());
    return result.stdout.toString().trimEnd();
  };
  const revision = git("rev-parse", "HEAD");
  snapshots[member] = revision;
  const included = new Set(entries.map(([slug]) => `docs/${slug}.md`));
  for (const [slug] of entries) {
    const source = `docs/${slug}.md`;
    const markdown = git("show", `${revision}:${source}`).replace(
      /(\]\()([^\s)]+)(\))/g,
      (match, before, href, after) => {
        if (/^(?:[a-z]+:|#)/i.test(href)) return match;
        const [path, fragment] = href.split("#");
        const target = posix.normalize(posix.join(dirname(source), path));
        if (included.has(target)) return match;
        return `${before}https://github.com/smeltery/${member}/blob/${revision}/${target}${fragment ? `#${fragment}` : ""}${after}`;
      },
    );
    await mkdir(`docs/members/${member}`, { recursive: true });
    await Bun.write(`docs/members/${member}/${slug}.md`, `${markdown}\n`);
  }
}
await Bun.write("web/docs/snapshots.json", JSON.stringify(snapshots, null, 2) + "\n");
console.log("Synced committed member docs; review snapshots before committing.");
