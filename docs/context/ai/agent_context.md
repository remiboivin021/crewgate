# AI Agent Context

## Gate Agents

| Gate | Role | Persona File | Behavior File |
|------|------|-------------|---------------|
| CEO | Business case, scope validation | `personas/ceo.md` | `behaviors/ceo.yaml` |
| CTO | Architecture + ADR gate | `personas/cto.md` | `behaviors/cto.yaml` |
| TechLead | Tech spec decomposition | `personas/techlead.md` | `behaviors/techlead.yaml` |
| Developer | Implementation + tests | `personas/developer.md` | `behaviors/developer.yaml` |
| QA | Test plan + validation | `personas/qa.md` | `behaviors/qa.yaml` |
| Security | SAST + threat model | `personas/security.md` | `behaviors/security.yaml` |
| Release | Changelog + deploy check | `personas/release.md` | `behaviors/release.yaml` |

## Adversarial Agents

| Adversary | Opposes | Role |
|-----------|---------|------|
| Business Skeptic | CEO | ROI, market timing, opportunity cost |
| Security Hawk | CTO | Threat model gaps, STRIDE |
| Pragmatist | TechLead | Over/under-engineering |
| Security Reviewer | Developer | Vulnerability in diff |

## Memory & State

- **Ephemeral Memory**: Per-gate context (cleared between gates)
- **Durable State**: `.crewgate/state/<slug>.json` (pipeline checkpoint)
- **Artifact Store**: `.crewgate/artifacts/<slug>/<gate>/` (gate outputs)

## Trust Boundaries

- **Gate Agents**: Can write only to their own artifact directory
- **Pipeline Manager**: Single writer to state file
- **Adversarial Agents**: Read-only — challenge upstream artifacts only
- **Human Operator**: Can invoke pipelines (operator CLI)

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||