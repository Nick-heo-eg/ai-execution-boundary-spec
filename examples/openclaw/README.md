# OpenClaw Reference: Pre-Execution Judgment Boundary

> ⚠️ **This project is not about AI safety.**
>
> It is about **execution authority**.
>
> AI systems can reason freely.
> Execution is a separate concern.
>
> This repository proves that execution can be
> **structurally blocked, audited, and decided**
> before any action occurs.

---

> **Purpose**: This example demonstrates where an execution boundary must exist in autonomous agent systems.

---

## What This Is

This is a **reference implementation** showing:

1. **Structural position** of a judgment boundary in an agent runtime
2. **Temporal ordering** of judgment (before execution, not after)
3. **Evidence format** proving execution prevention (not just action logging)

**This implementation uses OpenClaw's plugin system to demonstrate a general principle applicable to any autonomous agent framework.**

---

## What This Is NOT

* ❌ **Not an evaluation of OpenClaw**
  - OpenClaw is used as a reference platform, not a subject of critique
  - Any agent framework with pre-execution hooks can demonstrate the same principle

* ❌ **Not a claim about "stopping dangerous actions"**
  - The number of blocked actions is irrelevant
  - What matters is **where judgment occurred** relative to execution

* ❌ **Not a security product**
  - This is proof-of-concept code for structural demonstration
  - Production systems require threat modeling, approval workflows, and policy tuning

* ❌ **Not about performance or accuracy**
  - This demonstrates Expected Damage Cost (EDC) optimization, not accuracy metrics
  - `P(over-execution) → 0` is the design goal, not "99.9% accuracy"

---

## Why OpenClaw?

OpenClaw provides a **native `before_tool_call` hook** that demonstrates the structural position where judgment must exist.

### Key Properties

1. **Pre-execution timing**
   - Hook fires BEFORE tool execution layer is invoked
   - Tool invocation can be prevented by returning `{block: true}`
   - No rollback needed (execution never occurs)

2. **Plugin-based extensibility**
   - Zero core modifications required
   - Judgment layer exists as external package
   - Composable with other plugins

3. **Complete context access**
   - Tool name, arguments, risk hints available at judgment time
   - Decision can be policy-driven (YAML rules)
   - Audit log preserves full context

**Important**: These properties are not unique to OpenClaw. Any agent framework can provide equivalent hooks. OpenClaw simply makes this example reproducible.

---

## The Structural Question

In any autonomous agent system, there exists a critical moment:

```
[LLM generates action proposal] → ??? → [System executes action]
```

**The question**: Where does judgment occur in this flow?

### Option A: After Execution (Incident Response)

```
[LLM] → [Execute] → [Log] → [Detect risk] → [Attempt rollback]
```

**Problem**:
- Execution happens first, judgment second
- Rollback is often impossible (file deletion, API calls, financial transactions)
- `P(damage) > 0` by design

### Option B: Before Execution (Execution Boundary)

```
[LLM] → [Judgment Boundary] → STOP/HOLD/ALLOW → [Execute if allowed]
```

**Property**:
- Judgment happens first, execution second (if approved)
- No rollback needed (prevention, not correction)
- `P(damage) → 0` by design

**This example proves Option B is structurally possible.**

---

## Implementation Architecture

### Hook Registration

```typescript
// src/plugin.ts
api.on("before_tool_call", async (event: any) => {
  const ctx = normalize(event);
  const res = judge(ctx);

  if (res.decision === "STOP" || res.decision === "HOLD") {
    audit(res, ctx);  // Log BEFORE returning
    return { block: true, blockReason: `Judgment ${res.decision}: ${res.reason}` };
  }

  return undefined;  // ALLOW: proceed to execution
});
```

**Critical property**: `return { block: true }` prevents tool execution layer from being reached.

---

### Policy-Driven Decision

```yaml
# rules/policy.yaml
rules:
  - id: R3_DESTRUCTIVE_SHELL_STOP
    decision: STOP
    when:
      tool_in: ["exec", "shell", "command"]
      any_regex_in_args:
        - "(rm\\s+-rf|mkfs|curl\\s+\\|\\s*bash)"
    reason: "Destructive shell pattern"
```

**Properties**:
- Declarative (no code changes per rule)
- Versioned (YAML in git)
- Auditable (rule ID traced in logs)

---

### Fail-Closed Default

```typescript
// src/judge.ts
export function judge(ctx: any) {
  for (const r of rules) {
    if (r.matches(ctx)) {
      return { decision: r.decision, reason: r.reason, rule_id: r.id };
    }
  }
  // No rule matched → fail-closed
  return { decision: "HOLD", reason: "Unclassified action (fail-closed default)" };
}
```

**Why fail-closed matters**:
- Unknown actions default to HOLD (require approval)
- Fail-closed behavior by design
- New tools/actions don't bypass judgment

---

## Evidence of Execution Prevention

### Audit Log Format

```jsonl
{
  "ts": "2026-02-07T15:09:25.530Z",
  "tool": "exec",
  "params": {"command": "rm -rf /tmp/test"},
  "decision": "STOP",
  "rule_id": "R3_DESTRUCTIVE_SHELL_STOP",
  "blocked": true,
  "block_reason": "Destructive shell pattern",
  "execution_prevented": true,
  "session_key": "test-session-1"
}
```

**Key fields**:
- `ts`: Timestamp of judgment (BEFORE execution)
- `decision`: STOP/HOLD/ALLOW
- `rule_id`: Which policy governed the decision
- `execution_prevented: true`: Tool layer never reached
- `block_reason`: Human-readable explanation

