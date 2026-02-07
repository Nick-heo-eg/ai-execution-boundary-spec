---
title: "What counts as proof for v0.1?"
labels: ["documentation", "pinned"]
---

# What Counts as Proof for Judgment Boundary v0.1?

This issue explains **what evidence constitutes valid proof** for the Judgment Boundary Minimal Specification v0.1.

---

## TL;DR

**Valid proof requires:**
1. Judgment happens **before execution**
2. Decision is **STOP / HOLD / ALLOW**
3. Unknown cases **fail-closed (HOLD)**
4. Audit signal includes **`execution_prevented: true`**
5. Model is **not modified**

**Invalid claims:**
- "We blocked X dangerous actions" (quantity doesn't prove timing)
- "Our accuracy is 99%" (safety metrics don't prove structure)
- "We use prompt engineering" (model modification ≠ execution boundary)

---

## Full Methodology

See: [`proof/WHAT_COUNTS_AS_PROOF.md`](../proof/WHAT_COUNTS_AS_PROOF.md)

### Key Distinctions

| What Matters | What Doesn't Matter |
|--------------|---------------------|
| **Where** judgment occurred | How many actions were blocked |
| **When** relative to execution | Accuracy percentage |
| **Structural position** | Safety claims |
| **`execution_prevented` flag** | Post-hoc logging |

---

## Current Proven Implementations

### 1. OpenClaw Plugin ✅

- **Interception:** `before_tool_call` hook
- **Evidence:** 6/6 automated tests, all non-ALLOW show `execution_prevented: true`
- **Location:** `examples/openclaw/proof/EXECUTION_PREVENTION_PROOF.md`

### 2. Shell Wrapper ✅

- **Interception:** Bash wrapper runs before shell execution
- **Evidence:** Manual validation, audit log with `execution_prevented` field
- **Location:** `examples/shell-boundary/proof/SHELL_WRAPPER_PROOF.md`

---

## Why Structural Position Matters

### ❌ Post-Execution "Prevention"

```
AI → generates command → executes → logs "blocked" → rollback
```

**Problem:** Execution already happened. Rollback ≠ prevention.

### ✅ Pre-Execution Judgment

```
AI → proposes command → JUDGMENT → [STOP/HOLD/ALLOW] → execution (maybe)
```

**Proof:** `execution_prevented: true` emitted **before** execution attempt.

---

## Compliance Checklist

To prove v0.1 compliance, demonstrate:

- [ ] **3.1 Interception Point** - Hook runs before execution layer
- [ ] **3.2 Decision Set** - STOP / HOLD / ALLOW implemented
- [ ] **3.3 Fail-Closed Rule** - Unknown commands → HOLD
- [ ] **3.4 Audit Signal** - `execution_prevented` field present

**Reference:** `JUDGMENT_BOUNDARY_MINIMAL_SPEC.md`

---

## What This Is NOT About

This specification does **NOT** measure:
- Safety (how "good" the AI is)
- Accuracy (false positive/negative rates)
- Performance (latency, throughput)
- Completeness (coverage of all possible actions)

Those are orthogonal concerns.

---

## Discussion

Questions about proof methodology? Reply below.

Proposing a new implementation? Show:
1. Interception point (code)
2. Test results (execution_prevented verification)
3. Fail-closed behavior (what happens for unknown commands)

---

## Related Documents

- 📄 [`JUDGMENT_BOUNDARY_MINIMAL_SPEC.md`](../JUDGMENT_BOUNDARY_MINIMAL_SPEC.md) - v0.1 specification
- 📄 [`proof/WHAT_COUNTS_AS_PROOF.md`](../proof/WHAT_COUNTS_AS_PROOF.md) - Detailed methodology
- 📄 [`RELEASE_v0.1_SEAL.md`](../examples/openclaw/RELEASE_v0.1_SEAL.md) - v0.1 release notes

---

**Status:** v0.1 (Two independent proofs sealed)
**Tag:** `v0.1-execution-boundary-proof`
