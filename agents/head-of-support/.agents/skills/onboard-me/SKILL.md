---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (product, segments + VIPs, support stance) AND the best way to share each, then run a tight 90-second 3-question interview and write results to `config/`.
---

# Onboard Me

## When to use

First-run setup. Triggered by:

- "onboard me" / "set me up" / "let's get started".
- The user opens the pre-seeded "Onboard me" activity card and sends
  any short message ("go", "ok", "start", "yes").
- About-to-do-real-work and `config/profile.json` is missing.

Only run ONCE unless the user explicitly re-invokes.

## Principles

- **Lead with a scope + modality preamble.** Name the three topics
  AND the easiest way to share each BEFORE the first question.
- **3 questions is the ceiling.** If you can do 2, do 2.
- **One question at a time after the preamble.**
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note `TBD`, ask again just-in-time later.

## Steps

0. **Scope + modality preamble (FIRST message, then roll into Q1):**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your product** — name + a 1-line pitch + main surface
   >    areas. *Best: drop a one-pager or point me at your
   >    docs/help-center URL. Or paste 1–2 lines.*
   > 2. **Your customer segments + VIP list** — who you support,
   >    which accounts get white-glove. *Best: paste a few account
   >    names, or point me at a connected CRM via Composio and I'll
   >    infer from paying accounts.*
   > 3. **Your support stance** — rough SLA tiers (P1/P2/P3/P4
   >    response times) + how you like to sound. *Best: tell me one
   >    line ("within 1 hour for P1, same-day for P2, 48h for P3")
   >    and I'll draft the rest. If you've connected an inbox, just
   >    say so — I'll pull recent replies for voice calibration.*
   >
   > For any of these you can drop files or paste URLs. Let's start
   > with #1 — what's your product + 1-line pitch?"

1. **Capture topic 1 (product).** Based on modality chosen: parse
   paste, fetch URL via `composio search web-scrape` (execute by
   slug), or read file. Extract name, one-line pitch, surface areas
   (feature groups), pricing model, self-serve or gated. Write
   `config/product.json` with
   `{ name, oneLine, url?, surface, pricing?, selfServe?, source,
   capturedAt }`. Acknowledge and roll into Q2.

2. **Capture topic 2 (segments + VIPs).** If the user picks the
   connected-CRM route, run `composio search crm` to discover the
   connected tool slug, pull paying accounts grouped by plan/MRR,
   surface top N by revenue as VIP candidates. If paste, parse the
   lines. Write `config/segments.json` with
   `{ segments: [{ name, size?, plan? }], vips?, source,
   capturedAt }`. Roll into Q3.

3. **Capture topic 3 (support stance).** Capture SLA tiers and tone
   into `config/support-stance.json`. If the user mentions a
   connected inbox, flag that `voice-calibration` is the next
   logical run but do NOT run it inside onboarding — keep it to 3
   questions.

4. **Write `config/profile.json`** with
   `{ userName, company, role?, onboardedAt, status: "onboarded" |
   "partial" }`. Use `"partial"` if any topic was skipped.

5. **Atomic writes.** Every file written as `{path}.tmp` then
   renamed.

6. **Hand off:** "Ready. Try: `Set up our support context` — I'll
   draft `support-context.md` from what you just told me, and you
   can polish from there."

## Outputs

- `config/profile.json`
- `config/product.json`
- `config/segments.json`
- `config/support-stance.json`

(No entry appended to `outputs.json` — onboarding is setup, not a
deliverable.)
