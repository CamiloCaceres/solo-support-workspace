---
name: prep-qbr
description: Use when the user says "prep a QBR for {account}" / "outline for my check-in with {customer}" — builds a 4-section QBR outline (wins / asks-shipped / friction / next moves) grounded in the account timeline.
---

# Prep QBR

## When to use

- "prep a QBR for {account}."
- "outline for my check-in with {customer}."
- Called during `weekly-support-review` when a scheduled QBR is
  within 7 days and no prep doc exists.

## Steps

1. **Read `../head-of-support/support-context.md`.** Stop if
   missing.

2. **Load the account.**
   - Run `customer-timeline` if missing / stale.
   - Run `score-account-health` if missing / stale.
   - Read `../help-center/requests.json` filtered to this customer
     + `../help-center/shipped-log.json` for ship status.

3. **Draft the 4-section outline** (markdown, ~400–600 words):

   ```markdown
   # QBR Prep — {Account} — {Meeting Date}

   **Health score:** {GREEN | YELLOW | RED}
   **Renewal:** {date if known}
   **Primary contact:** {name, role}

   ## 1. What they've gotten — wins

   {3–5 bullets of concrete outcomes or usage highlights pulled
   from the timeline. Each bullet names a specific thing they did
   or a specific value they got. No marketing fluff.}

   ## 2. What they asked for — shipped

   {List of their feature requests from help-center/requests.json,
   cross-referenced against shipped-log.json. For each:
   - "Asked for {feature} on {date} — shipped {date}."
   - "Asked for {feature} on {date} — not shipped; current status:
     {status from known-issues or requests metadata}."
   This section is the single best moment in a QBR — it proves
   you listen. Be honest about what didn't ship.}

   ## 3. Where they're stuck — friction

   {2–4 bullets. Open bugs affecting them (cite severity + age),
   unmet asks that still matter, any recurring complaint theme.
   Don't dress it up — the founder's job in the QBR is to
   acknowledge this.}

   ## 4. What we're proposing next

   {2–3 concrete moves we'd like input on. Could be:
   - A feature we're scoping and want feedback on.
   - An expansion option — hint only, don't close.
   - A process change (more frequent check-ins, new contact, etc.).
   - A specific fix with a committed date.
   Each move should be short and actionable — something they can
   say yes/no/modify to in the meeting.}

   ## Pre-meeting prep

   - {1–2 bullets on what the founder should do before the meeting:
     confirm a ship date with engineering, pull a usage number,
     sanity-check the proposal.}
   ```

4. **Voice** from `support-context.md#voice`. The QBR doc itself
   is internal prep, not customer-facing, so tone can be more
   direct — but the 4-section structure should read naturally off
   the page in a call.

5. **Write to `qbrs/{account-slug}-{YYYY-MM-DD}.md`** atomically.

6. **Append to `outputs.json`** with `type: "qbr"`, title =
   "QBR prep — {account}", summary = health + 1-line headline per
   section, path, status `draft`.

7. **Summarize to user.** Show the 4 section headlines inline and
   the 1–2 pre-meeting prep bullets. "Meeting in {N days}.
   Anything I should add?"

## Outputs

- `qbrs/{account-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "qbr"`.
