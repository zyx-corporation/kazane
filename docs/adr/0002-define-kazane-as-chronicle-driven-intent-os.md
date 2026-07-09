# ADR 0002: Define Kazane as Chronicle-driven Intent OS

- Status: Accepted
- Date: 2026-07-09

## Context

Kazane has been discussed as a system for intent organization, decision support, workflow generation, and AI-agent coordination. It has strong business use cases, but it is not limited to enterprise or back-office automation.

Recent AI-native tools such as MulmoClaude show an important shift: individuals can use natural language to generate applications, databases, user interfaces, and working environments on demand. This is an important signal for Kazane, because it confirms that the future interface is not only conversational, but also generative and adaptive.

However, defining Kazane merely as an AI agent, a business automation tool, a second brain, or an on-demand software generator would narrow its design intent.

Kazane is also intended for personal use. It should support a person's thinking, notes, reading, software development, family matters, finances, health, travel, research, writing, GitHub work, and daily decisions as a connected chronicle rather than as isolated tasks or records.

Therefore, Kazane needs a durable architectural definition that covers personal, household, small-business, and organizational use without losing its core focus on intent, context, decision provenance, and meaning change.

## Decision

Define Kazane as a **Chronicle-driven Intent OS** that spans personal and organizational use.

Kazane is not primarily a task manager, note-taking system, chatbot, second brain, or on-demand application generator. Kazane's primary responsibility is to preserve and operationalize intent, decisions, context, provenance, and meaning change.

Kazane may generate applications, user interfaces, workflows, documents, notifications, and AI-agent actions, but those generated artifacts must be grounded in the user's or organization's Chronicle.

The core responsibilities of Kazane are:

1. Record intent: preserve what the person or organization wants, avoids, values, and prioritizes.
2. Manage decision provenance: keep track of the context, assumptions, constraints, evidence, and value judgments behind decisions.
3. Track meaning change: observe how tasks, documents, designs, policies, relationships, and projects change meaning over time.
4. Generate from context: produce applications, views, workflows, documents, and agent actions based on accumulated Chronicle rather than only on one-shot prompts.
5. Support RDE review: make it possible to inspect how generated artifacts preserve, transform, supplement, or deviate from the original intent.
6. Bridge personal and organizational use: support individuals, households, small businesses, and organizations on a common Chronicle model while separating permissions, visibility, and responsibility.

This distinguishes Kazane from on-demand software systems:

- MulmoClaude: an environment where individuals can generate applications, databases, and user interfaces through natural language.
- Kazane: an environment where individuals and organizations preserve intent and decision provenance, then generate applications, user interfaces, workflows, documents, and AI behavior from that Chronicle.

In short: if MulmoClaude is an On-demand Software OS, Kazane is a Chronicle-driven Intent OS.

## Consequences

### Function generation is secondary to provenance

Kazane should not optimize only for generating useful functions quickly. It must also preserve why a function was needed, which decision it supports, and which Chronicle it belongs to.

### UI is a Chronicle expression layer

Kazane UI is not only an operation surface. It is a way to view, edit, compare, and audit Chronicle. The same underlying data may require different views for personal planning, family use, business operations, research, software development, and customer work.

### The data model should be intent-centered

Tasks, notes, documents, calendar events, emails, issues, pull requests, meeting records, and generated artifacts should be connected to intent and decision flow rather than treated only as independent records.

### Personal use is a first-class use case

Kazane must support personal thinking, daily work, research, writing, development, household matters, and life management. It is not only a business operating system.

However, Kazane should not become only a second brain. Its focus is not memory assistance alone, but decision assistance, intent assistance, and provenance assistance.

### Organizational use requires explicit boundaries

Personal Chronicle must not be naively expanded into organizational Chronicle. Organizational use requires explicit handling of roles, departments, customers, contracts, confidential information, audit trails, approval authority, visibility, and responsibility boundaries.

### Kotone is an embodied interface to Kazane

Kazane keeps intent and Chronicle. Kotone can be understood as one embodied interface where Kazane appears in household, voice, IoT, edge-device, and everyday environments.

### Koguchi Service is a semantic processing layer

Koguchi Service should be positioned as an independent service that connects Intent Graph, Chronicle, RDE review, workflow generation, and external service integration. It is not only a tool execution layer.

## Design principles

### Intent before task

A task is a derivative of intent. Kazane should generate tasks, documents, workflows, and actions from intent, not reduce intent to task lists.

### Chronicle before history

History is a sequence of events. Chronicle includes events, decisions, meaning change, relationships, unresolved issues, and reviewability.

### Reviewable generation

AI-generated applications, interfaces, documents, workflows, and decision-support outputs must be produced in units that humans can inspect, revise, withdraw, and audit.

### Reversible meaning change

Meaning changes should remain traceable. Designs that make meaning drift invisible should be avoided.

### Personal-first, organization-ready

Personal use is a first-class entry point. At the same time, the design must remain extensible to organizational use through permissions, responsibility boundaries, audit trails, and visibility controls.

### Local context sovereignty

Users and organizations should retain sovereignty over their Chronicle. Even when external LLMs, SaaS tools, or cloud services are used, ownership, storage, auditability, and portability of Chronicle must be preserved.

## Alternatives considered

### Alternative 1: Kazane as Business Intent OS

This framing fits enterprise adoption and AI-banto use cases, but it narrows personal, household, research, writing, and development use cases.

Rejected.

### Alternative 2: Kazane as Second Brain

This framing fits personal knowledge management, but it does not fully capture intent, decision provenance, meaning change, RDE review, and organizational expansion.

Rejected.

### Alternative 3: Kazane as On-demand Software OS

This framing connects well with emerging tools such as MulmoClaude, but it places too much emphasis on function generation and risks making Chronicle and meaning review secondary.

Rejected.

### Alternative 4: Kazane as Chronicle-driven Intent OS

This framing supports personal use, household use, small-business use, organizational use, AI-banto, Kotone, Koguchi Service, and RDE review under one conceptual model.

Accepted.

## RDE check

- Preserved: Kazane's existing direction as an intent-oriented AI system and business support foundation.
- Preserved: Kazane's personal-use orientation.
- Preserved: the relationship between Chronicle, Intent, RDE, Koguchi, and Kotone.
- Transformed: Kazane is reframed from business-oriented intent support to a personal-to-organizational Chronicle-driven system.
- Transformed: generated software becomes an expression of Chronicle rather than the core goal.
- Supplemented: a comparison with MulmoClaude-style on-demand software generation.
- Supplemented: design implications for UI, data model, permissions, Kotone, and Koguchi Service.
- Unresolved: concrete Chronicle schema, Intent Graph schema, RDE log format, personal/organizational boundary model, provider abstraction, and local/cloud/edge responsibility split.
- Deviation risk: the phrase "Chronicle-driven Intent OS" may be too abstract for MVP planning.
- Deviation risk: aiming at personal and organizational use simultaneously may blur the initial product focus.
- Deviation risk: excessive RDE overhead may harm usability.
- Next update: define MVP scenarios, minimal Chronicle/Intent/Decision objects, lightweight RDE log format, and UX-level differences from on-demand UI generation systems.
