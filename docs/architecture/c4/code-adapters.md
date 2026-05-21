# C4 Code View — Adapter Implementations

This document provides a code-level decomposition of the CrewGate adapter layer. Adapters implement port interfaces and bridge the domain layer with external systems.

## CLI Adapter (Inbound)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class CrewGateCliAdapter {
        -parser: CommandParser
        -orchestrator: GateOrchestrator
        +run(args): void
        -handleFeatNew(args): void
        -handleRun(args): void
        -handleStatus(args): void
        -printResult(result): void
        -printError(err): void
    }

    class CommandParser {
        +parse(args): ParsedCommand
        -extractSlug(raw): string
        -extractDescription(raw): string
        -extractFlags(raw): map
    }

    class ParsedCommand {
        +command: string
        +subcommand: string
        +slug: string
        +description: string
        +flags: map
    }

    CrewGateCliAdapter --> CommandParser : uses
    CommandParser --> ParsedCommand : returns
    CrewGateCliAdapter --> ICommandPort : implements
@enduml
```

## Config Adapter (Inbound)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class ConfigFileAdapter {
        -configPath: string
        +load(): PipelineConfig
        -parseYaml(raw): PipelineConfig
        -validate(config): ValidationResult
        -applyDefaults(config): PipelineConfig
    }

    class ConfigValidator {
        +validateSchema(config): bool
        +validateTimeouts(config): bool
        +validateLLM(config): bool
    }

    ConfigFileAdapter --> ConfigValidator : uses
    ConfigFileAdapter ..|> IConfigPort : implements
@enduml
```

## LLM Adapters (Outbound)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class OpenCodeLLMAdapter {
        -opencodePlugin: OpenCodePlugin
        +complete(prompt): Completion
        -formatPrompt(raw): OpenCodePrompt
        -parseResponse(raw): Completion
    }

    class ClaudeApiAdapter {
        -apiKey: string
        -client: AnthropicClient
        +complete(prompt): Completion
        -buildMessages(prompt): Message[]
        -handleError(err): void
    }

    class LlamaCppAdapter {
        -endpoint: string
        -modelPath: string
        +complete(prompt): Completion
        -buildRequestBody(prompt): dict
        -streamResponse(chunk): void
    }

    class Completion {
        +content: string
        +finishReason: string
        +usage: TokenUsage
        +latencyMs: int
    }

    class TokenUsage {
        +prompt: int
        +completion: int
        +total: int
    }

    OpenCodeLLMAdapter ..|> ILLMPort : implements
    ClaudeApiAdapter ..|> ILLMPort : implements
    LlamaCppAdapter ..|> ILLMPort : implements
    Completion --> TokenUsage : contains
@enduml
```

## Filesystem & Git Adapters (Outbound)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class FileSystemAdapter {
        -basePath: string
        +write(filename, content): void
        +read(filename): string
        +list(gate): string[]
        -ensureDir(path): void
        -sanitizePath(filename): string
    }

    class ScopedArtifactPort {
        -basePath: string
        -currentGate: string
        -completedGates: string[]
        +write(filename, content): void
        +read(filename): string
        +list(gate): string[]
        -resolvePath(filename): string
        -validateGateAccess(gate): bool
    }

    class GitRepoAdapter {
        -repoPath: string
        +write(filename, content): void
        +read(filename): string
        +list(gate): string[]
        +commit(message): string
        +createBranch(name): void
        +tag(name): void
    }

    FileSystemAdapter ..|> IArtifactPort : implements
    ScopedArtifactPort --|> FileSystemAdapter : extends
    GitRepoAdapter ..|> IArtifactPort : implements
@enduml
```

## Router Adapter (Outbound)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class CupcakeAdapter {
        -policyDir: string
        -wasmRuntime: WasmRuntime
        +evaluate(input): PolicyResult
        +loadPolicy(name): void
        +reload(): void
    }

    CupcakeAdapter ..|> IRouterPort : implements
@enduml
```

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    |