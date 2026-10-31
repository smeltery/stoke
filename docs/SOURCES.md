# Documentation sources and attribution

## Interface

The documentation interface adapts
[Convrt b66e8dd](https://github.com/smeltery/convrt/tree/b66e8dd48f37517779739f34b0038705101a1a70/apps/web/src/docs):
its header/sidebar layout, responsive breakpoints, search dialog with previews,
code blocks, mobile navigation and page actions. These components and styles are
reused in `web/docs`. Colors, type tokens, the logo and product copy use Stoke's
existing identity. Markdown rendering and static generation are specific to
Stoke's existing documentation sources.

Convrt and Stoke use the same Smeltery copyright and PolyForm Shield license;
the repository [license](../LICENSE) is retained. Chat-provider and GitHub marks
are copied unchanged from Convrt. See the
[asset source notes](../site/assets/docs-brands/README.md).

## Content

Workspace pages are authored under `docs/`. Bellows and Kiln guide snapshots live
under `docs/members/`, with exact source commits in
[`snapshots.json`](../web/docs/snapshots.json). The page catalog records the
selected member guides. View-source links point to those exact upstream commits;
edit links point to each source repository's `main` branch.

`bun run docs:sync` reads the committed files from the local member checkouts.
Links between included member guides keep their relative paths. Links to files
outside the selected set are expanded to their upstream commit URLs. The build
then maps included Markdown links to documentation routes. No upstream content
is downloaded during CI or deployment.

Review updates before committing. The snapshot docs retain the source project's
license and product claims. Workspace setup and runtime installation remain
separate; local feedback complements hosted CI and merge enforcement.
