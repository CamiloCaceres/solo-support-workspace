---
name: draft-onboarding-sequence
description: Use when the user says "draft onboarding for {segment}" / "welcome series for new signups" / "activation drip" — drafts a 5-touch sequence (Day 0/1/3/7/14) with CTA and success metric per touch.
---

# Draft Onboarding Sequence

## When to use

- "draft onboarding for new {segment} signups."
- "welcome series for {specific customer}" (rare — more often
  segment-level).
- After a new plan launch, when the founder wants a tailored
  sequence for the new tier.

## Steps

1. **Read `../head-of-support/support-context.md`.** Stop if
   missing. Pull: product surface (key milestones), segments
   (match to the target), tone + voice, known gotchas to address
   proactively.

2. **Resolve the target.** If segment-level, read
   `config/accounts-seed.json` for segment definition. If
   specific customer, load their timeline (run `customer-timeline`
   first if missing).

3. **Map the 5-touch skeleton.** Each touch has: timing, intent,
   subject, body, CTA, success metric.

   - **Day 0 — Welcome.** Intent: confirm they made the right
     choice, name the first value they'll get. CTA: one concrete
     first action (set up X, connect Y, invite a teammate).
     Success metric: CTA clicked.
   - **Day 1 — First-value nudge.** Intent: celebrate / assist the
     first action. If done, "nice — here's the next thing." If not
     done, reduce friction with a specific tip. CTA: the deferred
     first action OR the second step.
   - **Day 3 — Milestone check.** Intent: make sure they've hit
     the activation milestone (founder defines what activation
     means for this product). If they have: amplify, hint at
     power-user move. If not: offer a 15-min office-hours.
   - **Day 7 — Feedback ask.** Intent: open the conversation,
     learn why they signed up, spot friction. CTA: reply with
     the one sentence on what they wanted to solve.
   - **Day 14 — Activation review.** Intent: mark whether they
     activated. If yes: name the value they've gotten, tee up
     expansion/upgrade conversation gently. If no: one direct
     "is this working for you?" message, offer help or offer to
     cancel.

4. **Draft each touch using voice from `support-context.md#voice`.**
   Keep bodies short — 3–5 sentences max. Use `{placeholders}`
   where the founder needs to personalize per-customer (e.g.
   `{First}`, `{CompanyName}`, `{SpecificUseCase}`).

5. **Reference the product surface from the context doc.** If the
   context doc says "self-serve activation is getting 3 keywords
   mapped," use that literally. Don't invent an activation moment.

6. **Address known gotchas inline** where they're likely to bite
   (e.g. if a gotcha is "Safari-specific first-connect issue,"
   surface it in the Day-1 touch if the customer is likely on
   Safari).

7. **Write to `onboarding/{slug}.md`** atomically. Slug =
   kebab-case of segment / customer (e.g. `smb-self-serve.md`,
   `enterprise-annual.md`).

8. **Append to `outputs.json`** with `type: "onboarding"`, title
   = "Onboarding — {segment/customer}", summary = the 5 touches
   in one line + activation metric, path, status `draft`.

9. **Summarize to user.** Bullet the 5 touches' subjects + one
   sentence on what the founder should personalize. Remind them:
   "Draft only — tell me when you want them live and I'll tell
   you which Composio tool to schedule them with."

## Outputs

- `onboarding/{slug}.md`
- Appends to `outputs.json` with `type: "onboarding"`.
