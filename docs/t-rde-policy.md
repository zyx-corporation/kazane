# T-RDE Policy

T-RDE means **Test-based Resonant Deviation Evaluator**.

Kazane uses T-RDE to verify that implementation, documentation, and agent workflows preserve the intended meaning of a work item rather than merely producing something that appears complete.

## Why T-RDE exists

AI-assisted development can move quickly, but speed can hide semantic drift.

Examples of drift:

- implementation convenience becomes product philosophy;
- a prototype decision becomes a permanent architecture;
- a broad claim appears stronger than evidence supports;
- an AI agent completes a task but drops context;
- a UI looks correct but no longer supports the intended workflow;
- a review passes functionality but misses responsibility boundaries.

T-RDE exists to catch these shifts.

## Relationship to tests

TDD and Test First verify behavior.

T-RDE verifies meaning alignment.

Both are required. Passing tests is not enough when a change affects product intent, responsibility boundaries, context models, or public claims.

## T-RDE checklist

For design-impacting changes, record:

1. Preserved elements
2. Transformed elements
3. Supplemented elements
4. Unresolved elements
5. Deviation risks
6. Next update policy

## When T-RDE is required

T-RDE is required for:

- changes to Context Card model;
- changes to Work Item lifecycle;
- changes to Agent Organization model;
- changes to Handoff Note or Evidence Log;
- changes to Escalation Gate;
- changes to RDE/Audit model;
- public README or product positioning changes;
- license or governance changes;
- runtime or UI strategy changes;
- release roadmap changes.

T-RDE is optional but recommended for ordinary documentation and small internal refactors.

## PR format

Pull requests that require T-RDE should include:

```text
## T-RDE

Preserved:
Transformed:
Supplemented:
Unresolved:
Deviation risk:
Next update:
```

## Agent use

AI agents may draft a T-RDE section, but the final T-RDE judgment for major changes must be reviewed by a human maintainer.

## Failure handling

If T-RDE finds material deviation, the PR should not be treated as complete until one of the following happens:

- the implementation is changed;
- the original Context Card is updated with human approval;
- the deviation is explicitly accepted in an ADR;
- the work is split into a smaller issue.
