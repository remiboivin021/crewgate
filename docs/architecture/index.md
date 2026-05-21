# Architecture Index

Entry point for architecture documentation.

## Pages

### [overview.md](overview.md)

High-level architecture: hexagonal pattern, Dynamic Router (Cupcake/Rego), 7-gate pipeline, state & artifact management, CLI entry points.

### [assumptions.md](assumptions.md)

Design premises with ID, rationale, and impact level:

- **A-01** — LLM Availability (OpenCode infrastructure)
- **A-02** — Deterministic Routing (Cupcake/Rego)
- **A-04** — Gate Isolation Sufficient (scoped IArtifactPort)
- **A-05** — Single-Project Scope
- **A-06** — OpenCode Plugin Interface

### [system-boundaries.md](system-boundaries.md)

Trust boundaries and safety gates:

- **Internal (trusted)**: `.crewgate/state/`, `.crewgate/artifacts/`, config
- **External (untrusted)**: LLM providers, feature input, git operations
- **Safety gates**: Cupcake policy (input validation), scoped IArtifactPort (write isolation), Developer gate (commit scope)

### [interfaces.md](interfaces.md)

Internal port interfaces and external contracts:

- **Inbound ports**: ICommandPort (`run`, `status`), IConfigPort (`load`)
- **Outbound ports**: ILLMPort (`complete`), IArtifactPort (`write`/`read`/`list`), IRouterPort (`classify`)
- **External contracts**: Cupcake (Rego/Wasm), OpenCode LLM, POSIX filesystem, Git CLI
- **User interfaces**: CLI (`crewgate`), plugin manifest (`.opencode/plugins/crewgate.json`)

### [data-flow.md](data-flow.md)

Pipeline data flow:

- Global flow: Feature Request → Cupcake Router → Gate Orchestrator → 7 gates → Commit
- Per-gate flow: AgentRunner loads persona + behavior → calls ILLMPort → writes scoped artifact → state checkpoint
- Artifact paths per gate (`.crewgate/artifacts/<slug>/<gate>/`)

### [deployment.md](deployment.md)

Distribution and runtime:

- npm package, Bun 1.x runtime, Cupcake CLI, Git
- GitHub Actions CI with TypeScript strict check, Vitest, Sentrux quality gate
- Self-hosted (no cloud dependency), runs on workstation, CI runner, or build server

### [security-architecture.md](security-architecture.md)

Threat model, trust boundaries, filesystem isolation, key management, git safety, Cupcake policy sandbox:

- **Threats**: API key leak, gate scope violation, input poisoning, policy escape, supply chain
- **Mitigations**: env-only keys, scoped artifact port, Cupcake Wasm sandbox, pinned deps
- **Git safety**: no config modification, `crewgate/` tag namespace, Developer-only commits

### [modularity-principles.md](modularity-principles.md)

Five principles (P-01 through P-05):

- P-01: Hexagonal isolation (domain has zero external deps)
- P-02: Deterministic core (routing, state, isolation in TypeScript, never in LLM)
- P-03: Gate independence (failure in one must not crash others)
- P-04: Adapter pluggability (all external integrations behind ports)
- P-05: Single responsibility per domain module

Includes module map (domain/ports/adapters), invariants I-CG-01/02/03, and coupling rules.

### [c4/](c4/index.md)

C4 visual models for the system:

- **Context** — system context diagram (Developer, CrewGate, OpenCode, Cupcake, Git, Filesystem)
- **Container** — container diagram (CLI, Orchestrator, Router, Agent Runner, State Manager, Fidelity, Adversary)
- **Component** — orchestrator components (GateSequencer, GateExecutor, StateManager)
- **Component Runtime** — runtime view (CLI, Router, Sequencer, Executor, Agent, State Manager)
- **Code Domain** — domain model entities (FeatureDescriptor, PipelineState, Gate, Artifact, Challenge, etc.)
- **Code Orchestrator** — orchestrator, router, and agent runner class diagrams
- **Code Ports** — inbound (ICommandPort, IConfigPort) and outbound (ILLMPort, IArtifactPort, IRouterPort) interfaces
- **Code Adapters** — adapter implementations (CLI, Config, LLM, Filesystem, Git, Cupcake)
- **Code Cross-Cutting** — Fidelity Checker, Adversarial Mirror, Adjudicator, Prediction Market (v0.2, planned)

---

| Maintainer/Author | Last modified |
|-------------------|---------------|
| Rémi Boivin       | 2026-05-22    |
