# AI Execution Boundary Standard (AEBS) v0.1

**Scope:** Structural requirements for AI agents with OS-level execution authority.

**Status:** Draft — Pre-incident reference

---

## Core Principle

AI agents MUST NOT execute actions directly. An explicit judgment layer MUST exist between proposal and execution.

**Defined Flow:**

```
Proposal (Agent) → Judgment (Gate) → Execution (System)
```

**Prohibited Flow:**

```
Proposal (Agent) → Execution (System)
```

---

## Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

---

## Five Standard Components

This specification defines five structural components:

1. **[Vocabulary Standard](#1-vocabulary-standard)** — Term definitions
2. **[Judgment Gate Standard](#2-judgment-gate-standard)** — Pre-execution decision structure
3. **[Audit Trail Standard](#3-audit-trail-standard)** — Responsibility tracking format
4. **[Forbidden Actions Standard](#4-forbidden-actions-standard)** — Negative constraints
5. **[Architecture Pattern](#5-architecture-pattern)** — Layer separation model

---

## 1. Vocabulary Standard

Implementations MUST use the following terms with their specified meanings:

| Term | Definition | Example |
|------|------------|---------|
| **Agent** | System that proposes actions | LLM-based assistant |
| **Proposal** | Suggested action, not yet approved | "Delete file X" |
| **Judgment** | Decision point: allow/deny/hold/escalate | Gate evaluation |
| **Execution** | Actual system operation | `rm file.txt` |
| **Boundary** | Explicit separation between judgment and execution | Pre-execution gate |
| **Irreversible Action** | Operation that cannot be undone | Payment, delete, credential change |
| **Judgment Actor** | Entity responsible for approval | Human, policy engine, dual control |

**Conformant Language:**

```
✓ "Agent proposed action X, judgment gate Y denied execution"
✗ "AI made a mistake"
```

**Required Usage Contexts:**
- Incident reports
- Policy documents
- Audit trails
- Regulatory compliance

---

## 2. Judgment Gate Standard

### 2.1 Judgment Request Format

Implementations MUST structure judgment requests as follows:

```yaml
action:
  proposed_by: <agent_id>        # REQUIRED
  intent: <action_type>          # REQUIRED
  target: <resource>             # REQUIRED
  risk: <low|medium|high|critical>  # REQUIRED

judgment:
  decision: <ALLOW|DENY|HOLD|ESCALATE>  # REQUIRED
  reason: <justification>        # REQUIRED
  required_actor: <approval_authority>  # REQUIRED if HOLD/ESCALATE
```

### 2.2 Judgment Outcomes

Implementations MUST support the following decision types:

| Decision | Meaning | Required Action |
|----------|---------|-----------------|
| **ALLOW** | Proceed to execution | Execute immediately |
| **HOLD** | Requires explicit approval | Wait for human confirmation |
| **DENY** | Blocked permanently | Return error to agent, MUST NOT execute |
| **ESCALATE** | Requires higher authority | Route to designated approver |

### 2.3 Risk-Based Routing

Implementations SHOULD implement risk-based routing. Default policy:

| Risk Level | Default Decision | Approver |
|------------|-----------------|----------|
| **low** | ALLOW | None (auto) |
| **medium** | HOLD | User |
| **high** | HOLD | User + Review |
| **critical** | ESCALATE | User + Security Officer |

Organizations MAY override this policy but MUST NOT weaken it (e.g., auto-approving critical actions).

### 2.4 Implementation Requirements

Implementations MUST satisfy the following:

1. Every execution MUST pass through judgment gate
2. Judgment MUST precede execution (NOT concurrent)
3. Denied actions MUST NOT execute under any circumstances
4. Gate failure MUST default to DENY (fail-safe)
5. Judgment decisions MUST be logged

**Example (informative):**

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

### 3.1 Log Format

Implementations MUST log all high-risk and critical actions in JSONL format.

**Example:**

```jsonl
{"ts":"2026-01-31T12:00:00Z","agent":"agent-01","action":"file_delete","target":"/data/important.csv","judgment":"HOLD","approver":"user@example.com","decision":"approved","execution":"success"}
{"ts":"2026-01-31T12:05:00Z","agent":"agent-01","action":"payment","target":"vendor-x","amount":"$5000","judgment":"ESCALATE","approver":null,"decision":"blocked","execution":"none"}
```

### 3.2 Required Fields

Implementations MUST include the following fields:

| Field | Type | Description | Requirement |
|-------|------|-------------|-------------|
| `ts` | ISO8601 | Timestamp of judgment | REQUIRED |
| `agent` | string | Agent identifier | REQUIRED |
| `action` | string | Action type | REQUIRED |
| `target` | string | Resource affected | REQUIRED |
| `judgment` | enum | Gate decision | REQUIRED |
| `approver` | string\|null | Who approved (if any) | REQUIRED |
| `decision` | enum | Final outcome | REQUIRED |
| `execution` | enum | Execution result | REQUIRED |
| `reason` | string | Justification | RECOMMENDED |
| `session_id` | string | Correlation ID | RECOMMENDED |

### 3.3 Retention Requirements

Implementations MUST retain logs for:

- High-risk actions: minimum 1 year
- Critical actions: minimum 3 years
- Payment/credential actions: minimum 7 years

Organizations MAY extend retention but MUST NOT reduce below these minimums.

### 3.4 Log Properties

Audit logs MUST satisfy:

1. Every high-risk action is logged
2. Logs are append-only (no modifications permitted)
3. Logs include decision reason
4. Failed actions are logged (not only successes)
5. Logs are machine-readable
6. Timestamps are tamper-evident

**Reference:**
- See: `examples/audit_logs/audit_log_format.jsonl`
- See: `examples/audit_logs/audit_example.jsonl`

---

## 4. Forbidden Actions Standard

### 4.1 Enterprise Baseline

Implementations MUST NOT allow agents to autonomously execute the following:

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

Organizations MUST enforce this baseline. Organizations MAY add additional constraints but MUST NOT remove items from this list.

### 4.2 Organizational Customization

Organizations MAY extend the forbidden actions list:

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

  # Organization-specific additions
  custom:
    - contract_signing
    - vendor_onboarding
```

### 4.3 Enforcement

Implementations MUST enforce forbidden actions at the judgment gate:

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

### 5.1 Layer Separation

Implementations MUST implement the following layer separation:

```
┌─────────────────────────────────┐
│ L0: Design (Human writes law)  │  ← Policy, forbidden actions
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│ L1: Judgment Gate (Enforces)   │  ← Pre-execution, mandatory
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

**Layer Requirements:**

- L1 (Judgment Gate) MUST execute for every action
- L1 MUST NOT be bypassable by agent or human
- L2 (Human) MUST operate within L1 boundaries
- L2 MUST NOT approve actions denied by L1
- L3 (Execution) MUST only receive L1-approved actions

### 5.2 Control Flow

Implementations MUST implement the following flow:

```
Proposal → Judgment Gate → Decision
                           ├─ ALLOW → Execute
                           ├─ DENY → Reject
                           └─ HOLD → Human Approval
                                     ├─ Approved → Execute
                                     └─ Denied → Reject
```

### 5.3 Structural Requirements

Implementations MUST satisfy:

1. Agent MUST NOT have direct execution authority
2. Agent MUST NOT bypass judgment gate
3. Judgment gate MUST run before execution
4. Failed judgment MUST block execution (fail-safe)
5. Forbidden actions MUST be hard-coded, NOT configurable by agent
6. Audit log writes MUST be atomic with execution

### 5.4 Testing Requirements

Implementations SHOULD include the following tests:

```python
def test_agent_cannot_bypass_gate():
    """Agent attempting direct execution MUST fail"""
    with pytest.raises(PermissionDenied):
        agent.execute_directly(action)

def test_judgment_precedes_execution():
    """Execution without judgment MUST be impossible"""
    judgment = gate.evaluate(proposal)
    if judgment.allow:
        system.execute(proposal)
```

**Reference:**
- See: `docs/05_architecture.mmd`
- See: `docs/06_adoption_paths.md`

---

## Compliance Mapping

This specification aligns with regulatory requirements as follows:

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

This specification does NOT define:

- AI safety mechanisms (toxic output filtering, content moderation)
- LLM alignment techniques or training procedures
- Prompt engineering methodologies
- Model selection criteria or performance benchmarks
- Agent capability evaluation
- User experience design for approval interfaces

This specification does NOT require:

- Specific implementation technologies (e.g., OPA, specific languages)
- Specific deployment architectures (cloud, on-premise)
- Integration with specific AI frameworks or platforms

This specification is NOT responsible for:

- Agent intelligence or capability
- Correctness of agent proposals
- Performance optimization
- Cost reduction
- User productivity

**Scope:** Execution governance only. All concerns outside this scope are explicitly excluded.

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
- 5 core components defined
- JSONL audit format
- YAML policy format
- Forbidden actions baseline
- Architecture pattern

**Future (v0.2):**
- OPA/Rego policy examples
- Multi-agent coordination patterns
- Incident response playbooks
- Compliance certification templates

---

## Contributing

This is a private repository during initial development.

**Feedback Accepted:**
- Practical implementation gaps
- Missing use cases
- Regulatory requirements

**Feedback Rejected:**
- Scope expansion beyond execution boundaries
- Vendor-specific implementations
- AI alignment theories

---

## License

TBD (targeting permissive open license for maximum adoption)

---

## Specification Summary

**Defined Flow:**

```
Proposal ≠ Execution
Proposal → Judgment → Execution
```

**Core Requirement:**

Agents MUST NOT execute. Agents MUST propose. Execution REQUIRES judgment.

---

**References:**
- [Declaration](docs/00_declaration.md)
- [Vocabulary](docs/01_vocabulary.md)
- [Forbidden Actions](docs/03_forbidden_actions.md)
- [Architecture](docs/05_architecture.mmd)
- [Messaging Guide](docs/07_messaging.md)
