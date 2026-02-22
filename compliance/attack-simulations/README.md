# AEBS Attack Simulations

**Purpose:** Demonstrate structural failure modes in systems WITHOUT execution boundaries.

**Important:** These are architectural proofs, not vulnerability disclosures.

---

## Overview

These simulations demonstrate what happens when AI systems lack structural execution boundaries.

Each simulation shows:
1. **Without AEBS** — Vulnerable behavior
2. **With AEBS** — Protected behavior

---

## Attack Classes

### Class A: Direct Bypass

**File:** `attack-direct-bypass.js`

**Scenario:** Execution function called directly without judgment

**Without AEBS:**
```javascript
dangerousAction(); // Executes immediately
```

**With AEBS:**
```javascript
executeWithBoundary(dangerousAction, null); // Throws: Blocked
```

**Run:**
```bash
node attack-direct-bypass.js
```

---

### Class B: State Confusion

**File:** `attack-state-confusion.js`

**Scenario:** Decision state is undefined, null, or invalid

**Without AEBS:**
- Undefined state → Execution proceeds
- Null state → Execution proceeds
- Invalid state → Execution proceeds

**With AEBS:**
- Undefined → Blocked (default-deny)
- Null → Blocked (default-deny)
- Invalid → Blocked (default-deny)

**Run:**
```bash
node attack-state-confusion.js
```

---

## Key Insights

### Why These Matter

1. **Direct Bypass** shows need for structural interception
2. **State Confusion** shows need for default-deny

Without both, execution boundaries can be circumvented.

### AEBS Defense

AEBS requires:

```
Execution MUST NOT occur unless decision_state == ALLOW
```

This eliminates both attack classes structurally.

---

## NOT Vulnerability Disclosures

These simulations do NOT represent:

- Exploits against real systems
- Security vulnerabilities
- CVE-worthy issues

These ARE:

- Architectural failure modes
- Design pattern demonstrations
- Structural proofs

---

## Adding Your Own Simulations

To add a simulation:

1. Create `attack-{name}.js`
2. Show "Without AEBS" behavior
3. Show "With AEBS" protection
4. Document the attack class
5. Update this README

---

## Future Attack Classes (Planned)

### Class C: Race Conditions

**Scenario:** Parallel execution attempts during HOLD state

**Protection:** Atomic state transitions required

### Class D: Authority Confusion

**Scenario:** Multiple judgment sources with conflicting decisions

**Protection:** AEBS-3 authority delegation model

---

## Running All Simulations

```bash
# Run all attack simulations
node attack-direct-bypass.js
node attack-state-confusion.js
```

Expected: All show AEBS successfully blocks attacks.

---

## Notes

These simulations use the reference harness from `../reference-harness/`.

They demonstrate structural properties, not production security.

Real systems require additional hardening beyond AEBS structural separation.

---

**Status:** v1.0-rc Simulations
**Part of:** AI Execution Boundary Standard (AEBS)
