---
name: weekly-digest
description: Use when the week ends (Sunday night / Monday morning) or the solo founder asks "what happened this week" — rolls up ticket volume, top themes, unresolved high-priority items, churn flags, and shipped features into `digests/{iso-week}.md` so the founder can read support health in 2 minutes.
---

# Weekly Digest

## When to use

- Scheduled: Sunday night or Monday morning (the founder's local time).
- Founder asks: "what happened this week?", "weekly recap?", "support summary?".
- End-of-sprint or end-of-month review where a compact status snapshot is needed.

## Steps

1. Compute the ISO week (e.g. `2026-W16`). Check `digests/{iso-week}.md` — if it exists, read it and offer to regenerate or append.
2. Gather data from multiple sources:
   - **Volume** — count conversations in `../inbox/conversations.json` with `createdAt` in the week. Count resolved vs open. Median time-to-first-response if available.
   - **Top themes** — read `patterns.json`; surface the 3 highest-frequency patterns this week (filter by `firstSeenAt` or by ticket activity).
   - **Unresolved high-priority** — from inbox, any open conversations flagged `priority: high` / `escalated`.
   - **Churn signals** — conversations containing cancellation language, or customers from `../inbox/customers.json` flagged `at-risk`.
   - **Shipped this week** — entries in `shipped-log.json` with `releasedAt` in the week.
   - **Gaps ready to doc** — top 3 from `gaps.json` by occurrence (chain output of `gap-surface` ranking logic).
   - **Known issues** — active entries in `known-issues.json` not yet `resolved`.
3. Run `detect-repeat-question` first if patterns feel stale (>7 days since last run).
4. Write the digest to `digests/{iso-week}.md` using the structure in `data-schema.md`. Keep it scannable: headers, bullet points, numbers over adjectives. Aim for one screen.
5. Include a "What to do next week" section with 2–3 concrete suggestions (e.g. "Write article for gap #1", "Check in with at-risk customer X").
6. Post to chat: "Weekly digest ready → `digests/{iso-week}.md`. Highlights: {volume}, top theme: {theme}, {N} shipped, {M} churn flags."

## Outputs

- Writes `digests/{iso-week}.md` (atomic: write temp then rename)
- Posts a short summary to chat with the top stats
