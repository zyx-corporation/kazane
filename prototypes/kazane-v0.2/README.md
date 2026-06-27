# Kazane / 風音 Prototype v0.2

This directory contains a low-to-mid fidelity clickable prototype for **Kazane / 風音 — Chronicle Work OS**.

Kazane is not a development-team-only tool. Development is the first dogfooding field, but the product definition is broader: Kazane manages business workflows that AI agents can execute, assist, research, draft, review, or monitor, together with human judgment, context, evidence, handoff, and responsibility boundaries.

## Prototype goal

The goal of this prototype is to validate the six core screens before durable implementation:

1. Flow Dashboard
2. Work Board
3. Context Cards
4. Handoff Notes
5. Escalation Gate
6. RDE / Evidence Audit

The prototype intentionally uses mock data. It is meant to test information architecture, workflow shape, terminology, and responsibility boundaries before implementing persistent data models, Tauri integration, MCP access, or agent orchestration.

## Open locally

Open `index.html` in a browser.

No build step is required.

## Design stance

- Use **Work Item** as the basic unit, not development Issue.
- Treat AI stop / handoff / escalation as normal workflow, not error.
- Keep Context Card, Handoff Note, Evidence Log, and RDE Audit reachable from work.
- Make it visible that Kazane spans development, sales, customer support, accounting notes, writing, research, meetings, AI Bantou operation, and consultant collaboration.
- Keep MVP implementation narrow while preserving the broader product definition.
