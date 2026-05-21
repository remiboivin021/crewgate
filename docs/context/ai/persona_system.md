# Persona System

## Overview

CrewGate uses a two-layer prompt architecture: **persona files** (`personas/*.md`) define the gate agent's identity, mission, and rules, while **behavior files** (`behaviors/*.yaml`) supply tone, heuristics, constraints, and context overrides.

The `AgentRunner` composes the final system prompt at runtime by merging the persona instructions with the active behavior profile.

## File Locations

| Layer | Location | Format | Purpose |
|-------|----------|--------|---------|
| Persona | `personas/<gate>.md` | Markdown | Agent identity, mission, rules, output schema |
| Behavior | `behaviors/<gate>.yaml` | YAML | Tone, heuristics, constraints, overrides |
| Adversary | `personas/<adversary>.md` | Markdown | Challenger identity (read-only, injected after gate output) |

## Persona File Structure (`personas/TEMPLATE.md`)

Each persona file follows this structure:

### `# Persona: {NAME} — Gate {N}`

Title identifying the gate and its position in the pipeline.

### `## Mission`

One sentence: what this gate produces and why it exists.

Examples:
- CEO: "Decide whether the feature request has sufficient business value to proceed."
- CTO: "Validate the architectural approach and produce an ADR when required."
- Developer: "Implement the feature according to the tech spec and write tests."

### `## Rules`

Actionable, specific directives. Each rule starts with a verb and describes one behavior.

Examples:
- "Validate the feature description against the scope contract."
- "Produce exactly one output artifact in the required format."
- "Reference specific upstream artifacts by name."

### `## Forbidden`

What this persona does NOT do. References other gates by name to prevent overlap.

Examples:
- "Do not write code — that is the Developer's responsibility."
- "Do not modify the state file — the pipeline manager handles this."
- "Do not make security decisions — escalate to the Security gate."

### `## Behavior`

Injection point for the behavior profile. Loaded from `behaviors/<gate>.yaml` at runtime.

```
Loaded from `behaviors/{name}.yaml`. The following behavior profile is active:

{orchestrator_injects_behavior_prose_here}
```

### `## References`

Links to architecture docs, standards, and external resources the agent may consult.

Typical references:
- `docs/architecture/assumptions.md`
- `docs/governance/levels.md`
- External: specific RFCs or standards

### `## Input`

Describes what artifacts the pipeline provides to this gate. Injected by the orchestrator at runtime.

### `## Output Format`

Expected schema for the gate's output artifact. Typically YAML with required and optional fields.

### `## Safeguards`

Guardrails for safe operation.

Standard safeguards:
- If input is insufficient to decide, respond with: `INSUFFICIENT_CONTEXT`
- Do not expand scope beyond the task definition
- Do not make decisions that belong to another gate

## Behavior File Structure (`behaviors/TEMPLATE.yaml`)

Each behavior file is a YAML document with these sections:

### `tone`

Two sub-sections:

- **structural_rules**: Verifiable output constraints, enforced by Cupcake Rego policy. Each rule is a separate check.
- **style_guide**: Desired texture — not verifiable, pure guidance injected into the prompt.

### `style`

Controls verbosity and audience level:

```yaml
style:
  verbosity: concise           # concise | balanced | detailed
  language_audience: executive # executive | technical | mixed
```

### `heuristics`

Decision rules evaluated in priority order. Each heuristic has:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (H-001, H-002, ...) |
| `rule` | The decision rule |
| `rationale` | Why this rule exists |
| `priority` | Evaluation order (1 = highest) |
| `type` | MUST (enforced by Cupcake), SHOULD (strong guidance), MAY (suggestion) |
| `evidence_required` | What the output must cite |

### `context_overrides`

Activated when trigger conditions match the current feature context. Overridden fields REPLACE (not merge) their base counterparts.

Trigger semantics:
- Keys within one trigger block are AND (all must match)
- Multiple override blocks are OR (first match wins)
- Selection strategy: `first_match` (default), `priority_lowest`, `all`

### `constraints`

Evaluated by Cupcake after LLM output. MUST constraint violated → gate BLOCKED. SHOULD constraint violated → gate WARNED.

