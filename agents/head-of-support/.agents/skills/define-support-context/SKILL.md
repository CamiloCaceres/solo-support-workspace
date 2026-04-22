---
name: define-support-context
description: Use when the user says "set up our support context" / "define our support context" / "update the context doc" — drafts or updates the shared `support-context.md` at the agent root, the single source of truth Inbox, Help Center, and Success read before any substantive output.
---

# Define Support Context

The Head of Customer Support OWNS `support-context.md`. No other
agent writes it. This skill creates or updates it. Its existence is
what unblocks the other three agents in the workspace.

## When to use

- "set up our support context" / "define our support context" /
  "let's do the context doc".
- "update the context doc" / "a new tier / VIP / gotcha — fix the
  context".
- Called implicitly by any other skill that needs context and finds
  the doc missing — but only after confirming with the user.

## Steps

1. **Read config.** Load `config/product.json`,
   `config/segments.json`, `config/support-stance.json`. If any is
   missing, run `onboard-me` first (or ask the ONE missing piece
   just-in-time with a modality hint: connected app > file > URL >
   paste).

2. **Read the existing doc if present.** If `support-context.md`
   exists, read it so this run is an update, not a rewrite. Preserve
   anything the founder has sharpened; change only what's stale or
   new.

3. **Push for verbatim language.** Before drafting, ask the founder
   for 2–3 verbatim customer phrases or example tickets — the
   friction words, the repeat gotchas. If `voice-samples/` has
   entries, mine those first.

4. **Draft the doc (~400–700 words, opinionated, direct).**
   Structure, in this order:

   1. **Product overview** — one paragraph: what the product is, who
      it's for, key surface areas (features/flows), pricing model,
      self-serve vs gated.
   2. **Customer segments + VIP list** — named segments + VIP
      accounts. VIPs get P1 regardless of content.
   3. **Tone + voice** — default tone (direct / warm / human), 3–5
      verbatim samples pulled from `voice-samples/` if present
      (otherwise `TBD — run voice-calibration`), forbidden phrases.
   4. **SLA tiers** — P1 / P2 / P3 / P4 definitions + response-time
      expectations per tier. Name what qualifies as each tier.
   5. **Routing rules** — decision tree:
      - Bug → tracker target (Linear / GitHub — from config or
        ask); what info to capture (repro, version, customer).
      - Feature request → `help-center/requests.json`, with
        customer attribution.
      - Outage → playbook reference (`playbooks/p1-outage.md` once
        drafted).
      - Billing → Stripe dossier + refund approver (founder by
        default).
   6. **Known gotchas** — short whisper-list of product quirks
      answered 10+ times. 3–10 bullets.

5. **Mark gaps honestly.** If a section is thin, write
   `TBD — {what the founder should bring next}`. Never invent.

6. **Write atomically.** Write to `support-context.md.tmp`, then
   rename to `support-context.md`. Single file at agent root. NOT
   under a subfolder.

7. **Append to `outputs.json`.** Read existing array, append a new
   entry (`type: "context-edit"`, title summarizing what changed),
   write atomically.

8. **Summarize to user.** One paragraph: what you wrote, what's
   still `TBD`, the next move ("next: run `voice-calibration`" /
   "next: tell me which tracker you use for bugs"). Remind them that
   Inbox / Help Center / Success now have what they need.

## Outputs

- `support-context.md` (at the agent root — live document)
- Appends to `outputs.json` with `type: "context-edit"`.
