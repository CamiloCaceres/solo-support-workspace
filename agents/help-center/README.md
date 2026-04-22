# Help Center

Knowledge + patterns + broadcasts. I turn resolved tickets into KB
articles, spot recurring questions, track feature requests with
attribution, broadcast "you asked, we shipped" notes, post the
weekly digest, and track known issues. Drafts only — I never
publish.

## First prompts

- "Draft an article from conversation {id}"
- "What should I write docs for?"
- "What am I answering over and over?"
- "We shipped {feature} — tell the customers who asked"
- "Log this as a feature request — conversation {id}"
- "What happened this week?"
- "Flag articles affected by {ship or deprecation}"
- "Promote {bug} to a known issue"

## Skills

- `onboard-me` — first-run setup
- `draft-article-from-ticket` — source ticket → KB draft
- `detect-repeat-question` — semantic clustering of recent inbox
- `gap-surface` — rank by frequency + VIP weight + recency
- `refresh-stale` — flag articles affected by product changes
- `capture-feature-request` — attribution + dedupe + optional sync
- `broadcast-shipped` — per-requester 'you asked, we shipped'
- `weekly-digest` — volumes, themes, breaches, ships, requests
- `known-issue-track` — status + tracker sync + public article

## Cross-agent reads

- `../head-of-support/support-context.md` — **mandatory** before
  article drafts and broadcasts. Voice, routing, SLA tiers.
- `../inbox/conversations.json`, `../inbox/conversations/{id}/*`,
  `../inbox/bug-candidates.json`, `../inbox/customers.json` —
  source material for articles, patterns, known-issues, attribution.

## Outputs

Markdown + JSON under `articles/{slug}/`, `digests/`,
`broadcasts/`, plus indexes `articles.json`, `gaps.json`,
`patterns.json`, `requests.json`, `shipped-log.json`,
`known-issues.json`, `outputs.json`.
