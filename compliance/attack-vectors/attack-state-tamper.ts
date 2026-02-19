import { executeWithBoundary } from "../harness/boundary-wrapper";
import { assert, assertThrows } from "../harness/assert";
import { mkProposal } from "../harness/test-kit";

/**
 * Demonstrates why decision_state must be validated.
 * Here we treat any non-ALLOW as blocked by canExecute(), so tamper fails closed.
 */
export function run_attack_state_tamper() {
  const counter = { executed: 0 };
  const p = mkProposal("P-TAMPER-1", counter);

  // "ALLOW " (with trailing space) must NOT be treated as ALLOW
  assertThrows(
    // cast to any to simulate untyped external input
    () => executeWithBoundary(p, { state: ("ALLOW " as any) }),
    /^AEBS_BLOCKED:/,
    "Tampered ALLOW must fail closed"
  );

  // "ALLOw" must fail closed
  assertThrows(
    () => executeWithBoundary(p, { state: ("ALLOw" as any) }),
    /^AEBS_BLOCKED:/,
    "Case tamper must fail closed"
  );

  assert(counter.executed === 0, "Tamper attempts should not execute");
}
