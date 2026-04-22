---
name: synthesize-voice-of-customer
description: Use when the user says "mine the tickets" / "what are customers saying" / "pull VoC from the last month" — clusters Inbox + Help Center traffic into verbatim pains, asks, friction quotes, and positioning wedges; outputs a strategic report.
---

# Synthesize Voice of Customer

Different from `help-center/detect-repeat-question`. HC outputs KB-gap
candidates (the operational view). HoS outputs a strategic VoC
report (the product/positioning view). Same source data, different
consumer.

## When to use

- "mine the last {N} tickets for themes."
- "what are customers asking for?"
- Before a founder writes a roadmap, landing-page update, or
  investor update.
- Ad hoc strategic-research requests.

## Steps

1. **Read `support-context.md`.** For the current positioning + VIP
   list. If missing, run `define-support-context` first.

2. **Set the window.** Default: last 30 days. Ask the founder if
   they want a different window.

3. **Read Inbox data.**
   - `../inbox/conversations.json` — filter to window.
   - For each conversation, read `../inbox/conversations/{id}/thread.json`
     for the actual message content. Prefer the customer's own
     messages, not the founder's replies.
   - Skip bot-looking or obviously-not-signal messages.

4. **Read Help Center data.**
   - `../help-center/requests.json` — feature requests in window,
     with attribution.
   - `../help-center/patterns.json` — already-detected themes.
   - Use these to sanity-check clusters you find and to attribute
     requests.

5. **Extract signal.**
   - **Pains (top 5):** cluster verbatim complaint phrases. Rank
     by frequency. For each, keep 2–3 verbatim quotes (redacted
     identifiers).
   - **Feature asks (top 5):** cluster requests. Rank by count of
     distinct customers asking (not total mention count). Note
     which VIPs are in each cluster.
   - **Friction phrases:** sentences that contradict current
     positioning (e.g. positioning claims "easy to set up" but 5
     customers described setup as "confusing" — flag it).
   - **Positioning-worthy quotes:** 2–3 verbatim lines that would
     make good landing-page copy, with customer-type attribution.
   - **Emerging shapes:** things the founder may not have noticed
     — e.g. "3 different SMB customers asked about the API this
     week."

6. **Draft the report.** Markdown, ~500–700 words. Structure:

   ```markdown
   # Voice of Customer — {window}

   **Window:** {start} → {end}
   **Source:** {N} conversations, {N} feature requests
   **Context doc version:** based on `support-context.md` as of {date}

   ## Top 5 pains (ranked by frequency)

   1. **{Pain name}** — {count} instances
      > "{verbatim quote 1}"
      > "{verbatim quote 2}"
      *Affects: {segments or VIPs}*

   2. … (repeat)

   ## Top 5 feature asks (ranked by distinct requesters)

   1. **{Feature}** — {N} distinct customers including {VIP-if-any}
      *Linked requests:* {paths into help-center/requests}
   2. …

   ## Friction with current positioning

   {2–4 items where language in tickets contradicts the
   positioning in support-context.md. Each item: the claim, the
   contradicting quotes, a specific edit we could make.}

   ## Positioning-worthy quotes

   - "{quote}" — {customer type}
   - "{quote}" — {customer type}
   - "{quote}" — {customer type}

   ## Emerging shapes

   {2–4 bullets on patterns the founder might not have noticed.}

   ## Recommended next moves

   1. **Send to marketing/product:** {specific quote or pain}
   2. **Update positioning:** {one friction point worth fixing}
   3. **Build/prioritize:** {one feature cluster}
   ```

7. **Write to `voc-reports/{YYYY-MM-DD}.md`** atomically.

8. **Append to `outputs.json`** with `type: "voc-report"`, title =
   "VoC — {window}", summary = top pain + top ask, path, status
   `ready`.

9. **Summarize to user.** Headline: the single biggest pain + the
   single biggest ask + the 3 positioning-worthy quotes copy-pasted
   inline. Offer to forward the full report to any other agent via
   a handoff prompt.

## Outputs

- `voc-reports/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "voc-report"`.
