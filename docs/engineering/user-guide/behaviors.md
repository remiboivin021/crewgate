# Behavior Profiles

> **v0.1 — Design Blueprint.** Behavior profiles define the intended tone, heuristics, and constraints for each gate persona. The files exist. The Cupcake policy engine that enforces them has not been implemented yet.

Behavior profiles (`.yaml` files in `behaviors/`) define the tone, style, decision heuristics, and constraints for each gate persona. They are designed to be loaded and injected by the orchestrator at runtime alongside the persona prompts once pipeline execution is implemented.

## File structure

```yaml
persona: <name>        # matches the persona file name
gate: <0-6>            # gate number in the pipeline

tone:                  # Structural rules + style guide
  structural_rules:    # Verifiable output constraints
  style_guide:         # Desired texture (guidance only)

style:                 # Output shape
  verbosity: concise   # concise | balanced | detailed
  language_audience:   # executive | technical | mixed

heuristics:            # Decision rules with priority and enforcement type
  - id: H-001
    rule: "<if-then>"
    rationale: "<why>"
    priority: 1        # 1 = highest
    type: MUST|SHOULD|MAY
    evidence_required: # what the output must cite

context_overrides:     # Crisis-mode overrides that replace base heuristics
  selection: first_match
  crisis:
    triggers:           # context conditions (AND within a block)
    overrides:          # replaces matching fields temporarily

constraints:           # Hard limits
  type: MUST|SHOULD
  value: <number|null>
```

## Target annotations

Each section is annotated with `@target` tags indicating intended runtime ownership:

| @target | Meaning | Evaluated by |
|---------|---------|-------------|
| `prompt` | Injected verbatim into the persona's ## Behavior section | The LLM |
| `cupcake` | Evaluated as Rego policy after LLM output | Cupcake policy engine |
| `orchestrator` | Controls pipeline behavior (retry, skip, block) | The orchestrator |

## Precedence (design)

1. **Persona prompt** (`personas/*.md` — ## Rules, ## Output format)
2. **Behavior file** (this file — tone, heuristics, constraints)
3. **Overlay** (`overlay.yaml` — project-specific overrides)

## Heuristics

Heuristics are decision rules intended to guide the gate agent's reasoning. Each has:

- **ID** — unique identifier (e.g. `CEO-001`)
- **Rule** — the if-then logic
- **Rationale** — why this rule exists
- **Priority** — lower number = evaluated first
- **Type:**
  - `MUST` — intended to be enforced by Cupcake; violation should block the gate
  - `SHOULD` — strong guidance
  - `MAY` — suggestion, no enforcement
- **Evidence required** — what the output must cite

### Example (from `behaviors/ceo.yaml`)

```yaml
heuristics:
  - id: CEO-001
    rule: "If ROI is less than 3x within 12 months, output NO-GO."
    rationale: "Ensures business viability threshold is met."
    priority: 1
    type: MUST
    evidence_required:
      - "ROI calculation with revenue projection"
      - "Time-to-market estimate"
```

## Context overrides

Context overrides are designed to replace base heuristics when specific trigger conditions are met:

```yaml
context_overrides:
  selection: first_match
  crisis:
    triggers:
      priority: P0
    overrides:
      tone:
        structural_rules:
          - "Limit decision to 3 sentences per option."
      heuristics:
        - id: CEO-C01
          rule: "If P0, prioritize time-to-market over ROI."
          type: MUST
          replaces:
            - CEO-001
```

## Constraints

Constraints define intended hard limits:

- `MUST` constraint violated → gate should be BLOCKED
- `SHOULD` constraint violated → gate should be WARNED (continues)
- `null` value — MUST + null = error if not resolved by overlay. SHOULD + null = silently skipped

### Example constraints

```yaml
constraints:
  max_cost_usd:
    value: 50000
    type: SHOULD
    description: "Maximum USD cost for implementation"
```

## Available behavior files

| File | Persona | Gate |
|------|---------|------|
| `behaviors/ceo.yaml` | CEO | 0 |
| `behaviors/cto.yaml` | CTO Architect | 1 |
| `behaviors/techlead.yaml` | TechLead | 2 |
| `behaviors/developer.yaml` | Developer | 3 |
| `behaviors/qa.yaml` | QA | 4 |
| `behaviors/security.yaml` | Security | 5 |
| `behaviors/release.yaml` | Release | 6 |
| `behaviors/business-skeptic.yaml` | Business Skeptic | Adversary |
| `behaviors/security-skeptic.yaml` | Security Skeptic | Adversary |
| `behaviors/devil-advocate.yaml` | Devil's Advocate | Adversary |
| `behaviors/chaos.yaml` | Chaos | Adversary |
| `behaviors/TEMPLATE.yaml` | — | Template for new behaviors |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
