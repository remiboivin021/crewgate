# Configuration Brainstorming

How to think through configuration decisions before writing. Use this guide before touching `AGENTS.md`, `AGENTS.override.md`, or any governance artifact. The goal is to surface hidden assumptions, map blast radius, and decide whether an ADR is needed.

---

## The Mental Model

Before changing config, hold four things in your head:

```
What changed? → What surfaces does it touch? → Who else depends on this? → What must be recorded?
```

1. **What changed?** — A new module? A new security concern? A pipeline change?
2. **What surfaces does it touch?** — Architecture? Security? Invariants? Contracts?
3. **Who else depends on this?** — Downstream consumers? CI/CD? Other agents?
4. **What must be recorded?** — Does this need an ADR? A doc update? A migration?

---

## Step 1: Diagnostic Questions

Run through these. If any answer is "yes," the change almost certainly needs config work and an ADR.

### Surface Questions

| Question | If yes → |
|----------|----------|
| Does this create a new module or package boundary? | Architecture trigger |
| Does this add a new external dependency? | Architecture trigger |
| Does this change how gates are sequenced? | Architecture trigger, ADR |
| Does this change the CLI or public API surface? | Architecture trigger, ADR |
| Does this touch auth, secrets, or credentials? | Security trigger |
| Does this parse untrusted input? | Security trigger |
| Does this add network exposure? | Security trigger |
| Does this touch a port interface (ICommandPort, ILLMPort, etc.)? | Architecture trigger + forbidden area |
| Does this change the state file format? | Invariant I-CG-02 surface |
| Does this change the entry point? | Invariant I-CG-03 surface |
| Does this change telemetry storage behavior? | Invariant I-CG-04 surface |
| Does this change rollback strategy? | Invariant I-CG-05 surface |

### Scope Questions

| Question | If yes → |
|----------|----------|
| Is this change reversible without migration? | L2 or L3 depending on blast radius |
| Does the change affect how other features are built? | Escalate |
| Would reverting this change be expensive? | Escalate, add rollback section to ADR |
| Are there existing tests that would need to change? | Document in STATE |
| Does this change require coordination with another team? | Document in STATE, escalate |

---

## Step 2: Map the Configuration Surface

Once you know what changed, map it to the exact configuration surface:

|        Change type        |       Config surface        |  Action
|---------------------------|-----------------------------|---------------------------------|
| New module boundary       | Forbidden areas             | Add entry to AGENTS.override.md |
| New security concern      | Security triggers           | Add entry to AGENTS.override.md |
| New architecture concern  | Architecture triggers       | Add entry to AGENTS.override.md |
| New invariant             | Project-Specific Invariants | Add I-CG-NN entry               |
| New skill or routing rule | Skill Routing table         | Edit AGENTS.md (rare)           |
| New authority rule        | Authority section           | Edit AGENTS.md (rare)           |

### Concrete example mapping

**Scenario:** Adding a GitLab webhook listener for external pipeline triggers.

```
Change: New module `src/adapters/inbound/WebhookAdapter/`
         receives HTTP POSTs from GitLab
         triggers pipeline resume

Surface mapping:
  - New network exposure          → Security trigger
  - Untrusted input parsing       → Security trigger
  - New adapter                   → Forbidden area? (probably yes)
  - ICommandPort usage            → No port contract change (uses existing)
  - Pipeline resume via webhook   → New entry point? Check I-CG-03
                                  → If it bypasses `crewgate run`, violates I-CG-03
                                  → Needs ADR

Result:
  - AGENTS.override.md: add WebhookAdapter to forbidden areas
  - AGENTS.override.md: update security triggers if webhook pattern is new
  - Maybe: ADR for the I-CG-03 exception
```

---

## Step 3: Blast Radius Assessment

Rate each dimension as **Local** / **Bounded** / **Cross-system**:

| Dimension | Local | Bounded | Cross-system |
|-----------|-------|---------|--------------|
| Files changed | 1 file | 2-3 files | 4+ files |
| Config surface | Comment/description | One entry added | Multiple entries, new invariants |
| Downstream impact | None | Within this module | Other modules or repos |
| Revert difficulty | `git revert` | Needs state migration | Needs coordination |
| ADR required | No | Probably | Yes |

**Rule:** If any dimension is Cross-system, the change is L3 with mandatory ADR.

---

## Step 4: Context Initialization Workflow

After brainstorming, initialize or update the context:

```
Brainstorm done
  → Clear picture of what needs to change
  → Identified config surfaces
  → Assessed blast radius
  → Decided on ADR need
      ↓
Triage (confirms level and flow)
  → Planner (STATE.<slug>.md)
  → Architect gate (config is a forbidden area)
  → ADR if needed
  → Preflight
  → Coder
  → Doc
```

### Before you write config, verify:

- [ ] You know exactly which file to edit (AGENTS.md vs AGENTS.override.md)
- [ ] You have the ADR draft ready (if required)
- [ ] You have identified all downstream docs that need updating
- [ ] You know whether a migration plan is needed
- [ ] You know whether a rollback plan is needed
- [ ] Preflight would PASS with this change

---

## Decision Tree

```
New feature needs configuration?
│
├─ Does it touch forbidden areas?
│  └─ Yes → Architect gate required → L3
│
├─ Does it touch invariants?
│  └─ Yes → ADR required → L3
│
├─ Does it touch architecture triggers?
│  └─ Yes → Architect gate + ADR → L3
│
├─ Does it touch security triggers?
│  └─ Yes → Security gate + ADR → L3
│
├─ Does it touch port interfaces?
│  └─ Yes → Architect gate + ADR → L3
│
├─ Does it add a new entry point?
│  └─ Yes → Check I-CG-03 → possible ADR → L3
│
└─ None of the above?
   └─ Pure description/comment change → could be L2
      └─ When in doubt → L3
```

---

## Anti-Patterns

| Anti-pattern | What it looks like | Better approach |
|-------------|-------------------|-----------------|
| Config-first thinking | "I need to add a trigger, let me edit AGENTS.override.md" | Feature-first: understand the change, then map to config |
| Blind copying | Copying another project's AGENTS.override.md without analysis | Run the diagnostic questions for each entry |
| Silent config | Adding an entry without updating docs or creating an ADR | Always update docs in the same feature scope |
| Over-engineering | Adding triggers for concerns that don't exist yet | Only add what the current change needs. YAGNI applies |
| Invisible invariants | Adding a rule that can't be verified by preflight | Every invariant should be checkable. If it can't, document why it exists |

---

## Quick Checklist (Before Coding)

- [ ] Ran the diagnostic questions
- [ ] Mapped change to the correct config surface
- [ ] Assessed blast radius
- [ ] Decided whether ADR is needed
- [ ] Identified downstream docs to update
- [ ] Know which file will be edited
- [ ] Know the change level (almost certainly L3)
- [ ] Triage confirms the level and flow
- [ ] Planner has written STATE.<slug>.md
- [ ] Architect gate is scheduled

---

## Related

- `configuration-usage.md` — Step-by-step config editing guide
- `AGENTS.override.md` — Where most changes land
- `AGENTS.md` — Organizational defaults (rarely changed)
- `docs/governance/levels.md` — Level classification
- `docs/governance/adr/` — Architecture Decision Records
