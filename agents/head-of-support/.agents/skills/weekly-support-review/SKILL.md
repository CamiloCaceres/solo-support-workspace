---
name: weekly-support-review
description: Use when the user says "Monday review" / "weekly support readout" / "how was the support week" — aggregates Inbox, Help Center, and Success outputs into a founder-facing review with 3 recommended next moves.
---

# Weekly Support Review

## When to use

- Monday-morning ritual: "give me the weekly support review."
- Ad-hoc: "how was last week?" / "catch me up on support."
- Before a founder check-in / investor update.

## Steps

1. **Read `support-context.md`.** For SLA tiers (to label breach
   counts correctly) and VIP list (to flag VIP activity). If
   missing, run `define-support-context` first.

2. **Read sister-agent outputs.** For the review window (default:
   last 7 days, or ISO-week the founder names):
   - `../inbox/outputs.json` — recent activity entries.
   - `../inbox/conversations.json` — summary counts (total,
     open, resolved).
   - `../inbox/followups.json` — open promises, overdue flagged.
   - `../inbox/bug-candidates.json`, `../inbox/churn-flags.json`
     — signals.
   - `../help-center/outputs.json` — articles, digests, gaps,
     shipped broadcasts in the window.
   - `../help-center/requests.json` — new feature requests this
     week, top-requested.
   - `../help-center/known-issues.json` — new known issues,
     status changes.
   - `../success/outputs.json` — accounts scored, renewals
     drafted, saves drafted.
   - `../success/health-scores.json` — count at GREEN / YELLOW /
     RED, changes.

   Degrade gracefully — if an agent isn't installed or has no data,
   mark that section "no activity" and continue.

3. **Read `support-context.md`** for voice — the review should
   sound like the founder, not a generic report.

4. **Draft the review.** Markdown, ~400–600 words. Structure:

   ```markdown
   # Weekly Support Review — {YYYY-MM-DD}

   **Window:** {start} → {end}
   **Volume:** {N} conversations, {N} resolved, {N} open
   **SLA:** {N} breaches ({P1-count} P1, {P2-count} P2, …)

   ## Inbox

   - {one line per notable thread or cluster}
   - **VIP activity:** {named VIPs touched this week, status}
   - **Open promises past due:** {count + top 3 names}
   - **Churn signals:** {count at RED, named accounts}

   ## Help Center

   - **Shipped articles:** {N} — {list}
   - **New feature requests:** {N} — top 3 by request count
   - **Known issues:** {N} active — status changes since last week
   - **Broadcasts sent:** {N} — "you asked, we shipped" notes

   ## Success

   - **Health-score movement:** {GREEN N, YELLOW N, RED N} ({delta
     from last week})
   - **Renewals in flight:** {list of accounts with renewal
     drafts in draft/ready}
   - **Saves active:** {count}
   - **QBRs prepped:** {list}

   ## Cross-cutting themes

   {2–4 sentences synthesizing what showed up across agents —
   e.g. "3 of this week's P1s and 2 of the new feature requests
   all point at the billing-export flow."}

   ## Next moves for this week

   1. **{Agent name}:** {one-line handoff prompt the founder can
      paste}
   2. **{Agent name}:** {one-line handoff prompt}
   3. **{Agent name}:** {one-line handoff prompt}
   ```

5. **Write to `reviews/{YYYY-MM-DD}.md`** atomically.

6. **Append to `outputs.json`** with `type: "review"`, title
   "Weekly support review — {week-of}", summary = 2–3 sentences
   with the headline numbers + top theme, path, status `ready`
   (reviews don't need approval — they're a readout, not a draft).

7. **Summarize to user.** One short paragraph with the 3 headline
   numbers (volume, SLA breaches, RED accounts) and the 3 next
   moves copy-pasteable.

## Outputs

- `reviews/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "review"`.
