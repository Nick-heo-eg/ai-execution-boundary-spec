import { loadRules } from "./rules.js";

const rules = loadRules();

type Decision = "ALLOW" | "HOLD" | "STOP";
export function judge(ctx: any): { decision: Decision; reason: string; rule_id?: string } {
  for (const r of rules) {
    if (r.matches(ctx)) return { decision: r.decision, reason: r.reason, rule_id: r.id };
  }
  return { decision: "HOLD", reason: "Unclassified action (fail-closed default)" };
}
