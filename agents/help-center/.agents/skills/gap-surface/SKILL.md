---
name: gap-surface
description: Use when the solo founder asks "what should I write docs for?" or on a weekly cadence — ranks open gaps by impact, presents the top 3 with source tickets, and offers to chain into `draft-article-from-ticket` for any the founder picks.
---

# Gap Surface

## When to use

- Founder asks: "what should I write docs for?", "what gaps do we have?", "what's missing from the help center?".
- Weekly cadence — usually paired with or before `weekly-digest`.
- After `detect-repeat-question` finds new clusters worth reviewing.

## Steps

1. Read `gaps.json`. Filter to `status: "open"`.
2. If the list is empty, run `detect-repeat-question` first (or tell the founder it just ran and there's nothing yet).
3. Rank each open gap by an impact score:
   - `occurrenceCount` — primary signal (how often it's asked)
   - **Customer value** — for each `sourceTicketId`, look up the customer in `../inbox/customers.json` and weight by plan tier / MRR if present (fallback: equal weight)
   - **Freshness** — recent occurrences beat stale ones; heavily penalize gaps with no hits in last 14 days
4. Present the top 3 gaps to the founder in chat:
   ```
   1. "How do I reset my API key?" — 7 occurrences, 3 paying customers, latest 2 days ago
      Source tickets: t_abc, t_def, t_ghi
   2. ...
   3. ...
   ```
5. Ask: "Want me to draft articles for any of these? Reply with the numbers (e.g. '1 and 3')."
6. For each number the founder picks, pick a representative source ticket (most recent, or the one with the clearest resolution) and chain to `draft-article-from-ticket`.
7. When a gap is promoted to an article, update its status in `gaps.json` to `drafting`, and set `relatedArticleSlug` when the draft lands.

## Outputs

- Updates `gaps.json` (status transitions)
- May chain to `draft-article-from-ticket` (one call per accepted gap)
- Posts a ranked list and recommendations to chat
