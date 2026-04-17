---
name: customer-dossier
description: Use when drafting a reply for a specific customer, or when the founder asks "who is this customer" / "what should I know about X" / "tell me about Acme" — aggregates profile, history, open conversations, open followups, bug-candidates and churn-flags entries into a one-page dossier and refreshes `customers/{slug}/profile.json`.
---

# Customer Dossier

## When to use
- The `draft-reply` skill calls this before drafting.
- The founder asks about a specific customer by name, email, or company.
- A churn flag fires and the founder wants context before calling.
- After a Composio-sourced profile refresh (Stripe plan change, Intercom attribute update, etc.) to keep the local profile current.

## Steps
1. **Resolve the customer slug** from whatever the founder gave you (email, name, company). Check `customers.json`. If no match, say so — do not invent.
2. **(Optional) Refresh from Composio.** If the founder asked to refresh, use `composio search` to find Stripe / Intercom / HubSpot lookup slugs for the customer's linked accounts. Pull plan, MRR, LTV, signup date. Update `customers/{slug}/profile.json` atomically.
3. **Aggregate the dossier in memory:**
   - Profile: name, company, plan, MRR, LTV, signup date, tags, founder notes.
   - Open conversations: filter `conversations.json` by `customerSlug` where status != "resolved".
   - Open followups: filter `followups.json` by `customerSlug` where status == "open".
   - Open bugs: filter `bug-candidates.json` where `customerSlug` or `affectedCustomerSlugs` contains this slug, status != "dismissed".
   - Churn: any open `churn-flags.json` entry.
   - Recent history: last 5 events from `customers/{slug}/history.json`.
4. **Produce the one-page dossier in chat.** Sections in this order: header (name/company/plan/MRR), tags, open conversations, outstanding promises, open bugs, churn status, recent history.

## Outputs
- Returns dossier to chat
- Optionally refreshes `customers/{slug}/profile.json` and updates `customers.json` row
