# Kazane / 風音

Kazane is an early-stage AI business operating system for orchestrating human and AI-agent work while preserving context, provenance, audit trails, and accountability boundaries.

Kazane is not intended to be just another chat interface. Its goal is to manage the operational context around AI-assisted work: what was requested, what evidence was used, what judgment was made, who or what acted, and where responsibility remains with humans.

## Project status

This repository is currently in the bootstrap phase. Public code, architecture notes, APIs, and contribution rules will be added incrementally.

Until a formal contribution policy is published, please open an issue before sending substantial code contributions. Kazane is planned as a dual-licensed project, so contribution acceptance may require a contributor agreement that preserves ZYX's ability to offer both open-source and commercial licensing.

## Core design themes

- Context sovereignty: business context should remain inspectable, portable, and accountable.
- Provenance preservation: prompts, decisions, evidence, agent actions, and human approvals should retain their origin and history.
- Auditability: AI-assisted workflows should leave reviewable traces rather than opaque outputs.
- Responsibility boundaries: Kazane should distinguish recommendation, execution, approval, delegation, and final human responsibility.
- Agent operations: AI agents should be operated as organizational actors with roles, permissions, logs, and review paths.

## Licensing

Kazane is dual-licensed.

By default, Kazane is licensed under the GNU Affero General Public License v3.0 only (`AGPL-3.0-only`). See [LICENSE](./LICENSE).

Commercial licensing is available from ZYX Corp株式会社 for users who need terms outside AGPL-3.0-only, such as private modifications, proprietary integration, hosted service use, redistribution, enterprise support, or commercial deployment terms that do not require AGPL source disclosure. See [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md) for the provisional commercial licensing notice.

Unless a separate written commercial license has been executed with ZYX Corp株式会社, use of Kazane is governed by AGPL-3.0-only.

Recommended SPDX identifier for source files that are available under either license:

```text
SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Kazane-Commercial
```

## Repository layout

The repository layout is intentionally minimal at this stage.

```text
.
├── README.md
├── LICENSE
└── COMMERCIAL-LICENSE.md
```

Planned areas include core runtime, workflow definitions, agent execution boundaries, audit log structures, connector interfaces, and documentation for deployment and operations.

## Commercial licensing inquiries

For commercial licensing, enterprise deployment, partnership, or support inquiries, contact:

- ZYX Corp株式会社
- Email: info@zyxcorp.jp
- Website: https://www.zyxcorp.jp/

## Legal note

The commercial license text in this repository is provisional and should be reviewed before production use or customer distribution. Nothing in this repository should be treated as legal advice.
