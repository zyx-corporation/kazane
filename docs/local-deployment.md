# Local deployment

This runbook deploys the current Kazane build to one macOS user account. It
does not produce a notarized public release.

## Prerequisites

- Node.js 20 or later;
- Rust stable toolchain;
- Xcode command line tools;
- Python 3.11 or later for the agent CLI and integration tests;
- `uv` when running `scripts/kazane-mcp`.

## Verify

```bash
npm ci
npm test
npm run build
(cd src-tauri && cargo check)
```

## Back up local data

Close Kazane before copying the database.

```bash
data_dir="$HOME/Library/Application Support/jp.zyxcorp.kazane"
cp "$data_dir/kazane.db" "$data_dir/kazane.db.backup-$(date +%Y%m%d-%H%M%S)"
```

## Build and install

```bash
npm run tauri build
hdiutil verify src-tauri/target/release/bundle/dmg/Kazane_0.8.0_aarch64.dmg
rm -rf /Applications/Kazane.app
cp -R src-tauri/target/release/bundle/macos/Kazane.app /Applications/Kazane.app
open -a /Applications/Kazane.app
```

The database is migrated in place when the new application starts.

## Start the local agent notification process

```bash
scripts/kazane-agentd start
scripts/kazane-agentd status
```

Agents can then wait for assignments without polling:

```bash
scripts/kazane-agent watch --timeout 300
```

If `kazane-agentd` is unavailable, `watch` falls back to the durable task-file
queue. Stop the daemon with `scripts/kazane-agentd stop`.

## Verify the installed application

```bash
defaults read /Applications/Kazane.app/Contents/Info CFBundleShortVersionString
codesign -dv --verbose=2 /Applications/Kazane.app
```

The current local build is ad-hoc signed. Developer ID signing and Apple
notarization are required before distribution to other users.

## Roll back

1. Close Kazane and stop `kazane-agentd`.
2. Replace `/Applications/Kazane.app` with the previous application bundle.
3. Restore the corresponding `kazane.db.backup-*` only when a schema rollback
   is required; application rollback alone should not modify the database.
