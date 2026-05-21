# Architecture Assumptions

| ID | Assumption | Rationale | Impact |
|----|------------|-----------|--------|
| A-01 | LLM Availability | OpenCode's LLM infrastructure is available and responsive during gate execution. | High (all gates) |
| A-02 | Deterministic Routing | Cupcake/Rego policy evaluation is deterministic and sufficient for Level+Flow classification. | Critical (Router) |
| A-04 | Gate Isolation Sufficient | Scoped IArtifactPort prevents all unauthorized filesystem access. | Critical (Security) |
| A-05 | Single-Project Scope | CrewGate runs one pipeline per feature in a single repository. | Medium (State) |
| A-06 | OpenCode Plugin Interface | `.opencode/plugins/crewgate.json` is sufficient for OpenCode integration. | Low (Plugin) |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||