Standard constraints include:
- `max_cost_usd` — Maximum implementation cost
- `min_coverage_pct` — Minimum test coverage (Developer gate)
- `max_scope_deviation` — Maximum allowed scope drift
- `min_challenges` — Minimum adversary challenges (adversarial gates)

## Precedence

```
1. persona prompt (## Rules, ## Output format)
2. behavior file (tone, heuristics, constraints)
3. overlay.yaml (runtime overrides)
```

Higher precedence overrides lower. Null convention:
- MUST + null → error if not resolved by overlay
- SHOULD + null → silently skipped if unresolved
- absent field → not applicable

## Gate Agents (7)

| Gate | Role | Persona | Behavior |
|------|------|---------|----------|
| CEO | Business case, scope validation | `personas/ceo.md` | `behaviors/ceo.yaml` |
| CTO | Architecture + ADR | `personas/cto.md` | `behaviors/cto.yaml` |
| TechLead | Tech spec decomposition | `personas/techlead.md` | `behaviors/techlead.yaml` |
| Developer | Implementation + tests | `personas/developer.md` | `behaviors/developer.yaml` |
| QA | Test plan + validation | `personas/qa.md` | `behaviors/qa.yaml` |
| Security | SAST + threat model | `personas/security.md` | `behaviors/security.yaml` |
| Release | Changelog + deploy check | `personas/release.md` | `behaviors/release.yaml` |

## Adversarial Agents (4)

| Adversary | Opposes | Role |
|-----------|---------|------|
| Business Skeptic | CEO | Challenges ROI, market timing, opportunity cost |
| Security Hawk | CTO | Probes threat model gaps, STRIDE |
| Pragmatist | TechLead | Questions over/under-engineering |
| Security Reviewer | Developer | Scans for vulnerabilities in diff |

Adversaries are **read-only**: they challenge the previous gate's output but do not produce artifacts. Their challenges are logged and evaluated by the next gate.

## Design Decisions

### Why two files (persona + behavior)?

Separation of concerns:
- **Persona** defines identity and mission — stable across the project lifetime.
- **Behavior** defines tone, heuristics, and constraints — tunable per gate and context.

This allows adjusting behavior (e.g., stricter validation for security-sensitive features) without rewriting persona identity.

### Why no template engine?

Raw markdown + YAML injected via string interpolation. Keeps the system transparent, debuggable, and free of template-language complexity.

### Why ~300 token budget for behavior injection?

Behaviors should be concise enough to fit the context window without crowding the feature description and upstream artifacts. 300 tokens forces discipline.

### Why Cupcake for structural rules?

Structural rules are verifiable constraints. Cupcake Rego policies evaluate them deterministically — same inputs always produce same verdict. This prevents LLM hallucination from bypassing critical constraints.

## How to Create a New Persona

1. Copy `personas/TEMPLATE.md` to `personas/<name>.md`
2. Fill each section:
   - **Title**: Persona name and gate position
   - **Mission**: One sentence defining the gate's purpose
   - **Rules**: 3-5 actionable directives
   - **Forbidden**: 2-3 things the persona must not do
   - **Behavior**: Leave the injection placeholder
   - **References**: Link to relevant architecture docs
   - **Input**: Describe expected artifacts
   - **Output Format**: Define the YAML schema
   - **Safeguards**: Include the standard guardrails
3. Create the corresponding behavior file from `behaviors/TEMPLATE.yaml`
4. Register the new gate in the pipeline configuration

## Token Budget

| Component | Budget | Notes |
|-----------|--------|-------|
| Persona prompt sections | ~500 tokens | Mission, Rules, Forbidden, Output Format |
| Behavior injection | ~300 tokens | tone, style, heuristics |
| Feature description | ~200 tokens | User-provided |
| Upstream artifacts | ~500-2000 tokens | Gate-specific |

Total per gate: ~1500-3000 tokens depending on artifact size.

## Anti-Patterns

- **Conflicting rules**: Two personas with contradictory instructions cause non-deterministic behavior.
- **Underspecified heuristics**: A heuristic without `evidence_required` is unverifiable.
- **Scope creep in persona**: A persona that tries to do another gate's job breaks the pipeline model.
- **Overly verbose personas**: Exceeding the token budget forces truncation of critical sections.

---

| Author      | Last modified |
|-------------|---------------|
| Remi Boivin | 2026-05-22    |
