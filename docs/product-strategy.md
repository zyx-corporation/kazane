# Product Strategy

## Product name

**Kazane / 風音 — Chronicle Work OS**

## Tagline

**仕事の気配を聴き、判断の来歴を綴る。**

## Product definition

Kazane is a Chronicle Work OS for human–AI organizations. It manages workflows that AI agents can execute, assist, research, draft, review, or monitor, while preserving context, evidence, handoff, review, and human responsibility boundaries.

Kazane is also a context-memory substrate for distributed cognition. It does not only reduce human decision load; it preserves meaning, provenance, value continuity, and uncertainty signals that humans and AI agents cannot reliably hold over time without external structure.

## Primary target

Initial practical target:

> Small organizations and responsible operators that have started using AI agents in real work, but are beginning to lose track of context, decisions, handoffs, evidence, and responsibility boundaries.

Initial dogfooding target:

> ZYX internal work, including Kazane development itself, documentation, product strategy, AI番頭 preparation, research, content, operations, and customer-support-like workflows.

Initial technical proof field:

> AI-assisted development workflows using GitHub, local files, CLI, and eventually MCP.

## Core desire addressed

Users do not merely want task management. The deeper desire is:

> We want to delegate work to AI agents without losing meaning, responsibility, provenance, value continuity, uncertainty awareness, and human judgment.

## Product distinction

AI-agent organization answers:

> Who does the work, who reviews it, and who decides?

Kazane adds:

> Why was the decision made, what meaning changed, what value was preserved, what was uncertain, and how can the decision be reinterpreted later?

## Required design additions

Kazane should incorporate the following cognitive-context design additions:

1. **Information Temperature Model**: classify information by update frequency and meaning stability, not only static/dynamic status.
2. **Decision Level Model**: define decision levels through reversibility, privilege/security impact, meaning-change impact, responsibility impact, and uncertainty class.
3. **Executive Layer**: include intermediate agent layers that reduce human decision concentration without replacing human responsibility.
4. **Meta-Executive / RDE Review**: make decision-makers themselves auditable, including lead agents, executive agents, and humans.
5. **Gate Evolution**: allow Escalation Gates to evolve when Unknown Unknowns are detected, through proposal, evidence, human approval, and ADR.
6. **Meaning Trace and Decision Provenance**: record why a decision was made, what alternatives were rejected, what changed from prior context, which values were prioritized, and which Evidence and Context Updates are linked.

## Value line

Kazane creates value when a user can trace a business workflow from:

1. why the work appeared;
2. which context and value principles shaped it;
3. who or which agent handled it;
4. what was done;
5. what was uncertain;
6. what evidence was used;
7. what required human judgment;
8. what decision level and escalation path applied;
9. what changed in the original context;
10. what meaning history should be preserved;
11. what should happen next.

See [cognitive-context-design.md](cognitive-context-design.md) for the cognitive model behind these additions.
