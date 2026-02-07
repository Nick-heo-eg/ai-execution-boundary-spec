/**
 * Direct Judgment Logic Test
 *
 * Tests STOP/HOLD/ALLOW decisions without OpenClaw runtime.
 * Proves judgment logic works correctly.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Types (copied from plugin)
// ============================================================================

/**
 * @typedef {"ALLOW" | "HOLD" | "STOP"} Decision
 * @typedef {{
 *   id: string;
 *   decision: Decision;
 *   when: {
 *     tool_in?: string[];
 *     source_in?: string[];
 *     any_regex_in_args?: string[];
 *     risk_hints_any?: string[];
 *     action_any?: string[];
 *   };
 *   reason: string;
 * }} PolicyRule
 * @typedef {{
 *   source: string;
 *   tool: string;
 *   action: string;
 *   args: string;
 *   risk_hints: string[];
 * }} JudgmentContext
 * @typedef {{
 *   decision: Decision;
 *   reason: string;
 *   rule_id?: string;
 * }} JudgmentResult
 */

// ============================================================================
// Core Logic (copied from plugin)
// ============================================================================

function loadRules() {
  try {
    const policyPath = join(__dirname, "rules/policy.yaml");
    const raw = readFileSync(policyPath, "utf8");
    const doc = YAML.parse(raw);
    return doc.rules ?? [];
  } catch (err) {
    console.warn(`Failed to load policy.yaml: ${String(err)}`);
    return [];
  }
}

/**
 * @param {PolicyRule["when"]} when
 * @param {JudgmentContext} ctx
 * @returns {boolean}
 */
function matchRule(when, ctx) {
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

/**
 * @param {JudgmentContext} ctx
 * @param {PolicyRule[]} rules
 * @returns {JudgmentResult}
 */
function judge(ctx, rules) {
  for (const r of rules) {
    if (matchRule(r.when, ctx)) {
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
// Test Scenarios
// ============================================================================

/**
 * @typedef {{
 *   name: string;
 *   context: JudgmentContext;
 *   expected: Decision;
 *   description: string;
 * }} TestCase
 */

/** @type {TestCase[]} */
const testCases = [
  {
    name: "STOP: Delete production database",
    context: {
      source: "tool",
      tool: "exec",
      action: "execute",
      args: "rm -rf /var/lib/production_db",
      risk_hints: ["destructive"],
    },
    expected: "STOP",
    description: "Destructive action on production path should be blocked",
  },
  {
    name: "STOP: Sensitive file access",
    context: {
      source: "tool",
      tool: "read_file",
      action: "read",
      args: "/etc/shadow",
      risk_hints: ["sensitive"],
    },
    expected: "STOP",
    description: "Reading sensitive system files should be blocked",
  },
  {
    name: "HOLD: Write to production",
    context: {
      source: "tool",
      tool: "write_file",
      action: "write",
      args: "/var/www/production/config.json",
      risk_hints: [],
    },
    expected: "HOLD",
    description: "Writing to production paths should require approval",
  },
  {
    name: "HOLD: Unclassified tool",
    context: {
      source: "tool",
      tool: "unknown_tool",
      action: "unknown",
      args: "some data",
      risk_hints: [],
    },
    expected: "HOLD",
    description: "Unclassified tools should default to HOLD (fail-closed)",
  },
  {
    name: "ALLOW: Safe read operation",
    context: {
      source: "tool",
      tool: "read_file",
      action: "read",
      args: "/tmp/test.txt",
      risk_hints: [],
    },
    expected: "ALLOW",
    description: "Safe read from /tmp should be allowed",
  },
  {
    name: "ALLOW: Safe directory listing",
    context: {
      source: "tool",
      tool: "exec",
      action: "execute",
      args: "ls /home/user/documents",
      risk_hints: [],
    },
    expected: "ALLOW",
    description: "Non-destructive commands should be allowed",
  },
];

// ============================================================================
// Test Runner
// ============================================================================

function runTests() {
  console.log("=".repeat(80));
  console.log("Judgment Gate - Direct Logic Test");
  console.log("=".repeat(80));
  console.log("");

  const rules = loadRules();
  console.log(`✓ Loaded ${rules.length} policy rules\n`);

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = judge(testCase.context, rules);
    const success = result.decision === testCase.expected;

    if (success) {
      passed++;
      console.log(`✓ PASS: ${testCase.name}`);
    } else {
      failed++;
      console.log(`✗ FAIL: ${testCase.name}`);
      console.log(`  Expected: ${testCase.expected}`);
      console.log(`  Got: ${result.decision}`);
    }

    console.log(`  Decision: ${result.decision}`);
    console.log(`  Reason: ${result.reason}`);
    if (result.rule_id) {
      console.log(`  Rule ID: ${result.rule_id}`);
    }
    console.log(`  Description: ${testCase.description}`);
    console.log(`  execution_prevented: ${result.decision !== "ALLOW"}`);
    console.log("");
  }

  console.log("=".repeat(80));
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(80));

  return failed === 0;
}

// ============================================================================
// Main
// ============================================================================

const success = runTests();
process.exit(success ? 0 : 1);
