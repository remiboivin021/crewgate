# Modularity Principles

## Principles

- **P-01: Hexagonal Isolation**: Domain logic has zero external dependencies. All I/O through port interfaces.
- **P-02: Deterministic Core**: Routing, state management, and artifact isolation are implemented in deterministic TypeScript, never in LLM prompts.
- **P-03: Gate Independence**: Each gate is functionally independent. Failure in one gate must not crash others.
- **P-04: Adapter Pluggability**: All external integrations (LLM, filesystem, git, Cupcake) are behind port interfaces with swappable adapters.
- **P-05: Single Responsibility**: Each domain module has exactly one reason to change (see module map).

## Module Map (v0.1)

```
src/domain/         # Pure logic — zero external deps
  GateOrchestrator  # Pipeline sequencing
  AgentRunner       # Persona + behavior injection
  StateManager      # State read/write
  DynamicRouter     # Level + flow classification

src/ports/          # Interface definitions
  inbound/          # ICommandPort, IConfigPort
  outbound/         # ILLMPort, IArtifactPort, IRouterPort

src/adapters/       # Implementations
  inbound/          # CLI adapter, config adapter
  outbound/         # LLM adapters, filesystem, git, Cupcake
```

## Invariants

- **I-CG-01**: Each gate writes only to `.crewgate/artifacts/<slug>/<gate>/`
- **I-CG-02**: State file is atomically written per gate completion
- **I-CG-03**: `crewgate run` is the sole entry point for pipeline execution

## Coupling Rules

- Domain → Ports (depends on): Domain imports port interfaces only
- Ports → Adapters (implemented by): Adapters implement port interfaces
- Domain → Adapters (never): Domain never imports adapters
- Adapters → External (depends on): Adapters wrap external libraries/APIs

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||