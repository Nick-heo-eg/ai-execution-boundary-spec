# AI Execution Boundary Standard (AEBS) v0.1

**Purpose:** Minimal structural standard for preventing unintended consequences when AI agents have OS-level execution authority.

**Status:** Draft — Pre-incident reference

---

## Core Principle

> **AI agents should not execute actions directly.
> There must be an explicit judgment layer between proposal and execution.**

**Current Reality (2026-01):**
- AI agents (Claude Desktop, OpenClaw, etc.) already have:
  - OS command execution
  - File system full access
  - Payment API credentials
  - Account management tokens

**The Gap:**
- Proposal (AI decides) → Execution (System runs)
- **Missing:** Judgment layer

**This Standard Defines:**
- Proposal (AI) → **Judgment (Gate)** → Execution (System)

---

## Why This Matters

### The Shift

| Before | Now |
|--------|-----|
| AI **explains** actions | AI **performs** actions |
| Mistakes = bad advice | **Mistakes = real damage** |
| Human executes | **AI executes** |
| Responsibility: clear | **Responsibility: unclear** |

### The Risk

When AI agents have execution authority without judgment boundaries:

```
User: "Clean up my photos"
AI interprets → Deletes all photos
No confirmation → Irreversible
```

**Traditional automation:** Fails safely (stops on unknown state)
**LLM agents:** "Creatively" solve problems (new, unreviewable actions)

---

## Five Standard Components

This standard provides minimal, reusable patterns for:

