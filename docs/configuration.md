# Configuration

## Fleet membership

[`scripts/repos.txt`](../scripts/repos.txt) lists one `owner/repository|directory`
pair per line. Stoke uses `smeltery/kiln|kiln` and `smeltery/bellows|bellows`.
Destinations must be plain lowercase names; traversal and arbitrary owners are
rejected. Add member directories to `.gitignore` when changing the fleet.

The script accepts GitHub HTTPS origins with or without `.git` and the standard
`git@github.com:owner/repo.git` SSH origin. It never changes an existing origin.

## Project runner configuration

Bellows reads `.bellows.yml` from the project you want to check, not from Stoke.
Run `bellows init` in that project, then review the generated config. For example:

```yaml
version: 1
default_workflows:
  - ci.yml
event: pull_request
runner:
  map:
    ubuntu-latest: ghcr.io/smeltery/kiln:ubuntu-22.04
```

All current Ubuntu-style Kiln tags alias one Wolfi image. They do not select an
Ubuntu distribution. Use a published image digest when reproducible image inputs
matter. Consult the member's
[configuration reference](https://github.com/smeltery/bellows/blob/main/docs/configuration.md)
for secrets, skips, platform overrides and native Flox profiles.

## Privacy

The workspace script performs Git clone and pull operations against GitHub. The
static landing site has no analytics, remote fonts or backend. Downloaded tools,
GitHub Actions and workflow dependencies may contact their own services. Bellows
passes only explicitly allowed secrets; review your workflows and config before
execution. A host Docker socket is not a boundary for untrusted code.
