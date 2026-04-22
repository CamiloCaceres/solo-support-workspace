---
name: draft-churn-save
description: Use when the user says "save {account}" / "draft a save for {customer}" — drafts ONE save message grounded in the specific risk signal, acknowledging it honestly, naming the specific pain from history, and offering the real next step. Never proposes price concessions without approval.
---

# Draft Churn Save

## When to use

- "save {account}" / "draft a save for {customer}."
- Triggered from `weekly-support-review` when an account appears
  in `../inbox/churn-flags.json` with status unaddressed + 48h
  elapsed.
- When `score-account-health` returns RED and the founder says
  "do something."

## Steps

1. **Read `../head-of-support/support-context.md`.** Stop if
   missing.

2. **Load the account fully.**
   - Run `customer-timeline` if missing / stale.
   - Run `score-account-health` if missing / stale.
   - Read the specific flag: `../inbox/churn-flags.json` for this
     customer — the signal + source conversation.
   - Read the source conversation at `../inbox/conversations/{id}/thread.json`
     verbatim. You need the customer's actual words.

3. **Identify the ONE specific reason.** Look across:
   - Active bugs affecting them (is the thing they're mad about
     open in `bug-candidates.json`?).
   - Unmet asks — anything they asked for that hasn't shipped.
   - Friction in recent messages — verbatim complaint phrases.
   - Silence — did we ghost them after a promise in
     `followups.json`?
   - Billing friction — downgrade attempts, invoice issues.

   If you can't identify a specific reason, STOP. Tell the founder
   you need more context — don't draft a generic save.

4. **Draft ONE message** (not a sequence). Structure:
   - **Acknowledge the signal honestly.** Name what you're seeing
     in your own words, not theirs — don't be creepy ("you seem
     unhappy" is wrong; "I saw your last reply and I want to make
     sure we get this right" is right).
   - **Name the specific pain.** Reference the actual thing that
     happened. "The billing-export bug has been open 22 days and
     I know that's the thing you bought us for." No generic
     "we value your business."
   - **Offer the real next step.** A 15-minute call, a specific
     fix (with a date if engineering confirmed one), a workaround
     you'll own yourself, or — if genuinely warranted — a
     concession. FLAG concessions for approval ("If you want me
     to offer a 2-month credit, say the word and I'll add it").
     Never propose pricing changes in the first draft.
   - **End with a choice, not a pitch.** "Tell me what would make
     this right" beats "we'd love to keep you."

5. **Voice** from `support-context.md#voice`. Keep to 5–8
   sentences.

6. **Write to `saves/{account-slug}-{YYYY-MM-DD}.md`**
   atomically. Include a short header: account, renewal date if
   known, health score, the signal that fired, the source
   conversation ID.

7. **Append to `outputs.json`** with `type: "save"`, title =
   "Save — {account}", summary = the signal + the proposed next
   step, path, status `draft`.

8. **Summarize to user.** Headline: "{account}: {signal}. Drafted
   a save that {names the specific pain, offers {next step}}.
   {If a concession might be warranted: flag it as a separate
   option for your call.}"

## Outputs

- `saves/{account-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "save"`.
