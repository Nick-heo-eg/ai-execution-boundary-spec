import { executeWithBoundary, nonBoundaryExecute } from "../harness/boundary-wrapper";
import { assert, assertThrows } from "../harness/assert";
import { mkProposal } from "../harness/test-kit";

export function run_attack_direct_bypass() {
  const counter = { executed: 0 };
  const p = mkProposal("P-DIRECT-1", counter);

  // Without AEBS: direct execution happens
  nonBoundaryExecute(p);
  assert(counter.executed === 1, "Without AEBS should execute once");

  // With AEBS: bypass attempt blocked (no ALLOW)
  assertThrows(
    () => executeWithBoundary(p, { state: "STOP" }),
    /^AEBS_BLOCKED:/,
    "With AEBS STOP must block"
  );
  assert(counter.executed === 1, "With AEBS STOP should not execute");
}
