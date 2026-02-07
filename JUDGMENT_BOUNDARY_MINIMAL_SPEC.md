# Judgment Boundary Minimal Specification

**Version:** v0.1
**Status:** SEALED
**Scope:** Runtime-agnostic Execution Authority Boundary

---

## 1. Purpose

This specification defines the **minimal, runtime-agnostic requirements** for a Judgment Boundary that governs **execution authority** in AI systems.

The boundary determines **whether execution is allowed**, independent of:

* model reasoning
* prompt content
* tool implementation

This is **not** a safety specification.
It is an **execution authority specification**.

---

## 2. Core Principle

> **Reasoning and execution are separate concerns.**
> AI may reason freely.
> Execution requires explicit authorization.

Judgment **must occur before execution**.

---

## 3. Mandatory Components (MUST)

Any compliant runtime **MUST** provide the following four elements.

---

### 3.1 Interception Point (`interception_point`)

**Definition:**
A deterministic interception point that occurs **after a tool/action is proposed** but **before it is executed**.

**Requirements:**

* MUST be pre-execution
* MUST be synchronous with execution decision
* MUST be external to the model

**Examples:**

* `before_tool_call`
* `pre_exec`
* `execution_request_hook`

---

### 3.2 Decision Set (`decision_set`)

**Definition:**
The minimal set of possible judgment outcomes.

**REQUIRED VALUES:**

* `STOP` — execution is forbidden
* `HOLD` — execution is deferred or denied by default (fail-closed)
* `ALLOW` — execution is permitted

**Rules:**

* `STOP` and `HOLD` MUST prevent execution
* `ALLOW` is the only state that permits execution

---

### 3.3 Fail-Closed Rule (`fail_closed_rule`)

**Definition:**
Behavior when judgment cannot be confidently determined.

**REQUIREMENT:**

```
Unknown / unmatched / ambiguous → HOLD
```

**Rationale:**

* Lack of policy ≠ permission
* Absence of judgment ≠ ALLOW

---

### 3.4 Audit Signal (`audit_signal`)

**Definition:**
A machine-readable signal indicating that execution was prevented by judgment.

**REQUIRED FIELDS (minimum):**

```json
{
  "decision": "STOP | HOLD",
  "execution_prevented": true,
  "reason": "<string>"
}
```

**Rules:**

* MUST be emitted for every non-ALLOW decision
* MUST be independent of runtime logging verbosity
* MUST be externally observable

---

## 4. Policy Model (SHOULD)

Judgment logic **SHOULD** be policy-driven and externalized.

Recommended characteristics:

* Declarative (e.g. YAML / JSON)
* Runtime-agnostic
* Hot-reloadable without model changes

---

## 5. Non-Goals (Explicit)

This specification does **NOT** require:

* model modification
* prompt filtering
* safety classification
* content moderation
* post-execution monitoring

Those concerns are orthogonal.

---

## 6. Compliance Criteria

A system is **Judgment Boundary v0.1 compliant** if and only if:

1. Execution can be prevented **before it occurs**
2. Prevention is driven by an explicit judgment decision
3. Unknown cases default to **HOLD**
4. An `execution_prevented` audit signal is emitted
5. The model is not modified to achieve the above

---

## 7. Proven Implementations

### OpenClaw Adapter — **Judgment Boundary v0.1 PROVEN**

* **Interception:** `before_tool_call` hook
* **Decision set:** STOP / HOLD / ALLOW
* **Fail-closed:** unknown → HOLD
* **Audit:** `execution_prevented: true`
* **Test:** 6/6 scenarios validated
* **Status:** Architecturally proven, adapter maturity partial

**Evidence:** `examples/openclaw/proof/EXECUTION_PREVENTION_PROOF.md`

---

## 8. Reference Implementations (In Progress)

* Shell Wrapper — Universal tool execution boundary
* Claude Code MCP — Model Context Protocol integration
* crewAI / AutoGen — Multi-agent framework adapters

---

## 9. Seal Statement

> This document defines the **minimal execution authority boundary**
> required for responsible AI execution.
>
> Safety may guide intention.
> **Authority governs action.**

---

## 10. Version History

* **v0.1** (2026-02-08) — Initial specification sealed
  - Four mandatory components defined
  - First proven implementation (OpenClaw)
  - Compliance criteria established
