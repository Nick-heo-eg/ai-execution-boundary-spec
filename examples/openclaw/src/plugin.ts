// @ts-nocheck
import { judge } from "./judge.js";
import { audit } from "./logger.js";

function normalize(raw: any) {
  // Extract args properly - prefer raw.args (string) over raw.params (object)
  let args = raw?.args ?? "";
  if (!args && raw?.params) {
    // If params is an object, try to extract command or convert to string
    if (typeof raw.params === "object") {
      args = raw.params.command || JSON.stringify(raw.params);
    } else {
      args = String(raw.params);
    }
  }
  if (!args && raw?.tool?.args) {
    args = raw.tool.args;
  }

  return {
    source: raw?.source ?? "tool",
    tool: raw?.toolName ?? raw?.tool?.name ?? raw?.tool ?? "unknown",
    action: raw?.action ?? raw?.tool?.action ?? "unknown",
    args: args,
    risk_hints: raw?.risk_hints ?? raw?.riskHints ?? []
  };
}

const judgmentGatePlugin = {
  id: "judgment-gate",
  name: "Judgment Gate (Stop-First)",
  description: "Pre-execution judgment layer that blocks or holds tool calls based on policy",
  configSchema: { type: "object", additionalProperties: false, properties: {} },

  register(api: any) {
    api.logger.info("judgment-gate: plugin registered");

    // Register before_tool_call hook
    api.on("before_tool_call", async (event: any) => {
      const ctx = normalize(event);
      const res = judge(ctx);

      // Audit non-ALLOW decisions
      if (res.decision !== "ALLOW") {
        audit(res, ctx);
      }

      // Block execution if STOP or HOLD
      if (res.decision === "STOP") {
        api.logger.warn(`judgment-gate: STOP - ${res.reason} (rule: ${res.rule_id})`);
        return {
          block: true,
          blockReason: `Judgment STOP: ${res.reason}`
        };
      }

      if (res.decision === "HOLD") {
        api.logger.warn(`judgment-gate: HOLD - ${res.reason} (rule: ${res.rule_id})`);
        return {
          block: true,
          blockReason: `Judgment HOLD: ${res.reason} (requires approval)`
        };
      }

      // ALLOW - let it proceed
      return undefined;
    });

    api.logger.info("judgment-gate: before_tool_call hook registered");
  },
};

export default judgmentGatePlugin;
