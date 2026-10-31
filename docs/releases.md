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

[`vercel.json`](../vercel.json) follows Harbor's static deployment setup. Import
`smeltery/stoke` into Vercel with the repository root as the project root; the
build copies `site/` and `assets/` into `dist/site`. No environment variables or
runtime services are required. This repository does not provision a deployment
or domain automatically.

For other hosts, run `bun run build:site` and publish `dist/site`.

GitHub's social preview can be set by uploading
[`social-preview.png`](../assets/brand/applications/social-preview.png) in the
repository settings. Committing the file alone does not change that setting.
