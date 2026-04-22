---
name: customer-timeline
description: Use when the user says "show me the full timeline for {account}" / "history on {customer}" / "what's the story with {account}", or implicitly as a dependency before score-account-health / draft-renewal-outreach / draft-churn-save / prep-qbr / nudge-expansion for that account.
---

# Customer Timeline

## When to use

- Explicit: "full timeline for {account}" / "history on {customer}"
  / "everything we know about {account}."
- Implicit: called as a dependency by `score-account-health`,
  `draft-renewal-outreach`, `draft-churn-save`, `prep-qbr`,
  `nudge-expansion` when the timeline doesn't exist or is stale
  (>14 days old).

## Steps

1. **Read `../head-of-support/support-context.md`.** If missing,
   stop and tell the founder to run Head of Customer Support's
   `define-support-context` first.

2. **Resolve the account.** Look up `accounts.json` by slug or name
   (fuzzy match if close). If the account isn't indexed yet,
   create the entry from what the founder tells you (name + slug).

3. **Pull Inbox data** (degrade gracefully if not installed):
   - `../inbox/customers.json` — customer record (email, plan,
     metadata).
   - `../inbox/conversations.json` — filter to this customer.
   - For each conversation: `../inbox/conversations/{id}/thread.json`
     (message content), `.../notes.md` (internal commitments),
     resolution status.
   - `../inbox/bug-candidates.json` — bugs this customer reported.
   - `../inbox/churn-flags.json` — any flag history for this
     customer.
   - `../inbox/followups.json` — any open promises to them.

4. **Pull Help Center data** (degrade gracefully):
   - `../help-center/requests.json` — feature requests attributed
     to this customer, with ship status cross-referenced against
     `../help-center/shipped-log.json`.

5. **Pull billing state** via Composio (optional but recommended):
   - `composio search billing` or `composio search stripe`.
   - Fetch plan, MRR, renewal date, payment status, any recent
     downgrade/upgrade events.
   - If billing isn't connected, note the gap.

6. **Build the timeline.** Markdown. Chronological, tagged bullets:
   - `[sign-up]` — date, plan, source if known.
   - `[ticket]` — date, topic, resolution.
   - `[bug]` — date, severity, current status.
   - `[ask]` — date, feature, ship status.
   - `[ship]` — date, feature they asked for that shipped.
   - `[churn-flag]` — date, signal, current state.
   - `[health]` — date, score, 3-signal one-liner (from
     `health-history.json` if it exists).
   - `[billing]` — plan changes, renewal dates.

7. **End with "What the account looks like today"** — 3 sentences.
   One on the relationship (happy? friction? silent?), one on
   value (what they're getting, what they're asking for), one on
   risk (what we should watch).

8. **Write** to `accounts/{slug}/timeline.md` (atomic). Update
   `accounts/{slug}/profile.json` with anything we learned.

9. **Append to `outputs.json`** with `type: "timeline"`, title =
   "Timeline — {account name}", summary = the 3-sentence "today"
   block, path, status `ready`.

10. **Summarize to user.** The 3-sentence "today" block + offer:
    "Want me to score health, draft a renewal, or prep a QBR for
    them next?"

## Outputs

- `accounts/{slug}/timeline.md`
- `accounts/{slug}/profile.json` (upsert)
- Appends to `outputs.json` with `type: "timeline"`.
