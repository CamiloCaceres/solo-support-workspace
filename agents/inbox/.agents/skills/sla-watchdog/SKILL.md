---
name: sla-watchdog
description: Use when reviewing open customer support conversations for response-time risk, on demand ("what's breaching SLA?") or as part of `morning-briefing` — scans `conversations.json` for items where `sla.firstReplyDueAt` or `sla.nextUpdateDueAt` is within 2 hours or already breached, and returns a ranked list worst-breach-first.
---

# SLA Watchdog

## When to use
- Founder asks "what's breaching?" / "anything on fire?" / "SLA check".
- Called by `morning-briefing`.
- Called periodically if the founder has set up a scheduled check.
- After a batch of `triage-incoming` runs to confirm nothing landed P1 that should have been P2 or vice versa.

## Steps
1. **Load `conversations.json`.** Filter to rows where `status` in `{ "open", "waiting_founder" }`.
2. **For each row, compute time-to-due:**
   - Use the earlier of `sla.firstReplyDueAt` and `sla.nextUpdateDueAt` if both are set.
   - If `now >= dueAt` → `breached` with magnitude `now - dueAt` (hours).
   - If `dueAt - now <= 2h` → `at-risk`.
   - Otherwise skip.
3. **Flip `sla.breached = true`** on rows that newly breached and write back atomically to `conversations.json`. This is the only field this skill ever writes.
4. **Rank:** breached first, ordered by how long they've been breached (longest first); then at-risk ordered by soonest due.
5. **Return the ranked list** to chat with: customer name, subject, priority, breach magnitude or time remaining, and a `Review conversation <id>` hint for each.

## Outputs
- Returns ranked SLA list to chat
- Updates `sla.breached` field in `conversations.json` (atomic write)
