# ADR 0009: Branch management

- Status: Accepted
- Date: 2026-06-26

## Context

The repository is public. The default branch is the stable integration branch for reviewed work.

## Decision

Prepare changes on topic branches and integrate them by pull request. Do not treat the default branch as a working branch.

## Consequences

This keeps public history reviewable and matches Kazane principles: written handoff, evidence, review, and responsibility boundaries.

## RDE check

- Preserved: reviewable development process.
- Transformed: default branch becomes an integration boundary.
- Supplemented: pull-request workflow for AI-assisted changes.
- Unresolved: required checks once code exists.
- Deviation risk: process overhead during early prototyping.
- Next update: define branch rules after v0.1 implementation begins.
