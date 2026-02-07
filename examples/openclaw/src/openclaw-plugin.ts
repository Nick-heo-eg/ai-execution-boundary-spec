/**
 * Judgment Gate - OpenClaw Plugin
 *
 * Pre-execution judgment boundary for autonomous agents.
 * Intercepts tool calls and applies STOP/HOLD/ALLOW decisions
 * based on policy rules.
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as YAML from "yaml";

// ============================================================================
// Types
// ============================================================================

type Decision = "ALLOW" | "HOLD" | "STOP";

type PolicyRule = {
  id: string;
  decision: Decision;
  when: {
    tool_in?: string[];
    source_in?: string[];
    any_regex_in_args?: string[];
    risk_hints_any?: string[];
    action_any?: string[];
  };
  reason: string;
};

type JudgmentContext = {
  source: string;
  tool: string;
  action: string;
  args: string;
  risk_hints: string[];
};

type JudgmentResult = {
  decision: Decision;
  reason: string;
  rule_id?: string;
};

type AuditEntry = {
  ts: string;
  tool: string;
  params?: unknown;
  risk_hints?: string[];
  decision: Decision;
  rule_id?: string;
  blocked: boolean;
  block_reason: string;
  execution_prevented: boolean;
  session_key?: string;
};

// ============================================================================
// Policy Loader
// ============================================================================

function loadRules(): PolicyRule[] {
  try {
    const policyPath = join(__dirname, "../rules/policy.yaml");
    const raw = readFileSync(policyPath, "utf8");
    const doc = YAML.parse(raw);
    return doc.rules ?? [];
  } catch (err) {
    console.warn(`judgment-gate: failed to load policy.yaml: ${String(err)}`);
    return [];
  }
}

function matchRule(when: PolicyRule["when"], ctx: JudgmentContext): boolean {
  if (!when) return false;

  // Tool name matching
  if (when.tool_in && !when.tool_in.includes(ctx.tool)) {
    return false;
  }

  // Source matching
  if (when.source_in && !when.source_in.includes(ctx.source)) {
    return false;
  }

  // Regex in args
  if (when.any_regex_in_args) {
    const text = String(ctx.args ?? "");
    const ok = when.any_regex_in_args.some((re) => new RegExp(re, "i").test(text));
    if (!ok) return false;
  }

  // Risk hints
  if (when.risk_hints_any) {
    const hints = Array.isArray(ctx.risk_hints) ? ctx.risk_hints : [];
    const ok = when.risk_hints_any.some((h) => hints.includes(h));
    if (!ok) return false;
  }

  // Action type
  if (when.action_any && !when.action_any.includes(ctx.action)) {
    return false;
  }

  return true;
}

// ============================================================================
// Judge
// ============================================================================

function judge(ctx: JudgmentContext, rules: PolicyRule[]): JudgmentResult {
  for (const r of rules) {
    if (matchRule(r.when, r)) {
      return {
        decision: r.decision,
        reason: r.reason,
        rule_id: r.id,
      };
    }
  }

  // Fail-closed: unknown actions default to HOLD
  return {
    decision: "HOLD",
    reason: "Unclassified action (fail-closed default)",
  };
}

// ============================================================================
// Audit Logger
// ============================================================================

function audit(result: JudgmentResult, ctx: JudgmentContext, api: OpenClawPluginApi, event: any) {
  const entry: AuditEntry = {
    ts: new Date().toISOString(),
    tool: ctx.tool,
    params: event.params,
    risk_hints: ctx.risk_hints,
    decision: result.decision,
    rule_id: result.rule_id,
    blocked: true,
    block_reason: `Judgment ${result.decision}: ${result.reason}`,
    execution_prevented: true,
  };

  api.logger.info(`[JUDGMENT-GATE] ${JSON.stringify(entry)}`);
}

// ============================================================================
// Context Normalizer
// ============================================================================

function normalize(event: any): JudgmentContext {
  let args = event?.args ?? "";
  if (!args && event?.params) {
    if (typeof event.params === "object") {
      args = (event.params as any).command || JSON.stringify(event.params);
    } else {
      args = String(event.params);
    }
  }

  return {
    source: event?.source ?? "tool",
    tool: event?.toolName ?? event?.tool?.name ?? event?.tool ?? "unknown",
    action: event?.action ?? event?.tool?.action ?? "unknown",
    args: args,
    risk_hints: event?.risk_hints ?? event?.riskHints ?? [],
  };
}

// ============================================================================
// Plugin Export
// ============================================================================

const judgmentGatePlugin = {
  id: "judgment-gate",
  name: "Judgment Gate",
  description: "Pre-execution judgment boundary (STOP/HOLD/ALLOW)",

  register(api: OpenClawPluginApi) {
    const rules = loadRules();

    api.logger.info(`judgment-gate: plugin registered (${rules.length} rules loaded)`);

    // Register before_tool_call hook
    api.on("before_tool_call", async (event) => {
      const ctx = normalize(event);
      const result = judge(ctx, rules);

      // ALLOW: proceed with execution
      if (result.decision === "ALLOW") {
        return undefined;
      }

      // STOP or HOLD: block execution
      audit(result, ctx, api, event);

      if (result.decision === "STOP") {
        api.logger.warn(`judgment-gate: STOP - ${result.reason} (rule: ${result.rule_id})`);
        return {
          block: true,
          blockReason: `Judgment STOP: ${result.reason}`,
        };
      }

      if (result.decision === "HOLD") {
        api.logger.warn(`judgment-gate: HOLD - ${result.reason} (rule: ${result.rule_id})`);
        return {
          block: true,
          blockReason: `Judgment HOLD: ${result.reason} (requires approval)`,
        };
      }

      return undefined;
    });

    api.logger.info("judgment-gate: before_tool_call hook registered");
  },
};

export default judgmentGatePlugin;
