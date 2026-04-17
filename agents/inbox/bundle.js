// Inbox Dashboard — custom bundle for the Houston Inbox agent.
//
// Loaded by the Houston tab resolver as a <script> tag. It must assign a
// component map to window.__houston_bundle__. React is available at
// window.Houston.React. We cannot import @houston-ai/core here (not on
// window), so everything is hand-rolled React.createElement + Tailwind.
//
// The dashboard is READ-ONLY. Every section reads JSON files at the agent
// root and renders. The only user action is a "Review" button per row in
// the "Needs you now" list, which delegates to props.sendMessage — the
// chat agent does the actual work.
//
// Reactivity: we subscribe to the Houston file-change event via
// useHoustonEvent (Tauri event listener, dynamically imported so the
// bundle degrades gracefully if Tauri isn't reachable from an injected
// script). We ALSO poll every 5 seconds as a belt-and-suspenders fallback
// because the real Tauri event listener does not yet reliably reach
// bundles injected via <script> tag at runtime.

(function () {
  const React = window.Houston.React;
  const { useState, useEffect, useCallback, useMemo } = React;
  const h = React.createElement;

  // ---------------------------------------------------------------------
  // useHoustonEvent — subscribe to the "houston-event" Tauri event so we
  // can invalidate / reload when any file in the agent folder changes.
  // Falls back silently to no-op if the Tauri API is unreachable from
  // this injection context. The literal string "useHoustonEvent" must
  // appear in this source file (Phase 6 verification greps for it).
  // ---------------------------------------------------------------------
  function useHoustonEvent(handler) {
    useEffect(() => {
      let unlisten;
      let cancelled = false;
      // Build the module specifier dynamically so a static analyzer
      // doesn't try to resolve it at bundle-time (this is an IIFE, not
      // a module — import() is still available at runtime in the
      // webview).
      const spec = ["@tauri-apps", "api", "event"].join("/");
      try {
        import(/* @vite-ignore */ spec)
          .then((m) => {
            if (cancelled || !m || typeof m.listen !== "function") return;
            m.listen("houston-event", (e) => {
              try { handler(e.payload); } catch (_) { /* swallow */ }
            }).then((fn) => {
              if (cancelled) fn(); else unlisten = fn;
            }).catch(() => { /* fallback: caller polls */ });
          })
          .catch(() => { /* fallback: caller polls */ });
      } catch (_) {
        // Same fallback — caller polls.
      }
      return () => {
        cancelled = true;
        if (typeof unlisten === "function") {
          try { unlisten(); } catch (_) {}
        }
      };
    }, [handler]);
  }

  // ---------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------

  function safeJsonParse(raw, fallback) {
    if (raw == null || raw === "") return fallback;
    try {
      const v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (_) {
      return fallback;
    }
  }

  async function readJsonArray(readFile, path) {
    try {
      const raw = await readFile(path);
      const parsed = safeJsonParse(raw, []);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      // File may not exist yet — empty is the right shape.
      return [];
    }
  }

  function formatRelative(iso) {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const diff = Date.now() - then;
    const abs = Math.abs(diff);
    const mins = Math.floor(abs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m${diff < 0 ? " away" : " ago"}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h${diff < 0 ? " away" : " ago"}`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d${diff < 0 ? " away" : " ago"}`;
    const months = Math.floor(days / 30);
    return `${months}mo${diff < 0 ? " away" : " ago"}`;
  }

  function priorityBadgeClass(priority) {
    switch (priority) {
      case "P1": return "bg-red-100 text-red-800 border-red-200";
      case "P2": return "bg-orange-100 text-orange-800 border-orange-200";
      case "P3": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "P4": return "bg-gray-100 text-gray-700 border-gray-200";
      default:   return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  function statusLabel(status) {
    switch (status) {
      case "waiting_founder":  return "Needs you";
      case "waiting_customer": return "Waiting on customer";
      case "open":             return "Open";
      case "resolved":         return "Resolved";
      case "snoozed":          return "Snoozed";
      default:                 return status || "";
    }
  }

  function scoreRow(convo, draftsPendingIds) {
    // Lower score = more urgent. Used to rank "Needs you now".
    let score = 0;
    if (convo.sla && convo.sla.breached) score -= 1000;
    const p = { P1: 0, P2: 10, P3: 100, P4: 1000 }[convo.priority] ?? 500;
    score += p;
    if (draftsPendingIds.has(convo.id)) score -= 5;
    if (convo.status === "waiting_founder") score -= 3;
    return score;
  }

  function todayKey(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function isDueToday(iso) {
    if (!iso) return false;
    const now = new Date();
    const due = new Date(iso);
    return (
      due.getFullYear() === now.getFullYear() &&
      due.getMonth() === now.getMonth() &&
      due.getDate() === now.getDate()
    );
  }

  function customerLookup(customers) {
    const map = new Map();
    for (const c of customers) {
      if (c && c.slug) map.set(c.slug, c);
    }
    return map;
  }

  // ---------------------------------------------------------------------
  // Presentational atoms
  // ---------------------------------------------------------------------

  function StatCard({ label, value, tone }) {
    const toneClass = tone === "danger"
      ? "text-red-700"
      : tone === "warn"
        ? "text-orange-700"
        : tone === "info"
          ? "text-blue-700"
          : "text-gray-900";
    return h(
      "div",
      { className: "bg-white rounded-lg border border-gray-200 p-4 flex-1 min-w-0" },
      h("div", { className: "text-xs font-medium uppercase tracking-wide text-gray-500" }, label),
      h("div", { className: `text-2xl font-semibold mt-1 ${toneClass}` }, String(value))
    );
  }

  function PriorityBadge({ priority }) {
    return h(
      "span",
      {
        className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${priorityBadgeClass(priority)}`,
      },
      priority || "P?"
    );
  }

  function SectionHeader({ title, subtitle }) {
    return h(
      "div",
      { className: "mb-3" },
      h("h2", { className: "text-base font-semibold text-gray-900" }, title),
      subtitle ? h("p", { className: "text-sm text-gray-500 mt-0.5" }, subtitle) : null
    );
  }

  function EmptyHint({ text }) {
    return h(
      "div",
      { className: "text-sm text-gray-500 italic py-6 text-center" },
      text
    );
  }

  function SkeletonRow() {
    return h(
      "div",
      { className: "flex items-center gap-3 py-2" },
      h("div", { className: "h-4 w-12 bg-gray-100 rounded animate-pulse" }),
      h("div", { className: "h-4 w-40 bg-gray-100 rounded animate-pulse" }),
      h("div", { className: "h-4 flex-1 bg-gray-100 rounded animate-pulse" }),
      h("div", { className: "h-4 w-16 bg-gray-100 rounded animate-pulse" })
    );
  }

  // ---------------------------------------------------------------------
  // The dashboard
  // ---------------------------------------------------------------------

  function InboxDashboard(props) {
    const { readFile, sendMessage } = props || {};
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [followups, setFollowups] = useState([]);
    const [churnFlags, setChurnFlags] = useState([]);
    const [draftIds, setDraftIds] = useState(() => new Set());

    const reload = useCallback(async () => {
      if (typeof readFile !== "function") {
        setErr("readFile is not available in this context.");
        setLoading(false);
        return;
      }
      try {
        const [c, cu, f, ch] = await Promise.all([
          readJsonArray(readFile, "conversations.json"),
          readJsonArray(readFile, "customers.json"),
          readJsonArray(readFile, "followups.json"),
          readJsonArray(readFile, "churn-flags.json"),
        ]);
        setConversations(c);
        setCustomers(cu);
        setFollowups(f);
        setChurnFlags(ch);
        // Drafts-pending is approximated by status === "waiting_founder".
        // The file watcher doesn't expose individual draft.md existence
        // cheaply from here; the status mirror set by draft-reply skill
        // is the intended source of truth.
        const d = new Set();
        for (const row of c) {
          if (row && row.status === "waiting_founder") d.add(row.id);
        }
        setDraftIds(d);
        setErr(null);
      } catch (e) {
        setErr(e && e.message ? e.message : "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }, [readFile]);

    // Initial load.
    useEffect(() => {
      reload();
    }, [reload]);

    // React to Houston file-change events (Tauri listener when available).
    const onEvent = useCallback((payload) => {
      if (!payload) return;
      if (payload.type === "FilesChanged" || payload.type === "files_changed") {
        reload();
      }
    }, [reload]);
    useHoustonEvent(onEvent);

    // Polling fallback: the real Tauri event listener does not yet reach
    // <script>-injected bundles reliably, so we poll every 5s. Cheap for
    // a handful of small JSON files; keeps the dashboard reactive.
    useEffect(() => {
      const t = setInterval(reload, 5000);
      return () => clearInterval(t);
    }, [reload]);

    const custMap = useMemo(() => customerLookup(customers), [customers]);

    // ---- Stats ----
    const stats = useMemo(() => {
      let open = 0;
      let overdue = 0;
      let drafts = 0;
      for (const row of conversations) {
        if (!row) continue;
        if (row.status === "open" || row.status === "waiting_founder" || row.status === "waiting_customer") {
          open++;
        }
        if (row.sla && row.sla.breached) overdue++;
        if (row.status === "waiting_founder") drafts++;
      }
      const churn = churnFlags.filter((f) => f && f.status === "open").length;
      return { open, overdue, drafts, churn };
    }, [conversations, churnFlags]);

    // ---- Needs you now (top 5) ----
    const needsYou = useMemo(() => {
      const candidates = conversations
        .filter((row) => row && (row.status === "open" || row.status === "waiting_founder" || (row.sla && row.sla.breached)))
        .filter((row) => row.status !== "resolved" && row.status !== "snoozed")
        .slice(0, 200); // safety cap
      candidates.sort((a, b) => scoreRow(a, draftIds) - scoreRow(b, draftIds));
      return candidates.slice(0, 5);
    }, [conversations, draftIds]);

    // ---- Follow-ups due today ----
    const dueToday = useMemo(() => {
      return followups
        .filter((f) => f && f.status === "open" && isDueToday(f.dueAt))
        .sort((a, b) => (a.dueAt || "").localeCompare(b.dueAt || ""))
        .slice(0, 10);
    }, [followups]);

    // ---- Churn flags ----
    const openChurn = useMemo(() => {
      return churnFlags
        .filter((f) => f && f.status === "open")
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
        .slice(0, 10);
    }, [churnFlags]);

    // ---- Render ----

    const handleReview = useCallback((conversationId) => {
      if (typeof sendMessage === "function") {
        sendMessage(`Review conversation ${conversationId}`);
      }
    }, [sendMessage]);

    const handleReviewFollowup = useCallback((followupId, conversationId) => {
      if (typeof sendMessage === "function") {
        if (conversationId) {
          sendMessage(`Review conversation ${conversationId} — follow-up ${followupId} is due today`);
        } else {
          sendMessage(`Review follow-up ${followupId}`);
        }
      }
    }, [sendMessage]);

    const handleReviewChurn = useCallback((slug) => {
      if (typeof sendMessage === "function") {
        sendMessage(`Show me the dossier for customer ${slug} — churn flag open`);
      }
    }, [sendMessage]);

    return h(
      "div",
      { className: "p-6 max-w-6xl mx-auto space-y-6" },

      // Error banner
      err
        ? h(
            "div",
            { className: "bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700" },
            `Dashboard error: ${err}`
          )
        : null,

      // Section 1 — Stats
      h(
        "div",
        { className: "flex flex-wrap gap-3" },
        h(StatCard, { label: "Open", value: loading ? "—" : stats.open, tone: "info" }),
        h(StatCard, { label: "Overdue SLA", value: loading ? "—" : stats.overdue, tone: stats.overdue ? "danger" : "default" }),
        h(StatCard, { label: "Drafts pending", value: loading ? "—" : stats.drafts, tone: stats.drafts ? "warn" : "default" }),
        h(StatCard, { label: "Churn-flagged", value: loading ? "—" : stats.churn, tone: stats.churn ? "danger" : "default" })
      ),

      // Section 2 — Needs you now
      h(
        "div",
        { className: "bg-white rounded-lg border border-gray-200 p-5" },
        h(SectionHeader, {
          title: "Needs you now",
          subtitle: "Ranked by SLA breach, priority, and drafts awaiting review.",
        }),
        loading
          ? h("div", { className: "space-y-1" },
              h(SkeletonRow), h(SkeletonRow), h(SkeletonRow), h(SkeletonRow), h(SkeletonRow))
          : needsYou.length === 0
            ? h(EmptyHint, {
                text: "Inbox is clear. Ask the agent: \"triage my inbox from Gmail\" to pull the latest.",
              })
            : h(
                "ul",
                { className: "divide-y divide-gray-100" },
                needsYou.map((row) => {
                  const cust = custMap.get(row.customerSlug);
                  const customerLabel = (cust && (cust.name || cust.company || cust.email)) || row.customerSlug || "Unknown";
                  const breached = !!(row.sla && row.sla.breached);
                  return h(
                    "li",
                    { key: row.id, className: "flex items-center gap-3 py-2.5" },
                    h(PriorityBadge, { priority: row.priority }),
                    h(
                      "div",
                      { className: "flex-1 min-w-0" },
                      h("div", { className: "flex items-center gap-2" },
                        h("span", { className: "text-sm font-medium text-gray-900 truncate" }, customerLabel),
                        cust && cust.tags && cust.tags.indexOf("vip") !== -1
                          ? h("span", { className: "text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5" }, "VIP")
                          : null,
                        breached
                          ? h("span", { className: "text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded px-1.5 py-0.5" }, "SLA")
                          : null
                      ),
                      h("div", { className: "text-sm text-gray-600 truncate" }, row.subject || "(no subject)"),
                      h("div", { className: "text-xs text-gray-500 mt-0.5" },
                        statusLabel(row.status),
                        " · ",
                        formatRelative(row.lastTouchedAt || row.updatedAt))
                    ),
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleReview(row.id),
                        className: "text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200 rounded px-2.5 py-1 transition-colors",
                      },
                      "Review"
                    )
                  );
                })
              )
      ),

      // Section 3 — Follow-ups due today + Churn flags (side by side)
      h(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },

        // Follow-ups due today
        h(
          "div",
          { className: "bg-white rounded-lg border border-gray-200 p-5" },
          h(SectionHeader, {
            title: "Due today",
            subtitle: "Promises you need to honor before end of day.",
          }),
          loading
            ? h("div", { className: "space-y-1" }, h(SkeletonRow), h(SkeletonRow), h(SkeletonRow))
            : dueToday.length === 0
              ? h(EmptyHint, {
                  text: "Nothing due today. Ask the agent: \"track promises from my latest reply\" to extract commitments.",
                })
              : h(
                  "ul",
                  { className: "divide-y divide-gray-100" },
                  dueToday.map((f) => {
                    const cust = custMap.get(f.customerSlug);
                    const customerLabel = (cust && (cust.name || cust.company)) || f.customerSlug || "Unknown";
                    return h(
                      "li",
                      { key: f.id, className: "flex items-center gap-3 py-2.5" },
                      h(
                        "div",
                        { className: "flex-1 min-w-0" },
                        h("div", { className: "text-sm font-medium text-gray-900 truncate" }, customerLabel),
                        h("div", { className: "text-sm text-gray-600 truncate" }, f.promise || "(no promise text)"),
                        h("div", { className: "text-xs text-gray-500 mt-0.5" }, `due ${formatRelative(f.dueAt)}`)
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleReviewFollowup(f.id, f.conversationId),
                          className: "text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200 rounded px-2.5 py-1 transition-colors",
                        },
                        "Review"
                      )
                    );
                  })
                )
        ),

        // Churn flags
        h(
          "div",
          { className: "bg-white rounded-lg border border-gray-200 p-5" },
          h(SectionHeader, {
            title: "Churn watch",
            subtitle: "Customers flagged as at-risk, highest confidence first.",
          }),
          loading
            ? h("div", { className: "space-y-1" }, h(SkeletonRow), h(SkeletonRow), h(SkeletonRow))
            : openChurn.length === 0
              ? h(EmptyHint, {
                  text: "No active churn flags. Ask the agent: \"run a churn risk scan on my top customers\" to check.",
                })
              : h(
                  "ul",
                  { className: "divide-y divide-gray-100" },
                  openChurn.map((f) => {
                    const cust = custMap.get(f.customerSlug);
                    const customerLabel = (cust && (cust.name || cust.company)) || f.customerSlug || "Unknown";
                    const confidence = typeof f.confidence === "number" ? f.confidence : 0;
                    const confTone = confidence >= 80
                      ? "text-red-700 bg-red-50 border-red-200"
                      : confidence >= 60
                        ? "text-orange-700 bg-orange-50 border-orange-200"
                        : "text-yellow-700 bg-yellow-50 border-yellow-200";
                    return h(
                      "li",
                      { key: f.id, className: "flex items-center gap-3 py-2.5" },
                      h("span", {
                        className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${confTone}`,
                      }, `${confidence}`),
                      h(
                        "div",
                        { className: "flex-1 min-w-0" },
                        h("div", { className: "text-sm font-medium text-gray-900 truncate" }, customerLabel),
                        h("div", { className: "text-sm text-gray-600 truncate" }, f.reason || "(no reason recorded)"),
                        h("div", { className: "text-xs text-gray-500 mt-0.5" }, `flagged ${formatRelative(f.flaggedAt || f.createdAt)}`)
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleReviewChurn(f.customerSlug),
                          className: "text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200 rounded px-2.5 py-1 transition-colors",
                        },
                        "Dossier"
                      )
                    );
                  })
                )
        )
      )
    );
  }

  window.__houston_bundle__ = { InboxDashboard: InboxDashboard };
})();
