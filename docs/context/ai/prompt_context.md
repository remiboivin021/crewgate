# Prompt Context

## Prompt Architecture

- **Pattern**: Persona file (`personas/*.md`) + Behavior profile (`behaviors/*.yaml`) injected at runtime
- **System prompt**: Composed by `AgentRunner` — merges persona instructions with behavior constraints
- **Template engine**: None — raw markdown + YAML, injected via string interpolation
- **Prompt templates location**: `personas/` (7 gates + 4 adversaries), `behaviors/` (11 YAML profiles)

## Conventions

- **Language**: English (technical output, code, docs)
- **Tone**: Concise, directive, minimal output per persona definition
- **Output format**: Gate-specific structured output (JSON/YAML schemas defined in per-gate specs)

## Prompt Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `persona` | `personas/<gate>.md` | Gate agent identity, mission, rules |
| `behavior` | `behaviors/<gate>.yaml` | Tone, heuristics, structural constraints |
| `feature` | `.crewgate/state/<slug>.json` | Current feature description + scope |
| `upstream_artifacts` | `.crewgate/artifacts/<slug>/<prev_gate>/` | Previous gate outputs |

## Few-Shot Examples

- **Location**: Embedded in persona files (per-gate examples)
- **Selection strategy**: Gate-specific (varies by gate role)

## Prompt Testing

- **Eval framework**: Vitest (unit) + Playwright (E2E)
- **Eval dataset location**: `specs/fidelity-calibration/` (good/bad YAML examples)
- **Regression criteria**: Fidelity gate passes between gate transitions

## Anti-Patterns to Avoid

- No speculative changes outside feature scope
- No persona files with conflicting instructions
- No behavior profiles with underspecified heuristics

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||