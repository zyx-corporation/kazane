# Claude Design Wireframe Prompt

Use this prompt with Claude Design / Claude Artifacts to generate a clickable low-to-mid fidelity prototype for **Kazane / 風音 — Chronicle Work OS**.

```text
You are a SaaS UI/UX designer and frontend prototyper.

Create a clickable low-to-mid fidelity prototype for Kazane / 風音 — Chronicle Work OS.

Use React + Tailwind CSS, or a single HTML/CSS/JavaScript artifact. The prototype should be visible and navigable inside Claude Artifacts. Do not connect to a real database or API. Use mock data.

Important product definition:

Kazane is not a development-team-only tool. Development is the first dogfooding field, but Kazane is a broader intelligent collaboration OS for business workflows.

Kazane manages every workflow where AI agents can execute, assist, research, draft, review, or monitor work, together with human judgment, context, evidence, handoff, and responsibility boundaries.

Tagline:

仕事の気配を聴き、判断の来歴を綴る。

Short description:

人とAIの業務フローを、文脈と来歴でつなぐOS。

Core objects:

1. Work Item
   The unit of work handled by humans or AI agents. It may be a development issue, email reply, customer inquiry, sales proposal, research task, meeting preparation, accounting note, legal pre-check, article draft, AI Bantou handoff, or consultant collaboration task.

2. Context Card
   Preserves why the work exists: question, purpose, customer or internal context, constraints, prior decisions, unresolved points, and update policy.

3. Handoff Note
   Records what a human or AI did, what was decided, what remains uncertain, why the work was escalated, and what should happen next.

4. Escalation Gate
   Defines where AI must stop and return the decision to humans or experts. Stopping is a normal workflow state, not an error.

5. Evidence Log
   Connects outputs to sources: emails, meeting notes, documents, GitHub issues, files, customer notes, prior decisions, conversation logs, and web references.

6. RDE Audit
   Inspects meaning change from the original context. Show preserved elements, transformed elements, supplemented elements, unresolved elements, deviation risk, and next update policy.

Create these six screens:

1. Flow Dashboard
   Show the whole ZYX internal business flow: active Work Items, Needs Human, RDE required, Expert Gate items, AI morning summary, domain queues.

2. Work Board
   Kanban board with columns: Inbox, AI Working, Needs Human, Expert / Gate, Done / Logged. Work Items must span development, sales, customer support, accounting, writing, research, meetings, AI Bantou, and consultant collaboration.

3. Context Cards
   Show the context behind Work Items. Include a card for Kazane Core Definition and a card for AI Bantou consultant demo.

4. Handoff Notes
   Show structured handoff from AI to humans and humans to AI. Include fields for work domain, actor, action taken, uncertainty, escalation reason, next action, Context update, Evidence references.

5. Escalation Gate
   Show domain-specific AI permission and stop rules. Include customer support, sales, accounting, writing/public relations, development, and AI Bantou.

6. RDE / Evidence Audit
   Show RDE result and Evidence Log. Treat RDE as meaning-change audit, not quality scoring.

UX requirements:

- Use a left sidebar to switch between the six screens.
- Make it clear that Kazane is not limited to development.
- Show AI stop / Needs Human / Expert Gate as normal flow, not error.
- Every Work Item should appear connected to Context, Handoff, Evidence, and RDE.
- Show AI responsibility boundaries clearly.
- Use a calm SaaS management interface style.
- Prefer information architecture over visual decoration.
- Mock data is enough.
- First output the complete artifact code, then briefly explain the design.
```
