# AI Execution Boundary Profile (v1.0-rc)

**AI application profile for [Execution Boundary Core Spec](https://github.com/Nick-heo-eg/execution-boundary-core-spec).**

Extends the transport-agnostic core model with AI-specific envelope fields, decision states, and tool-call examples.

---

## Dependency

This profile is built on top of:

**[execution-boundary-core-spec v0.1](https://github.com/Nick-heo-eg/execution-boundary-core-spec)**

Core Spec defines:
- ActionEnvelope / Decision / Ledger / Runtime Adapter interfaces
- Fail-closed requirement
- Negative proof requirement
- State model: `PROPOSED → EVALUATED → ALLOWED/DENIED/HOLD → EXECUTED/CLOSED`

This profile extends those definitions for AI agent contexts.

---

## 1. Problem Statement

AI agent systems generate actions as proposals. Without a structural boundary, those proposals execute directly — without explicit authorization, without a verifiable denial record, and without a point where execution can be suppressed.

This profile defines how the core boundary model applies to:

- LLM tool-call runtimes
- Agent orchestration loops
- Multi-agent delegation chains

---

## 2. AI-Specific ActionEnvelope Extension

Base fields are defined in Core Spec. This profile adds:

```json
{
  "action_id": "uuid",
  "action_type": "tool.call",
  "resource": "string",
  "parameters": "object",
  "context_hash": "string",
  "timestamp": "string",

  "model_id": "string",
  "tool_name": "string",
  "tool_arguments": "object",
  "session_id": "string",
  "confidence_score": "number | null"
}
```

### Extended Field Definitions

**`model_id`**
Identifier of the model that proposed the action.
Example: `"claude-sonnet-4-6"`, `"gpt-4o"`

**`tool_name`**
Name of the tool being invoked.
Example: `"send_email"`, `"delete_file"`, `"transfer_funds"`

**`tool_arguments`**
Arguments passed to the tool. Treated as parameters in the base envelope.

**`session_id`**
Conversation or agent session identifier. Used for audit trail grouping.

**`confidence_score`**
Optional. Model-reported confidence for the proposed action. `null` if unavailable.
Does not affect authorization. Recorded for observability only.

---

## 3. Decision State Model

Core Spec defines: `ALLOW | DENY | HOLD`

This profile maps decision states as follows:

| Profile term | Core Spec term | Meaning |
|---|---|---|
| ALLOW | ALLOW | Execution authorized |
| STOP | DENY | Execution prohibited |
| HOLD | HOLD | Deferred, requires re-evaluation |

`STOP` is used in AI-facing documentation for clarity. Internally maps to `DENY`.

---

## 4. Extension Rules

This profile extends Core Spec fields. Extension is **add-only**.

Rules:
- Core Spec fields MUST NOT be modified or removed
- AI-specific fields are additive only
- `action_type` for tool calls SHOULD be `"tool.call"` or a namespaced variant (e.g. `"tool.file.write"`)
- Extended fields that are unavailable MUST be set to `null`, not omitted

AI ActionEnvelope = Core ActionEnvelope + AI extension fields.
Core ActionEnvelope fields remain the authoritative base.

---

## 5. Normative Requirements

From Core Spec (inherited, mandatory):

```
Execution MUST NOT occur unless decision.result == ALLOW
```

```
If evaluation cannot be completed, the system MUST default to DENY (fail-closed)
```

```
DENY decisions MUST be recorded in the ledger with a verifiable proof_hash
```

AI profile additions:

- `tool_name` MUST be present in the envelope when action_type is `tool.call`
- `model_id` SHOULD be present for all AI-generated proposals
- `session_id` SHOULD be present for audit trail continuity

---

## 5. Reference Architecture

```
LLM / Agent
   ↓
AI ActionEnvelope (tool_name, model_id, tool_arguments, ...)
   ↓
Evaluator (policy check, side-effect free)
   ↓
Decision (ALLOW | DENY | HOLD)
   ↓
Ledger Append (unconditional)
   ↓
Tool Runtime (ALLOW only)
   ↓
Side-Effect
```

---

## 6. Conformance Levels

Inherits Core Spec conformance model. AI profile conformance requires:

**Level 1: Structural**
- ActionEnvelope produced before tool execution
- Evaluator called before runtime
- Runtime blocked on non-ALLOW

**Level 2: Observable**
- Level 1 satisfied
- Ledger records all decisions including DENY
- `proof_hash` present on all Decision objects

**Level 3: Verifiable**
- Level 2 satisfied
- `proof_hash` independently verifiable
- Ledger tamper-evidence preserved

---

## 7. Reference Implementation

**[execution-gate](https://github.com/Nick-heo-eg/execution-gate)**

Implements Core Spec v0.1 with Python. Demonstrates:
- `ActionEnvelope.build()` — explicit envelope construction
- `Gate.evaluate(envelope)` — side-effect-free evaluation
- `Decision` with `decision_id`, `proof_hash`, `authority_token`
- Append-only ledger via `emit_audit()`
- `enforce` decorator — blocks execution on DENY

---

## 8. Non-Goals

This profile does not define:

- Policy language or rule syntax
- LLM alignment or content filtering
- Compliance certification
- Specific cryptographic algorithms
- Harm prevention guarantees

---

## 9. Repository Structure

```
/spec          → Normative specifications
/compliance    → Conformance harness
/proof         → Decision artifacts
/examples      → Integration examples
/docs          → Rationale and background
/archive       → Historical versions
```

---

## 10. Scope

In scope:
- Structural separation between proposal, evaluation, and execution
- Decision state semantics for AI tool-call runtimes
- Envelope extension fields for AI context

Out of scope:
- AI safety mechanisms
- Content guardrails
- Policy semantics
- Regulatory compliance

---

## License

MIT License — See [LICENSE](LICENSE) for details.
