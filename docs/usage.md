# Workspace usage

## Clone and update

```sh
bash scripts/fleet.sh setup
bash scripts/fleet.sh update
```

Both commands clone missing members. Setup leaves existing checkouts unchanged.
Update pulls existing members only when their working trees are clean and their
branch is `main`. Dirty trees, feature branches and detached HEADs are skipped
with a visible message. Pulls use `--ff-only`; divergence fails without a merge
or reset. Unexpected origins and non-repository destinations fail explicitly.

Each member has its own Git history, dependency environment, checks and releases.
Commit member changes in that member's repository. Source updates do not update
an installed Bellows binary or pull a newer Kiln image.

## Everyday feedback

From your project directory:

```sh
bellows doctor
bellows run --list --estimate
bellows run --workflow ci.yml
```

To use Kiln directly with act:

```sh
act -P ubuntu-latest=ghcr.io/smeltery/kiln:latest
```

## Optional pre-push feedback

Install the `pre-commit` framework, then from your project run:

```sh
bellows init --pre-commit
pre-commit install --hook-type pre-push
```

Review generated configuration before committing. Hooks can be bypassed; hosted
required checks continue to determine merge enforcement. For exact-commit local
verification and private receipts, see
[Bellows local verification](https://github.com/smeltery/bellows/blob/main/docs/local-verification.md).
