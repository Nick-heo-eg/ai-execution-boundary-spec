# What Counts as Proof?

## The Wrong Question

> "Did you block a dangerous action?"

This is the wrong question.

**Blocking an action proves nothing about execution boundaries.**

Any system can block any action at any layer:
- A content filter can block dangerous text
- A post-processor can revert a committed change
- A monitoring system can alert after execution

These are **not execution boundaries**. They are **correction mechanisms**.

---

## The Right Question

> "Where did the judgment occur relative to execution?"

This is the right question.

**The location of judgment determines whether prevention is structural or reactive.**

---

## Why Location Matters

### Scenario: `rm -rf /tmp/important_data`

#### Post-Execution Blocking (Wrong Layer)

```
Timeline:
  LLM Decision → Tool Execution → Damage → Detection → Rollback Attempt

Evidence:
  ✅ Action was logged
  ✅ Cleanup was attempted
  ✅ Incident was recorded

Problem:
  💥 Damage occurred
  💥 Rollback is incomplete (cannot undo file deletion)
  💥 Trust boundary was already crossed
```

**This is not proof of execution boundary. This is proof of incident response.**

---

#### Pre-Execution Blocking (Correct Layer)

```
Timeline:
  LLM Decision → [JUDGMENT BOUNDARY] → STOP → Tool Execution (never reached)

Evidence:
  ✅ Judgment record created BEFORE execution
  ✅ Tool execution layer never invoked
  ✅ Audit log shows: execution_prevented = true
  ✅ No rollback needed (nothing to undo)

Result:
  ✅ No damage
  ✅ Trust boundary never crossed
  ✅ System state unchanged
```

**This is proof of execution boundary. Judgment happened where it must: before execution.**

---

## What Makes Valid Proof

### 1. Temporal Ordering (When)

**Invalid Proof**:
- "We detected the dangerous command after it ran"
- "We reverted the changes within 100ms"
- "We logged the incident for review"

**Valid Proof**:
- "Judgment decision was made BEFORE tool invocation"
- "Tool execution layer was never reached"
- "No rollback was needed because execution never occurred"

### 2. Execution Prevention (Not Output Filtering)

**Invalid Proof**:
- Blocking dangerous text in LLM outputs
- Filtering API responses
- Content moderation

**Valid Proof**:
- Tool call interception at execution boundary
- Prevention of system-level actions
- File operations, shell commands, API calls blocked before invocation

### 3. Structural Position (Where)

**Invalid Proof**:
- Guardrails that filter model outputs
- Post-execution monitoring
- After-the-fact compliance checks

**Valid Proof**:
- Hook registered at `before_tool_call`
- Decision engine positioned between LLM and execution layer
- Judgment boundary is part of the execution path, not the output path

### 4. Audit Completeness (Why)

**Invalid Proof**:
- Logs showing "action was attempted"
- Metrics showing "blocked after execution"
- Alerts showing "incident detected"

**Valid Proof**:
- Audit log showing: `execution_prevented: true`
- Rule ID traceability (which policy caused the block)
- Context preservation (tool name, args, risk hints, decision)
- Timestamp showing judgment occurred before any execution

---

## The Distinction in Practice

### Example 1: Output Filter (Not an Execution Boundary)

```yaml
# Guardrails AI-style
timestamp: 2026-02-08T10:15:30Z
event: output_filtered
content: "rm -rf /tmp/important_data"
action: blocked_from_display
execution_status: N/A (only filters outputs)
```

**This is NOT proof** because:
- ❌ Does not prevent execution (only output)
- ❌ If LLM had execution permission, damage would occur
- ❌ Judgment is about content safety, not execution risk

---

### Example 2: Post-Execution Callback (Not an Execution Boundary)

```yaml
# LangChain callback-style
timestamp: 2026-02-08T10:15:32Z
event: tool_execution_completed
tool: shell
command: "rm -rf /tmp/important_data"
result: "0 files deleted"
action: incident_logged
```