**This is not a log of execution. This is proof of prevention.**

---

### Test Results

| Scenario | Tool | Expected | Result | Evidence |
|----------|------|----------|--------|----------|
| S1 | `rm -rf /tmp/test` | STOP | ✅ STOPPED | Rule R3 matched |
| S2 | Browser financial submit | HOLD | ✅ HELD | Risk hint matched |
| S3 | Unprofiled dynamic tool | HOLD | ✅ HELD | Fail-closed default |
| S5 | Unknown new tool | HOLD | ✅ HELD | Fail-closed default |

**Critical property**: 4/4 dangerous scenarios prevented before execution. 0 false negatives.

See `proof/AUDIT_LOG.jsonl` for full evidence.

---

## Reproducibility

### Prerequisites

- Node.js 22+
- pnpm 10+
- OpenClaw repository (for development, not required for concept)

### Running the Test

```bash
cd examples/openclaw
node test-integration.mjs
```

**Expected output**:
```
🎉 All tests passed! (5/5)
📄 Audit log written to: ../proof/AUDIT_LOG.jsonl
```

### Verification

```bash
cat proof/AUDIT_LOG.jsonl | jq '.execution_prevented'
# Should output: true (for all blocked scenarios)
```

---

## Why This Matters

### The Generalization

This example proves a **general principle** applicable to any autonomous agent:

> **When agents have execution authority, judgment must occur at a structural boundary between decision and execution.**

**OpenClaw's `before_tool_call` is one such boundary.**

Other agent frameworks may have equivalent hooks:
- LangChain: `callbacks` (but post-execution)
- AutoGPT: Plugin system
- Agent frameworks with middleware layers

**The principle is universal. The implementation is framework-specific.**

---

### The EDC Argument

Traditional agent safety optimizes for **accuracy**:
```
Accuracy = Correct outputs / Total outputs
```

**Problem**: Accuracy doesn't capture catastrophic risk.
- 999 safe operations + 1 destructive → 99.9% accuracy ✅
- But system is destroyed 💥

**Execution boundaries optimize for Expected Damage Cost (EDC)**:
```
EDC = P(over-execution) × Cost(over-execution)
```

For catastrophic actions: `Cost(over-execution) → ∞`

**Therefore**: Must minimize `P(over-execution) → 0`

**This requires judgment BEFORE execution, not after.**

---

## Limitations

This reference implementation is deliberately minimal:

* **Regex-based matching** (no semantic analysis)
  - Trade-off: Predictable, auditable, but not context-aware
  - Production systems may add LLM-powered risk assessment

* **Static policy** (no runtime learning)
  - Trade-off: Deterministic, version-controlled, but requires manual updates
  - Production systems may add policy suggestion tools

* **No approval workflow** (HOLD blocks indefinitely)
  - Trade-off: Proof of structural position, but not usable workflow
  - Production systems need approval UI/API

**These limitations are intentional** to keep the proof focused on structural position, not feature completeness.

---

## Integration Notes

To adapt this pattern to other frameworks:

1. **Identify the execution hook**
   - Find where tool calls are invoked
   - Check if framework provides pre-execution hooks
   - If not, consider adding middleware layer

2. **Implement judgment function**
   - Load policy (YAML, JSON, or code)
   - Match context against rules
   - Return decision: STOP/HOLD/ALLOW

3. **Add fail-closed default**
   - Unknown actions → HOLD (not ALLOW)
   - Maintains fail-closed behavior even with incomplete policy

4. **Generate audit trail**
   - Log every non-ALLOW decision
   - Include: timestamp, rule ID, decision, context
   - Prove `execution_prevented: true`

**The pattern is portable. The hook is framework-specific.**

---

## Directory Structure

```
examples/openclaw/
├── README.md              # This file
├── src/
│   ├── plugin.ts          # Hook registration
│   ├── judge.ts           # Decision engine
│   ├── rules.ts           # Policy loader
│   └── logger.ts          # Audit writer
├── rules/
│   └── policy.yaml        # 4 example rules
├── test-integration.mjs   # Reproducible test
└── proof/
    ├── AUDIT_LOG.jsonl    # Evidence (4 entries)
    ├── RUN_NOTES.md       # Test execution notes
    └── JUDGMENT_CHECKLIST.md  # Validation criteria
```

---

## Key Takeaways

1. **This is not about OpenClaw**
   - OpenClaw is used as a reference, not a subject of evaluation
   - Any framework with pre-execution hooks demonstrates the same principle

2. **This is not about blocking actions**
   - The number of blocked actions is meaningless
   - What matters is **where judgment occurred**

3. **This is about structural position**
   - Judgment must happen BEFORE execution
   - Audit logs must prove `execution_prevented: true`
   - Fail-closed defaults provide block-by-default behavior for unknowns

4. **This is generalizable**
   - The pattern applies to any autonomous agent
   - The implementation is framework-specific
   - The principle is universal

**Read `../../proof/WHAT_COUNTS_AS_PROOF.md` for the full argument on why structural position matters.**

---

## License

MIT - See LICENSE in repository root.

---

## Related Documents

- `../../proof/WHAT_COUNTS_AS_PROOF.md` - Why structural position matters
- `../../docs/VISUALIZATIONS.md` - Visual comparisons and diagrams
- `../../docs/VISUAL_SUMMARY.md` - One-page summary
- `proof/JUDGMENT_CHECKLIST.md` - Validation criteria (all passed)

---

**Status**: Reference implementation for structural demonstration
**Framework**: OpenClaw (as reference platform)
**Principle**: Universal (applicable to any autonomous agent)
