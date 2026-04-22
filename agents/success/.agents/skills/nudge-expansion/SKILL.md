---
name: nudge-expansion
description: Use when the user says "they're ready for {tier}" / "draft an expansion nudge for {account}" / "ceiling signal for {account}" — drafts a single expansion outreach grounded in a specific ceiling signal (usage near limit, higher-plan feature request, team growth). Opens a conversation, doesn't push a close.
---

# Nudge Expansion

## When to use

- "draft an expansion nudge for {account}."
- "they're hitting the ceiling on {plan}."
- Called from `score-account-health` when a GREEN + ceiling-signal
  combination appears.
- Weekly review surfaces accounts crossing usage / plan thresholds.

## Steps

1. **Read `../head-of-support/support-context.md`.** Stop if
   missing. Pull voice + current pricing/plans.

2. **Load the account.**
   - Run `customer-timeline` if missing / stale.
   - Run `score-account-health` if missing / stale. If health is
     RED, STOP — do `draft-churn-save` instead. Expansion on a
     RED account is tone-deaf.

3. **Identify the specific ceiling signal.** Must be at least one
   of:
   - Usage near plan limit — via `composio search usage-analytics`
     if connected. Pull current usage vs plan cap.
   - Feature request on a higher tier — check
     `../help-center/requests.json` for features they've asked
     for that live on a higher plan.
   - Support tickets about limits — check Inbox for "can I do X"
     / "the limit is hitting us" patterns.
   - Team growth — new seats added, multiple new email addresses
     on the account.
   - Billing signal — recent plan upgrade attempt abandoned.

   If no specific signal, STOP. Don't draft a generic "consider
   upgrading" message — it erodes trust.

4. **Draft ONE short message.** Structure:
   - **Acknowledge the signal specifically.** "You hit 94% of your
     monthly API calls this week." / "You've asked twice about
     the audit-log feature — that lives on Team plan."
   - **Name the value of the higher plan in terms of THEIR thing.**
     Not "more features" — "audit log + SSO, which would give you
     the thing {they asked for} and unblock {specific usage}."
   - **Offer a conversation, not a close.** "Want to jump on 15
     min to see if it makes sense? Happy to answer 'not right
     now' if it doesn't." Nudges that pressure-close damage trust
     more than they convert.
   - **No urgency, no discount, no scarcity.** Unless the founder
     explicitly says "we're running an upgrade promo this month."

5. **Voice** from `support-context.md#voice`. Keep to 4–6
   sentences.

6. **Write to `expansion/{account-slug}-{YYYY-MM-DD}.md`**
   atomically. Header: account, current plan, target plan, the
   specific ceiling signal with evidence.

7. **Append to `outputs.json`** with `type: "expansion"`, title =
   "Expansion nudge — {account}", summary = signal + proposed
   target plan, path, status `draft`.

8. **Summarize to user.** Headline: "{account}: {signal}.
   Drafted a nudge toward {target plan}. Draft-only — approve
   before sending."

## Outputs

- `expansion/{account-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "expansion"`.
