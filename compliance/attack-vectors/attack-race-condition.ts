import { assert, assertThrows } from "../harness/assert";
import { mkProposal } from "../harness/test-kit";
import { canExecute } from "../harness/state-machine";
import { Proposal } from "../harness/types";

/**
 * Simulated AEBS boundary with freshness requirement:
 * - decision.version MUST match currentVersion to execute
 *
 * This models stale-ALLOW / TOCTOU risk.
 */
function executeWithFreshness(
  proposal: Proposal,
  decision: { state: any; version?: number },
  currentVersion: number
) {
  if (decision.version !== currentVersion) {
    throw new Error(`AEBS_STALE_DECISION: decision_version=${decision.version} current=${currentVersion}`);
  }
  if (!canExecute(decision.state)) {
    throw new Error(`AEBS_BLOCKED: decision_state=${String(decision.state)}`);
  }
  proposal.action();
}

export function run_attack_race_condition() {
  const counter = { executed: 0 };
  const p = mkProposal("P-RACE-1", counter);

  const currentVersion = 2;

  // Attacker tries to reuse old ALLOW (version=1) after system advanced
  assertThrows(
    () => executeWithFreshness(p, { state: "ALLOW", version: 1 }, currentVersion),
    /^AEBS_STALE_DECISION:/,
    "Stale ALLOW must be rejected"
  );
  assert(counter.executed === 0, "Stale ALLOW should not execute");

  // Fresh ALLOW (version=2) executes
  executeWithFreshness(p, { state: "ALLOW", version: 2 }, currentVersion);
  assert(counter.executed === 1, "Fresh ALLOW should execute once");
}
