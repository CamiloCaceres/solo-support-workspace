---
name: score-account-health
description: Use when the user says "score health for {account}" / "how's {customer} doing" / "run health" — outputs GREEN / YELLOW / RED with the three driving signals, reasoning, and one recommended next action. Also called during weekly-support-review for every tracked account.
---

# Score Account Health

## When to use

- "score health for {account}" / "how's {customer} doing."
- Weekly rollup: score every tracked account in `accounts.json`.
- Ad-hoc risk check before a founder call or renewal conversation.

## Steps

1. **Read `../head-of-support/support-context.md`.** Stop if
   missing.

2. **Read `config/health-definitions.json`.** If missing, apply
   defaults (GREEN = low volume + no flags; YELLOW = elevated
   volume OR one open bug OR one unmet VIP ask; RED = active churn
   flag OR multiple open P1/P2 bugs OR silence > 60d after
   complaint).

3. **Load the timeline.** If `accounts/{slug}/timeline.md` is
   missing or > 14 days old, run `customer-timeline` first.

4. **Evaluate signals** (aim for exactly 3 driving signals — be
   specific):
   - Support volume trend — tickets this month vs last, any sudden
     spike.
   - Open bugs affecting them — count, severity, age.
   - Unmet feature asks — how many, how long open, whether any
     were promised.
   - Churn-flag status — any active RED flag from Inbox, any
     sentiment-negative recent message.
   - Usage (if `composio search usage-analytics` connects) — last
     seen, DAU/WAU trend if available.
   - Billing — on-plan, past-due, recent downgrade.
   - Silence — time since last inbound from them; time since last
     response from us.

5. **Apply the definitions** to pick GREEN / YELLOW / RED. Bias
   toward the worst signal — one RED signal makes the account RED
   even if others are GREEN.

6. **Draft the scoring write-up.** Markdown, 150–300 words:

   ```markdown
   # Health — {Account} — {YYYY-MM-DD}

   **Score:** {GREEN | YELLOW | RED}

   ## Signals

   1. **{signal 1 name}** — {specific evidence, e.g. "3 open P2 bugs, oldest 22 days, all in the billing-export flow"}
   2. **{signal 2 name}** — {specific evidence}
   3. **{signal 3 name}** — {specific evidence}

   ## Reasoning

   {one paragraph — why the combination of these signals lands
   here. Reference the health definitions in plain language.}

   ## Recommended next action

   {ONE sentence — the concrete next move. Examples:
   - "Leave alone — check back in 2 weeks."
   - "Nudge via `draft-renewal-outreach` — renewal in 72 days and
     ROI message will land."
   - "Save via `draft-churn-save` — churn-flag fired 4 days ago,
     no response from us yet."
   - "Escalate to founder — VIP, 2 open P1 bugs, silence 14 days."}
   ```

7. **Write** to `accounts/{slug}/health-{YYYY-MM-DD}.md`
   atomically.

8. **Update `health-scores.json`** — append the new score (with
   full metadata), and set it as the latest score for this
   account. Read-merge-write.

9. **Update `accounts/{slug}/health-history.json`** — append the
   score + pointer.

10. **Append to `outputs.json`** with `type: "health-score"`,
    title = "Health — {account}: {score}", summary = signals
    one-liner + recommended action, path, status `ready`.

11. **Summarize to user.** One line: "{account} = {score}.
    {top-signal}. {recommended action}." Offer the handoff ("Want
    me to draft the {save/renewal/expansion}?").

## Outputs

- `accounts/{slug}/health-{YYYY-MM-DD}.md`
- Updates `health-scores.json`, `accounts/{slug}/health-history.json`.
- Appends to `outputs.json` with `type: "health-score"`.
