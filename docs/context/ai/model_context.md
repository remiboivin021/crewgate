# Model Context

## Integration Model

CrewGate does not manage its own LLM API keys. All LLM calls are routed through OpenCode's existing LLM infrastructure via the `ILLMPort` adapter pattern.

## Adapter Architecture

| Adapter | Target | Use Case |
|---------|--------|----------|
| OpenCodeLLMAdapter | OpenCode's LLM interface | Default — all gates |
| ClaudeApiAdapter | Anthropic Claude API | Direct integration (future) |
| LlamaCppAdapter | Local llama.cpp | Self-hosted fallback (future) |

## Capabilities Required

- **Structured Output**: Gate verdicts must be parseable (JSON/YAML schemas).
- **Persona Adherence**: Each gate agent follows its persona file for tone, scope, and behavior.
- **Context Window**: Must support large inputs (feature description, upstream artifacts, personas, behaviors).

## Constraints

- **Latency**: Gate execution targets <30s for Level 0-2, <120s for Level 3-4.
- **Determinism**: Same feature + same personas must produce equivalent gate verdicts.
- **OpenCode Routing**: The default adapter uses whatever LLM provider OpenCode is configured to use.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||