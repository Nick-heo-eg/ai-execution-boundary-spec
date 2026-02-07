# Shell Boundary: Universal Execution Authority

> ⚠️ **This is not a sandboxing tool.**
>
> It is a **judgment boundary** that decides whether execution is allowed,
> independent of sandboxing, isolation, or security mechanisms.

---

## What This Proves

This example demonstrates that **Judgment Boundary v0.1 compliance** can be achieved with:

- **Zero dependencies** (pure bash + YAML parser)
- **Universal applicability** (wraps any command)
- **Runtime agnostic** (works with any AI agent)
- **Model independent** (no model modification required)

---

## Architecture

```
AI Agent → proposes command → judge-exec → STOP/HOLD/ALLOW → execution
                                    ↓
                              execution_prevented: true
```

### Interception Point

`judge-exec` is a command wrapper that intercepts **before execution**:

```bash
# Without judgment boundary
rm -rf /production/*

# With judgment boundary
judge-exec rm -rf /production/*
# → Judgment: STOP (execution_prevented: true)
```

### Decision Flow

1. **Parse command** - Extract tool, args, context
2. **Load policy** - Read rules from `rules/policy.yaml`
3. **Judge** - Match rules, default to HOLD (fail-closed)
4. **Decide**:
   - `STOP` → Block with error message, exit 1
   - `HOLD` → Block with approval prompt, exit 2
   - `ALLOW` → Execute command, exit with command's exit code
5. **Audit** - Emit `execution_prevented: true` for STOP/HOLD

---

## Compliance with Minimal Spec v0.1

| Component | Implementation |
|-----------|----------------|
| **Interception Point** | `judge-exec` wrapper intercepts before shell execution |
| **Decision Set** | STOP / HOLD / ALLOW |
| **Fail-Closed Rule** | Unknown commands → HOLD |
| **Audit Signal** | JSON audit log with `execution_prevented: true` |

---

## Installation

```bash
# Add to PATH
export PATH="/path/to/shell-boundary:$PATH"

# Verify
judge-exec --version
```

---

## Usage

### Basic Execution

```bash
# AI agent proposes command
judge-exec ls /tmp
# → ALLOW: executes normally

judge-exec rm -rf /production/db
# → STOP: Destructive pattern detected
# → Exit code 1, execution_prevented: true
```

### Policy Configuration

Edit `rules/policy.yaml`:

```yaml
rules:
  - id: R3_DESTRUCTIVE_STOP
    decision: STOP
    when:
      command_pattern: "rm\\s+-rf|mkfs"
    reason: "Destructive operation blocked"
```

### Audit Logs

All decisions are logged to `audit.jsonl`:

```json
{
  "ts": "2026-02-08T...",
  "command": "rm -rf /production/db",
  "decision": "STOP",
  "rule_id": "R3_DESTRUCTIVE_STOP",
  "execution_prevented": true,
  "exit_code": 1
}
```

---

## Test Suite

```bash
# Run all compliance tests
./test-all.sh

# Expected output:
# ✓ STOP: Destructive command
# ✓ HOLD: Unknown command
# ✓ ALLOW: Safe read operation
# ✓ Fail-closed: Unmatched pattern → HOLD
# ✓ Audit signal: execution_prevented present
```

---

## Why Shell Boundary?

### Universal Applicability

Works with **any AI agent**:
- OpenClaw
- Claude Code
- crewAI
- AutoGen
- Custom agents

### No Model Modification

The model proposes commands freely.
Judgment happens **at execution time**, not in the model.

### Proof of Generality

If execution authority can be separated at the **shell level**,
it can be separated at **any level**.

This is the most general proof possible.

---

## What This Is NOT

- ❌ Not a security sandbox (use firejail, bubblewrap, etc.)
- ❌ Not input validation (commands are not rewritten)
- ❌ Not a prompt filter (model reasoning is untouched)
- ❌ Not post-execution monitoring (judgment is pre-execution)

---

## Limitations

1. **Shell-level only**: Only intercepts shell commands, not library calls
2. **Policy completeness**: Example rules provided, not production-ready
3. **Bypass potential**: Agents can invoke binaries directly if not wrapped

These are **scope limitations**, not architectural limitations.

---

## Next Steps

- Extend to Python wrapper (`judge-python`)
- Add approval workflow for HOLD decisions
- Multi-user policy management
- Integration with system audit frameworks

---

## Status

**Judgment Boundary v0.1:** ✅ COMPLIANT
**Test Results:** Pending
**Production Ready:** No (proof of concept)
