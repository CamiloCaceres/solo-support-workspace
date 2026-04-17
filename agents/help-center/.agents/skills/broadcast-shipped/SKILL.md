---
name: broadcast-shipped
description: Use when the solo founder says "we just shipped X" or shares a release note — cross-references `requests.json` to find customers who asked for it, drafts personalized "you asked, we shipped" notes (one per requester, held for approval), and logs the release in `shipped-log.json`.
---

# Broadcast Shipped

## When to use

- Founder announces a ship in chat: "we just shipped bulk export", "dark mode is live", "rolled out the Zapier integration today".
- Founder pastes a release note and asks "who should I tell?".
- `requests.json` has a request whose `roadmapStatus` the founder manually flips to `shipped`.

## Steps

1. Parse what shipped:
   - Extract a short `summary` (one sentence) and `releasedAt` (ISO, default = now).
2. Find matching requests in `requests.json`:
   - Semantic match on `title` / `summary`. Present the matches to the founder: "Looks like this closes: 1) bulk export (3 requesters), 2) Zapier (1 requester). Confirm?"
   - On confirmation, collect the matched `FeatureRequest.id`s into `closedRequestIds`.
3. Create a new `ShippedEntry` in `shipped-log.json` (atomic write):
   - `releasedAt`, `summary`, `closedRequestIds`, `broadcasts: []` (fill in step 5).
4. Flip `roadmapStatus: "shipped"` on each closed request in `requests.json`; bump `updatedAt`.
5. For each unique `requestingCustomer` across all closed requests:
   - Look up customer in `../inbox/customers.json` for name / email / plan context.
   - Draft a personalized note in `digests/broadcast-{shipped-id}/{customer-slug}.md`:
     - Short. Personal. "Hey {name} — you asked about {feature} back in {month}. It shipped today. Here's what's new: …"
     - Include a 1-line how-to-use if obvious.
   - Add a broadcast entry to the `ShippedEntry.broadcasts[]` with `status: "drafted"` and the `draftPath`.
6. Post to chat: "Drafted {N} broadcasts in `digests/broadcast-{id}/`. Review and reply 'approve broadcasts' to send, or 'approve {customer-slug}' for specific ones."
7. When the founder approves, update each broadcast's `status: "approved"`. Actual sending goes through Composio (Gmail, Intercom, Front — discover via `composio search`) and flips to `sent` with `sentAt`.

## Outputs

- Appends to `shipped-log.json`
- Updates `roadmapStatus` in `requests.json`
- Creates `digests/broadcast-{id}/{customer-slug}.md` for each requester
- Optionally sends broadcasts via Composio on founder approval
