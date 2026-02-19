/**
 * AEBS Reference Harness Test Runner
 * Executes conformance tests
 */

import { DecisionState, canExecute, transition } from "./state-machine.js";
import { executeWithBoundary, clearExecutionLog, getExecutionLog } from "./boundary-wrapper.js";

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test helper
 */
function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: "PASS" });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: "FAIL", error: error.message });
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
  }
}

/**
 * Mock action for testing
 */
let executionCounter = 0;
function mockAction() {
  executionCounter++;
  return `executed-${executionCounter}`;
}

console.log("AEBS Compliance Test Suite v0.9\n");
console.log("[Category A: Decision Enforcement]\n");

// AEBS-T01: STOP Prevents Execution
test("AEBS-T01: STOP prevents execution", () => {
  clearExecutionLog();
  executionCounter = 0;

  try {
    executeWithBoundary(mockAction, DecisionState.STOP);
    throw new Error("Expected execution to be blocked");
  } catch (error) {
    if (!error.message.includes("AEBS Boundary")) {
      throw error;
    }
  }

  if (executionCounter !== 0) {
    throw new Error("Action was executed despite STOP");
  }

  const log = getExecutionLog();
  if (log[0].decision !== DecisionState.STOP) {
    throw new Error("Decision not logged correctly");
  }
});

// AEBS-T02: HOLD Defers Execution
test("AEBS-T02: HOLD defers execution", () => {
  clearExecutionLog();
  executionCounter = 0;

  try {
    executeWithBoundary(mockAction, DecisionState.HOLD);
    throw new Error("Expected execution to be blocked");
  } catch (error) {
    if (!error.message.includes("AEBS Boundary")) {
      throw error;
    }
  }

  if (executionCounter !== 0) {
    throw new Error("Action was executed despite HOLD");
  }
});

// AEBS-T03: ALLOW Permits Execution
test("AEBS-T03: ALLOW permits execution", () => {
  clearExecutionLog();
  executionCounter = 0;

  const result = executeWithBoundary(mockAction, DecisionState.ALLOW);

  if (!result.success) {
    throw new Error("Execution was blocked despite ALLOW");
  }

  if (executionCounter !== 1) {
    throw new Error("Action was not executed");
  }

  const log = getExecutionLog();
  if (!log[0].executed) {
    throw new Error("Execution not logged correctly");
  }
});

// AEBS-T04: NULL Blocks Execution (Default-Deny)
test("AEBS-T04: NULL blocks execution (default-deny)", () => {
  clearExecutionLog();
  executionCounter = 0;

  try {
    executeWithBoundary(mockAction, DecisionState.NULL);
    throw new Error("Expected execution to be blocked");
  } catch (error) {
    if (!error.message.includes("AEBS Boundary")) {
      throw error;
    }
  }

  if (executionCounter !== 0) {
    throw new Error("Action was executed despite NULL");
  }
});

console.log("\n[Category B: State Machine]\n");

// State machine tests
test("State machine: PROPOSAL → JUDGMENT transition", () => {
  const next = transition("PROPOSAL", null);
  if (next !== "JUDGMENT") {
    throw new Error(`Expected JUDGMENT, got ${next}`);
  }
});

test("State machine: JUDGMENT → EXECUTION (ALLOW)", () => {
  const next = transition("JUDGMENT", DecisionState.ALLOW);
  if (next !== "EXECUTION") {
    throw new Error(`Expected EXECUTION, got ${next}`);
  }
});

test("State machine: JUDGMENT → HALT (STOP)", () => {
  const next = transition("JUDGMENT", DecisionState.STOP);
  if (next !== "HALT") {
    throw new Error(`Expected HALT, got ${next}`);
  }
});

test("State machine: JUDGMENT → HALT (NULL)", () => {
  const next = transition("JUDGMENT", null);
  if (next !== "HALT") {
    throw new Error(`Expected HALT, got ${next}`);
  }
});

console.log("\n[Category C: Runtime Blocking]\n");

// AEBS-T06: Runtime Blocking Enforcement
test("AEBS-T06: Runtime blocking enforcement", () => {
  clearExecutionLog();
  executionCounter = 0;

  // Attempt direct execution (without boundary)
  mockAction(); // This executes (VULNERABLE without AEBS)

  // With AEBS boundary
  clearExecutionLog();
  executionCounter = 0;

  try {
    executeWithBoundary(mockAction, null); // Should block
    throw new Error("Expected blocking");
  } catch (error) {
    if (!error.message.includes("AEBS Boundary")) {
      throw error;
    }
  }

  if (executionCounter !== 0) {
    throw new Error("Boundary failed to block execution");
  }
});

console.log("\n[Summary]\n");

const total = results.passed + results.failed;
const passRate = ((results.passed / total) * 100).toFixed(1);

console.log(`Tests Run:    ${total}`);
console.log(`Passed:       ${results.passed}`);
console.log(`Failed:       ${results.failed}`);
console.log(`Pass Rate:    ${passRate}%`);

if (results.failed === 0) {
  console.log("\n✓ Level 1 Conformance: PASS");
  console.log("\nAll structural requirements satisfied.");
} else {
  console.log("\n✗ Level 1 Conformance: FAIL");
  console.log("\nSome structural requirements not satisfied.");
  process.exit(1);
}
