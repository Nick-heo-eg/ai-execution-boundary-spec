# AI Execution Boundary Specification

## Position

This repository is part of the **Judgment Boundary** work:
a set of experiments and specifications focused on
*when AI systems must stop or not execute*.

See the overarching map:
→ https://github.com/Nick-heo-eg/stop-first-rag/blob/master/JUDGMENT_BOUNDARY_MANIFEST.md

---

**Status:** Draft v0.1
**Purpose:** Minimal structural standard for AI agent execution governance

---

## What This Is

A specification for the **minimum structure needed** to prevent AI agents from causing unintended consequences when they have OS-level execution authority.

This is **not**:
- A compliance framework
- A regulatory guideline
- AI safety filtering
- A specific product

This **is**:
- The structural boundaries that should exist before an incident makes them mandatory
- A reference for "what we should have had in place"
- A vocabulary and pattern library for execution governance

---

## Why This Exists

Current state (2026-01):
- AI agents with OS-level execution authority already have:
  - OS command execution
  - File system access
  - Payment API access
  - Account credentials
- But there is **no standard boundary** between:
  - AI proposes action
  - Action executes

**Gap:** Judgment and Execution are conflated.

**This spec defines the separation.**

---

## Core Principle

> **AI agents should not have direct execution authority.
> There must be an explicit judgment layer between proposal and execution.**

**Formula:**
```
Proposal (AI) → Judgment (Gate) → Execution (System)
```

**Not:**
```
Proposal (AI) → Execution (System)
```

---

## Five Standard Components

This spec provides minimal patterns for:

1. **[Vocabulary](STANDARD.md#1-vocabulary-standard)** - Common language for roles and boundaries
2. **[Judgment Gate](STANDARD.md#2-judgment-gate-standard)** - Pre-execution decision structure
3. **[Audit Trail](STANDARD.md#3-audit-trail-standard)** - Responsibility tracking format
4. **[Forbidden Actions](STANDARD.md#4-forbidden-actions-standard)** - Negative constraint template
5. **[Architecture Pattern](STANDARD.md#5-architecture-pattern)** - Role separation model

See **[STANDARD.md](STANDARD.md)** for detailed specification.

---

## Who This Is For

**Primary audience:**
- Engineers building AI agent systems
- Security teams evaluating AI agent deployments
- Organizations writing AI execution policies

**When to reference:**
- Before deploying AI agents with OS access
- After an incident, when designing prevention
- When regulators ask "what controls exist?"

---

## Non-Goals

This spec **does not**:
- Define AI safety (e.g., toxic output filtering)
- Specify LLM alignment techniques
- Mandate specific tools or vendors
- Create legal compliance requirements

**Scope:** Structural boundaries for execution, nothing else.

---

## Reference Implementation

See [echo_role_guard](../echo_role_guard) for a working implementation of these patterns applied to code generation workflows.

---

## Status and Evolution

- **v0.1 (current):** Initial draft, minimal viable structure
- **Future:** Community feedback, real-world validation, refinement

This is deliberately **minimal**. Additional layers can be added, but these five components represent the **irreducible core**.

---

## Contributing

This is a private repository during initial development.

For specification changes, see [RFC Process](docs/RFC_PROCESS.md).

---

## License

MIT License - See [LICENSE](LICENSE) file for details.
