# CrewGate v0.1 Pipeline Core

## Table of Contents

1. Overview and Goals
2. Domain Model and Glossary
3. Interfaces and Contracts
4. Data Flow / Execution Model
5. Validation / Linting Rules
6. Failure Modes and Error Taxonomy
7. Observability
8. Security and Trust Boundaries
9. Extensibility Rules
10. Definition of Done

## Overview and Goals

Job story: when an operator uses CrewGate to bootstrap and run a feature workflow locally, the system must create a deterministic feature record, route the feature into the correct gate sequence, execute each gate in order, and persist inspectable state and artifacts without exposing secrets or allowing file writes outside the feature sandbox.

This specification defines the v0.1 runtime only. It makes the existing CLI scaffold operational for `feat new`, `run`, and `status`.

In scope:

- deterministic feature slug creation
- persisted feature state under `.crewgate/state/<slug>.json`
- persisted gate artifacts under `.crewgate/artifacts/<slug>/<gate>/`
- deterministic routing for level and flow selection
- execution of the 7 named gates with persona and behavior context
- status inspection for one feature or all features
- security guards for env-only keys, artifact write confinement, and git-safe behavior

Out of scope:

- live model calls to external providers
- prediction market, fidelity, adversarial mirror, telemetry integrity hash chain, rollback execution, and human approval loops
- any hidden or undocumented pipeline entry point other than `crewgate run`

## Domain Model and Glossary

- Feature: a persisted work item with `slug`, `title`, `description`, `createdAt`, `updatedAt`, `level`, `flow`, `currentGate`, `status`, and `completedGates`.
- Flow: one of `bugfix`, `feature`, `structural`, or `security`.
- Level: one of `0`, `1`, `2`, `3`, or `4`.
- Gate: one of `ceo`, `cto`, `techlead`, `developer`, `qa`, `security`, or `release`.
- Gate artifact: the per-gate output stored inside the current gate directory.
- Runtime state: the JSON document stored at `.crewgate/state/<slug>.json`.

## Interfaces and Contracts

CLI contracts:

- `crewgate feat new "<desc>"` must create the `.crewgate/` directory structure if absent, derive a slug from the description, persist a new feature state file, and print the slug.
- `crewgate run <slug>` must fail if the slug state file does not exist, otherwise classify the feature if classification is absent, execute the required gates in order, and persist state after every gate.
- `crewgate status` must list every state file under `.crewgate/state/`.
- `crewgate status <slug>` must show the single feature state for that slug.

State contract:

- The state file must be valid JSON with at least `slug`, `title`, `description`, `status`, `currentGate`, `completedGates`, `artifactsRoot`, `createdAt`, and `updatedAt`.
- State writes must replace the target file atomically through write-then-rename semantics.
- `currentGate` is `null` only before first execution or after completion.

Routing contract:

- Classification must depend only on title and description.
- Keyword matches for structural or security flows must bump the level to at least `3`.
- Level `0` is only allowed for doc-only or extremely small markdown-only requests. v0.1 execution may still store the classification even if direct commit mode is not implemented.

Execution contract:

- The default gate sequence is `ceo -> cto -> techlead -> developer -> qa -> security -> release`.
- Bugfix level `1` skips `cto`, `techlead`, and `security`.
- Level `2` skips `security`.
- `run` must resume from the first incomplete gate in state.
- Each gate writes exactly one artifact payload within its own gate directory and records completion before the next gate starts.

Persona and behavior contract:

- Each gate must resolve a persona file from `personas/<gate>.md`, except `cto` which resolves `personas/cto.md` or `personas/cto-archi.md` if present.
- Each gate must resolve a behavior file from `behaviors/<gate>.yaml`.
- Missing persona or behavior files are hard failures for the affected gate.

## Data Flow / Execution Model

1. `feat new` normalizes the description into a slug and writes a `pending` feature state.
2. `run` loads the state, classifies it if classification is missing, computes the gate sequence, and initializes the artifact root.
3. For each gate, the runtime loads the persona and behavior text, builds a deterministic prompt context from feature metadata plus prior artifacts, and produces a local stub artifact payload.
4. The runtime writes the artifact only inside `.crewgate/artifacts/<slug>/<gate>/`.
5. The runtime updates and atomically persists state after every completed gate.
6. `status` reads state files and reports their current status without mutation.

## Validation / Linting Rules

- Slugs must be lowercase ASCII with words separated by `-`.
- Duplicate slugs are rejected unless the existing state is explicitly resumed by `run`.
- State JSON must be parseable before use; invalid state files fail with `INVALID_STATE`.
- Gate identifiers outside the 7 known names fail validation.

## Failure Modes and Error Taxonomy

- `FEATURE_NOT_FOUND`: requested slug has no state file.
- `FEATURE_ALREADY_EXISTS`: `feat new` would overwrite an existing slug.
- `INVALID_STATE`: state JSON missing required fields or malformed.
- `INVALID_ROUTE`: classifier produced an unsupported level or flow.
- `MISSING_PERSONA`: required persona file is absent.
- `MISSING_BEHAVIOR`: required behavior file is absent.
- `ARTIFACT_SCOPE_VIOLATION`: attempted read/write escapes the feature gate directory.
- `MISSING_API_KEY`: a requested provider key is absent from environment.
- `UNSAFE_GIT_OPERATION`: runtime attempts a forbidden git action such as reset-based rollback.

Each failure must stop execution and preserve the last valid state on disk.

## Observability

v0.1 observability is local and minimal:

- CLI output must announce created slugs, selected level/flow, and final pipeline status.
- State files are the source of truth for current progress.
- Gate artifact files provide inspectable evidence for completed gates.

No telemetry JSONL implementation is required in v0.1 beyond preserving the `.crewgate/telemetry/` directory for future versions.

## Security and Trust Boundaries

- API keys are read from environment variables only and never persisted into state or artifacts.
- The artifact writer must reject absolute paths, parent traversal, or writes outside `.crewgate/artifacts/<slug>/<gate>/`.
- The runtime must not invoke `git reset --hard` or any equivalent destructive rollback.
- Persona, behavior, and policy files are read-only inputs.
- The primary trust boundary is between runtime state management and per-gate artifact writes.

## Extensibility Rules

- Routing must stay behind an interface boundary so Cupcake or another policy adapter can replace the local deterministic rules later.
- Gate execution may evolve to real LLM calls, but the persisted state and artifact contracts defined here must remain stable or go through ADR-backed change.
- New gates are out of scope for v0.1 and require ADR-backed pipeline updates.

## Definition of Done

- Automated tests fail before implementation and pass after implementation.
- `crewgate feat new`, `crewgate run`, and `crewgate status` behave as specified.
- The runtime persists valid `.crewgate/state/*.json` files and gate artifacts under `.crewgate/artifacts/<slug>/<gate>/`.
- Routing covers level/flow classification cases from this specification.
- Security guard tests prove env-only keys, artifact path confinement, and git safety constraints.
- ADR and user-facing documentation are updated to reflect the final v0.1 behavior.
