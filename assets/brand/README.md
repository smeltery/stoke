# Stoke brand

Good work starts close to home.

Stoke is a shared home for local CI: it assembles Kiln and Bellows in one
workspace. Use “A shared home for local CI.” as the short description and
“Local workflows. Shared purpose.” as the supporting line.

## Preview and downloads

Open [index.html](index.html) for the responsive brand guide, light/dark/one-color
logo switcher, copyable palette, typography and downloads. All fonts and artwork
are local. Clipboard access works when served from localhost; visible hex values
remain available when copying is unavailable.

- [Brand board PNG](brand-board.png) and [vector board](brand-board.svg).
- [Primary logo](logos/svg/stoke-primary.svg), [reversed logo](logos/svg/stoke-reversed.svg),
  [stacked logo](logos/svg/stoke-stacked.svg) and one-color Ink/Paper variants.
- [Two-color symbol](logos/svg/symbol.svg), one-color symbols and separate wordmarks.
- [Application tile](logos/png/app-icon.png), [SVG favicon](logos/svg/favicon.svg),
  [multi-size ICO](logos/png/favicon.ico), and 16–512 px icon exports.
- [README banner](applications/readme-banner.png), [social preview](applications/social-preview.png)
  and [documentation header](applications/docs-header.png), each with a matching SVG.
- [CSS tokens](tokens/brand.css), [JSON tokens](tokens/brand-tokens.json)
  and [editor palette](tokens/stoke.gpl).
- [Provenance](PROVENANCE.md) and [validation](VALIDATION.md).

SVG masters contain outlined lettering and render without installed fonts.
Matching transparent PNGs live in `logos/png`. The `stoke-on-*` variants include
intentional opaque backgrounds. Banners and boards also have opaque surfaces.

## The family

The flame follows the angular geometry of Kiln's chamber and Bellows' airways.
Its two planes join Kiln Gold (`#E5B05C`) and Bellows Ember (`#F06A43`). Member
marks are copied unchanged and retain their names. Stoke assembles the workspace;
Bellows orchestrates the workflows; Kiln supplies the container environment.

Paper (`#F5F3ED`) and Ink (`#191C22`) remain the main surfaces. Use Steel
(`#626B75`) for secondary text on Paper, or `#BBC2CA` on Ink. Choose Ink text
on Gold or Ember. Use Burnt Gold (`#7A4D16`) and Burnt Ember (`#A9361C`) for
accent text on Paper. Gold and Ember are not small-text colors on Paper.

Use local Space Grotesk 400–700 for the interface, with JetBrains Mono 400–500
for commands, metadata and data. Preserve the font licenses beside the files.
The original variable fonts power the interface; static 400/600 instances are
inputs for reliable outlined artwork generation.

Keep one quarter of the symbol height clear around visible artwork. Minimum
sizes are 160 px lockup width and 16 px symbol height. Preserve geometry,
proportions, lowercase lettering, orientation and color assignments. Use supplied
one-color variants when the two-color mark cannot be reproduced clearly.

## Voice and product claims

Keep language capable, approachable and direct. State the tool's actual role.
Workspace setup clones sources; runtime installation is separate. Bellows uses
act and Docker; Kiln runs Wolfi with `apk`. Ubuntu-style image tags are aliases,
not Ubuntu installations. Hosted CI continues to provide platform coverage and
merge enforcement. Label demonstration output as illustrative.

## Rebuild and verify

```sh
bun run brand:build
bun run brand:update
bun run check
```

Edit the palette in `tokens/brand-tokens.json` and the owned geometry and
compositions in `scripts/build-brand.ts`. The generator writes vector masters,
matching PNGs, favicon sizes, ICO, banners, the brand board and CSS/GPL tokens.
The HTML guide is maintained separately. Review intentional visual changes before
updating `checksums.json`; integrity checks do not prove visual correctness.

The root README and site use these same assets. To set GitHub's repository social
preview, upload `applications/social-preview.png` in repository settings.
