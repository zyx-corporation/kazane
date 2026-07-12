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
codesign --force --deep --sign - src-tauri/target/release/bundle/macos/Kazane.app
codesign --verify --deep --strict src-tauri/target/release/bundle/macos/Kazane.app
hdiutil create -volname Kazane \
  -srcfolder src-tauri/target/release/bundle/macos/Kazane.app \
  -ov -format UDZO src-tauri/target/release/bundle/dmg/Kazane_0.8.0_aarch64.dmg
hdiutil verify src-tauri/target/release/bundle/dmg/Kazane_0.8.0_aarch64.dmg
rm -rf /Applications/Kazane.app
ditto src-tauri/target/release/bundle/macos/Kazane.app /Applications/Kazane.app
open -a /Applications/Kazane.app
```

The database is migrated in place when the new application starts.

## Start the local runtime processes

```bash
scripts/kazane-agentd start
scripts/kazane-privd start
scripts/kazaned start
scripts/kazane-agentd status
scripts/kazane-privd status
scripts/kazaned status
```

Agents can then wait for assignments without polling:

```bash
scripts/kazane-agent watch --timeout 300
```

If `kazane-agentd` is unavailable, `watch` falls back to the durable task-file
queue. `kazane-mcp` starts `kazaned` and `kazane-privd` when needed, but explicit
startup makes process state visible to the operator.

## Verify the installed application

```bash
defaults read /Applications/Kazane.app/Contents/Info CFBundleShortVersionString
codesign --verify --deep --strict /Applications/Kazane.app
codesign -dv --verbose=2 /Applications/Kazane.app
```

The current local build is ad-hoc signed. Developer ID signing and Apple
notarization are required before distribution to other users.

## Roll back

1. Close Kazane and stop `kazaned`, `kazane-privd`, and `kazane-agentd`.
2. Replace `/Applications/Kazane.app` with the previous application bundle.
3. Restore the corresponding `kazane.db.backup-*` only when a schema rollback
   is required; application rollback alone should not modify the database.
