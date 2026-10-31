# Development

## Shared environment and checks

Install Flox, then from Stoke run:

```sh
flox activate -- bun install --frozen-lockfile
flox activate -- bun run check
```

Flox supplies Bun, Git, GitHub CLI, ShellCheck, actionlint and pre-commit. It does
not install Docker or the member runtimes. Activation configures the repository's
pre-commit hook. The hook, CI and manual validation share `scripts/check.sh`.

Checks cover Markdown style, local links, Mermaid syntax, source budgets, brand
integrity, shell and workflow linting, workspace behavior, site interactions and
a static site build. Fleet tests use temporary fixtures and a fake Git command;
they do not modify your member checkouts or fetch real repositories.

Stoke has a 4,000-line source budget and 300 lines per file, including TSX.
The increase from 1,400 covers the requested Convrt documentation shell, its
search/navigation/page actions, Markdown rendering, snapshot tooling and checks.
Font licenses, lockfiles, raster assets and generated SVG paths are not
handwritten source. Keep checks focused on behavior and user-facing failures.

## Preview the site

```sh
flox activate -- bun run build:site
python3 -m http.server --bind 127.0.0.1 --directory dist/site 8000
```

Open `http://127.0.0.1:8000`. Check desktop and narrow layouts, all workflow demo
steps, mobile menu, keyboard navigation, FAQ disclosure and copy success/failure.
The demo explicitly labels example output and never executes a real workflow.
The brand guide is at `/assets/brand/` and uses only local assets.

## Documentation site

The site builds 35 static routes under `/docs/`. Each route includes rendered
content before JavaScript loads. React adds search, code copying, page actions
and mobile navigation; Mermaid diagrams load on pages that contain them.
The header and footer point to the hosted documentation.

Edit workspace Markdown under `docs/`. Bellows/Kiln pages use committed snapshots
under `docs/members/`; refresh them from the checked-out member commits with
`bun run docs:sync`, then review the Markdown and `web/docs/snapshots.json`.
No member checkout or network fetch is needed during deployment. See
[sources and attribution](SOURCES.md) for the reference and update rules.

`bun run build:site` generates the page catalog, bundles the docs client and
writes each route to `dist/site`. `bun run check:types` validates the docs source.
Tests check Markdown safety, nested content, search, local links, assets and
anchors across every generated page. Recheck desktop/mobile navigation, keyboard
search, copying, chat links, tables and diagrams when changing the shell.

## Brand updates

```sh
flox activate -- bun run brand:build
flox activate -- bun run brand:update
flox activate -- bun run check
```

Review appearance before updating the integrity manifest. See the
[brand library](../assets/brand/README.md) for exact color, font and logo rules.
Member marks stay unchanged; update their provenance when syncing new versions.
