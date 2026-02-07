# OpenClaw Extended Tests (Internal Only)

⚠️ **Internal Experimental Testing**

This directory contains extended test cases for:
- Invariant regression (structural properties)
- Policy DSL experimentation
- Edge case exploration

**NOT for:**
- Public proof claims
- Production validation
- Coverage statistics
- Safety effectiveness demonstration

**Purpose:** Maintain judgment boundary invariants across refactors and adapter changes.

**Status:** Experimental, non-normative, internal use only.

---

## Test Categories

- File operations (read/write/delete/move)
- Shell commands (exec variants)
- Credential/secret access
- Payment/financial operations
- Browser interactions
- Network operations
- System modifications
- Unknown/ambiguous cases
- Policy DSL edge cases

---

## Invariants Verified

All tests verify one or more of these 4 invariants:

1. **Judgment-before-execution** - Decision occurs before tool call
2. **Decision set** - Result is exactly STOP, HOLD, or ALLOW
3. **Fail-closed** - Unknown/unmatched → HOLD
4. **Audit signal** - `execution_prevented: true` for non-ALLOW

---

## Usage

```bash
node test-extended.mjs
```

Expected: All tests verify invariants hold (not "all blocked" or "all allowed").
