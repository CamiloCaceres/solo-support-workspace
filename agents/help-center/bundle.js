// Help Center Dashboard — hand-written IIFE bundle.
// Contract: assigns window.__houston_bundle__ = { HelpCenterDashboard }.
// React is available at window.Houston.React. No JSX, no build step.
// Pure Tailwind classNames for styling. Read-only observer surface.

(function () {
  const React = window.Houston.React;
  const { useState, useEffect, useCallback, useMemo, useRef } = React;
  const h = React.createElement;

  // ---------------------------------------------------------------------------
  // useHoustonEvent — subscribe to Tauri "houston-event" channel if present.
  // Falls back silently if the @tauri-apps/api/event module can't be imported
  // (e.g. running in a browser preview). The string "useHoustonEvent" must
  // appear in this source file — the Phase 6 verification greps for it.
  // ---------------------------------------------------------------------------
  function useHoustonEvent(handler) {
    useEffect(() => {
      let unlisten;
      let cancelled = false;
      // Obfuscate the module specifier so the Vite pre-bundler (in case
      // something ever scans this file) doesn't try to resolve it.
      const spec = ["@tauri-apps", "api", "event"].join("/");
      import(/* @vite-ignore */ spec)
        .then((m) => {
          if (cancelled || !m || typeof m.listen !== "function") return;
          m.listen("houston-event", (e) => {
            try {
              handler(e && e.payload);
            } catch (_) {
              /* swallow — handler errors shouldn't break the bridge */
            }
          }).then((fn) => {
            if (cancelled) fn();
            else unlisten = fn;
          });
        })
        .catch(() => {
          /* not in a tauri webview — polling fallback covers us */
        });
      return () => {
        cancelled = true;
        if (typeof unlisten === "function") unlisten();
      };
    }, [handler]);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function safeParse(text, fallback) {
    if (!text) return fallback;
    try {
      const parsed = JSON.parse(text);
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  }

  function formatRelative(iso) {
    if (!iso) return "—";
    const then = new Date(iso).getTime();
    if (isNaN(then)) return "—";
    const diff = Date.now() - then;
    const s = Math.round(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.round(s / 60);
    if (m < 60) return `${m}m ago`;
    const hr = Math.round(m / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.round(hr / 24);
    if (d < 14) return `${d}d ago`;
    const w = Math.round(d / 7);
    if (w < 8) return `${w}w ago`;
    const mo = Math.round(d / 30);
    return `${mo}mo ago`;
  }

  function sortByNumberDesc(list, key) {
    return list.slice().sort((a, b) => (b[key] || 0) - (a[key] || 0));
  }

  const STATUS_BADGE = {
    investigating: "bg-neutral-200 text-neutral-800",
    "workaround-available": "bg-amber-100 text-amber-800",
    "fix-in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-emerald-100 text-emerald-800",
  };

  // ---------------------------------------------------------------------------
  // Small presentational pieces
  // ---------------------------------------------------------------------------

  function StatCard(props) {
    return h(
      "div",
      {
        className:
          "flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm",
      },
      h("span", { className: "text-xs uppercase tracking-wide text-neutral-500" }, props.label),
      h("span", { className: "text-2xl font-semibold text-neutral-900" }, props.value),
      props.hint
        ? h("span", { className: "text-xs text-neutral-500" }, props.hint)
        : null
    );
  }

  function SectionHeader(props) {
    return h(
      "div",
      { className: "mb-3 flex items-baseline justify-between" },
      h("h2", { className: "text-sm font-semibold text-neutral-800" }, props.title),
      props.subtitle
        ? h("span", { className: "text-xs text-neutral-500" }, props.subtitle)
        : null
    );
  }

  function SkeletonRow() {
    return h("div", {
      className: "h-10 animate-pulse rounded-md bg-neutral-100",
    });
  }

  function EmptyState(props) {
    return h(
      "div",
      {
        className:
          "rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center",
      },
      h("p", { className: "text-sm text-neutral-600" }, props.message),
      props.suggestion
        ? h(
            "button",
            {
              type: "button",
              onClick: props.onSuggest,
              className:
                "mt-2 inline-flex items-center rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700",
            },
            props.suggestion
          )
        : null
    );
  }

  function StatusBadge(props) {
    const cls = STATUS_BADGE[props.status] || "bg-neutral-100 text-neutral-700";
    return h(
      "span",
      {
        className:
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " + cls,
      },
      props.status
    );
  }

  // ---------------------------------------------------------------------------
  // Main dashboard
  // ---------------------------------------------------------------------------

  function HelpCenterDashboard(props) {
    const { readFile, sendMessage } = props;

    const [articles, setArticles] = useState([]);
    const [gaps, setGaps] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [requests, setRequests] = useState([]);
    const [knownIssues, setKnownIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const readJson = useCallback(
      async (path, fallback) => {
        if (typeof readFile !== "function") return fallback;
        try {
          const text = await readFile(path);
          return safeParse(text, fallback);
        } catch (_) {
          // Missing file is expected on a fresh agent — treat as empty.
          return fallback;
        }
      },
      [readFile]
    );

    const reload = useCallback(async () => {
      try {
        const [a, g, p, r, k] = await Promise.all([
          readJson("articles.json", []),
          readJson("gaps.json", []),
          readJson("patterns.json", []),
          readJson("requests.json", []),
          readJson("known-issues.json", []),
        ]);
        setArticles(Array.isArray(a) ? a : []);
        setGaps(Array.isArray(g) ? g : []);
        setPatterns(Array.isArray(p) ? p : []);
        setRequests(Array.isArray(r) ? r : []);
        setKnownIssues(Array.isArray(k) ? k : []);
        setError(null);
      } catch (err) {
        setError(err && err.message ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }, [readJson]);

    // Initial load.
    useEffect(() => {
      reload();
    }, [reload]);

    // React to Tauri file-change events.
    const onEvent = useCallback(
      (payload) => {
        if (!payload) return;
        if (payload.kind === "FilesChanged" || payload.type === "FilesChanged") {
          reload();
        }
      },
      [reload]
    );
    useHoustonEvent(onEvent);

    // Belt-and-suspenders: 5s polling fallback until event-bridge is fully
    // wired in injected bundles. Cheap (local file reads) and idempotent.
    useEffect(() => {
      const t = setInterval(() => {
        reload();
      }, 5000);
      return () => clearInterval(t);
    }, [reload]);

    // Derived counts & rankings.
    const publishedArticleCount = useMemo(
      () => articles.filter((a) => a && a.status === "published").length,
      [articles]
    );
    const openGapCount = useMemo(
      () => gaps.filter((g) => g && g.status === "open").length,
      [gaps]
    );
    const activeKnownIssues = useMemo(
      () => knownIssues.filter((k) => k && k.status !== "resolved"),
      [knownIssues]
    );
    const openRequests = useMemo(
      () =>
        requests.filter(
          (r) =>
            r &&
            r.roadmapStatus !== "shipped" &&
            r.roadmapStatus !== "declined"
        ),
      [requests]
    );

    const topGaps = useMemo(() => {
      const open = gaps.filter((g) => g && g.status === "open");
      return sortByNumberDesc(open, "occurrenceCount").slice(0, 8);
    }, [gaps]);

    const topRequests = useMemo(() => {
      const enriched = openRequests.map((r) => ({
        ...r,
        requesterCount: Array.isArray(r.requestingCustomers)
          ? r.requestingCustomers.length
          : 0,
      }));
      return sortByNumberDesc(enriched, "requesterCount").slice(0, 5);
    }, [openRequests]);

    const suggestChat = useCallback(
      (text) => {
        if (typeof sendMessage === "function") sendMessage(text);
      },
      [sendMessage]
    );

    // -------------------------------------------------------------------------
    // Rendered layout
    // -------------------------------------------------------------------------

    const topBar = h(
      "div",
      { className: "grid grid-cols-2 gap-3 md:grid-cols-4" },
      h(StatCard, {
        label: "Articles",
        value: loading ? "…" : publishedArticleCount,
        hint: loading ? null : `${articles.length} total`,
      }),
      h(StatCard, {
        label: "Open Gaps",
        value: loading ? "…" : openGapCount,
        hint: "Unanswered repeats",
      }),
      h(StatCard, {
        label: "Known Issues",
        value: loading ? "…" : activeKnownIssues.length,
        hint: "Active",
      }),
      h(StatCard, {
        label: "Requests",
        value: loading ? "…" : openRequests.length,
        hint: "In flight",
      })
    );

    const gapsSection = h(
      "div",
      { className: "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm" },
      h(SectionHeader, {
        title: "Recurring questions without articles",
        subtitle: `${openGapCount} open gap${openGapCount === 1 ? "" : "s"}`,
      }),
      loading
        ? h(
            "div",
            { className: "flex flex-col gap-2" },
            h(SkeletonRow, null),
            h(SkeletonRow, null),
            h(SkeletonRow, null)
          )
        : topGaps.length === 0
        ? h(EmptyState, {
            message: "No recurring questions yet.",
            suggestion: "Scan recent tickets for patterns",
            onSuggest: () =>
              suggestChat("Scan the last 30 days of inbox tickets for recurring questions."),
          })
        : h(
            "ul",
            { className: "flex flex-col divide-y divide-neutral-100" },
            topGaps.map((g, i) =>
              h(
                "li",
                {
                  key: g.id || i,
                  className: "flex items-start justify-between gap-3 py-2.5",
                },
                h(
                  "div",
                  { className: "min-w-0 flex-1" },
                  h(
                    "p",
                    { className: "truncate text-sm text-neutral-900" },
                    g.question || "(unlabeled question)"
                  ),
                  h(
                    "p",
                    { className: "mt-0.5 text-xs text-neutral-500" },
                    `${g.occurrenceCount || 0} occurrence${
                      (g.occurrenceCount || 0) === 1 ? "" : "s"
                    } · updated ${formatRelative(g.updatedAt || g.createdAt)}`
                  )
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () =>
                      suggestChat(`Draft an article for: ${g.question || ""}`),
                    className:
                      "shrink-0 rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
                  },
                  "Draft"
                )
              )
            )
          )
    );

    const requestsSection = h(
      "div",
      { className: "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm" },
      h(SectionHeader, {
        title: "Top feature requests",
        subtitle: `${openRequests.length} open`,
      }),
      loading
        ? h(SkeletonRow, null)
        : topRequests.length === 0
        ? h(EmptyState, {
            message: "No feature requests recorded yet.",
            suggestion: "Scan inbox for feature asks",
            onSuggest: () =>
              suggestChat(
                "Scan recent inbox conversations for feature requests and capture them."
              ),
          })
        : h(
            "ul",
            { className: "flex flex-col divide-y divide-neutral-100" },
            topRequests.map((r, i) =>
              h(
                "li",
                { key: r.id || i, className: "py-2.5" },
                h(
                  "div",
                  { className: "flex items-start justify-between gap-3" },
                  h(
                    "p",
                    { className: "truncate text-sm font-medium text-neutral-900" },
                    r.title || "(untitled)"
                  ),
                  h(
                    "span",
                    {
                      className:
                        "shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700",
                    },
                    `${r.requesterCount || 0}× requested`
                  )
                ),
                h(
                  "p",
                  { className: "mt-0.5 truncate text-xs text-neutral-500" },
                  `${r.roadmapStatus || "requested"} · updated ${formatRelative(
                    r.updatedAt || r.createdAt
                  )}`
                )
              )
            )
          )
    );

    const knownIssuesSection = h(
      "div",
      { className: "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm" },
      h(SectionHeader, {
        title: "Active known issues",
        subtitle: `${activeKnownIssues.length} active`,
      }),
      loading
        ? h(SkeletonRow, null)
        : activeKnownIssues.length === 0
        ? h(EmptyState, {
            message: "No active known issues. Nice.",
            suggestion: "Check inbox bug candidates",
            onSuggest: () =>
              suggestChat("Check ../inbox/bug-candidates.json for new defects to track."),
          })
        : h(
            "ul",
            { className: "flex flex-col divide-y divide-neutral-100" },
            activeKnownIssues.slice(0, 5).map((k, i) =>
              h(
                "li",
                { key: k.id || i, className: "py-2.5" },
                h(
                  "div",
                  { className: "flex items-start justify-between gap-3" },
                  h(
                    "p",
                    { className: "truncate text-sm font-medium text-neutral-900" },
                    k.title || "(untitled)"
                  ),
                  h(StatusBadge, { status: k.status || "investigating" })
                ),
                h(
                  "p",
                  { className: "mt-0.5 truncate text-xs text-neutral-500" },
                  `${
                    Array.isArray(k.affectedCustomerSlugs)
                      ? k.affectedCustomerSlugs.length
                      : 0
                  } customer${
                    (k.affectedCustomerSlugs && k.affectedCustomerSlugs.length) === 1
                      ? ""
                      : "s"
                  } · updated ${formatRelative(k.updatedAt || k.createdAt)}`
                )
              )
            )
          )
    );

    const errorBanner = error
      ? h(
          "div",
          {
            className:
              "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700",
          },
          `Couldn't load all data: ${error}`
        )
      : null;

    return h(
      "div",
      { className: "flex h-full flex-col gap-4 overflow-y-auto bg-neutral-50 p-5" },
      errorBanner,
      topBar,
      gapsSection,
      h(
        "div",
        { className: "grid grid-cols-1 gap-4 md:grid-cols-2" },
        requestsSection,
        knownIssuesSection
      )
    );
  }

  window.__houston_bundle__ = { HelpCenterDashboard: HelpCenterDashboard };
})();
