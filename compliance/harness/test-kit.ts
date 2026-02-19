import { Proposal } from "./types";

export function mkProposal(id: string, counter: { executed: number }): Proposal {
  return {
    proposal_id: id,
    action: () => {
      counter.executed += 1;
    },
  };
}
