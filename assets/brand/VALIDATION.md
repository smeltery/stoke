# Validation

Validation records are maintained with the repository. Run the shared quality
gate with `flox activate -- bun run check`.

The gate verifies Markdown, relative links, Mermaid syntax, source budgets,
brand checksums, workflow/shell syntax, fleet behavior, site interactions and the
static build. `checksums.json` covers every non-Markdown brand file except the
manifest itself, detecting changed, missing and newly added assets.

The asset generator checks text outlines for non-finite coordinates and exports
SVG/PNG pairs from one source. PNG dimensions, transparency, icon sizes, ICO
entries and light/dark compositions are inspected during visual review. Font
licenses remain beside the original and static fonts.

The site and guide require visual review on desktop and narrow screens. Exercise
each demo step, copy success/failure, mobile menu and Escape handling, FAQ,
all three logo appearances and color swatches. Demonstration output is clearly
marked illustrative and does not execute a real workflow.

Checksums prove file integrity, not visual equivalence or renderer behavior.

## Initial integration: 2026-10-31

- `bun run check` passed: 13 Markdown files, one Mermaid diagram, 785/1,400
  source lines, 63 brand files, actionlint, ShellCheck, 15 tests with 97
  assertions, and the static site build.
- Headless Chromium checks passed at 320, 360, 390, 768 and 1,440 px widths.
  Demo, navigation, Escape/focus, FAQ, clipboard success/failure, all logo
  appearances and palette copying worked without page or resource errors.
- Reviewed desktop/mobile site and guide screenshots and the brand board.
  Verified outlined SVG coordinates, icon/application dimensions and unchanged
  member masters. A second brand build passed the existing checksum manifest.
- The local Flox executable exited unsuccessfully without a diagnostic during
  environment activation. The full gate passed directly using Bun 1.3.14,
  actionlint 1.7.12 and ShellCheck 0.11.0. CI retains Harbor's Flox workflow.
- CodeRabbit CLI was signed out; external automated review was unavailable.
  Repository code and the staged diff were reviewed locally.
