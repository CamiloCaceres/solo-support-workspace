---
name: churn-risk-scan
description: Use when scanning a customer's recent thread history for churn risk — trigger conditions are 2-3 support tickets in 30 days OR a single thread with frustration signals ("considering alternatives", "not working for us", "need to decide", "cancel", "downgrade") — scores 0–100, appends to `churn-flags.json` with signals and a suggested save-play.
---

# Churn Risk Scan

## When to use
- **Automatic trigger from `triage-incoming`**: when a customer opens their 3rd conversation in 30 days, or a new conversation lands with any of the frustration phrases.
- **Explicit founder ask**: "is anyone at risk?" / "churn check on Acme" / "who should I call this week?"
- **After a plan downgrade** event pulled from Stripe via Composio.

## Steps
1. **Resolve the customer slug**, or scan all customers if asked a broad question.
2. **For each candidate customer, gather signals:**
   - Count conversations in the last 30 days (threshold ≥3 → +20 points).
   - Scan the most recent 3 threads for frustration phrases. Phrases worth mentioning (each +15): "considering alternatives", "cancel", "downgrade", "refund", "not working", "we're evaluating", "need to decide", "disappointed", "unreliable".
   - Plan change event in last 45 days: downgrade +25, cancellation-requested +40.
   - Silence after a bug report (created in last 14d, no response in 7d) → +15.
   - Any open `bug-candidates` entry where the customer is affected and severity is `high`/`critical` → +10.
3. **Score and clamp** to 0–100. Below 30 → skip (no flag). 30–59 → low confidence. 60–79 → medium. 80+ → high.
4. **Generate a suggested save-play** based on top signals: downgrade → personal check-in from founder; unresolved bug → dedicated fix ETA email; silence → light nudge with an update.
5. **Check dedup** in `churn-flags.json` — if an `open` entry for this slug exists, update `signals`, `confidence`, `updatedAt` instead of duplicating.
6. **Write atomically** to `churn-flags.json`. Append `kind: "churn_flag"` event to `customers/{slug}/history.json`.

## Outputs
- Appends or updates entry in `churn-flags.json`
- Appends to `customers/{slug}/history.json`
- Returns score + signals + suggested play to chat
