# Internal Documentation

⚠️ **This directory contains internal validation and operational documents.**

These files are **NOT** part of the public v0.1 specification or proof.
They represent:
- Internal QA checklists
- Development run notes
- Operational considerations
- Future extension planning

---

## Public vs Internal Documentation

### ✅ Public (Specification & Proof)

**Location:** Root and `examples/*/proof/`

- `JUDGMENT_BOUNDARY_MINIMAL_SPEC.md`
- `examples/openclaw/proof/EXECUTION_PREVENTION_PROOF.md`
- `examples/shell-boundary/proof/SHELL_WRAPPER_PROOF.md`

**Purpose:** Demonstrate proven capabilities and compliance

### 🔒 Internal (QA & Operations)

**Location:** `docs/internal/`

- `OPENCLAW_QA_CHECKLIST.md`
- `OPENCLAW_RUN_NOTES.md`

**Purpose:** Validation methodology and operator confidence

---

## Why Separate?

Public documents prove **what was achieved**.
Internal documents describe **how we validated and what's next**.

Mixing them creates:
- ❌ "Incomplete" framing (future work looks like missing features)
- ❌ Roadmap exposure
- ❌ Product plan confusion (this is a standard, not a product)

---

## Usage

**Public audience:** Read specification and proof documents only
**Implementers:** May reference internal docs for validation methodology
**Operators:** Use internal docs for deployment confidence
