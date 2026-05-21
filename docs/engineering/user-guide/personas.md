# Personas

> **v0.1 — Design Blueprint.** This guide documents the intended architecture and workflow. The 7 primary gate personas are defined as prompt files. No pipeline execution or LLM integration is implemented yet.

CrewGate defines **9 personas** (7 primary gates + 2 universal adversaries), each as a complete LLM prompt that defines the agent's mission, rules, forbidden actions, input contract, and output format.

Persona files live in `personas/*.md` and are designed to be injected by the orchestrator at runtime once pipeline execution is implemented.

---

## Primary gates

### CEO — Gate 0 (Strategic Approval)

**File:** `personas/ceo.md`

Analyzes the feature request and decides whether the feature has sufficient business value.

- **Mode:** READ-only
- **Key rule:** Decision (GO/NO-GO) must be the first sentence
- **Forbidden:** Architecture, technology stack, implementation details
- **Output:** `business.yaml` with requirements, KPIs, priority, business value
- **Safeguard:** If the request is too vague → `INSUFFICIENT_CONTEXT`

### CTO Architect — Gate 1 (Architecture Review)

**File:** `personas/cto-archi.md`

Ensures every feature aligns with the overall system architecture and long-term technical vision.

- **Mode:** READ-only
- **Key rule:** Produces ADR with security requirements and threat model
- **Forbidden:** Business decisions (CEO domain)
- **Output:** Architecture Decision Record

### TechLead — Gate 2 (Design Validation)

**File:** `personas/techlead.md`

Translates the ADR into a detailed technical specification with task breakdown.

- **Mode:** READ-only
- **Key rule:** Tasks must be ≤1 day each. Feasibility statement as first sentence
- **Forbidden:** Override ADR decisions, produce code
- **Output:** `techspec.yaml` with modules, tasks, interfaces, test strategy
- **Safeguard:** If ADR is missing → `INSUFFICIENT_CONTEXT`

### Developer — Gate 3 (Implementation)

**File:** `personas/developer.md`

Implements the feature according to the tech spec, one task at a time.

- **Mode:** **WRITE (code)** — the only gate designed to produce code
- **Key rule:** One commit per task. Tests for every new/modified function
- **Forbidden:** Redesign architecture, change module boundaries, expand scope
- **Output:** Git commits with Conventional Commits format
- **Safeguard:** If task cannot be implemented as specified → `INSUFFICIENT_CONTEXT`

### QA — Gate 4 (Quality Assurance)

**File:** `personas/qa.md`

Validates implementation against the tech spec.

- **Mode:** READ-only
- **Key rule:** Verdict (PASS/PASS_WITH_ISSUES/FAIL) as first sentence
- **Forbidden:** Fix bugs, redesign tests, evaluate business value
- **Output:** `qa_report.yaml` with coverage, failed tests, issues
- **Safeguard:** If tech spec or code diff is missing → `INSUFFICIENT_CONTEXT`

### Security — Gate 5 (Security Audit)

**File:** `personas/security.md`

Audits for security vulnerabilities, trust boundary violations, and dependency risks.

- **Mode:** READ-only
- **Key rule:** Verdict (SECURE/CONDITIONAL/BLOCKED) as first sentence
- **Forbidden:** Modify code, evaluate functional correctness or business value
- **Output:** `security_report.yaml` with findings (CWE-referenced) and dependency risks
- **Safeguard:** If ADR or tech spec is missing → `INSUFFICIENT_CONTEXT`

### Release — Gate 6 (Release Authorization)

**File:** `personas/release.md`

Final gate — verifies all upstream gates passed and the feature is safe to ship.

- **Mode:** READ-only
- **Key rule:** Verdict (SHIP/SHIP_WITH_CAVEATS/BLOCK) as first sentence
- **Forbidden:** Re-evaluate QA or Security findings, assess business value
- **Output:** `release_report.yaml` with gate status, constraints, caveats
- **Safeguard:** If upstream gate results are missing → `INSUFFICIENT_CONTEXT`

---

## Adversarial personas (definitions only)

Adversarial persona files exist in `personas/` as prompt definitions. Their integration into the pipeline (adversarial mirror mechanism) is planned for a later version.

### Business Skeptic

**File:** `personas/business-skeptic.md`  
**Target:** CEO output

Challenges the CEO's business case — ROI projection, KPI selection, competitive positioning, or cost assumptions.

### Security Skeptic

**File:** `personas/security-skeptic.md`  
**Target:** Security output

Challenges the Security gate's threat model, dependency audit, trust boundaries, and remediation timelines.

### Devil's Advocate

**File:** `personas/devil-advocate.md`  
**Target:** Any gate (universal)

Challenges the fundamental assumptions behind any gate's decision.

### Chaos

**File:** `personas/chaos.md`  
**Target:** The pipeline itself

Finds failure modes across the entire pipeline: hallucinations, cascading failures, dependency conflicts, and input poisoning.

---

## Creating custom personas

Use the template at `personas/TEMPLATE.md` as a starting point. A persona file must define:

1. **Mission** — what this gate produces and why
2. **Rules** — actionable, specific behavior rules
3. **Forbidden** — what this persona does NOT do
4. **Behavior reference** — links to the corresponding YAML behavior file
5. **References** — documentation or external standards
6. **Input contract** — what artifacts this gate receives
7. **Output format** — structured YAML schema
8. **Safeguards** — edge case handling (e.g. `INSUFFICIENT_CONTEXT`)

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
