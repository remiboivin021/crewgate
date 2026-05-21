# C4 Code View — Cross-Cutting Mechanisms

This document provides a code-level decomposition of the CrewGate cross-cutting mechanisms.

| Mechanism | Version | Status |
|-----------|:-------:|:------:|
| Fidelity Checker | v0.2 | planned |
| Adversarial Mirror | v0.2 | planned |
| Adjudicator | v0.2 | planned |
| Prediction Market | v0.2 | planned |

## Fidelity Checker (v0.2)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class FidelityChecker {
        -embeddingAdapter: EmbeddingAdapter
        -threshold: float
        +check(upstream, downstream): FidelityResult
        -computeSimilarity(textA, textB): float
        -extractRequiredElements(artifact): string[]
    }

    class FidelityResult {
        +passed: bool
        +similarity: float
        +missingElements: string[]
        +driftedElements: DriftedElement[]
        +threshold: float
    }

    class DriftedElement {
        +element: string
        +originalValue: string
        +driftedValue: string
        +severity: DriftSeverity
    }

    class DriftSeverity {
        <<enum>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }

    class EmbeddingAdapter {
        <<interface>>
        +embed(text): float[]
        +similarity(a, b): float
    }

    FidelityChecker --> EmbeddingAdapter : uses
    FidelityChecker --> FidelityResult : returns
    FidelityResult --> DriftedElement : contains
    DriftedElement --> DriftSeverity : has
@enduml
```

## Adversarial Mirror (v0.2)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class AdversarialMirror {
        -agentRunner: AgentRunner
        -adjudicator: Adjudicator
        +challengeGate(gate, output): ChallengeResult
        -loadAdversary(gate): Adversary
        -runChallenge(adversary, output): Challenge[]
    }

    class ChallengeResult {
        +gate: string
        +challenges: Challenge[]
        +resolved: bool
        +adjudication: Adjudication
    }

    class Challenge {
        +from: string
        +to: string
        +issue: string
        +category: ChallengeCategory
        +severity: ChallengeSeverity
    }

    class ChallengeCategory {
        <<enum>>
        SCOPE_DRIFT
        SECURITY
        PERFORMANCE
        CORRECTNESS
        COMPLETENESS
    }

    class ChallengeSeverity {
        <<enum>>
        INFO
        WARNING
        BLOCKER
    }

    AdversarialMirror --> Adjudicator : delegates
    AdversarialMirror --> ChallengeResult : returns
    ChallengeResult --> Challenge : contains
    Challenge --> ChallengeCategory : has
    Challenge --> ChallengeSeverity : has
@enduml
```

## Adjudicator (v0.2)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class Adjudicator {
        +resolve(challenges, gateOutput): Adjudication
        -deterministicRules(challenge): RuleResult
        -llmFallback(challenge): RuleResult
    }

    class Adjudication {
        +challenge: Challenge
        +ruling: Ruling
        +reason: string
        +action: AdjudicationAction
    }

    class Ruling {
        <<enum>>
        UPHELD
        DISMISSED
        PARTIAL
    }

    class AdjudicationAction {
        <<enum>>
        BLOCK_GATE
        FLAG_REVIEW
        LOG_ONLY
        REQUIRE_FIX
    }

    Adjudicator --> Adjudication : returns
    Adjudication --> Ruling : has
    Adjudication --> AdjudicationAction : has
@enduml
```

## Prediction Market (v0.2)

```plantuml
@startuml
skinparam backgroundColor #1e2129
skinparam defaultFontSize 25
skinparam rectanglePadding 20
skinparam arrowFontSize 20
skinparam arrowFontColor #FFFFFF
skinparam arrowColor #EEEEEE

    class PredictionMarket {
        -agentRunner: AgentRunner
        +poll(feature, gate, agents): PredictionResult
        -collectBets(agents, context): Bet[]
        -aggregate(bets): PredictionResult
    }

    class Bet {
        +agent: string
        +confidence: float
        +rationale: string
        +timestamp: timestamp
    }

    class PredictionResult {
        +meanConfidence: float
        +medianConfidence: float
        +variance: float
        +bets: Bet[]
        +verdict: PredictionVerdict
    }

    class PredictionVerdict {
        <<enum>>
        HIGH_CONFIDENCE
        MEDIUM_CONFIDENCE
        LOW_CONFIDENCE
        INCONCLUSIVE
    }

    PredictionMarket --> Bet : collects
    PredictionMarket --> PredictionResult : returns
    PredictionResult --> Bet : aggregates
    PredictionResult --> PredictionVerdict : has
@enduml
```

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    |