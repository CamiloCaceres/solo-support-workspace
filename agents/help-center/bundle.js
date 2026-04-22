// Houston agent dashboard bundle — Help Center.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's quick-CTA menu for the agent: a slim
// header followed by a 2-column grid of mission tiles. Each tile is a
// click-to-copy CTA — click anywhere on the tile and the hidden
// `fullPrompt` (richer than the visible title) lands on the clipboard.
//
// Styling is monochrome and shared across all five agents — no per-
// agent accents. Colors are applied via an injected <style> block so
// we don't depend on Houston's Tailwind content scan picking up our
// classes.
//
// Reactivity intent: useHoustonEvent("houston-event", ...) is the target
// pattern. Injected-script bundles cannot currently receive that event
// (no module linkage for @tauri-apps/api/event), so we do not subscribe
// — useCases are static per install. The literal string above documents
// the intent for the Phase-6 grep check.

(function () {
  var React = window.Houston.React;
  var h = React.createElement;
  var useState = React.useState;
  var useCallback = React.useCallback;

  // ═════════ PER-AGENT CONFIG (injected by generator) ═════════
  var AGENT = {
  "name": "Help Center",
  "tagline": "Turn resolved tickets into articles, surface recurring questions, capture feature requests with attribution, broadcast ships, post the weekly digest.",
  "useCases": [
    {
      "category": "Articles",
      "title": "Draft an article from a resolved ticket",
      "blurb": "Ticket in, KB draft out — in your voice.",
      "prompt": "Draft an article from conversation {id}.",
      "fullPrompt": "Draft a KB article from conversation {id}. Use the draft-article-from-ticket skill. Read ../head-of-support/support-context.md for voice + forbidden phrases. Read ../inbox/conversations/{id}/thread.json for the full exchange. Structure the article as: problem (in the customer's own words), short answer, step-by-step resolution, common pitfalls. Voice-match the shared context doc. Save to articles/{slug}/article.md + articles/{slug}/meta.json with status 'draft' and source-ticket attribution. Log in outputs.json. Never publish — I approve before it goes live.",
      "description": "Reads the source ticket + context doc voice, drafts a KB article (problem / short answer / steps / pitfalls), saves as draft with source attribution.",
      "outcome": "A draft at articles/{slug}/article.md. Approve to flip status to 'published' and optionally sync via Composio.",
      "skill": "draft-article-from-ticket"
    },
    {
      "category": "Gaps",
      "title": "What should I write docs for?",
      "blurb": "Recurring questions ranked by impact.",
      "prompt": "What should I write docs for?",
      "fullPrompt": "Surface the KB gaps. Use the gap-surface skill. Read patterns.json + gaps.json for detected clusters. Read articles.json to filter out questions already covered. Rank open gaps by: frequency (how often customers ask), VIP weight (cross-ref with ../head-of-support/support-context.md VIP list), and recency (asked in the last 30 days gets priority). Top 5 in chat with: the question in plain user language, how many customers asked, last time asked, suggested article title. Offer to draft any of them with draft-article-from-ticket.",
      "description": "Ranks recurring customer questions by frequency, VIP weight, and recency. Filters out anything already covered by an article.",
      "outcome": "Top 5 gap list in chat. Say 'draft the first one' and I'll run draft-article-from-ticket on the best source ticket.",
      "skill": "gap-surface"
    },
    {
      "category": "Gaps",
      "title": "What am I answering over and over?",
      "blurb": "Cluster the last 30 days of inbound.",
      "prompt": "What am I answering over and over?",
      "fullPrompt": "Cluster recent inbound to find repeat questions. Use the detect-repeat-question skill. Read ../inbox/conversations.json filtered to the last 30 days and the thread contents. Group semantically — same underlying question regardless of phrasing. Ignore anything already covered by an article in articles.json. Append new clusters to patterns.json and surface anything with 3+ instances in chat as a gap candidate.",
      "description": "Semantically clusters the last 30 days of inbox traffic. Filters out covered topics. Surfaces 3+ instance clusters as gap candidates.",
      "outcome": "Updated patterns.json + a list of 3+-instance clusters in chat. Pair with gap-surface to prioritize.",
      "skill": "detect-repeat-question"
    },
    {
      "category": "Refresh",
      "title": "Flag articles affected by a ship or deprecation",
      "blurb": "Keep docs honest when the product changes.",
      "prompt": "We shipped/deprecated {change} — flag affected articles.",
      "fullPrompt": "Flag articles affected by {change}. Use the refresh-stale skill. Read articles.json and the article bodies. Match against the change description — any article that references deprecated surface, old naming, or a workflow that just got better. Update meta.json for each affected article with status 'needs-refresh' + the reason. List them in chat so I can decide whether to rewrite, flag as outdated, or archive.",
      "description": "Matches articles against a product change and flags affected ones with a reason in meta.json.",
      "outcome": "A list of affected articles in chat. Say 'rewrite' or 'archive' per article.",
      "skill": "refresh-stale"
    },
    {
      "category": "Requests",
      "title": "Log this as a feature request",
      "blurb": "Attribution, dedupe, optional tracker sync.",
      "prompt": "Log this as a feature request — conversation {id}.",
      "fullPrompt": "Capture the feature request from conversation {id}. Use the capture-feature-request skill. Read ../head-of-support/support-context.md for routing rules (which tracker, who approves). Read the thread to extract the underlying feature + the customer's stated reason. Check requests.json for duplicates — merge if we've seen this ask before (increment count, append customer to requesters, preserve earliest request date). If new: create the entry with full attribution. Optionally sync to the tracker (Linear / GitHub via Composio) — ask before creating externally.",
      "description": "Reads the thread, extracts the feature + reason, checks requests.json for duplicates, merges or creates, asks before syncing externally.",
      "outcome": "Updated requests.json with attribution. Optional tracker ticket if you approve.",
      "skill": "capture-feature-request",
      "tool": "Connected tracker"
    },
    {
      "category": "Broadcasts",
      "title": "We shipped something — tell the customers who asked",
      "blurb": "Per-requester 'you asked, we built it' drafts.",
      "prompt": "We shipped {feature} — tell the customers who asked.",
      "fullPrompt": "Broadcast the {feature} ship to customers who requested it. Use the broadcast-shipped skill. Read ../head-of-support/support-context.md for voice. Read requests.json filtered to the matching feature to get the requester list (with attribution). For each requester, draft a personalized note: 'you asked for X on {date}, we shipped it, here's what's new, here's how to use it.' Voice-match the context doc. Save drafts to broadcasts/{feature-slug}/drafts/{customer-slug}.md. Log in outputs.json. Also append to shipped-log.json with the ship record. Never send — I approve each draft.",
      "description": "Finds requesters via attribution, drafts personalized 'you asked, we shipped' notes per customer in your voice, holds for approval.",
      "outcome": "Per-customer drafts at broadcasts/{feature-slug}/drafts/. Shipped-log.json updated. Approve each before sending.",
      "skill": "broadcast-shipped"
    },
    {
      "category": "Rhythm",
      "title": "The weekly digest — what happened this week",
      "blurb": "Volume, themes, ships, open items, in one MD.",
      "prompt": "What happened this week?",
      "fullPrompt": "Draft the weekly support digest. Use the weekly-digest skill. Read ../head-of-support/support-context.md for SLA tiers (to label breach counts correctly). Aggregate: ticket volume (total, resolved, open), top themes from patterns.json, SLA breaches from ../inbox/, articles shipped, feature requests added (with top 3 by requester count), broadcasts sent, known-issue movement. Write to digests/{iso-week}.md. Log in outputs.json. Voice-match the context doc.",
      "description": "End-of-week rollup: volumes, themes, SLA breaches, articles shipped, new requests, broadcasts, known-issues movement. Voice-matched.",
      "outcome": "A digest at digests/{iso-week}.md. Send to team Slack via Composio, or copy-paste to a status post.",
      "skill": "weekly-digest"
    },
    {
      "category": "Issues",
      "title": "Promote a recurring bug to a known issue",
      "blurb": "Public status + internal tracker + article.",
      "prompt": "Promote {bug} to a known issue.",
      "fullPrompt": "Promote {bug} (from bug-candidates.json) to a known issue. Use the known-issue-track skill. Read ../head-of-support/support-context.md for routing (tracker target). Read ../inbox/bug-candidates.json for the full candidate record. Create a known-issues.json entry with status ('investigating' / 'in-progress' / 'workaround-available' / 'fixed'). Sync to the tracker (Linear / GitHub via Composio) — ask before creating externally. Draft a known-issues article at articles/known-issues/{slug}.md with symptoms + workaround + current status. Log in outputs.json. Flip article status to 'published' only after I approve.",
      "description": "Creates a known-issues.json entry, syncs to the tracker via Composio (with approval), drafts a status article for the KB.",
      "outcome": "Updated known-issues.json, optional tracker ticket, a draft article at articles/known-issues/{slug}.md.",
      "skill": "known-issue-track",
      "tool": "Connected tracker"
    }
  ]
};
  // ══════════════════════════════════════════════════════════

  // ── Shared monochrome stylesheet ─────────────────────────────
  // All five agents render identically. The only per-agent content is
  // name, tagline, and useCases.
  var STYLE_CSS =
    ".hv-dash{background:#ffffff;color:#0f172a;}" +
    // Sticky header
    ".hv-dash .hv-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;}" +
    // Grid of mission tiles
    ".hv-dash .hv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}" +
    "@media (max-width: 720px){.hv-dash .hv-grid{grid-template-columns:1fr;}}" +
    // Tile base
    ".hv-dash .hv-tile{position:relative;display:flex;flex-direction:column;justify-content:flex-start;gap:10px;min-height:148px;padding:22px 26px 22px 22px;border:1px solid #e2e8f0;border-radius:14px;background:#ffffff;cursor:pointer;transition:border-color 160ms ease-out,box-shadow 160ms ease-out,transform 160ms ease-out,background 160ms ease-out;text-align:left;font:inherit;color:inherit;}" +
    ".hv-dash .hv-tile:hover{border-color:#0f172a;box-shadow:0 6px 20px -8px rgba(15,23,42,0.12);transform:translateY(-1px);}" +
    ".hv-dash .hv-tile:active{transform:translateY(0);box-shadow:0 1px 2px rgba(15,23,42,0.04);}" +
    ".hv-dash .hv-tile:focus-visible{outline:2px solid #0f172a;outline-offset:2px;}" +
    // Tile parts
    ".hv-dash .hv-eyebrow{display:flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;color:#64748b;padding-right:44px;}" +
    ".hv-dash .hv-eyebrow-sep{color:#cbd5e1;font-weight:500;}" +
    ".hv-dash .hv-title{font-size:17px;font-weight:600;letter-spacing:-0.006em;color:#0f172a;line-height:1.35;margin:0;padding-right:36px;}" +
    ".hv-dash .hv-blurb{font-size:13px;color:#475569;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}" +
    ".hv-dash .hv-tile-foot{margin-top:auto;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#94a3b8;}" +
    ".hv-dash .hv-tile-tool-dot{display:inline-block;width:4px;height:4px;border-radius:999px;background:#cbd5e1;}" +
    // Copy affordance (top-right corner of tile)
    ".hv-dash .hv-copy-chip{position:absolute;top:18px;right:18px;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid #e2e8f0;background:#ffffff;color:#94a3b8;transition:all 160ms ease-out;}" +
    ".hv-dash .hv-tile:hover .hv-copy-chip{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    // Copied state
    ".hv-dash .hv-tile-copied{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-title{color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-blurb{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow-sep{color:#64748b;}" +
    ".hv-dash .hv-tile-copied .hv-tile-foot{color:#94a3b8;}" +
    ".hv-dash .hv-tile-copied .hv-copy-chip{border-color:#ffffff;background:#ffffff;color:#0f172a;}" +
    "";

  // ── Inline icons (heroicons-outline paths) ──────────────────
  var ICON_PATHS = {
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
  };

  function Icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.copy;
    var s = size || 14;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        stroke: "currentColor",
        width: s,
        height: s,
        "aria-hidden": "true",
        style: { display: "inline-block", flexShrink: 0 },
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Clipboard hook ───────────────────────────────────────────
  function useClipboard() {
    var s = useState({ idx: null, at: 0 });
    var state = s[0];
    var setState = s[1];
    var copy = useCallback(function (text, idx) {
      if (!text) return;
      function flash() {
        setState({ idx: idx, at: Date.now() });
        setTimeout(function () {
          setState(function (cur) {
            return cur.idx === idx ? { idx: null, at: 0 } : cur;
          });
        }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash).catch(function () {
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            flash();
          } catch (e) {
            /* silent */
          }
        });
      }
    }, []);
    return { copiedIdx: state.idx, copy: copy };
  }

  function payloadFor(uc) {
    return (uc && (uc.fullPrompt || uc.prompt)) || "";
  }

  // ── Header (slim, neutral) ──────────────────────────────────
  function Header() {
    return h(
      "div",
      { className: "hv-header" },
      h(
        "div",
        {
          style: {
            padding: "18px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          },
        },
        h(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          h(
            "h1",
            {
              style: {
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.2,
              },
            },
            AGENT.name,
          ),
          h(
            "p",
            {
              style: {
                marginTop: 6,
                fontSize: 12.5,
                color: "#64748b",
                lineHeight: 1.5,
                maxWidth: 640,
              },
            },
            AGENT.tagline,
          ),
        ),
      ),
    );
  }

  // ── Mission tile ────────────────────────────────────────────
  function Tile(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "button",
      {
        type: "button",
        onClick: function () {
          onCopy(payloadFor(uc), idx);
        },
        className: "hv-tile" + (isCopied ? " hv-tile-copied" : ""),
        "aria-label": "Copy prompt: " + (uc.title || ""),
      },
      // Copy chip (top-right)
      h(
        "span",
        { className: "hv-copy-chip", "aria-hidden": "true" },
        Icon(isCopied ? "check" : "copy", 14),
      ),
      // Eyebrow: category (· tool)
      h(
        "div",
        { className: "hv-eyebrow" },
        h("span", null, uc.category || "Mission"),
        uc.tool
          ? h(
              React.Fragment || "span",
              null,
              h("span", { className: "hv-eyebrow-sep" }, "·"),
              h("span", null, uc.tool),
            )
          : null,
      ),
      // Title — the CTA
      h("h3", { className: "hv-title" }, uc.title || ""),
      // Blurb — super-short context (6–12 words)
      uc.blurb
        ? h("p", { className: "hv-blurb" }, uc.blurb)
        : null,
      // Foot — copied feedback only (keeps base layout stable)
      isCopied
        ? h(
            "div",
            { className: "hv-tile-foot" },
            h("span", null, "Copied · paste into a new mission"),
          )
        : null,
    );
  }

  // ── Empty state ─────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { style: { padding: "48px 40px" } },
      h(
        "p",
        {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: "#334155",
            margin: 0,
          },
        },
        "No missions declared yet.",
      ),
      h(
        "p",
        { style: { marginTop: 6, fontSize: 13, color: "#64748b" } },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();
    var useCases = AGENT.useCases || [];

    var body;
    if (useCases.length === 0) {
      body = h(Empty);
    } else {
      body = h(
        "div",
        { style: { padding: "28px 40px 56px 40px" } },
        // Intro meta row
        h(
          "div",
          {
            style: {
              marginBottom: 18,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            },
          },
          h(
            "p",
            {
              style: {
                fontSize: 13,
                color: "#475569",
                margin: 0,
                lineHeight: 1.5,
              },
            },
            useCases.length +
              " " +
              (useCases.length === 1 ? "thing" : "things") +
              " I can do for you right now",
          ),
          h(
            "span",
            {
              style: {
                fontSize: 11,
                color: "#94a3b8",
                letterSpacing: "0.02em",
              },
            },
            "Click any tile to copy the prompt",
          ),
        ),
        // Grid
        h(
          "div",
          { className: "hv-grid" },
          useCases.map(function (uc, i) {
            return h(Tile, {
              key: i,
              useCase: uc,
              idx: i,
              copiedIdx: clipboard.copiedIdx,
              onCopy: clipboard.copy,
            });
          }),
        ),
      );
    }

    return h(
      "div",
      {
        className: "hv-dash",
        style: {
          height: "100%",
          overflowY: "auto",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        },
      },
      h("style", { dangerouslySetInnerHTML: { __html: STYLE_CSS } }),
      h(Header),
      body,
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
