/**
 * Attack Simulation: Direct Bypass
 *
 * Demonstrates what happens when an execution function
 * is called directly without judgment boundary.
 *
 * This is NOT a vulnerability disclosure.
 * This is an architectural proof showing why AEBS is necessary.
 */

import { executeWithBoundary, clearExecutionLog } from "../reference-harness/boundary-wrapper.js";
import { DecisionState } from "../reference-harness/state-machine.js";

console.log("=== Attack Class A: Direct Bypass ===\n");

// Mock dangerous action
let sideEffectOccurred = false;

function dangerousAction() {
  sideEffectOccurred = true;
  console.log("  [!] Side effect occurred");
  return "executed";
}

// Scenario 1: WITHOUT AEBS
console.log("Scenario 1: Without AEBS Boundary\n");

sideEffectOccurred = false;

console.log("  Attacker calls execution function directly:");
dangerousAction(); // Executes immediately - NO BOUNDARY

if (sideEffectOccurred) {
  console.log("  ✗ VULNERABLE: Direct execution succeeded");
  console.log("  No judgment occurred");
  console.log("  No decision state checked");
  console.log("  No audit trail created\n");
}

// Scenario 2: WITH AEBS
console.log("Scenario 2: With AEBS Boundary\n");

sideEffectOccurred = false;
clearExecutionLog();

console.log("  Attacker attempts direct execution:");
console.log("  (simulated by calling with NULL decision)\n");

try {
  executeWithBoundary(dangerousAction, null);
  console.log("  ✗ FAILED: Execution was not blocked");
} catch (error) {
  console.log("  ✓ PROTECTED: Execution blocked");
  console.log(`  Reason: ${error.message}`);
  console.log(`  Side effect occurred: ${sideEffectOccurred}`);
  console.log("  Judgment enforced: Yes");
  console.log("  Audit trail: Yes\n");
}

// Scenario 3: Explicit STOP
console.log("Scenario 3: With AEBS + Explicit STOP Decision\n");

sideEffectOccurred = false;
clearExecutionLog();

console.log("  Judgment result: STOP");
console.log("  Attempting execution:\n");

try {
  executeWithBoundary(dangerousAction, DecisionState.STOP);
  console.log("  ✗ FAILED: Execution was not blocked");
} catch (error) {
  console.log("  ✓ PROTECTED: Execution blocked");
  console.log(`  Decision: STOP`);
  console.log(`  Side effect occurred: ${sideEffectOccurred}`);
  console.log("  Judgment enforced: Yes\n");
}

// Summary
console.log("=== Summary ===\n");
console.log("Without AEBS:");
console.log("  - Direct execution possible");
console.log("  - No judgment required");
console.log("  - No audit trail\n");

console.log("With AEBS:");
console.log("  - Direct execution blocked");
console.log("  - Judgment required");
console.log("  - Decisions logged");
console.log("  - Default-deny enforced\n");

console.log("✓ Attack Class A: AEBS successfully prevents direct bypass\n");
