# Chronicle Replay

Chronicle Replay reconstructs the recorded provenance of one Work Item. Open a
Work Item drawer and select **Replay**.

The prototype presents, in order:

1. the originating Context and purpose;
2. the current workflow state and next action;
3. recorded state-change Events;
4. linked Evidence entries;
5. the latest written Handoff.

Replay is evidence-oriented, not a reconstruction of hidden reasoning. Missing
records remain visibly missing, and no inference is generated to fill those gaps.
The v0.8 prototype establishes this boundary; filtering and long-history summaries
remain candidates for later hardening.
