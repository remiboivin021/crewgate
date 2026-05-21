# Configuration

> **v0.1 — Design Blueprint.** This documents the intended configuration approach. No configuration file is consumed by the CLI in v0.1.

## Pipeline configuration

**File:** `plugin.config.yaml`

Defines the pipeline gates and their associated personas:

```yaml
pipeline:
  gates:
    - id: ceo
      name: Strategic Approval
      persona: personas/ceo.md
    - id: cto
      name: Architectural Review
      persona: personas/cto-archi.md
    - id: techlead
      name: Design Validation
      persona: personas/techlead.md
    - id: developer
      name: Implementation
      persona: personas/developer.md
    - id: qa
      name: Quality Assurance
      persona: personas/qa.md
    - id: security
      name: Security Audit
      persona: personas/security.md
    - id: release
      name: Release Authorization
      persona: personas/release.md
```

This file exists in the repository as a design reference but is not consumed by any code in v0.1. Consumption will be implemented alongside the pipeline engine.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
