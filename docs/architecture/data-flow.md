# Data Flow

## Global Pipeline Flow

```text
[Feature Request] ───► [Cupcake Router] ───► [Level + Flow Classification]
                            │
                            ▼
                    [Gate Orchestrator]
                            │
                            ▼
                      [CEO Gate]
                            │
                            ▼
                      [CTO Gate]
                            │
                            ▼
                   [TechLead Gate]
                            │
                            ▼
                   [Developer Gate]
                            │
                            ▼
                       [QA Gate]
                            │
                            ▼
                   [Security Gate]  (Level 3-4 only)
                            │
                            ▼
                    [Release Gate]
                            │
                            ▼
                        [Commit]
```

## Detailed Gate Flow

1. **Input**: User runs `crewgate feat new "description"` (or direct `crewgate run <slug>`).
2. **Routing**: Cupcake evaluates Rego policy on title + description → returns (level, flow).
3. **Gate Execution**: Gate orchestrator iterates through required gates for the level/flow.
4. **Per Gate**:
   - AgentRunner loads persona + behavior for the gate.
   - AgentRunner calls ILLMPort with composed prompt.
   - Gate output is written to scoped artifact directory.
5. **Transition**: State checkpointed, next gate reads upstream artifacts.
6. **Completion**: State file updated, commit created (Developer gate).

## Artifact Flow

```text
CEO ──► .crewgate/artifacts/<slug>/ceo/business_case.yaml
CTO ──► .crewgate/artifacts/<slug>/cto/adr.yaml
TL  ──► .crewgate/artifacts/<slug>/techlead/tech_spec.yaml
Dev ──► .crewgate/artifacts/<slug>/developer/implementation.yaml
QA  ──► .crewgate/artifacts/<slug>/qa/report.yaml
Sec ──► .crewgate/artifacts/<slug>/security/report.yaml
Rel ──► .crewgate/artifacts/<slug>/release/checklist.yaml
```

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||