# C4 Code View — Orchestrator & Router

This document provides a code-level decomposition of the Gate Orchestrator, Dynamic Router, and Agent Runner.

## Gate Orchestrator

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class GateOrchestrator {
        -router: IRouterPort
        -stateManager: StateManager
        -agentRunner: AgentRunner
        -fidelityChecker: FidelityChecker
        -adversarialMirror: AdversarialMirror
        +execute(feature): PipelineResult
        +resume(slug): PipelineResult
        +cancel(slug): void
        +getStatus(slug): PipelineStatus
    }

    class GateSequencer {
        -gates: string[]
        -currentIndex: int
        +next(): GateDescriptor
        +hasNext(): bool
        +reset(): void
        +current(): GateDescriptor
    }

    class GateExecutor {
        +execute(gate, context): GateOutput
        -validateInput(artifact): ValidationResult
        -writeArtifact(output): void
    }

    class StateManager {
        +read(slug): PipelineState
        +write(slug, state): void
        +checkpoint(slug, gate, output): void
        +delete(slug): void
    }

    class TransitionValidator {
        +validate(prev, current): ValidationResult
        -checkSchema(artifact): bool
        -checkFidelity(prev, current): FidelityResult
    }

    GateOrchestrator --> GateSequencer : creates
    GateOrchestrator --> GateExecutor : uses
    GateOrchestrator --> StateManager : delegates
    GateOrchestrator --> TransitionValidator : calls
    GateSequencer --> GateExecutor : feeds
    GateExecutor --> StateManager : checkpoints
    GateExecutor --> TransitionValidator : after each gate
@enduml
```

## Dynamic Router

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class DynamicRouter {
        -cupcakeAdapter: CupcakeAdapter
        -classifiers: Classifier[]
        +classify(feature): RouteClassification
        -levelFromTitle(title): PipelineLevel
        -flowFromKeywords(desc): PipelineFlow
        -bumpLevel(level, flow): PipelineLevel
    }

    class CupcakeAdapter {
        -policyDir: string
        -wasmRuntime: WasmRuntime
        +evaluate(input): PolicyResult
        +loadPolicy(name): void
        +reload(): void
    }

    class Classifier {
        <<interface>>
        +match(feature): ClassificationScore
    }

    class LevelClassifier {
        +match(feature): ClassificationScore
        -keywordPatterns: map
    }

    class FlowClassifier {
        +match(feature): ClassificationScore
        -flowPatterns: map
    }

    DynamicRouter --> CupcakeAdapter : uses
    DynamicRouter --> Classifier : delegates to
    Classifier <|.. LevelClassifier : implements
    Classifier <|.. FlowClassifier : implements
@enduml
```

## Agent Runner

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class AgentRunner {
        -llm: ILLMPort
        -personaLoader: PersonaLoader
        +run(gate, feature, upstream): GateOutput
        -composePrompt(gate, context): Prompt
        -parseVerdict(raw): GateOutput
    }

    class PersonaLoader {
        -personaDir: string
        +load(gate): Persona
        +loadAdversary(name): Persona
        +listGates(): string[]
    }

    class BehaviorLoader {
        -behaviorDir: string
        +load(gate): Behavior
        +validate(behavior): ValidationResult
    }

    class PromptComposer {
        +compose(persona, behavior, feature, upstream): Prompt
        -mergeInstructions(persona, behavior): string
    }

    AgentRunner --> PersonaLoader : reads
    AgentRunner --> BehaviorLoader : reads
    AgentRunner --> PromptComposer : uses
    AgentRunner --> ILLMPort : calls

@enduml
```

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    |