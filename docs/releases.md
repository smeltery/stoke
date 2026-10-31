# Releases and deployment

Stoke is a workspace, not a combined binary. Bellows publishes its CLI releases
and Kiln publishes container images independently:

- [Bellows releases](https://github.com/smeltery/bellows/releases)
- [Kiln releases](https://github.com/smeltery/kiln/releases)
- [Kiln container package](https://github.com/smeltery/kiln/pkgs/container/kiln)

Updating member sources does not upgrade installed binaries or cached images.
Use the installation method you originally chose to upgrade Bellows, and pull
the image or digest you intend to run. Keep immutable image references where
reproducibility matters.

## Landing site

The production site is [stoke-two.vercel.app](https://stoke-two.vercel.app),
with the [brand guide](https://stoke-two.vercel.app/assets/brand/) served from the
same deployment. The Vercel project is
[nicholas-adamous-projects/stoke](https://vercel.com/nicholas-adamous-projects/stoke)
under the `nicholasadamou` account and is connected to `smeltery/stoke`.
Pushes to `main` deploy to production through Vercel's GitHub integration.

[`vercel.json`](../vercel.json) follows Harbor's static deployment setup, with the
repository root as the project root. Vercel installs the locked Bun dependencies
and runs `bun run build:site`. The build copies the landing site and assets,
then renders and bundles documentation routes under `dist/site/docs`.
No environment variables or runtime services are required.

For other hosts, run `bun run build:site` and publish `dist/site`.

GitHub's social preview can be set by uploading
[`social-preview.png`](../assets/brand/applications/social-preview.png) in the
repository settings. Committing the file alone does not change that setting.
