# Product Context

## Project Identity

- **Name**: CrewGate
- **Type**: Multi-agent pipeline orchestrator / CLI
- **Phase**: Active Development

## Problem

- **Core Problem**: OpenCode feature workflows require manual skill selection and gate sequencing. There is no deterministic, auditable, multi-agent pipeline that enforces scope, validates contracts, and gates each step with adversarial and fidelity checks.

## Users

- **Target Users**: OpenCode users and AI-agent developers who need structured, gated feature pipelines with quality guarantees.

## Value

- **Value Proposition**: A standalone 7-gate pipeline (CEO→CTO→TechLead→Dev→QA→Security→Release) with adversarial mirror, prediction market, and fidelity validation. Single entry point: `crewgate run`.

## Scope

- **In Scope (v0.1)**: Dynamic pipeline router (Level 0-4), 7 gate agents with personas/behaviors, feature state management, artifact isolation, Cupcake policy routing, security model, CLI (`crewgate feat new`, `run`, `status`).
- **Out of Scope**: Fidelity gate (v0.2), adversarial mirror (v0.2), prediction market (v0.2), third-party gate plugins (v0.2), telemetry pipeline (v0.2), failure recovery/resume/cancel/rollback (v0.3), multi-project orchestration (v0.4).

## Workflows

- **Development Workflow**: TypeScript/Bun codebase, hexagonal architecture, vitest + Playwright testing, GitHub Actions CI.
- **Runtime Workflow**: Feature request → Dynamic Router (level+flow classification) → Gate pipeline execution → Artifact persistence → Commit or fail.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||