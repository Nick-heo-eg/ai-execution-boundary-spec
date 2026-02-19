export type DecisionState = "STOP" | "HOLD" | "ALLOW" | null | undefined;

export type Decision = {
  state: DecisionState;
  // optional: decision id for correlation
  decision_id?: string;
  // optional: monotonic timestamp / version for race tests
  version?: number;
};

export type Proposal = {
  proposal_id: string;
  // side-effectful action (simulated)
  action: () => void;
};
