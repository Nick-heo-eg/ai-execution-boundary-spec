/**
 * AEBS Boundary Wrapper
 * Implements execution boundary enforcement
 */

import { canExecute, DecisionState } from "./state-machine.js";

/**
 * Execution log for observability
 */
const executionLog = [];

/**
 * Execute action with boundary enforcement
 * Implements AEBS core requirement: Execution MUST NOT occur unless decision_state == ALLOW
 *
 * @param {Function} action - Proposed action to execute
 * @param {string|null} decision - Judgment decision (STOP|HOLD|ALLOW|null)
 * @param {Object} metadata - Optional metadata for logging
 * @returns {Object} - Execution result with status
 * @throws {Error} - If execution is blocked
 */
export function executeWithBoundary(action, decision, metadata = {}) {
  const timestamp = new Date().toISOString();

  // Log judgment
  const logEntry = {
    timestamp,
    decision,
    metadata,
    executed: false
  };

  // Enforce boundary
  if (!canExecute(decision)) {
    logEntry.blocked = true;
    logEntry.reason = `Execution blocked: decision_state = ${decision ?? "NULL"}`;
    executionLog.push(logEntry);

    throw new Error(
      `AEBS Boundary: Execution blocked (decision: ${decision ?? "NULL"})`
    );
  }

  // Execute if ALLOW
  try {
    const result = action();
    logEntry.executed = true;
    logEntry.result = result;
    executionLog.push(logEntry);

    return {
      success: true,
      result,
      decision
    };
  } catch (error) {
    logEntry.error = error.message;
    executionLog.push(logEntry);
    throw error;
  }
}

/**
 * Get execution log for verification
 * Implements observability requirement
 *
 * @returns {Array} - Execution log entries
 */
export function getExecutionLog() {
  return [...executionLog];
}

/**
 * Clear execution log (for testing)
 */
export function clearExecutionLog() {
  executionLog.length = 0;
}
