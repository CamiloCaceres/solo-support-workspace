---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (tracked accounts, renewal cadence, healthy-vs-at-risk definitions) AND the best way to share each, then run a 3-question interview and write to `config/`.
---

# Onboard Me

## When to use

- "onboard me" / "set me up" / "let's get started."
- The user opens the pre-seeded "Onboard me" activity card and
  sends any short message.
- About-to-do-real-work and `config/profile.json` is missing.

## Principles

- Scope + modality preamble before the first question.
- 3 questions max.
- Rank modalities: connected CRM/billing via Composio > file > paste.

## Steps

0. **Preamble (FIRST message):**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   >
   > 1. **Which accounts do you want me tracking?** *Best: point me
   >    at a connected CRM or Stripe via Composio and I'll pull your
   >    paying accounts. Or drop a list / file. Or tell me "just the
   >    top 10" and we'll infer from Inbox.*
   > 2. **Your renewal cadence** — annual / monthly / mixed? When
   >    during the cycle do you want me drafting touches (e.g.
   >    Day-90 / Day-60 / Day-30)? *Paste one line.*
   > 3. **Healthy vs at-risk** — in your words, what does a GREEN
   >    account look like? YELLOW? RED? *Paste a few bullets or
   >    tell me "use your judgment from ticket volume + churn
   >    flags" and I'll set sensible defaults.*
   >
   > Let's start with #1 — which accounts am I tracking?"

1. **Capture topic 1 (accounts).** If connected-CRM route: run
   `composio search crm` (and `composio search billing` for
   Stripe), discover slugs, pull paying accounts with name / plan /
   MRR / renewal date / primary contact. If paste/file: parse. Seed
   `config/accounts-seed.json` and also write `accounts.json` at
   agent root with one entry per account (index the seed).

2. **Capture topic 2 (renewal cadence).** Parse the founder's
   line. Write `config/renewal-cadence.json` with
   `{ defaultCycleDays, touchSchedule, source, capturedAt }`. Defaults:
   365 days, schedule [{90,"ROI"},{60,"friction"},{30,"ask"}].

3. **Capture topic 3 (health definitions).** If founder says "use
   your judgment," apply defaults: GREEN = low support volume + no
   active churn flags; YELLOW = elevated volume OR one open bug
   affecting them OR one unmet VIP ask; RED = active churn flag OR
   multiple open P1/P2 bugs OR silence > 60 days after a complaint.
   Write `config/health-definitions.json`.

4. **Write `config/profile.json`** with
   `{ userName, onboardedAt, status: "onboarded" | "partial" }`.

5. **Atomic writes.**

6. **Hand off:**
   > "Ready. Try: `Show me the full timeline for {one of your top
   > accounts}` — that's the skill everything else builds on."

## Outputs

- `config/profile.json`
- `config/accounts-seed.json`
- `config/renewal-cadence.json`
- `config/health-definitions.json`
- `accounts.json` (seeded index)
