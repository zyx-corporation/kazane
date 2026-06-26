# Testing Strategy

Kazane follows TDD and Test First where durable implementation begins.

Prototype First may precede tests for exploratory UI and workflow discovery, but implementation hardening should define tests before behavior is considered complete.

## Testing goals

Tests should verify:

- behavior;
- schema validity;
- state transitions;
- data integrity;
- permission boundaries;
- handoff requirements;
- evidence linkage;
- import/export compatibility;
- agent runtime contracts.

## Test First scope

Test First is expected for:

- Work Item state machine;
- Context Card schema;
- Work Item to Context linkage;
- Agent Profile schema;
- Handoff Note schema;
- Evidence Log schema;
- Escalation Gate rules;
- RDE/T-RDE record format;
- CLI command contracts;
- API contracts;
- local persistence.

## Prototype exception

For early prototypes, such as static HTML or fake-data clickable screens, the first deliverable may be learning rather than tests.

Before prototype code becomes product code, it must either be:

- discarded;
- rewritten with tests;
- isolated as a throwaway artifact;
- documented as prototype-only.

## Suggested test layers

### Unit tests

For schemas, validation, permission checks, and state transitions.

### Integration tests

For persistence, import/export, CLI workflows, issue linkage, and agent handoff flow.

### Contract tests

For CLI/API/MCP boundaries used by AI agents.

### UI tests

For critical flows in the web UI, especially state transitions and review gates.

### T-RDE checks

For meaning alignment on design-impacting changes.

## Definition of tested

A change is tested when:

- expected behavior is covered;
- failure behavior is covered where relevant;
- tests can be run locally on macOS and Linux;
- validation steps are recorded in the PR;
- T-RDE is included when the change affects design meaning.

## Non-goals at early stage

Early Kazane does not require exhaustive enterprise-scale tests, performance benchmarks, or platform matrix coverage beyond macOS/Linux assumptions.

Those may be added after v0.3 when the core data model stabilizes.
