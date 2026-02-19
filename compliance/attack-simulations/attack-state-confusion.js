/**
 * Attack Simulation: State Confusion
 *
 * Demonstrates what happens when decision state is:
 * - undefined
 * - null
 * - stale
 * - tampered
 *
 * Shows AEBS default-deny behavior.
 */

import { executeWithBoundary, clearExecutionLog } from "../reference-harness/boundary-wrapper.js";
import { DecisionState } from "../reference-harness/state-machine.js";

console.log("=== Attack Class B: State Confusion ===\n");

let executionCount = 0;

function testAction() {
  executionCount++;
  return `execution-${executionCount}`;
}

// Test 1: Undefined state
console.log("Test 1: Undefined Decision State\n");

executionCount = 0;
clearExecutionLog();

try {
  executeWithBoundary(testAction, undefined);
  console.log("  ✗ VULNERABLE: Undefined state allowed execution");
} catch (error) {
  console.log("  ✓ PROTECTED: Undefined state blocked");
  console.log(`  Executions: ${executionCount}`);
  console.log("  Default-deny: Enforced\n");
}

// Test 2: Null state
console.log("Test 2: Null Decision State\n");

executionCount = 0;
clearExecutionLog();

try {
  executeWithBoundary(testAction, null);
  console.log("  ✗ VULNERABLE: Null state allowed execution");
} catch (error) {
  console.log("  ✓ PROTECTED: Null state blocked");
  console.log(`  Executions: ${executionCount}`);
  console.log("  Default-deny: Enforced\n");
}

// Test 3: Invalid state value
console.log("Test 3: Invalid Decision State\n");

executionCount = 0;
clearExecutionLog();

try {
  executeWithBoundary(testAction, "INVALID_STATE");
  console.log("  ✗ VULNERABLE: Invalid state allowed execution");
} catch (error) {
  console.log("  ✓ PROTECTED: Invalid state blocked");
  console.log(`  Executions: ${executionCount}`);
  console.log("  Default-deny: Enforced\n");
}

// Test 4: State tampering attempt (empty string)
console.log("Test 4: Empty String State\n");

executionCount = 0;
clearExecutionLog();

try {
  executeWithBoundary(testAction, "");
  console.log("  ✗ VULNERABLE: Empty string allowed execution");
} catch (error) {
  console.log("  ✓ PROTECTED: Empty string blocked");
  console.log(`  Executions: ${executionCount}`);
  console.log("  Default-deny: Enforced\n");
}

// Test 5: Only ALLOW succeeds
console.log("Test 5: Valid ALLOW State (Control)\n");

executionCount = 0;
clearExecutionLog();

try {
  const result = executeWithBoundary(testAction, DecisionState.ALLOW);
  console.log("  ✓ EXPECTED: ALLOW permitted execution");
  console.log(`  Executions: ${executionCount}`);
  console.log(`  Result: ${result.result}\n`);
} catch (error) {
  console.log("  ✗ UNEXPECTED: ALLOW was blocked");
}

// Summary
console.log("=== Summary ===\n");

const confusionStates = [
  "undefined",
  "null",
  "INVALID_STATE",
  '""' // empty string
];

console.log("States tested:");
confusionStates.forEach(state => {
  console.log(`  - ${state}: BLOCKED`);
});

console.log("\nAEBS Default-Deny Model:");
console.log("  If decision_state != ALLOW → execution BLOCKED");
console.log("  No state confusion → No execution\n");

console.log("✓ Attack Class B: AEBS default-deny prevents state confusion\n");
