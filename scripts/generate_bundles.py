#!/usr/bin/env python3
"""Generate bundle.js per agent from the template + houston.json useCases.

Support workspace variant. Mirrors founder-marketing-workspace/scripts/.
Monochrome palette across all agents — no per-agent accent color, per
the "one palette for the whole vertical" rule in BUILDING-A-VERTICAL.md.
"""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BASE = REPO / "agents"
TEMPLATE = (Path(__file__).resolve().parent / "bundle_template.js").read_text()

# Ordered list of agents built in this workspace. Add entries as new
# agents ship.
AGENTS = [
    "head-of-support",
    "inbox",
    "help-center",
    "success",
]

TAGLINES = {
    "head-of-support": "Support context, voice calibration, escalation playbooks, the weekly review. I coordinate Inbox, Help Center, and Success through one shared support-context.md I own.",
    "inbox": "Triage inbound, draft replies in your voice, track promises, watch SLAs, catch bugs and churn signals. Drafts only — I never send.",
    "help-center": "Turn resolved tickets into articles, surface recurring questions, capture feature requests with attribution, broadcast ships, post the weekly digest.",
    "success": "Onboarding sequences, account health, renewal drafts, churn-save drafts, QBR prep, expansion nudges. Drafts only — I never send.",
}


def build_for(agent_id: str) -> tuple[str, int]:
    agent_dir = BASE / agent_id
    houston_json = json.loads((agent_dir / "houston.json").read_text())

    agent_config = {
        "name": houston_json["name"],
        "tagline": TAGLINES[agent_id],
        "useCases": houston_json.get("useCases", []),
    }

    injected = json.dumps(agent_config, indent=2, ensure_ascii=False)

    bundle_source = TEMPLATE.replace("{{AGENT_NAME}}", houston_json["name"])
    bundle_source = bundle_source.replace("{{AGENT_CONFIG}}", injected)

    target = agent_dir / "bundle.js"
    target.write_text(bundle_source)
    return str(target), len(bundle_source)


def verify(agent_id: str) -> bool:
    agent_dir = BASE / agent_id
    node_check = (
        "global.window={Houston:{React:{createElement:()=>null,"
        "useState:()=>[{idx:null,at:0},()=>{}],"
        "useEffect:()=>{},useCallback:f=>f}}};"
        "eval(require('fs').readFileSync('bundle.js','utf8'));"
        "console.log(Object.keys(window.__houston_bundle__));"
    )
    result = subprocess.run(
        ["node", "-e", node_check],
        cwd=agent_dir,
        capture_output=True,
        text=True,
    )
    ok = result.returncode == 0 and "Dashboard" in result.stdout
    status = "OK" if ok else "FAIL"
    print(f"  {status}  {result.stdout.strip() or result.stderr.strip()[:200]}")
    return ok


print("=== Generating bundle.js per agent (Solo Support Workspace) ===")
all_ok = True
for agent_id in AGENTS:
    agent_dir = BASE / agent_id
    if not (agent_dir / "houston.json").exists():
        print(f"\n{agent_id}: SKIP (no houston.json yet)")
        continue
    path, size = build_for(agent_id)
    print(f"\n{agent_id}: wrote {size:,} bytes")
    if not verify(agent_id):
        all_ok = False

print("\n=== Summary ===")
print("All bundles verified." if all_ok else "SOME BUNDLES FAILED VERIFICATION.")
sys.exit(0 if all_ok else 1)