1. **[Vocabulary Standard](#1-vocabulary-standard)** — Common language
2. **[Judgment Gate Standard](#2-judgment-gate-standard)** — Pre-execution decision structure
3. **[Audit Trail Standard](#3-audit-trail-standard)** — Responsibility tracking
4. **[Forbidden Actions Standard](#4-forbidden-actions-standard)** — Negative constraints
5. **[Architecture Pattern](#5-architecture-pattern)** — Role separation model

---

## 1. Vocabulary Standard

**Problem:** Without shared language, incidents cannot be discussed clearly.

**Standard Terms:**

| Term | Definition | Example |
|------|------------|---------|
| **Agent** | System that proposes actions | LLM-based assistant |
| **Proposal** | Suggested action, not yet approved | "Delete file X" |
| **Judgment** | Decision point: allow/deny/hold/escalate | Gate evaluation |
| **Execution** | Actual system operation | `rm file.txt` |
| **Boundary** | Explicit separation between judgment and execution | Pre-execution gate |
| **Irreversible Action** | Cannot be undone | Payment, delete, credential change |
| **Judgment Actor** | Entity responsible for approval | Human, policy engine, dual control |

**Key Distinction:**

```
❌ "AI made a mistake"
✅ "Agent proposed action X, judgment gate Y failed to block it"
```

**Usage:**
- Incident reports
- Policy documents
- Audit trails
- Regulatory compliance

---

## 2. Judgment Gate Standard

**Problem:** Most AI agents execute proposals immediately.

**Minimum Required Structure:**

### 2.1 Judgment Request Format

```yaml
action:
  proposed_by: <agent_id>
  intent: <action_type>
  target: <resource>
  risk: <low|medium|high|critical>

judgment:
  decision: <ALLOW|DENY|HOLD|ESCALATE>
  reason: <justification>
  required_actor: <approval_authority>
```

### 2.2 Judgment Outcomes

| Decision | Meaning | Next Step |
|----------|---------|-----------|
| **ALLOW** | Proceed to execution | Execute immediately |
| **HOLD** | Requires explicit approval | Wait for human confirmation |
| **DENY** | Blocked permanently | Return error to agent |
| **ESCALATE** | Requires higher authority | Route to designated approver |

### 2.3 Risk-Based Routing

**Default Policy:**

| Risk Level | Default Decision | Approver |
|------------|-----------------|----------|
| **low** | ALLOW | None (auto) |
| **medium** | HOLD | User |
| **high** | HOLD | User + Review |
| **critical** | ESCALATE | User + Security Officer |

### 2.4 Implementation Contract

**Required Behavior:**
1. **Every execution** passes through judgment gate
2. Judgment **precedes** execution (not concurrent)
3. Denied actions **never execute**
4. Gate failure = **DENY** (fail-safe)

**Example:**

```python
def execute_action(proposal):
    judgment = judgment_gate.evaluate(proposal)

    if judgment.decision == "ALLOW":
        return system.execute(proposal)
    elif judgment.decision == "HOLD":
        return await_human_approval(proposal)
    else:  # DENY or ESCALATE
        raise ExecutionBlocked(judgment.reason)
```

**Reference Implementations:**
- See: `examples/policies/pre_execution_gate.yaml`
- See: `examples/policies/reference_policy.yaml`

---

## 3. Audit Trail Standard

**Problem:** After an incident, "who approved this?" has no answer.

**Minimum Required Log Format:**

### 3.1 JSONL Audit Log

```jsonl
{"ts":"2026-01-31T12:00:00Z","agent":"agent-01","action":"file_delete","target":"/data/important.csv","judgment":"HOLD","approver":"user@example.com","decision":"approved","execution":"success"}
{"ts":"2026-01-31T12:05:00Z","agent":"agent-01","action":"payment","target":"vendor-x","amount":"$5000","judgment":"ESCALATE","approver":null,"decision":"blocked","execution":"none"}
```

### 3.2 Required Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `ts` | ISO8601 | Timestamp of judgment | ✅ |
| `agent` | string | Agent identifier | ✅ |
| `action` | string | Action type | ✅ |
| `target` | string | Resource affected | ✅ |
| `judgment` | enum | Gate decision | ✅ |
| `approver` | string\|null | Who approved (if any) | ✅ |
| `decision` | enum | Final outcome | ✅ |
| `execution` | enum | Execution result | ✅ |
| `reason` | string | Justification | Recommended |
| `session_id` | string | Correlation ID | Recommended |

### 3.3 Retention Requirements

**Minimum:**
- High-risk actions: **1 year**
- Critical actions: **3 years**
- Payment/credential: **7 years** (compliance)

### 3.4 Auditability Checklist

✅ Every high-risk action is logged
✅ Logs are append-only
✅ Logs include decision reason
✅ Failed actions are logged (not just successes)
✅ Logs are machine-readable
✅ Timestamp is tamper-evident

**Reference:**
- See: `examples/audit_logs/audit_log_format.jsonl`
- See: `examples/audit_logs/audit_example.jsonl`

---

## 4. Forbidden Actions Standard

**Problem:** AI agents are "helpful" and will attempt anything requested.

**Minimum Negative Constraint List:**

### 4.1 Enterprise Baseline

**AI agents MUST NOT autonomously:**

| Category | Forbidden Action |
|----------|------------------|
| **Financial** | Approve payments |
| **Financial** | Transfer funds externally |
| **Financial** | Modify payment methods |
| **Identity** | Change passwords |
| **Identity** | Reset MFA tokens |
| **Identity** | Modify user roles |
| **Security** | Disable security policies |
| **Security** | Grant elevated privileges |
| **Security** | Modify firewall rules |
| **Data** | Delete production databases |
| **Data** | Export PII externally |
| **Data** | Disable backups |

### 4.2 Organizational Customization

**Template:**

```yaml
forbidden_actions:
  financial:
    - payment_approval
    - fund_transfer
  identity:
    - credential_change
    - privilege_escalation
  data:
    - production_delete
    - backup_disable

  # Add organization-specific rules
  custom:
    - contract_signing
    - vendor_onboarding
```

### 4.3 Enforcement

**Policy as Code:**

```python
FORBIDDEN_ACTIONS = {
    "payment_approval",
    "credential_change",
    "privilege_escalation"
}

def is_forbidden(action_type):
    return action_type in FORBIDDEN_ACTIONS

# In judgment gate:
if is_forbidden(proposal.intent):
    return Judgment(decision="DENY", reason="Forbidden autonomous action")
```

**Reference:**
- See: `docs/03_forbidden_actions.md`
- See: `examples/policies/reference_policy.yaml`

---

## 5. Architecture Pattern

**Problem:** Without structural separation, judgment can be bypassed.

**Minimum Separation Model:**

### 5.1 Layer Separation

```
┌─────────────────────────────────┐
│ L0: Design (Human writes law)  │  ← Policy, forbidden actions
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│ L1: Judgment Gate (Enforces)   │  ← Pre-execution, exit-code based
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│ L2: Human-in-Loop (Approves)   │  ← Interactive approval (optional)
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│ L3: Execution (System acts)    │  ← OS, APIs, payments
└─────────────────────────────────┘
```

**Key Properties:**
- **L1 (Gate) always runs** — cannot be skipped
- **L2 (Human) operates within L1 boundaries** — cannot approve forbidden actions
- **L3 (Execution) only receives approved actions**

### 5.2 Control Flow

```
Proposal → Judgment Gate → Decision
                           ├─ ALLOW → Execute
                           ├─ DENY → Reject
                           └─ HOLD → Human Approval
                                     ├─ Approved → Execute
                                     └─ Denied → Reject
```

**Critical Rule:**

> **Agent MUST NOT have direct execution authority**
>
> All execution passes through:
> 1. Judgment gate evaluation
> 2. Policy check
> 3. (If required) Human approval
> 4. Audit log write
> 5. Execution

### 5.3 Implementation Checklist

**Structural Requirements:**

- [ ] Agent cannot bypass judgment gate
- [ ] Judgment gate runs before execution
- [ ] Failed judgment blocks execution (fail-safe)
- [ ] Forbidden actions are hard-coded, not configurable by agent
- [ ] Audit log writes are atomic with execution

**Testing:**

```python
def test_agent_cannot_bypass_gate():
    """Agent attempting direct execution should fail"""
    with pytest.raises(PermissionDenied):
        agent.execute_directly(action)  # Should not exist

def test_judgment_precedes_execution():
    """Execution without judgment should be impossible"""
    # Correct flow
    judgment = gate.evaluate(proposal)
    if judgment.allow:
        system.execute(proposal)

    # Incorrect flow should not compile/run
    # system.execute(proposal)  # Missing gate check
```

**Reference:**
- See: `docs/05_architecture.mmd` (Mermaid diagram)
- See: `docs/06_adoption_paths.md`

---

## Compliance Mapping

### Regulatory Alignment

| Standard Component | EU AI Act | SOC 2 | ISO 27001 |
|-------------------|-----------|-------|-----------|
| Judgment Gate | Human oversight (Art. 14) | CC6.1 | A.9.2.5 |
| Audit Trail | Logging (Art. 12) | CC7.2 | A.12.4.1 |
| Forbidden Actions | Risk mgmt (Art. 9) | CC7.1 | A.12.6.1 |
| Architecture | Design docs (Art. 11) | CC3.1 | A.14.2.1 |

**Reference:**
- See: `enterprise/compliance/regulatory_mapping.md`
- See: `enterprise/compliance/regulator_pack/`

---

## Adoption Paths

### Individual Developer

1. Read `docs/00_declaration.md`
2. Review `examples/use_cases/demo_agent_flow.md`
3. Implement judgment gate pattern
4. Add audit logging

### Team / Startup

1. Establish `examples/policies/reference_policy.yaml`
2. Deploy judgment gate in CI/CD
3. Configure forbidden actions list
4. Enable audit trail

### Enterprise

1. Review `enterprise/checklist.md`
2. Conduct PoC using `enterprise/01_poc_scope.md`
3. Deploy with `enterprise/02_install_steps.md`
4. Measure success via `enterprise/03_success_metrics.md`

**Reference:**
- See: `docs/06_adoption_paths.md`
- See: `enterprise/README.md`

---

## Non-Goals

This standard **does not** cover:

- ❌ AI safety (toxic output filtering)
- ❌ LLM alignment techniques
- ❌ Prompt engineering best practices
- ❌ Model selection criteria
- ❌ Performance optimization

**Scope:** Execution governance only.

---

## Reference Implementation

**Working Implementation:**
- [echo_role_guard](../echo_role_guard) — Code-level enforcement for AI-generated artifacts
- Demonstrates all 5 standard components
- Production-tested, CI-validated

---

## Status and Evolution

### Current Version: v0.1

**Included:**
- ✅ 5 core components defined
- ✅ JSONL audit format
- ✅ YAML policy format
- ✅ Forbidden actions baseline
- ✅ Architecture pattern

**Future (v0.2):**
- [ ] OPA/Rego policy examples
- [ ] Multi-agent coordination patterns
- [ ] Incident response playbooks
- [ ] Compliance certification templates

---

## Contributing

This is a private repository during initial development.

**Feedback Welcome:**
- Practical implementation gaps
- Missing use cases
- Regulatory requirements

**Not Accepting:**
- Scope expansion beyond execution boundaries
- Vendor-specific implementations
- AI alignment theories

---

## License

TBD (targeting permissive open license for maximum adoption)

---

## Summary

**This standard exists so that when an incident happens, people can say:**

> "We should have had judgment gates."
> "We should have logged this."
> "We should have forbidden that action."

**Instead of inventing solutions during crisis,
this provides the structure that should have existed before.**

**Formula:**

```
Proposal ≠ Execution
Proposal → Judgment → Execution
```

**One sentence:**

> **AI agents must not execute; they must propose.
> Execution requires judgment.**

---

**References:**
- [Declaration](docs/00_declaration.md)
- [Vocabulary](docs/01_vocabulary.md)
- [Forbidden Actions](docs/03_forbidden_actions.md)
- [Architecture](docs/05_architecture.mmd)
- [Messaging Guide](docs/07_messaging.md)
