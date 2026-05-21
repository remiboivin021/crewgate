# User Guide

> **v0.1 — Design Blueprint.** This guide documents the intended architecture and workflow. No pipeline execution, state management, or LLM integration is implemented yet.

Welcome to the CrewGate user guide. This section documents the intended design for CrewGate — the multi-agent pipeline orchestrator for OpenCode.

## What is CrewGate?

CrewGate is designed as a deterministic, auditable 7-gate pipeline that orchestrates AI agents to produce verified software changes. Each gate is intended as an LLM-driven agent with a specialized persona, behavior profile, and strict input/output contract.

The design defines a single entry point — `crewgate run` — that would classify a feature request, route it through the correct gates, and produce verified artifacts at each step.

## Sections

| Section | Description |
|---------|-------------|
| [Installation](installation.md) | System requirements and setup |
| [Quick Start](quickstart.md) | End-to-end walkthrough of the intended workflow |
| [CLI Reference](cli.md) | All commands and options |
| [Pipeline & Gates](pipeline.md) | The 7 gates and how they are designed to work |
| [Personas](personas.md) | Gate agents (prompts defined) |
| [Behaviors](behaviors.md) | Behavior profiles and heuristics (defined) |
| [Routing](routing.md) | Level and flow classification (design) |

## Target Audiences

- **Developers** — Intended to use CrewGate to run structured, gated feature pipelines.
- **CI/CD Operators** — Intended integration into automated quality gates.
- **Quality Reviewers** — Intended to inspect gate artifacts and audit trails.

## Status

The CLI signature exists, all persona prompts and behavior profiles are defined, and the full specification is written. The pipeline execution engine has not been built yet.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
