---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (docs location, tracker, weekly-digest delivery) AND the best way to share each, then run a 3-question interview and write to `config/`.
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
- Rank modalities: connected app via Composio > URL > paste.

## Steps

0. **Preamble (FIRST message):**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   >
   > 1. **Where your docs live** — Notion / Intercom Help / Webflow
   >    / plain markdown? *Best: point me at the base URL. Or link
   >    the tool via Composio. If you don't have a docs site yet,
   >    that's fine — I'll draft to markdown at my root and you can
   >    publish later.*
   > 2. **Your tracker** — Linear / GitHub / internal? Where do
   >    feature requests and known issues land? *Best: link it via
   >    Composio. Or paste the tool name.*
   > 3. **Weekly digest delivery** — how do you want it delivered?
   >    *Best: tell me the Slack channel (I'll use Composio). Or
   >    'just save to disk and I'll read it' — fine by me.*
   >
   > One heads-up: I share a **support context doc** with Head of
   > Customer Support. Articles and broadcasts match the voice in
   > that doc — if you haven't run
   > `define-support-context` yet, do that right after me.
   >
   > Let's start with #1 — where do your docs live?"

1. **Capture topic 1 (docs).** Parse paste or connect via
   Composio. Write `config/docs-site.json` with
   `{ provider, url?, connected: boolean, source, capturedAt }`.
   If no docs site yet, mark `"provider": "markdown-only"`.

2. **Capture topic 2 (tracker).** Parse/connect. Write
   `config/tracker.json` with
   `{ provider, featureRequestTarget, knownIssueTarget, connected:
   boolean, source, capturedAt }`. If both types go to the same
   place, same slug twice.

3. **Capture topic 3 (digest delivery).** Parse. Write
   `config/digest-delivery.json` with
   `{ channel: "slack" | "email" | "disk-only", target?, source,
   capturedAt }`.

4. **Write `config/profile.json`** with
   `{ userName, onboardedAt, status: "onboarded" | "partial" }`.

5. **Atomic writes.**

6. **Hand off:**
   > "Ready. Try: `What should I write docs for?` — I'll read
   > patterns across the Inbox and rank gap candidates for you."

## Outputs

- `config/profile.json`
- `config/docs-site.json`
- `config/tracker.json`
- `config/digest-delivery.json`
