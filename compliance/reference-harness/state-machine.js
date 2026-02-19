/**
 * AEBS State Machine
 * Implements core decision state logic
 */

export const DecisionState = {
  STOP: "STOP",
  HOLD: "HOLD",
  ALLOW: "ALLOW",
  NULL: null
};

/**
 * Determines if execution can proceed based on decision state
 * Implements default-deny model
 *
 * @param {string|null} state - Decision state (STOP|HOLD|ALLOW|null)
 * @returns {boolean} - Whether execution is permitted
 */
export function canExecute(state) {
  // Default-deny: Only ALLOW permits execution
  if (state === DecisionState.ALLOW) {
    return true;
  }
  return false;
}

/**
 * Validates decision state
 *
 * @param {string|null} state - Decision state to validate
 * @returns {boolean} - Whether state is valid
 */
export function isValidState(state) {
  return state === DecisionState.STOP ||
         state === DecisionState.HOLD ||
         state === DecisionState.ALLOW ||
         state === DecisionState.NULL;
}

/**
 * State transition function
 * Implements formal model: δ(S₁, d) → S₂
 *
 * @param {string} currentState - Current system state
 * @param {string|null} decision - Decision value
 * @returns {string} - Next state
 */
export function transition(currentState, decision) {
  if (currentState === "PROPOSAL") {
    return "JUDGMENT";
  }

  if (currentState === "JUDGMENT") {
    if (decision === DecisionState.ALLOW) {
      return "EXECUTION";
    }
    return "HALT";
  }

  // Terminal states
  return currentState;
}
