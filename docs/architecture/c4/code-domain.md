# C4 Code View — Domain Model (Core Entities)

This document provides a code-level decomposition of the CrewGate domain model.

## Core Entities

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam arrowFontSize 20
skinparam arrowFontColor #DDDDDD
skinparam arrowColor #EEEEEE

class FeatureDescriptor {
    +title: string
    +description: string
    +level: PipelineLevel
    +flow: PipelineFlow
    +slug: string
}

class RouteClassification {
    +level: PipelineLevel
    +flow: PipelineFlow
}

class PipelineState {
    +slug: string
    +status: PipelineStatus
    +current_gate: string
    +completed_gates: string[]
    +artifacts: ArtifactIndex
    +created_at: timestamp
    +updated_at: timestamp
}

class GateOutput {
    +gate: string
    +verdict: GateVerdict
    +artifacts: Artifact[]
    +challenges: Challenge[]
    +timestamp: timestamp
}

class Artifact {
    +gate: string
    +filename: string
    +content: string
    +schema: string
}

class Gate {
    +name: string
    +ordinal: int
    +minLevel: PipelineLevel
    +personaPath: string
    +behaviorPath: string
    +produces: string[]
    +consumes: string[]
}

class GateDescriptor {
    +name: string
    +persona: Persona
    +behavior: Behavior
    +context: GateContext
}

class Challenge {
    +from: string
    +to: string
    +issue: string
    +response: string
    +resolution: ChallengeResolution
}

class ChallengeResolution {
    <<enum>>
    UPHELD
    DISMISSED
    PARTIAL
    ESCALATED
}

class PipelineLevel {
    <<enum>>
    0
    1
    2
    3
    4
}

class PipelineFlow {
    <<enum>>
    bugfix
    feature
    structural
    security
}

class PipelineStatus {
    <<enum>>
    pending
    running
    passed
    failed
    cancelled
}

class GateVerdict {
    <<enum>>
    PASS
    BLOCK
    INSUFFICIENT_CONTEXT
    OVERRIDE
}

class PipelineConfig {
    +defaultLevel: PipelineLevel
    +defaultFlow: PipelineFlow
    +timeouts: map
    +llm: LLMConfig
    +cupcake: CupcakeConfig
    +load(path): PipelineConfig
}

class LLMConfig {
    +provider: string
    +model: string
    +maxTokens: int
    +temperature: float
}

class CupcakeConfig {
    +policyDir: string
    +reloadOnChange: bool
}

class TelemetryEvent {
    +seq: int
    +gate: string
    +verdict: string
    +timestamp: string
    +hash: string
    +metadata: map
}

class ArtifactIndex {
    +gates: map~string, string[]~
    +latest(string): string
}

class PipelineResult {
    +slug: string
    +status: PipelineStatus
    +gatesCompleted: string[]
    +failedGate: string
    +commitSha: string
    +telemetrySeq: int
}

FeatureDescriptor --> RouteClassification : classified by
PipelineState --> GateOutput : contains
PipelineState --> PipelineStatus : has
PipelineState --> ArtifactIndex : has
GateOutput --> GateVerdict : has
GateOutput --> Artifact : contains
GateOutput --> Challenge : may contain
FeatureDescriptor --> PipelineLevel : has
FeatureDescriptor --> PipelineFlow : has
PipelineResult --> PipelineStatus : has
PipelineConfig --> LLMConfig : contains
PipelineConfig --> CupcakeConfig : contains
Gate --> PipelineLevel : required
GateDescriptor --> Gate : describes
GateDescriptor --> Challenge : may face
@enduml
```

## CLI Entry / Exit Contracts
Formats de la CLI. L'**entrée** est une commande shell ; la **sortie** est un JSON écrit sur stdout.

### Commandes CLI (entrée)

```
crewegate feat new "<title>: <description>"
crewegate run <slug>
crewegate status [slug]
crewegate resume <slug>
crewegate cancel <slug>
crewegate rollback <slug>
crewegate log [slug]
```

### Sorties JSON (stdout)
**Succès** — tous les gates ont passé :

```json
{
  "slug": "ma-feature",
  "status": "passed",
  "gates_completed": ["preflight", "developer", "qa", "review"],
  "commit_sha": "a1b2c3d",
  "telemetry_seq": 42
}
```

**Échec** — un gate a bloqué :

```json
{
  "slug": "ma-feature",
  "status": "failed",
  "failed_gate": "qa",
  "reason": "Fidelity check threshold not met",
  "resumable": true
}
```

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    |