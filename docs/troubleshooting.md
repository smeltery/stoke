# Troubleshooting

## Setup or updates

- **Git or Bash missing:** install both before running the fleet script.
- **Unexpected origin:** inspect `git -C kiln remote -v` or the Bellows equivalent.
  Move an unrelated checkout out of the destination before retrying.
- **Destination is not a repository:** inspect and move the existing directory;
  Stoke will not delete or overwrite it.
- **Skipped update:** commit or stash your edits, or switch back to `main` when
  you are ready. Stoke does not change branches or stash work automatically.
- **Diverged history:** inspect the member's Git log and resolve it deliberately;
  the fleet script only permits fast-forward pulls.

## Local workflows

- **Docker unavailable:** start your Docker runtime and run `docker info`.
- **Missing act or Bellows:** follow [getting started](getting-started.md).
- **No workflows found:** run Bellows from your own project with workflow files
  under `.github/workflows`, rather than the parent workspace.
- **Image missing:** run `docker pull ghcr.io/smeltery/kiln:latest` and inspect
  the image tags referenced in your `.bellows.yml`.
- **Missing apt or hosted tools:** Kiln uses Wolfi's `apk`. Adapt the workflow,
  extend the image, or keep that check on a hosted runner.
- **Architecture mismatch:** consult
  [Kiln usage](https://github.com/smeltery/kiln/blob/main/docs/usage.md) and the
  Bellows `docker.platform` setting before choosing native execution or emulation.

Run `bellows doctor` in the affected project for concrete compatibility guidance.
