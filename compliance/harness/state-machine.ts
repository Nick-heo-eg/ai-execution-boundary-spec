import { DecisionState } from "./types";

/**
 * AEBS default-deny model.
 * Execution MUST NOT occur unless decision_state == ALLOW.
 */
export function canExecute(state: DecisionState): boolean {
  return state === "ALLOW";
}
