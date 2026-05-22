# STATE - pipeline-core-v0-1

Branch: feature/pipeline-core-v0-1
Worktree: /tmp/wt-pipeline-core-v0-1
Planner: Codex
Executor: Codex

---

# Mission

Deliver the v0.1 CrewGate pipeline core described in `specs/roadmap.md` by replacing the placeholder CLI scaffold with a functional local runtime that can create feature state, classify a request, execute the 7-gate pipeline deterministically, persist per-feature state and artifacts under `.crewgate/`, and enforce the baseline security constraints for key handling, artifact isolation, and git safety.

Out of scope:

- real LLM provider integrations
- fidelity gate, adversarial mirror, prediction market, HITL, rollback automation, or telemetry integrity features scheduled for later roadmap versions
- editing persona or behavior content beyond wiring/validation needs
- changing the public config contract beyond creating the minimal files/directories required for v0.1 runtime

---

# Feature Type

- [x] new feature
- [ ] bug fix
- [ ] refactor (approved)
- [ ] performance improvement
- [ ] infrastructure
- [ ] security

---

# Change Level

- [ ] L1 - local low-risk
- [ ] L2 - bounded standard change
- [x] L3 - structural or sensitive

---

# Acceptance Criteria

- [x] `crewgate feat new "<desc>"` creates a deterministic feature slug plus initial state and artifact directories under `.crewgate/`.
- [x] `crewgate run <slug>` loads the feature state, classifies it into a level/flow, executes the required gate sequence, and persists gate outputs/status after each gate.
- [x] `crewgate status [slug]` reports one feature or all features from `.crewgate/state/` without mutating runtime data.
- [x] The runtime supports all 7 named gates: `ceo`, `cto`, `techlead`, `developer`, `qa`, `security`, `release`.
- [x] Routing uses a deterministic policy implementation aligned with the v0.1 roadmap and existing `specs/overview.md` heuristics.
- [x] Persona and behavior files are resolved from `personas/` and `behaviors/` and incorporated into gate execution context.
- [x] Security guards prevent API keys from being sourced from disk config, prevent artifact writes outside `.crewgate/artifacts/<slug>/<gate>/`, and prevent git-unsafe operations such as reset-based rollback.
- [x] The implementation has automated tests covering CLI behavior, routing, orchestrator sequencing, state persistence, and security guardrails.

---

# Scope Contract

## Allowed Areas

- src/index.ts
- src/domain/**
- src/ports/**
- src/adapters/**
- tests/**
- specs/**
- docs/governance/adr/**
- .crewgate/**
- policies/**
- MEMORY.md
- STATE.pipeline-core-v0-1.md
- TODO.pipeline-core-v0-1.md
- DECISIONS.pipeline-core-v0-1.md

## Forbidden Areas

- personas/** content semantics beyond load/validation
- behaviors/** content semantics beyond load/validation
- plugin.config.yaml
- package.json dependency additions unless planner/gates are updated
- unrelated docs/site generation output

---

# Public Contract Impact

- [ ] no
- [x] yes - CLI
- [ ] yes - config
- [x] yes - file format / schema
- [x] yes - pipeline semantics
- [ ] yes - external integration behavior

If yes, specify:

- Migration needed: no
- ADR required: yes

---

# Required Gates

- [x] governance
- [ ] architect
- [x] architect-security
- [ ] security
- [x] adr
- [x] doc
- [x] qa
- [x] review
- [x] release

---

# Blast Radius Assessment

- [ ] localized (single module)
- [ ] multi-module
- [x] cross-system
- [ ] unknown

---

# Architectural Constraints

- Preserve the existing hexagonal split between `domain`, `ports`, and `adapters`.
- Keep `crewgate run` as the sole execution entry point.
- Do not add external dependencies for routing or sandboxing; implement the v0.1 core with repository-local code.
- Keep state writes atomic from the perspective of file replacement, not in-place mutation.
- Keep routing deterministic from feature title/description only.

---

# Parallel Safety Check

The feature runs in `/tmp/wt-pipeline-core-v0-1` on `feature/pipeline-core-v0-1`. No other worktree is active besides the primary checkout on `develop`, so there is no parallel feature collision at the worktree level.

---

# Security Surface Check

This feature touches:

- secrets handling
- command execution surface
- artifact filesystem boundaries
- git safety policy

Architect-security gate is mandatory. A separate downstream security gate is not required if trust-boundary constraints remain unchanged from the approved architecture and are covered by tests and QA evidence.

---

# Execution Plan (Planner Output)

1. Create dedicated NLSpec and execution artifacts for v0.1 pipeline core, including gate decisions and security constraints.
2. Write failing tests for CLI commands, deterministic routing, state/artifact persistence, and filesystem/git safety constraints.
3. Implement the runtime composition root plus supporting domain/adapters to satisfy the tests with minimal production code.
4. Run typecheck and tests, update NLSpec/ADR/docs to match delivered behavior, and complete QA/review/release checks.

---

# Refactor Shield

Refactoring is forbidden unless required to make the v0.1 runtime executable inside the declared scope. No unrelated cleanup, renames, or doc rebuilds are in scope.
