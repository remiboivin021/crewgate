# C4 Models

C4 visual architecture models for CrewGate, organized by level of abstraction (context → container → component → code).

## Context & Container

### [context.md](context.md)

System context diagram (PlantUML). Shows CrewGate as a black box interacting with:

- **Developer** — runs CLI commands
- **OpenCode** — LLM infrastructure provider
- **Cupcake Policy Engine** — Rego/Wasm routing
- **Git Repository** — commits, branches, rollback
- **Local Filesystem** — state, artifacts, personas, telemetry

### [container.md](container.md)

Container diagram (PlantUML). Decomposes CrewGate into:

- CLI Adapter, Gate Orchestrator, Dynamic Router, Agent Runner, State Manager, Fidelity Checker, Adversarial Mirror
- External dependencies: OpenCode LLM, Cupcake Engine, Filesystem, Git

### [component.md](component.md)

Component diagram (PlantUML) focusing on the Gate Orchestrator:

- GateSequencer — iterates gates per level/flow
- GateExecutor — runs a single gate (load persona → call LLM → validate → write artifact)
- StateManager — atomic checkpoint per gate
- DynamicRouter — classifies feature via Cupcake

## Runtime

### [component-runtime.md](component-runtime.md)

Runtime view of the v0.1 pipeline components in sequence:

- CLI → Router → Sequencer → Executor → Agent → State Manager
- Composition table: component, technology, external dependencies
- Links to code-level views

## Code Level

### [code-domain.md](code-domain.md)

Domain model entities (PlantUML class diagram):

- **Core**: FeatureDescriptor, PipelineState, GateOutput, Artifact, Gate, Challenge
- **Enums**: PipelineLevel (0-4), PipelineFlow (bugfix/feature/structural/security), PipelineStatus, GateVerdict
- **Config**: PipelineConfig, LLMConfig, CupcakeConfig
- **Results**: PipelineResult, ArtifactIndex
- Also documents CLI entry/exit contracts (command formats + JSON output schemas)

### [code-orchestrator.md](code-orchestrator.md)

Code-level decomposition of three key modules (PlantUML class diagrams):

- **Gate Orchestrator** — GateOrchestrator, GateSequencer, GateExecutor, StateManager, TransitionValidator
- **Dynamic Router** — DynamicRouter, CupcakeAdapter, Classifier (LevelClassifier, FlowClassifier)
- **Agent Runner** — AgentRunner, PersonaLoader, BehaviorLoader, PromptComposer

### [code-ports.md](code-ports.md)

Hexagonal port interfaces (PlantUML diagrams):

- **Inbound**: ICommandPort (`run`, `status`), IConfigPort (`load`)
- **Outbound**: ILLMPort (`complete`), IArtifactPort (`write`/`read`/`list`), IRouterPort (`classify`)
- **Port relationships**: all adapter implementations mapped to their ports (CLIAdapter, ConfigFileAdapter, OpenCodeLLMAdapter, ClaudeApiAdapter, LlamaCppAdapter, FileSystemAdapter, ScopedArtifactPort, GitRepoAdapter, CupcakeAdapter)

### [code-adapters.md](code-adapters.md)

Adapter implementation details (PlantUML class diagrams):

- **CLI Adapter** — CrewGateCliAdapter, CommandParser, ParsedCommand
- **Config Adapter** — ConfigFileAdapter, ConfigValidator
- **LLM Adapters** — OpenCodeLLMAdapter, ClaudeApiAdapter, LlamaCppAdapter, Completion, TokenUsage
- **Filesystem & Git** — FileSystemAdapter, ScopedArtifactPort, GitRepoAdapter
- **Router Adapter** — CupcakeAdapter

### [code-cross-cutting.md](code-cross-cutting.md)

Cross-cutting mechanisms (all planned for v0.2+):

- **Fidelity Checker** — semantic drift detection via embeddings
- **Adversarial Mirror** — challenge gate outputs with dedicated adversaries
- **Adjudicator** — deterministic + LLM-fallback judgment
- **Prediction Market** — confidence betting from downstream agents

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
