import { afterEach, expect, test } from "bun:test";
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "stoke-test-")); roots.push(root);
  cpSync("scripts", `${root}/scripts`, { recursive: true });
  mkdirSync(`${root}/bin`);
  writeFileSync(`${root}/bin/git`, `#!/bin/bash
set -eu
printf '%s\\n' "$*" >> "$GIT_CAPTURE"
if [ "$1" = clone ]; then mkdir -p "$3/.git"; exit; fi
case "$3" in
 remote) echo "\${FAKE_ORIGIN:-https://github.com/smeltery/$2.git}" ;;
 status) printf '%s' "\${FAKE_DIRTY:-}" ;;
 symbolic-ref) [ "\${FAKE_DETACHED:-}" != true ] || exit 1; echo "\${FAKE_BRANCH:-main}" ;;
 pull) exit "\${FAKE_PULL_EXIT:-0}" ;;
esac
`, { mode: 0o755 });
  const run = (mode: string, env = {}) => Bun.spawnSync(["bash", "scripts/fleet.sh", mode], { cwd: root, env: { ...process.env, PATH: `${root}/bin:${process.env.PATH}`, GIT_CAPTURE: `${root}/calls`, ...env } });
  const calls = () => existsSync(`${root}/calls`) ? readFileSync(`${root}/calls`, "utf8") : "";
  return { root, run, calls };
}
test("setup is idempotent and clones exactly the two members", () => {
  const { run, calls } = fixture();
  expect(run("setup").exitCode).toBe(0);
  expect(run("setup").exitCode).toBe(0);
  expect(calls().match(/clone /g)?.length).toBe(2);
  expect(calls()).toContain("clone https://github.com/smeltery/kiln.git kiln");
  expect(calls()).toContain("clone https://github.com/smeltery/bellows.git bellows");
});
test("updates skip dirty worktrees and feature branches", () => {
  const { run, calls } = fixture();
  run("setup");
  expect(run("update", { FAKE_DIRTY: " M README.md" }).exitCode).toBe(0);
  expect(run("update", { FAKE_BRANCH: "feature" }).exitCode).toBe(0);
  expect(calls()).not.toContain("pull");
  expect(run("update").exitCode).toBe(0);
  expect(calls().match(/pull --ff-only/g)?.length).toBe(2);
});
test("rejects unsafe manifest destinations before cloning", () => {
  const { root, run, calls } = fixture();
  writeFileSync(`${root}/scripts/repos.txt`, "smeltery/kiln|../outside\n");
  expect(run("setup").exitCode).toBe(1);
  expect(calls()).toBe("");
});

test("updates skip detached HEADs", () => {
  const { run, calls } = fixture();
  run("setup");
  const result = run("update", { FAKE_DETACHED: "true" });
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString()).toContain("detached HEAD");
  expect(calls()).not.toContain("pull");
});

test("rejects unrelated repositories without pulling", () => {
  const { run, calls } = fixture();
  run("setup");
  const result = run("update", { FAKE_ORIGIN: "https://github.com/other/project.git" });
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain("Unexpected origin");
  expect(calls()).not.toContain("pull");
});

test("accepts the standard GitHub SSH origin", () => {
  const { root, run } = fixture();
  run("setup");
  writeFileSync(`${root}/scripts/repos.txt`, "smeltery/kiln|kiln\n");
  expect(run("update", { FAKE_ORIGIN: "git@github.com:smeltery/kiln.git" }).exitCode).toBe(0);
});

test("fails explicitly on an occupied non-repository destination", () => {
  const { root, run, calls } = fixture();
  mkdirSync(`${root}/kiln`);
  const result = run("setup");
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain("kiln is not a repository");
  expect(calls()).toBe("");
});

test("update clones missing members", () => {
  const { run, calls } = fixture();
  expect(run("update").exitCode).toBe(0);
  expect(calls().match(/clone /g)?.length).toBe(2);
});

test("propagates a failed fast-forward without resetting or merging", () => {
  const { run, calls } = fixture();
  run("setup");
  expect(run("update", { FAKE_PULL_EXIT: "1" }).exitCode).toBe(1);
  expect(calls()).toContain("pull --ff-only");
  expect(calls()).not.toMatch(/reset|stash|checkout|merge/);
});

test("rejects unsupported commands before invoking Git", () => {
  const { run, calls } = fixture();
  expect(run("remove").exitCode).toBe(1);
  expect(calls()).toBe("");
});
