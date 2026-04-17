---
name: morning-briefing
description: Use when the solo founder starts their day and asks for a rundown ("what's on my plate", "morning brief", "where do I start", "what do I need to do") — produces a ranked "start here" list combining P1/P2 open threads, overnight arrivals, follow-ups due today, and churn-flagged customers, written to `morning-brief.md` at agent root.
---

# Morning Briefing

## When to use
- Founder's first interaction of the day (time-heuristic: more than 8h since last chat).
- Explicit ask: "morning brief", "what's on my plate", "start of day", "where do I start".
- Dashboard is opened for the first time today (the founder may trigger this from the UI).

Only one brief per day should be authoritative. This skill overwrites `morning-brief.md` — it does not append.

## Steps
1. **Run `sla-watchdog`** internally to gather breached + at-risk conversations.
2. **Scan overnight arrivals** — rows in `conversations.json` whose `createdAt` is within the last 12h and whose status is still `open` (not yet drafted).
3. **Pull follow-ups due today** — filter `followups.json` where `status == "open"` and `dueAt` falls within today in the founder's local timezone.
4. **Pull open churn flags** — filter `churn-flags.json` where `status == "open"`, ranked by confidence desc.
5. **Rank the top N (target ~10).** Priority ordering: breached SLA → P1 overnight → P2 overnight → followups due today → churn flags → P3 overnight. Deduplicate — if one customer appears in multiple sections, mention once with all reasons.
6. **Render `morning-brief.md`** with sections: Start Here (top 5 combined), Breaching SLA, Overnight Arrivals, Due Today, Churn Watch. Each row links to the conversation id so the founder can say "review conversation <id>" in chat.
7. **Write atomically** to `morning-brief.md` at agent root. Overwrites yesterday's.
8. **Post a short summary to chat** — don't paste the whole brief; point the founder to the file and highlight the single most urgent item.

## Outputs
- Overwrites `morning-brief.md` at agent root
- Posts short summary to chat
