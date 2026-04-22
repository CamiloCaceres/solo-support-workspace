---
name: tune-routing-rules
description: Use when the user says "update our routing" / "what counts as a bug" / "change where feature requests go" / "fix the routing rules" — rewrites the routing section of `support-context.md` with new decision tree and targets.
---

# Tune Routing Rules

## When to use

- "update our routing" / "fix routing" / "what's a bug vs a feature
  request."
- "we moved to {tracker}" / "refunds now go to {person}" / "add a
  new tier."
- When `weekly-support-review` surfaces that classifications are
  drifting.

## Steps

1. **Read `support-context.md`.** If missing, run
   `define-support-context` first.

2. **Surface the current rules to the founder.** Read the Routing
   rules section and restate it in 3–4 lines ("today: bug →
   Linear, feature request → help-center requests.json, outage →
   playbooks/p1-outage, billing → Stripe + you approve refunds").
   Ask: what's changing?

3. **Capture the update.** Ask ONE focused question at a time —
   don't do a whole interview. Typical updates:
   - New tracker target (moved from Linear to GitHub Issues, etc.).
   - New classification (e.g. add "security report").
   - New escalation contact.
   - Changed refund approver.
   - VIP list additions (also belongs in segments section — update
     both if needed).

4. **Rewrite the Routing rules section cleanly.** Preserve the
   decision-tree shape. For each type, state:
   - Trigger phrases / patterns that qualify.
   - Target location (tracker slug, playbook path, dossier, chat).
   - Who acts (the agent — inbox / help-center / success — or the
     founder).
   - What data to capture.

5. **Also update related sections** if the change implies it —
   VIP list (segments section), SLA tiers, known-gotchas entries
   that reference the changed tracker. Be explicit about what else
   you touched.

6. **Write atomically** (`.tmp` → rename).

7. **Append to `outputs.json`** with `type: "context-edit"`, title
   "Routing rules updated — {short reason}", summary 2 sentences on
   what changed, path `support-context.md`, status `draft`.

8. **Notify dependent agents.** End your summary with:
   > "Inbox and Help Center now classify with the new rules the next
   > time they triage. No manual re-sync needed — they read the doc
   > each run."

## Outputs

- `support-context.md` (routing + possibly related sections updated)
- Appends to `outputs.json` with `type: "context-edit"`.
