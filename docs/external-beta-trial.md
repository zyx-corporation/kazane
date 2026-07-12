# v0.8 External Beta Trial

This protocol validates the remaining v0.8 exit criterion with one actual partner
or trial user. It is an observation exercise, not a product demo whose outcome is
assumed in advance.

## Before the session

- Use a dedicated local Kazane database or make a timestamped database backup.
- Use a fictional or sanitized small-business scenario. Do not enter customer
  secrets, credentials, health, legal, financial, or other sensitive records.
- Explain that data remains in local SQLite, AI does not assume responsibility,
  and a Gate stop is normal. Show **Trust & Privacy** before delegation.
- Obtain consent before recording participant feedback in Kazane.
- Assign one observer. The observer may answer environment questions but should
  not tell the participant which product control to select.

## Thirty-minute scenario

1. Open **Start Guide** and ask the participant to create one Context Card and
   linked Work Item for a sanitized business problem.
2. Ask the participant to explain, in their own words, what the Context represents
   and where AI must stop.
3. Move or process the Work Item once and leave a written Handoff. A simulated
   agent result is acceptable; an unexplained direct database edit is not.
4. Ask the participant to open **Replay** and identify the work's origin, current
   state, one recorded change, and the next responsible actor.
5. Open **Context Cards**, select **Feedbackを記録 / Capture Feedback**, obtain
   consent, and record the participant's background plus one observation.
6. If the observation implies work, ask the participant to turn the unresolved
   point into a linked Work Item.

## Pass criteria

Record a pass only when all of the following are directly observed:

- the participant creates or recognizes the linked Context and Work Item;
- the participant describes at least one AI stop condition without being prompted
  with the answer;
- the participant uses Replay to identify origin, current state, and next actor;
- feedback is stored as a consent-aware Feedback Context rather than only as an
  unlinked feature request;
- the participant can say what remains a human decision.

Record a fail or partial result when any criterion is not observed. Confusion is
valid product evidence and must not be reinterpreted as success.

## Records to retain

- the generated Context Card and Work Item IDs;
- one Handoff Note for the processed Work Item;
- a high-trust Evidence entry containing the session date, sanitized scenario,
  observer, observed criteria, and result (`pass`, `partial`, or `fail`);
- the Feedback Context ID and any promoted improvement Work Item;
- an escalation note if privacy, consent, responsibility, or external sharing was
  unclear.

Do not store audio, video, identifying details, or private model reasoning unless a
separate reviewed consent and retention policy explicitly permits it.

## Completion rule

The v0.8 exit criterion can be marked complete only after a real session produces
the records above and the observed result is `pass`. A local developer walkthrough,
automated browser test, or agent self-report is useful Evidence but cannot replace
this human validation.
