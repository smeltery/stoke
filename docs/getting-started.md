# Getting started

## Assemble the workspace

Git and Bash are enough to clone the member sources:

```sh
git clone https://github.com/smeltery/stoke.git
cd stoke
bash scripts/fleet.sh setup
```

Existing members stay in place. Setup validates their origins and does not
install tools, build images, start services or change your project.

## Install the runtime

Install and start a Docker-compatible runtime, then install act and Bellows.
On macOS with Homebrew:

```sh
brew install act
brew tap smeltery/tap
brew install --cask smeltery/tap/bellows
docker info
bellows --version
```

On other supported platforms, follow
[act installation](https://nektosact.com/installation/index.html) and
[Bellows installation](https://github.com/smeltery/bellows/blob/main/docs/installation.md).
With a compatible Go toolchain, Bellows can also be installed with
`go install github.com/smeltery/bellows@latest`.

Kiln is a container image, so it needs no separate CLI installation:

```sh
docker pull ghcr.io/smeltery/kiln:latest
```

## Run your project's workflow

Change into your own project, which should already have GitHub Actions workflows
under `.github/workflows`, then run:

```sh
bellows init
bellows doctor
bellows run --list --estimate
bellows run
```

Review the generated `.bellows.yml`, including runner mappings, skipped jobs and
secret allowlists. Bellows defaults to Kiln runner images. `--list` previews the
plan without executing Docker. Run only workflows you trust with your local
Docker socket and allowed secrets.

Kiln uses Wolfi and `apk`; Ubuntu-style tags are aliases. Workflows requiring
`apt`, systemd, a native macOS host or the complete hosted runner environment need
adaptation or hosted coverage. Keep hosted CI and required checks in place.

See [workspace usage](usage.md) for updates and the optional pre-push hook.
