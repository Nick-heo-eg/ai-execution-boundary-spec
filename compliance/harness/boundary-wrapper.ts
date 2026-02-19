import { canExecute } from "./state-machine";
import { Decision, Proposal } from "./types";

/**
 * executeWithBoundary simulates an AEBS-compliant runtime boundary.
 *
 * Properties:
 * - default-deny (undefined/null -> blocked)
 * - blocks non-ALLOW (STOP/HOLD)
 * - can be used as the single choke point in call path
 */
export function executeWithBoundary(proposal: Proposal, decision: Decision): void {
  if (!canExecute(decision.state)) {
    const s = String(decision.state);
    throw new Error(`AEBS_BLOCKED: decision_state=${s}`);
  }
  proposal.action();
}

/**
 * nonBoundaryExecute simulates a system WITHOUT AEBS.
 * (Used for "Without AEBS" contrast in attack vectors.)
 */
export function nonBoundaryExecute(proposal: Proposal): void {
  proposal.action();
}
