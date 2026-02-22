# AEBS Reference Harness

**Version:** 0.9.0
**Part of:** AI Execution Boundary Standard (AEBS)

---

## Overview

This reference harness demonstrates structural viability of the AEBS execution boundary model.

**Purpose:** Prove that AEBS requirements can be satisfied in practice.

**This is NOT:**
- A production implementation
- A complete AI agent system
- A policy engine

**This IS:**
- A minimal structural proof
- A conformance test suite
- A reference for implementers

---

## Quick Start

```bash
# Install (no external dependencies)
npm install

# Run tests
npm test
```

Expected output:

```
AEBS Compliance Test Suite v1.0-rc

[Category A: Decision Enforcement]

✓ AEBS-T01: STOP prevents execution
✓ AEBS-T02: HOLD defers execution
✓ AEBS-T03: ALLOW permits execution
✓ AEBS-T04: NULL blocks execution (default-deny)

[Category B: State Machine]

✓ State machine: PROPOSAL → JUDGMENT transition
✓ State machine: JUDGMENT → EXECUTION (ALLOW)
✓ State machine: JUDGMENT → HALT (STOP)
✓ State machine: JUDGMENT → HALT (NULL)

[Category C: Runtime Blocking]

✓ AEBS-T06: Runtime blocking enforcement

[Summary]

Tests Run:    9
Passed:       9
Failed:       0
Pass Rate:    100.0%

✓ Level 1 Conformance: PASS

All structural requirements satisfied.
```

---

## Architecture

### Files

```
state-machine.js      - Core decision state logic
boundary-wrapper.js   - Execution boundary enforcement
test-runner.js        - Conformance test suite
```

### State Machine

Implements formal model from [spec/aebs-formal-model.md](../../spec/aebs-formal-model.md):

```
States: PROPOSAL → JUDGMENT → EXECUTION | HALT
Decisions: STOP | HOLD | ALLOW | NULL
Default: deny
```

### Boundary Wrapper

Enforces core requirement:

```javascript
Execution MUST NOT occur unless decision_state == ALLOW
```

### Test Runner

Executes conformance tests from [spec/conformance-tests.md](../../spec/conformance-tests.md).

---

## Usage

### As a Library

```javascript
import { executeWithBoundary } from "./boundary-wrapper.js";
import { DecisionState } from "./state-machine.js";

function myAction() {
  console.log("Action executed");
  return "result";
}

// With ALLOW - executes
const result = executeWithBoundary(
  myAction,
  DecisionState.ALLOW
);

// With STOP - throws
try {
  executeWithBoundary(myAction, DecisionState.STOP);
} catch (error) {
  console.log("Blocked:", error.message);
}
```

### For Verification

Use this harness to verify AEBS concepts:

1. Clone the repository
2. Run `npm test`
3. Examine test-runner.js for verification logic
4. Adapt to your system architecture

---

## Design Principles

### Minimal Dependencies

- Zero external dependencies (except Node.js runtime)
- Pure JavaScript (ES modules)
- No framework coupling

### Structural Focus

Tests verify:
- State transition correctness
- Default-deny behavior
- Runtime blocking capability

Tests do NOT verify:
- Policy correctness
- Content safety
- Performance characteristics

### Reference, Not Production

This harness demonstrates structural viability only.

Production implementations should add:
- Robust error handling
- Logging infrastructure
- Policy integration
- Performance optimization
- Security hardening

---

## Attack Simulations

See [../attack-simulations/](../attack-simulations/) for demonstrations of:

- Direct bypass attempts
- State confusion attacks
- Race condition scenarios

These show what happens WITHOUT AEBS enforcement.

---

## Conformance

This harness satisfies:

✓ **AEBS Level 1** (Structural Conformance)
- Decision enforcement (T01-T04)
- State machine correctness
- Runtime blocking (T06)

✓ **AEBS Level 2** (Observability Conformance)
- Execution log available via `getExecutionLog()`
- Decision states recorded
- Timestamps captured

---

## Extending

To adapt for your system:

1. **Replace mock action** with real action executor
2. **Integrate judgment logic** (policy engine, rules, etc.)
3. **Add observability** (OpenTelemetry, logs, metrics)
4. **Implement persistence** (if needed for HOLD states)

Core structure remains the same:

```
proposal → judgment → boundary check → execute (if ALLOW)
```

---

## License

MIT License - Same as AEBS specification

---

## Contact

For questions about this harness:

- **GitHub Issues:** [ai-execution-boundary-spec/issues](https://github.com/Nick-heo-eg/ai-execution-boundary-spec/issues)

For AEBS specification questions:

- **GitHub Discussions:** [ai-execution-boundary-spec/discussions](https://github.com/Nick-heo-eg/ai-execution-boundary-spec/discussions)

---

**Status:** Reference Implementation (v1.0-rc)
**Part of:** AI Execution Boundary Standard (AEBS)
