---
name: draft-renewal-outreach
description: Use when the user says "renewal is coming for {account}" / "draft 30/60/90 for {account}" — drafts a 3-touch pre-renewal sequence (Day-90 / Day-60 / Day-30) grounded in the account timeline, health score, open items, and what shipped that they asked for.
---

# Draft Renewal Outreach

## When to use

- "renewal is coming up for {account}."
- "draft 30/60/90 for {account}."
- Called from `weekly-support-review` when an account's renewal is
  approaching and no renewal draft exists.

## Steps

1. **Read `../head-of-support/support-context.md`.** Stop if
   missing. Pull voice + any renewal-specific gotchas.

2. **Load the account.** Read `accounts.json` for renewal date. If
   `accounts/{slug}/timeline.md` is missing or > 14 days old, run
   `customer-timeline`. If `accounts/{slug}/health-{latest}.md` is
   missing or > 14 days old, run `score-account-health`.

3. **Read `config/renewal-cadence.json`** for the touch schedule.
   Default: Day-90 (ROI), Day-60 (friction), Day-30 (ask).

4. **Build per-touch intent from the timeline + health score:**

   - **Day-90 (ROI).**
     - Pull from timeline: what they've gotten — usage/outcome
       wins, features they've adopted.
     - Pull from `../help-center/shipped-log.json`: anything that
       shipped since last renewal that they specifically asked for
       ("you asked for X — we shipped it in Q2").
     - CTA: propose a 20-minute check-in to talk about the next
       year.
   - **Day-60 (friction).**
     - Pull from timeline: open bugs affecting them, unmet feature
       asks, any friction signals from Inbox.
     - If health = RED or YELLOW, lead with the friction directly
       ("I know {specific pain} has been a drag — here's where
       it stands and what's changing").
     - CTA: invite them to share what would make this a clear-yes
       renewal.
   - **Day-30 (ask).**
     - Direct: the renewal is coming, propose a 20-min call with
       2 specific agenda bullets (ROI, next-year roadmap). If
       health = RED, lead with "I want to make sure this is still
       working for you" before the ask.
     - CTA: pick a time. Surface 2–3 slots if calendar is
       connected.

5. **Draft each message.** Use voice from
   `support-context.md#voice`. Keep to 4–6 sentences per touch.
   Use `{placeholders}` for anything that might shift by the time
   the founder sends (dates, named contacts).

6. **Ground every claim in the timeline.** No generic ROI talk. If
   you reference a win, it came from the timeline. If you
   reference a ship, it came from `shipped-log.json`. Never
   invent.

7. **Write to `renewals/{account-slug}-{YYYY-MM-DD}.md`**
   atomically. Include a short header with the account name,
   renewal date, current health score, and the 3 touches in order.

8. **Append to `outputs.json`** with `type: "renewal"`, title =
   "Renewal outreach — {account}", summary = renewal date + health
   score + headline of Day-30 touch, path, status `draft`.

9. **Summarize to user.** Headline: "{account} renewal {date}.
   Health: {score}. 3 touches drafted." Show the Day-30 subject
   inline. Remind them to approve before sending.

## Outputs

- `renewals/{account-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "renewal"`.
