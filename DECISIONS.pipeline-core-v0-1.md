# DECISIONS - pipeline-core-v0-1

D-001 - Keep v0.1 routing local and deterministic

Date: 2026-05-22
Task: T-002
Status: Applied
Related files: src/domain, src/adapters, specs/overview.md

Context

The roadmap calls for Cupcake policies, but the repository has no policy runtime dependency and v0.1 only needs deterministic local classification.

Options considered

Option A:
Implement an actual Rego/Wasm policy engine now.

Option B:
Implement a repository-local deterministic router that mirrors the documented heuristics and leaves a clear seam for future policy adapters.

Decision

Implement a local deterministic `DynamicRouter` now and preserve the policy seam with a reference `policies/cupcake-routing.rego` file plus an isolated router class.

Why

This satisfies the v0.1 contract without adding a dependency or inventing a half-built policy runtime. The router stays replaceable later without changing the CLI or persisted state format.

Impact

Affects router implementation, tests, ADR 26-05-12, and future adapter evolution.

ADR check

ADR required: yes

Follow-up

If CrewGate adopts a real Cupcake/Wasm runtime, replace `DynamicRouter` behind the same classification contract and update the ADR/spec accordingly.

Commit

10c44d7
