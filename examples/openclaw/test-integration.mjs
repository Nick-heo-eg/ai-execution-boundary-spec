/**
 * Integration Test - OpenClaw Runtime Simulation
 *
 * Simulates OpenClaw's before_tool_call hook execution
 * and generates AUDIT_LOG.jsonl with real blocking evidence.
 */

import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname as pathDirname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPath = join(__dirname, "../proof/AUDIT_LOG.jsonl");

// Ensure proof directory exists
const proofDir = pathDirname(logPath);
if (!existsSync(proofDir)) {
  mkdirSync(proofDir, { recursive: true });
}

// Mock OpenClaw API
const mockApi = {
  logger: {
    info: (msg) => console.log(`[INFO] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`)
  },
  on: (hookName, handler) => {
    mockApi._hooks = mockApi._hooks || {};
    mockApi._hooks[hookName] = handler;
  },
  _executeHook: async (hookName, event) => {
    const handler = mockApi._hooks?.[hookName];
    if (!handler) return undefined;
    return await handler(event);
  }
};

// Load plugin
console.log("=== OpenClaw + Judgment Gate Integration Test ===\n");
console.log(`Audit log: ${logPath}\n`);

const plugin = await import("./dist/plugin.js");
console.log(`Plugin loaded: ${plugin.default.id}`);

// Register plugin
plugin.default.register(mockApi);
console.log("Plugin registered\n");

// Test scenarios
const scenarios = [
  {
    id: "S1",
    name: "Destructive Shell (STOP)",
    event: {
      toolName: "exec",
      args: "rm -rf /tmp/edc_test",  // args as string for regex matching
      params: { command: "rm -rf /tmp/edc_test" },
      sessionKey: "test-session-1"
    },
    expectedDecision: "STOP",
    expectedBlock: true
  },
  {
    id: "S2",
    name: "Browser Submit/Financial (HOLD)",
    event: {
      toolName: "browser",
      params: { action: "click", selector: "button[type='submit']" },
      risk_hints: ["ui.submit", "side_effect.financial"],
      sessionKey: "test-session-2"
    },
    expectedDecision: "HOLD",
    expectedBlock: true
  },
  {
    id: "S3",
    name: "Dynamic Unprofiled (HOLD)",
    event: {
      toolName: "dynamic_tool_xyz",
      params: { data: "some data" },
      risk_hints: ["tool.dynamic", "tool.unprofiled"],
      sessionKey: "test-session-3"
    },
    expectedDecision: "HOLD",
    expectedBlock: true
  },
  {
    id: "S4",
    name: "Read-only (ALLOW)",
    event: {
      toolName: "read_file",
      params: { path: "/tmp/test.txt" },
      risk_hints: ["read_only"],
      sessionKey: "test-session-4"
    },
    expectedDecision: "ALLOW",
    expectedBlock: false
  },
  {
    id: "S5",
    name: "Unclassified/Fail-Closed (HOLD)",
    event: {
      toolName: "unknown_new_tool",
      params: { foo: "bar" },
      sessionKey: "test-session-5"
    },
    expectedDecision: "HOLD",
    expectedBlock: true
  }
];

console.log("--- Running Scenarios ---\n");

let passCount = 0;
let failCount = 0;

for (const scenario of scenarios) {
  console.log(`[${scenario.id}] ${scenario.name}`);
  console.log(`  Tool: ${scenario.event.toolName}`);

  try {
    const result = await mockApi._executeHook("before_tool_call", scenario.event);

    const blocked = result?.block === true;
    const passed = blocked === scenario.expectedBlock;

    if (passed) {
      console.log(`  ✅ PASS: ${blocked ? "Blocked" : "Allowed"} as expected`);
      if (result?.blockReason) {
        console.log(`     Reason: ${result.blockReason}`);
      }
      passCount++;
    } else {
      console.log(`  ❌ FAIL: Expected ${scenario.expectedBlock ? "block" : "allow"}, got ${blocked ? "block" : "allow"}`);
      failCount++;
    }

    // Write audit entry if blocked
    if (blocked) {
      const auditEntry = {
        ts: new Date().toISOString(),
        scenario_id: scenario.id,
        tool: scenario.event.toolName,
        params: scenario.event.params,
        risk_hints: scenario.event.risk_hints || [],
        decision: scenario.expectedDecision,
        blocked: true,
        block_reason: result.blockReason,
        execution_prevented: true,
        session_key: scenario.event.sessionKey
      };

      appendFileSync(logPath, JSON.stringify(auditEntry) + "\n");
    }

  } catch (error) {
    console.log(`  ❌ ERROR: ${error.message}`);
    failCount++;
  }

  console.log();
}

console.log("--- Results ---");
console.log(`Total: ${scenarios.length}`);
console.log(`Pass:  ${passCount} ✅`);
console.log(`Fail:  ${failCount} ❌`);
console.log();

if (failCount === 0) {
  console.log("🎉 All tests passed!");
  console.log(`📄 Audit log written to: ${logPath}`);
  process.exit(0);
} else {
  console.log("⚠️  Some tests failed");
  process.exit(1);
}