**This is NOT proof** because:
- ❌ Execution already occurred
- ❌ If deletion succeeded, rollback is impossible
- ❌ Judgment happened AFTER damage window

---

### Example 3: Pre-Execution Judgment (Valid Execution Boundary)

```jsonl
{
  "ts": "2026-02-08T10:15:25.000Z",
  "tool": "exec",
  "params": {"command": "rm -rf /tmp/important_data"},
  "risk_hints": [],
  "decision": "STOP",
  "rule_id": "R3_DESTRUCTIVE_SHELL_STOP",
  "blocked": true,
  "block_reason": "Destructive shell pattern",
  "execution_prevented": true,
  "session_key": "session-123"
}
```

**This IS proof** because:
- ✅ Judgment timestamp predates any execution
- ✅ `execution_prevented: true` confirms tool layer was never reached
- ✅ Rule ID shows which policy governed the decision
- ✅ No rollback needed (nothing to undo)
- ✅ Structural position: between LLM decision and tool execution

---

## Mathematical Formulation

### Traditional Approach (Post-Execution)

```
P(damage) > 0  (execution happens first, detection second)

Even with perfect detection:
  Damage occurs with probability = P(execution)
  Expected cost = P(execution) × Cost(damage)
  Cost(damage) → ∞ for catastrophic actions
```

**Therefore:** Post-execution systems cannot achieve `EDC → 0`

---

### Execution Boundary Approach (Pre-Execution)

```
P(damage) → 0  (judgment prevents execution)

With structural prevention:
  Execution blocked BEFORE damage window
  Expected cost = 0 × Cost(damage) = 0
```

**Therefore:** Pre-execution boundaries achieve `EDC → 0` by design.

---

## Why "We Blocked It" Is Meaningless

### Claims That Don't Count as Proof

❌ "We stopped 1000 dangerous commands"
- Where? After execution? During output generation?
- Can you prove execution layer was never reached?

❌ "Our system has 99.9% safety rate"
- Accuracy doesn't capture catastrophic risk
- One `rm -rf` makes 999 safe operations irrelevant

❌ "We have complete audit logs"
- Logs of what? Execution or prevention?
- Do they prove judgment occurred BEFORE execution?

### Claims That Count as Proof

✅ "Judgment hook registered at `before_tool_call`"
- Provable: check hook registration code
- Verifiable: hook fires before tool invocation

✅ "4/4 dangerous scenarios blocked, 0 executed"
- Measurable: check audit log for `execution_prevented: true`
- Reproducible: run test suite, verify no false negatives

✅ "No rollback mechanisms needed"
- Structural: prevention eliminates need for correction
- Design property: execution boundary is fail-closed

---

## How to Evaluate Reference Implementations

When reviewing examples under `examples/`, ask these questions:

### 1. **Temporal Priority**
- Is there proof that judgment occurred BEFORE execution?
- Does the audit log show timestamps that confirm this ordering?

### 2. **Execution Prevention (Not Output Filtering)**
- Does the implementation intercept tool calls?
- Or does it only filter text outputs?

### 3. **Structural Position**
- Is the judgment boundary in the execution path?
- Can you trace the hook from LLM decision to tool invocation?

### 4. **Fail-Closed Behavior**
- What happens to unclassified actions?
- Is the default to ALLOW or to HOLD?

### 5. **Audit Completeness**
- Does every non-ALLOW decision generate an audit record?
- Does the record include: rule ID, decision, reason, and execution status?

---

## Summary

**Proof is not about success rates.**
**Proof is not about blocking counts.**
**Proof is not about detection speed.**

**Proof is about structural position.**

An execution boundary must exist **before** execution, not after.

Reference implementations demonstrate **where that boundary must live**,
not how many actions it blocked.

The question is never:
> "Did you stop this?"

The question is always:
> "Where does judgment live in your system?"

If judgment happens after execution, you have incident response.
If judgment happens before execution, you have an execution boundary.

**That is what counts as proof.**
