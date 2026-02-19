import { executeWithBoundary, nonBoundaryExecute } from "../harness/boundary-wrapper";
import { assert, assertThrows } from "../harness/assert";
import { mkProposal } from "../harness/test-kit";

export function run_attack_default_deny() {
  const counter = { executed: 0 };
  const p = mkProposal("P-DEFAULTDENY-1", counter);

  // Without AEBS: executes even when state is unknown (illustrative failure)
  nonBoundaryExecute(p);
  assert(counter.executed === 1, "Without AEBS should execute once");

  // With AEBS: undefined blocks (default-deny)
  assertThrows(
    () => executeWithBoundary(p, { state: undefined }),
    /^AEBS_BLOCKED:/,
    "With AEBS undefined must block (default-deny)"
  );
  assert(counter.executed === 1, "With AEBS undefined should not execute");

  // With AEBS: null blocks (default-deny)
  assertThrows(
    () => executeWithBoundary(p, { state: null }),
    /^AEBS_BLOCKED:/,
    "With AEBS null must block (default-deny)"
  );
  assert(counter.executed === 1, "With AEBS null should not execute");
}
