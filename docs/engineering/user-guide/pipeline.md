# Pipeline & Gates

> **v0.1 — Design Blueprint.** This guide documents the intended architecture and workflow. No pipeline execution is implemented yet. The personas and behavior profiles exist as files; the orchestration engine that drives them has not been built.

## Overview

CrewGate is designed as a deterministic sequence of gates. Each gate is intended as an LLM-driven agent with a specialized role, persona prompt (`personas/*.md`), behavior profile (`behaviors/*.yaml`), and strict input/output contract.

The pipeline is designed to be **deterministic** — the same feature request will always traverse the same gate sequence for a given level and flow classification.

## Pipeline diagram (design)

```
Feature Request
    │
    ▼
┌─────────────────────────────────────────────────────┐
│              Dynamic Pipeline Router                 │
│  Classifies: Level (0-4) + Flow (bugfix/feature/    │
│              structural/security)                    │
│  Engine: Cupcake (Rego/Wasm policies)                │
└─────────────────────────────────────────────────────┘
    │
    ▼  (path depends on level + flow)
```

### Gate sequence by level

| Level | Gates | When |
|-------|-------|------|
| **0** | Commit direct | Typo, doc fix, <50 words |
| **1** | CEO → Dev → QA → Release | Rename, bump, config change |
| **2** | CEO → CTO → TechLead → Dev → QA → Release | New endpoint, small feature |
| **3-4** | CEO → CTO → TechLead → Dev → QA → Security → Release | Migration, auth, architecture change |

## The 7 gates

Each gate below has its persona prompt and behavior profile already defined. The pipeline orchestration that invokes them has not been implemented yet.

### Gate 0: CEO (Strategic Approval)

| Property | Value |
|----------|-------|
| Persona | `personas/ceo.md` |
| Behavior | `behaviors/ceo.yaml` |
| Mode | **READ-only** |
| Intended output | `business.yaml` — GO/NO-GO, priority, KPIs |
| Purpose | Validate business case and strategic alignment |

Intended to produce a business case with ROI assessment, KPI recommendations, and a GO/NO-GO decision. Does **not** make technical decisions.

### Gate 1: CTO (Architecture Review)

| Property | Value |
|----------|-------|
| Persona | `personas/cto-archi.md` |
| Behavior | `behaviors/cto.yaml` |
| Mode | **READ-only** |
| Intended output | `adr.md` — architecture decisions, security requirements |
| Purpose | Ensure architectural alignment |

Intended to produce an Architecture Decision Record (ADR) with security requirements, threat model, and trust boundary definitions.

### Gate 2: TechLead (Design Validation)

| Property | Value |
|----------|-------|
| Persona | `personas/techlead.md` |
| Behavior | `behaviors/techlead.yaml` |
| Mode | **READ-only** |
| Intended output | `techspec.yaml` — tasks, modules, interfaces |
| Purpose | Translate ADR into a detailed technical specification |

Intended to produce a tech spec with task breakdown (≤1 day per task), module boundaries, interfaces, and test strategy.

### Gate 3: Developer (Implementation)

| Property | Value |
|----------|-------|
| Persona | `personas/developer.md` |
| Behavior | `behaviors/developer.yaml` |
| Mode | **WRITE (code)** — the only gate designed to produce code |
| Intended output | Git commits — one per task |
| Purpose | Implement according to tech spec |

The **only** gate designed to write production code. Intended to complete one task at a time, write tests for every new or modified function, and commit after each task.

### Gate 4: QA (Quality Assurance)

| Property | Value |
|----------|-------|
| Persona | `personas/qa.md` |
| Behavior | `behaviors/qa.yaml` |
| Mode | **READ-only** |
| Intended output | `qa_report.yaml` — PASS/FAIL, coverage, issues |
| Purpose | Validate implementation against tech spec |

Intended to validate test coverage, test results, and regression risk. Does **not** fix bugs — it reports them.

### Gate 5: Security (Security Audit)

| Property | Value |
|----------|-------|
| Persona | `personas/security.md` |
| Behavior | `behaviors/security.yaml` |
| Mode | **READ-only** |
| Intended output | `security_report.yaml` — SECURE/BLOCKED, findings |
| Purpose | Audit for vulnerabilities |

Intended to audit implementation and architecture for security vulnerabilities, trust boundary violations, and dependency risks. References CWE and OWASP categories.

### Gate 6: Release (Release Authorization)

| Property | Value |
|----------|-------|
| Persona | `personas/release.md` |
| Behavior | `behaviors/release.yaml` |
| Mode | **READ-only** |
| Intended output | `release_report.yaml` — SHIP/BLOCK, caveats |
| Purpose | Final go/no-go for shipping |

Intended to verify all upstream gates have passed, no constraints are violated, and the feature is safe to ship. Conservative bias: if unsure, BLOCK with specific reasons.

## Filesystem isolation (design)

Each gate is intended to write exclusively to its own artifact directory:

```
.crewgate/artifacts/<slug>/
  ceo/
  cto/
  techlead/
  developer/
  qa/
  security/
  release/
```

No gate should be able to write outside its directory. The Developer gate would produce git commits (the only write path to the source tree). This isolation is specified but not yet enforced.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
