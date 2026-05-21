# Quick Start

> **v0.1 — Design Blueprint.** This guide documents the intended architecture and workflow. No pipeline execution, state management, or LLM integration is implemented yet.

This guide walks through the intended CrewGate workflow — from feature declaration to pipeline execution.

## 1. Declare a feature

```sh
crewgate feat new "Add user authentication with OIDC"
```

The intended behavior: would create a feature slug, a feature branch `feat/<slug>`, and a state file `.crewgate/state/<slug>.json`. Currently prints "not yet implemented".

## 2. Check the classification

```sh
crewgate status <slug>
```

Designed to show the current pipeline state, including the level and flow classification assigned by the Dynamic Router. Currently prints "not yet implemented".

## 3. Run the pipeline

```sh
crewgate run <slug>
```

Designed to execute gates in sequence, based on the classified level:

| Level | Gates | Use case |
|-------|-------|----------|
| 0 | Commit direct | Typo, doc fix, <50 words |
| 1 (bugfix) | CEO → Dev → QA → Release | Rename, bump, config change |
| 2 (default) | CEO → CTO → TechLead → Dev → QA → Release | New endpoint, small feature |
| 3-4 | CEO → CTO → TechLead → Dev → QA → Security → Release | Migration, auth, architecture |

Each gate is intended to produce artifacts in `.crewgate/artifacts/<slug>/<gate>/`.

## Intended output example

Once implemented, a full pipeline run will look like:

```
# Declare
crewgate feat new "Add rate limiting to API gateway"

# Check classification (Level 2, feature flow)
crewgate status api-rate-limiting

# Execute pipeline
crewgate run api-rate-limiting

# Output:
# [CEO]      PASS — business case validated
# [CTO]      PASS — architecture approved, ADR written
# [TechLead] PASS — tech spec produced, 3 tasks defined
# [Dev]      PASS — implementation complete, 3 commits
# [QA]       PASS — all tests pass, coverage 92%
# [Release]  SHIP — all gates passed, safe to ship
```

## Gate roles (defined in personas/)

| Gate | Role | Mode | Output format |
|------|------|------|---------------|
| **CEO** | Business case & prioritization | READ-only | `business.yaml` (GO/NO-GO) |
| **CTO** | Architecture & ADR | READ-only | `adr.md` (architecture decisions) |
| **TechLead** | Tech spec & task breakdown | READ-only | `techspec.yaml` (tasks, modules) |
| **Developer** | Implementation | WRITE (code) | Git commits |
| **QA** | Test validation | READ-only | `qa_report.yaml` (PASS/FAIL) |
| **Security** | Security audit | READ-only | `security_report.yaml` (SECURE/BLOCKED) |
| **Release** | Release readiness | READ-only | `release_report.yaml` (SHIP/BLOCK) |

## Next steps

→ [CLI Reference](cli.md)
→ [Pipeline & Gates](pipeline.md)
→ [Personas](personas.md)

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
