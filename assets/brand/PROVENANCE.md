# Brand and repository provenance

## Stoke identity

Created on 2026-10-31 for the project owner's requested Kiln/Bellows parent
workspace. The owner selected the name Stoke. The angular two-color flame,
outlined wordmarks, compositions and generated exports are new vector artwork.
The source is [build-brand.ts](../../scripts/build-brand.ts); no raster image
generator or external stock artwork is used.

Paper, Ink, Gold, Ember, semantic text colors, typography and logo spacing rules
follow the existing Kiln and Bellows brand libraries. The SVGs in this library
named `kiln-*`, `bellows-*`, `symbol-gold.svg` and `symbol-ember.svg` are copied
unchanged from these repository snapshots:

- [Kiln 2d7ba8f](https://github.com/smeltery/kiln/tree/2d7ba8f84c31adacaed577b7a2fe77cff4d40cff/assets/brand).
- [Bellows aaf0ddb](https://github.com/smeltery/bellows/tree/aaf0ddb707aee5b7da1edc5c5ef3ecefd53ea3c6/assets/brand).

The member provenance files record the original supplied kits. This record does
not assert separate rights or licensing grants for their artwork. The parent
repository retains [PolyForm Shield 1.0.0](../../LICENSE).

## Repository and guide reference

The fleet script, base tests, quality checks, CI, Flox configuration, license and
static site structure are adapted from
[Harbor 9099fb5](https://github.com/smeltery/harbor/tree/9099fb534accf095b2b423f64651948091e005c9).
Harbor's license and copyright notice are preserved. The brand guide adapts
Kiln's existing layout, logo switcher and copyable swatches. No Harbor logo or
Mac-testing artwork is included.

The Flox lock retains Harbor's exact resolved package entries, with the
Mac-specific Tart dependency removed to match Stoke's manifest.

## Fonts

Original Space Grotesk and JetBrains Mono variable TTFs and their SIL Open Font
License notices are copied unchanged from Kiln:

- [Space Grotesk notice](fonts/SpaceGrotesk-OFL.txt),
  [upstream](https://github.com/floriankarsten/space-grotesk).
- [JetBrains Mono notice](fonts/JetBrainsMono-OFL.txt),
  [upstream](https://github.com/JetBrains/JetBrainsMono).

The static `SpaceGrotesk-Regular.ttf` (400), `SpaceGrotesk-Semibold.ttf` (600)
and `JetBrainsMono-Regular.ttf` (400) files were instantiated from those originals
using fontTools 4.60.2. Their OFL notices also apply. They are committed build
inputs; rebuilding assets requires only the locked Bun dependencies. Static
instances avoid malformed outlines produced by variable-font interpolation in
opentype.js 2.0.0; the generator uses pinned opentype.js 1.3.4.

To recreate these font inputs with fontTools 4.60.2, use
`fonttools varLib.instancer INPUT.ttf wght=WEIGHT --output OUTPUT.ttf` for each
of the three input/weight/output combinations above. The original variable
fonts continue to supply the web interface through `tokens/brand.css`.
