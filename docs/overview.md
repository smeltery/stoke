# A shared home for local CI

Stoke brings Kiln and Bellows into one workspace for local GitHub Actions feedback.
Bellows plans and runs the workflows; Kiln supplies the runner environment.

## Assemble your workspace

Clone Stoke and set up the pair. Each tool keeps its own source, history and releases.

```sh
git clone https://github.com/smeltery/stoke.git
cd stoke
bash scripts/fleet.sh setup
```

Setup clones the source repositories. Follow [getting started](getting-started.md)
to install Docker, act and Bellows before your first run.

## Your first local workflow

From your project, with GitHub Actions workflows under `.github/workflows`:

```sh
bellows init
bellows doctor
bellows run --list --estimate
bellows run
```

Review runner mappings, skipped jobs and secret allowlists in `.bellows.yml`.
Preview the plan before starting containers. Keep hosted CI for platform coverage
and merge enforcement.

## The working pair

| Tool | Responsibility | Documentation |
| --- | --- | --- |
| Stoke | Assemble and update the workspace | [Workspace usage](usage.md) |
| Bellows | Plan, diagnose and run workflows | [Bellows quickstart](members/bellows/quickstart.md) |
| Kiln | Supply the Wolfi runner image | [Kiln usage](members/kiln/usage.md) |

## Use Kiln directly

```sh
docker pull ghcr.io/smeltery/kiln:latest
act -P ubuntu-latest=ghcr.io/smeltery/kiln:latest
```

Kiln runs Wolfi Linux with `apk`. Ubuntu-style tags are compatibility aliases.
See [runner usage](members/kiln/usage.md) for architecture choices and
[maintenance](members/kiln/maintenance.md) for signatures and image verification.

## Keep the feedback close

Use [pre-push hooks](members/bellows/pre-commit.md) for everyday feedback, or
[local verification](members/bellows/local-verification.md) to record exact
committed inputs. Native Flox profiles reuse your project's commands; dedicated
Docker execution supports compatible workflow jobs and services.

For installation, command flags, configuration, compatibility and security,
use the Bellows and Kiln sections in the sidebar. The documentation search
includes their guides and code examples.
