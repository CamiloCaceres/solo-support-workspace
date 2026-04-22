// Houston agent dashboard bundle — Head of Customer Support.
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
  "name": "Head of Customer Support",
  "tagline": "Support context, voice calibration, escalation playbooks, the weekly review. I coordinate Inbox, Help Center, and Success through one shared support-context.md I own.",
  "useCases": [
    {
      "category": "Foundation",
      "title": "Lock the support context everyone reads",
      "blurb": "Product map, tone, SLAs, VIPs — one doc, all agents.",
      "prompt": "Set up our support context — product map, tone, SLA tiers, VIPs, routing rules.",
      "fullPrompt": "Set up (or update) our support context. Use the define-support-context skill. Interview me for the pieces you don't already have in config/ — product surface (features, pricing tiers, self-serve vs gated), customer segments + VIP list, tone + voice defaults, SLA tiers (P1-P4 response times), routing rules (bug vs feature vs outage vs billing), known gotchas I'm tired of answering. Synthesize into the full support-context.md at your agent root. This is the doc Inbox, Help Center, and Success all read before every task — be specific, no throw-away adjectives. After saving, tell me which sections still need evidence and what you'd ask next.",
      "description": "I interview you once, then draft the support-context.md at my root — product surface, customer segments, tone, SLA tiers, routing rules, VIP list, known gotchas. This is the doc Inbox / Help Center / Success read before any substantive work.",
      "outcome": "A filled-in support-context.md at my root. Inbox / Help Center / Success unlock the moment this exists.",
      "skill": "define-support-context"
    },
    {
      "category": "Foundation",
      "title": "Calibrate my voice from 10 real replies",
      "blurb": "Tone fingerprint straight from my sent folder.",
      "prompt": "Pull 10–20 of my recent support replies and calibrate the voice section of the context doc.",
      "fullPrompt": "Calibrate my support voice. Use the voice-calibration skill. Search Composio for my connected inbox (Gmail, Front, Intercom, Help Scout, Zendesk — whatever's linked), pull the 10–20 most recent outbound support replies I personally sent, and extract tone cues: greeting style, sentence length, formality, signature, forbidden phrases, quirks I repeat. Write 3–5 verbatim excerpts + a tone summary into the voice section of support-context.md. Save raw samples to voice-samples/ so I can re-run the calibration later. If no inbox is connected, tell me what category to link and stop.",
      "description": "Pulls 10–20 of your real sent support replies via Composio, extracts your tone fingerprint, and writes the voice block into support-context.md so every draft across the workspace matches how you actually write.",
      "outcome": "Voice section of support-context.md updated + raw samples saved to voice-samples/. Every draft across the workspace pulls from this.",
      "skill": "voice-calibration",
      "tool": "Connected inbox"
    },
    {
      "category": "Rules",
      "title": "Tune what counts as a bug, feature, outage, billing",
      "blurb": "Routing rules every agent respects.",
      "prompt": "Update our routing rules — what's a bug, what's a feature request, what's an outage, what's billing.",
      "fullPrompt": "Update the routing rules in support-context.md. Use the tune-routing-rules skill. Walk me through the current rule set (bug → tracker target, feature request → help-center requests.json, outage → escalation playbook, billing → Stripe dossier + refund path). Ask me what's changing — maybe we moved trackers, added a tier, changed the refund-approver. Rewrite the routing section cleanly, keep examples, preserve the decision tree. Update the doc atomically and log the change in outputs.json.",
      "description": "Updates the routing section of support-context.md: what's a bug vs a feature request vs an outage vs billing, and which target each routes to (Linear / GitHub / Stripe / escalation playbook).",
      "outcome": "Routing section of support-context.md updated. Every triage decision across Inbox + Help Center follows these rules.",
      "skill": "tune-routing-rules"
    },
    {
      "category": "Playbooks",
      "title": "Draft the P1 / outage playbook",
      "blurb": "Who to tell, what to say, in what order.",
      "prompt": "Draft the P1 / outage playbook — who I tell, what I say, in what order.",
      "fullPrompt": "Draft the P1 / outage / security-incident playbook. Use the draft-escalation-playbook skill. Ask me two things: what counts as P1 for this product, and who needs to be looped in (engineering on-call, named customers on VIP list, any legal/compliance contact). Synthesize a step-by-step playbook: first 15 min (detection + internal Slack), first 60 min (customer comms template + status page), same day (RCA outline), follow-up (48-hour post-mortem). Save to playbooks/{slug}.md with a filled template that I can edit once and reuse. Log in outputs.json.",
      "description": "Synthesizes a step-by-step P1 / outage / security-incident runbook — detection, internal comms, customer comms template, status page, RCA outline, post-mortem follow-up.",
      "outcome": "A runbook at playbooks/{slug}.md. Edit once, reference every incident.",
      "skill": "draft-escalation-playbook"
    },
    {
      "category": "Reviews",
      "title": "The Monday support review in 2 minutes",
      "blurb": "Volume, breaches, themes, churn flags, ships.",
      "prompt": "Give me the Monday support review across Inbox, Help Center, and Success.",
      "fullPrompt": "Run the Monday support review. Use the weekly-support-review skill. Read each sister agent's outputs.json — ../inbox/ (volumes, SLA breaches, bugs filed, churn flags), ../help-center/ (articles drafted/shipped, gaps surfaced, feature requests, known issues moved), ../success/ (accounts scored, renewals drafted, saves drafted, QBRs prepped). Cross-reference against support-context.md (VIP hits? SLA tier performance?). End with 3 recommended next moves, each addressed to a specific agent with a one-line handoff prompt I can paste. Save to reviews/{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Aggregates what each sister agent produced last week, flags SLA breaches and churn signals, and ends with 3 recommended handoffs I can paste into the right agent's chat.",
      "outcome": "A weekly review at reviews/{YYYY-MM-DD}.md with next moves per sister agent.",
      "skill": "weekly-support-review"
    },
    {
      "category": "Research",
      "title": "Mine the month's tickets for product + positioning signal",
      "blurb": "Verbatim pains, top asks, positioning wedges.",
      "prompt": "Mine the last month of tickets for product signals and positioning language.",
      "fullPrompt": "Mine the last month of tickets for strategic signal. Use the synthesize-voice-of-customer skill. Read ../inbox/conversations/ (thread contents) and ../help-center/requests.json / patterns.json to pull verbatim customer language. Extract: the top 5 pains ranked by frequency, the top 5 feature requests, objections or friction phrases that contradict our current positioning, 2–3 quotes worth pulling into a landing page or sales deck. Save to voc-reports/{YYYY-MM-DD}.md and log in outputs.json. Flag the 3 quotes I should send to marketing/product immediately.",
      "description": "Clusters last month's ticket traffic into pains, feature asks, friction phrases, and positioning-worthy quotes. Reads Inbox + Help Center — no external scraping.",
      "outcome": "A VoC report at voc-reports/{YYYY-MM-DD}.md — the best source for landing-page copy and roadmap prioritization.",
      "skill": "synthesize-voice-of-customer"
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
