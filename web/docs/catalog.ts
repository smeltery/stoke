export const workspace = [
  ["/docs", "docs/overview.md", "Overview", "Start here"],
  ["/docs/getting-started", "docs/getting-started.md", "Getting started", "Start here"],
  ["/docs/usage", "docs/usage.md", "Workspace usage", "Start here"],
  ["/docs/configuration", "docs/configuration.md", "Configuration", "Workspace"],
  ["/docs/architecture", "docs/architecture.md", "Architecture", "Workspace"],
  ["/docs/troubleshooting", "docs/troubleshooting.md", "Troubleshooting", "Workspace"],
  ["/docs/development", "docs/development.md", "Development", "Project"],
  ["/docs/releases", "docs/releases.md", "Releases and deployment", "Project"],
] as const;

export const members = {
  bellows: [
    ["installation", "Installation"], ["quickstart", "Quickstart"],
    ["how-it-works", "How it works"], ["commands", "Command reference"],
    ["configuration", "Configuration"], ["local-verification", "Local verification"],
    ["native-profiles", "Native Flox profiles"], ["services", "Docker services"],
    ["caches", "Caches"], ["trusted-reporting", "Trusted reporting"],
    ["pre-commit", "Pre-push hooks"], ["compatibility", "Compatibility"],
    ["local-differences", "Local differences"], ["blacksmith", "Blacksmith runners"],
    ["migration", "Migration"], ["secrets", "Secrets"], ["security", "Security"],
    ["troubleshooting", "Troubleshooting"], ["development", "Development"],
    ["releases", "Releases"],
  ],
  kiln: [
    ["usage", "Usage and runner images"], ["packages", "Package reference"],
    ["building", "Building images"], ["architecture", "Architecture"],
    ["maintenance", "Maintenance and verification"],
    ["automation", "Automation and releases"], ["development", "Development"],
  ],
} as const;
