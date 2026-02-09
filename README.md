# AI Execution Boundary Specification

![v0.1 SEALED](https://img.shields.io/badge/v0.1-SEALED-green?style=flat-square)
![Two Independent Proofs](https://img.shields.io/badge/Proofs-2%20Independent-blue?style=flat-square)
![Judgment Boundary Spec](https://img.shields.io/badge/Spec-Runtime%20Agnostic-purple?style=flat-square)

## Important Notice

This repository defines concepts specifications or proofs related to execution or judgment boundaries This repository is not an implementation not a product and not an enforcement mechanism It provides no runtime guarantees compliance claims or safety certification It does not prevent misuse accidents or harm by itself All examples code and diagrams are illustrative and exist only to clarify ideas Any operational enforcement must be implemented outside the model and outside this repository

Questions discussions and critical review are welcome via GitHub Issues This repository intentionally separates conceptual clarity from execution responsibility

---

> ⚠️ **This is not about AI safety.**
>
> It is about **execution authority**.
>
> AI systems can reason freely.
> Execution is a separate concern.

---

## What This Is

This repository defines and proves an **Execution Authority Boundary**.

It answers a single question:

> **Can execution be structurally prevented BEFORE it happens,
> without modifying the model?**

**Answer:** Yes. Proven twice.

---

## What Is Proven

- Judgment occurs **before execution**
- Decisions are **STOP / HOLD / ALLOW**
- Unknown cases **fail-closed (HOLD)**
- Execution prevention emits an **audit signal**
- The model is untouched

---

## Scope
This repository defines judgment boundaries that prevent execution without an explicit judgment step.
It does not own, automate, or enforce judgment authority and makes no legal or compliance claims.

## Non-Goals
- No judgment automation or ownership
- No legal-grade or court-ready claims
- No sealed or proprietary authority
- No safety or compliance guarantees

---

## Proven Implementations

### 1. OpenClaw Plugin — Framework-Level Interception

- **Hook:** `before_tool_call`
- **Tests:** 6/6 automated tests passed
- **Status:** ✅ v0.1 COMPLIANT
- **Evidence:** `examples/openclaw/proof/EXECUTION_PREVENTION_PROOF.md`

### 2. Shell Wrapper — Universal, Runtime-Agnostic

- **Hook:** Bash wrapper (`judge-exec`)
- **Tests:** Manual validation (STOP/HOLD/ALLOW)
- **Dependencies:** Zero (bash only)
- **Status:** ✅ v0.1 COMPLIANT
- **Evidence:** `examples/shell-boundary/proof/SHELL_WRAPPER_PROOF.md`

Both implementations comply with:
📄 **`JUDGMENT_BOUNDARY_MINIMAL_SPEC.md`** (Runtime-agnostic standard)

---

## What This Is NOT

This is **not**:
- AI safety
- Guardrails
- Prompt filtering
- Post-hoc monitoring
- Compliance framework
- Regulatory guideline

This **is** execution authority.

---

## Status

**Release:** v0.1 (2026-02-08)
**Scope:** Judgment Logic & Pre-Execution Blocking
**Proven:** Two independent implementations

---

## Background

This repository is part of the **Judgment Boundary** research:
→ https://github.com/Nick-heo-eg/stop-first-rag/blob/master/JUDGMENT_BOUNDARY_MANIFEST.md

**Purpose:** Define minimum structural requirements for AI agent execution governance

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

## Execution OS Clarification

**What Execution OS does:**
- Executes approved actions exactly as specified
- Produces tamper-evident evidence of execution
- Returns execution receipts

**What Execution OS does NOT do:**
- ❌ Does NOT decide whether an action should occur
- ❌ Does NOT issue approvals
- ❌ Does NOT judge executability
- ❌ Does NOT retry or branch on failure
- ❌ Does NOT infer parameters

**Critical distinctions:**
- Execution OS is **not an agent**
- Execution OS has **no autonomy**
- Execution OS is **powerful precisely because it is stupid**

For architectural context, see:
[Three-Layer Architecture](https://github.com/Nick-heo-eg/execution-governance-spec/blob/master/ARCHITECTURE_THREE_LAYER.md)

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

## Reference Implementations

This specification is tool- and model-agnostic.

Concrete reference implementations are provided under **`examples/`** to demonstrate **where an execution boundary must exist in real systems**.

### Available Examples

- **[examples/openclaw/](examples/openclaw/)** - Pre-execution judgment boundary using agent framework native hooks
  - Demonstrates: structural position, temporal ordering, audit format
  - Shows: 4/4 dangerous scenarios blocked before execution
  - Proves: Prevention is achievable by structural design

**These examples are proofs of structural placement, not endorsements or critiques of any specific framework.**

See also:
- [proof/WHAT_COUNTS_AS_PROOF.md](proof/WHAT_COUNTS_AS_PROOF.md) for validation criteria

---

## Status and Evolution

- **v0.1 (current):** Initial draft, minimal viable structure
- **Future:** Community feedback, real-world validation, refinement

This is deliberately **minimal**. Additional layers can be added, but these five components represent the **irreducible core**.

---

## Scope Clarification (Non-Normative)

This repository intentionally does **not** attempt to:

- Demonstrate real-world safety effectiveness
- Provide large-scale production validation
- Optimize false-positive / false-negative rates
- Defend against all prompt-level bypass strategies
- Maximize automation or minimize human approvals

Version v0.1 answers one question only:

> Does a structurally independent judgment occur *before* execution,
> and can that prevention be explicitly proven?

**Meaning of This Proof**

This proof does not guarantee that all harmful actions are preventable.

It guarantees something narrower and stronger:

If execution occurred, an explicit ALLOW decision existed beforehand.
If execution did not occur, prevention was structural, not corrective.

This work fixes responsibility boundaries, not outcome guarantees.

---

Operational usability, policy tuning, attack hardening,
and workflow optimization are explicitly **out of scope** for this version.

---

## Contributing

This is a private repository during initial development.

For specification changes, see [RFC Process](docs/RFC_PROCESS.md).

---

## License

MIT License - See [LICENSE](LICENSE) file for details.
