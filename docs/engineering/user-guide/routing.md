# Routing: Levels & Flows

> **v0.1 — Design Blueprint.** This documents the intended routing design. The Dynamic Router, Cupcake policies, and classification engine have not been implemented yet.

The **Dynamic Pipeline Router** is designed to classify each feature request by level of complexity and flow type, then select the minimal gate sequence required.

Routing is designed to be **deterministic** — same inputs always produce the same classification.

## Levels (design)

| Level | Criteria | Intended gates | Example |
|-------|----------|----------------|---------|
| **0** | `.md` only AND description < 50 words | Commit direct | Typo fix in docs |
| **1** | Title matches `/(typo\|rename\|bump)/` | CEO → Dev → QA → Release | Dependency bump, config rename |
| **2** | DEFAULT | CEO → CTO → TechLead → Dev → QA → Release | New API endpoint, small feature |
| **3** | Title matches `/(migration\|auth\|database)/` | CEO → CTO → TL → Dev → QA → Sec → Release | Database migration, auth integration |
| **4** | Title matches `/(architecture\|rewrite)/` | Full pipeline + ADR forced | Module rewrite, architecture change |

### Auto-escalation (design)

- If the description contains Level 3-4 keywords, the level auto-bumps by 1
- If a flow is detected but the level is too low for that flow, auto-bump to the minimum level for that flow

### Safety net (design)

Any gate can emit a `complexity_override` that triggers reclassification of the current feature.

## Flows

Flows define the composition of gates beyond what level alone provides:

| Flow | Detection | Levels | Description |
|------|-----------|--------|-------------|
| **bugfix** | Title matches `/(fix\|bug\|hotfix\|regression)/` | 1-2 | Quick fix pipeline |
| **feature** | DEFAULT | 2-4 | Standard feature pipeline |
| **structural** | Title matches `/(architecture\|rewrite\|migration\|module)/` | 3-4 | Full pipeline with ADR |
| **security** | Title matches `/(auth\|vulnerability\|cve\|security)/` | 3-4 | Full pipeline with security veto |

## Classification engine (design)

Classification is designed to use **Cupcake** (Rego policies compiled to WebAssembly):

```
Phase 1 (deterministic, ~1ms):
  Cupcake Rego policy analyzes title + description → (level, flow)

Phase 2 (fuzzy escalation):
  IF description contains Level 3-4 keyword → auto-bump
  IF flow detected but level too low → auto-bump to minimum level for flow

Safety net:
  Any gate can emit complexity_override → reclassification
```

## Example classifications

| Description | Level | Flow | Gates |
|-------------|-------|------|-------|
| "Fix typo in README" | 0 | — | Commit direct |
| "Bump lodash to 4.17.21" | 1 | bugfix | CEO → Dev → QA → Release |
| "Add /users endpoint" | 2 | feature | CEO → CTO → TL → Dev → QA → Release |
| "Migrate PostgreSQL 15" | 3 | structural | Full pipeline |
| "OIDC authentication" | 3 | security | Full pipeline |
| "Rewrite module X" | 4 | structural | Full pipeline + ADR |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
