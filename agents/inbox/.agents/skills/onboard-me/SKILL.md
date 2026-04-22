---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (inbox, escalation contacts, signature) AND the best way to share each, then run a 3-question interview and write to `config/`.
---

# Onboard Me

## When to use

- "onboard me" / "set me up" / "let's get started."
- The user opens the pre-seeded "Onboard me" activity card and
  sends any short message.
- About-to-do-real-work and `config/profile.json` is missing.

Only run ONCE unless re-invoked.

## Principles

- Scope + modality preamble before the first question.
- 3 questions max.
- Rank modalities: connected inbox via Composio > paste > file.

## Steps

0. **Preamble (FIRST message):**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   >
   > 1. **Your inbox** — which tool do you use for support? *Best:
   >    link it via Composio in the Integrations tab. Supports
   >    Gmail, Front, Intercom, Help Scout, Zendesk — or whatever's
   >    connected.*
   > 2. **Escalation contacts** — who do I Slack/DM when a P1 or
   >    outage hits? *Paste 1–2 names.*
   > 3. **Your signature** — the last 1–3 lines you put at the
   >    bottom of support replies. *Paste it.*
   >
   > One heads-up: I share a **support context doc** with Head of
   > Customer Support (voice, SLAs, VIPs, routing, gotchas). If you
   > haven't run Head of Customer Support's `define-support-context`
   > yet, do that right after me — every drafting skill I run
   > depends on it.
   >
   > Let's start with #1 — which inbox are you on?"

1. **Capture topic 1 (inbox).** If connected-Composio route:
   confirm the connection exists with `composio search inbox`,
   note the slug for later skills. If paste: note the provider
   name. Write `config/inbox.json` with
   `{ provider, connected: boolean, source, capturedAt }`.

2. **Capture topic 2 (escalation contacts).** Parse names. Write
   `config/escalation.json` with
   `{ contacts: [{name, role?, handle?}], source, capturedAt }`.

3. **Capture topic 3 (signature).** Parse the lines verbatim.
   Write `config/signature.md` with the raw signature plus any
   tone notes inferable from it.

4. **Write `config/profile.json`** with
   `{ userName, onboardedAt, status: "onboarded" | "partial" }`.

5. **Atomic writes.**

6. **Hand off:**
   > "Ready. If you haven't already, run
   > `define-support-context` with Head of Customer Support — I
   > can't draft in your voice without it. Otherwise, try: `Pull
   > unread from my inbox and triage`."

## Outputs

- `config/profile.json`
- `config/inbox.json`
- `config/escalation.json`
- `config/signature.md`
