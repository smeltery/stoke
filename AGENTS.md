# Stoke contributor instructions

Run `flox activate -- bun install --frozen-lockfile`, then
`flox activate -- bun run check` before committing. CI and the pre-commit
hook run the same gate. Use conventional commits without attribution footers.

Stoke assembles Kiln and Bellows; each member keeps its own source, history,
license and releases. Never commit the member checkouts. Preserve the fleet
script's validation and fast-forward-only updates. Cover changes to workspace
behavior with tests that use local fixtures, without changing real checkouts.

Use Bun for repository tooling and Bash for the workspace script. Keep source
files within `budget.json`. Reuse Harbor's navigation, setup, copy and workflow
demo patterns. Use the family palette and local fonts in `assets/brand`.
Keep member logos unchanged, and preserve the font licenses and `LICENSE`.

Regenerate owned artwork with `bun run brand:build`. Review the visual changes,
then run `bun run brand:update`. Checksums verify integrity, not appearance.
Keep examples consistent with the member docs; label illustrative output.
Do not claim that Wolfi is Ubuntu, containers emulate macOS, local execution
replaces hosted enforcement, or a Docker socket isolates untrusted code.
Never add credentials, runtime logs or downloaded container images.
