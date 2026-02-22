# AI Execution Boundary Standard (AEBS)

**Vendor-neutral architectural standard for separating proposal, judgment, and execution in AI systems.**

**Version:** v1.0-rc
**Status:** Release Candidate
**Date:** 2026-02-22

---

## Quick Summary

AEBS is a vendor-neutral architectural standard that requires:

- **Structural separation** between proposal and execution
- **Default-deny enforcement**: `execution MUST NOT occur unless decision_state == ALLOW`
- **Explicit decision states** (STOP / HOLD / ALLOW)
- **Execution blocking capability** prior to runtime

Normative requirements are defined under `/spec`. This repository contains the complete specification, conformance matrix, and reference materials.

---

## 1. Overview

The AI Execution Boundary Standard (AEBS) defines structural separation between proposal, judgment, and execution in AI agent systems.

AEBS establishes **STOP as a first-class outcome** and formalizes execution constraints using explicit decision states.

This standard is framework-agnostic, runtime-agnostic, and vendor-neutral.

---

## Repository Structure

```
/spec          → Normative specifications and formal models
/compliance    → Reference harness and attack simulations
/proof         → Cryptographic proof artifacts
/examples      → Integration examples and demonstrations
/docs          → Background documentation and rationale
/archive       → Historical sealed versions and internal artifacts
```

**For Implementation:** See `/spec/` for normative requirements
**For Testing:** See `/compliance/reference-harness/`
**For Context:** See `/docs/` for rationale and background

---

## 2. Problem Statement

Current AI agent systems typically combine proposal generation and execution authority within a single process. This creates structural conditions where:

1. Generated actions execute without intermediate authorization
2. Decision logic is embedded within inference processes
3. Execution outcomes cannot be prevented by external judgment
4. STOP is not structurally available as an outcome

AEBS addresses this through architectural separation requirements.

---

## 3. Normative Summary

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this specification are to be interpreted as described in RFC 2119.

### Core Requirement

AEBS-compliant systems MUST satisfy the following condition:

```
Execution MUST NOT occur unless decision_state == ALLOW
```

### Default-Deny Model

AEBS follows a **default-deny model**:

```
If decision_state is undefined, unavailable, or NULL,
execution MUST NOT occur.
```

### Judgment Independence

Judgment MUST:

- Occur prior to execution in the call path
- Be technically capable of blocking execution at runtime without cooperation from the proposing component
- Be structurally independent from the proposing system's inference process

---

## 4. Decision State Model

### Valid States

AEBS defines three decision states:

- **STOP** — Execution is prohibited
- **HOLD** — Execution is deferred pending additional input
- **ALLOW** — Execution is authorized

### Execution Semantics

| State | Execution Behavior   | Description |
|-------|---------------------|-------------|
| STOP  | MUST NOT execute    | Execution is explicitly prohibited |
| HOLD  | MUST NOT execute    | Execution authority is not granted. No execution may occur unless a new evaluation produces an ALLOW decision. |
| ALLOW | MAY execute         | Execution is authorized to proceed |
| NULL  | MUST NOT execute    | Default-deny behavior |

### State Machine

```
[ Proposal ] → [ Judgment ] → [ Execution ]
                    ↓
              STOP / HOLD / ALLOW
```

See [Formal Model](spec/aebs-formal-model.md) for detailed state transitions.

### Environment Fingerprint

The `environment_fingerprint` is a deterministic cryptographic hash derived from the execution environment context.

**Requirements:**

An AEBS implementation:

- MUST compute the fingerprint deterministically
- MUST ensure the fingerprint is identical between proposal evaluation and execution phases
- MUST cause verification failure if the execution environment changes between evaluation and execution

**Scope:**

The exact attributes included in the fingerprint are implementation-specific and MUST be documented by the implementation.

**Reference Implementation Example:**

The [execution-guard-action](https://github.com/Nick-heo-eg/execution-guard-action) reference implementation derives the fingerprint from:

- Node.js version
- Runner operating system
- Policy hash

Other implementations may include additional attributes such as container ID, hardware identity, or deployment metadata.

---

## 4.1 Conformance Matrix

AEBS defines three conformance levels for implementation verification:

| Requirement | Level 1: Structural | Level 2: Observable | Level 3: Verifiable |
|-------------|---------------------|---------------------|---------------------|
| **Structural separation** | MUST | MUST | MUST |
| **Default-deny enforcement** | MUST | MUST | MUST |
| **STOP/HOLD/ALLOW states** | MUST | MUST | MUST |
| **Decision state observability** | OPTIONAL | MUST | MUST |
| **Pre-execution trace logging** | OPTIONAL | MUST | MUST |
| **Cryptographic decision signing** | OPTIONAL | OPTIONAL | MUST |
| **Authority transfer modeling** | OPTIONAL | OPTIONAL | MUST |
| **Tamper-evident audit trail** | OPTIONAL | OPTIONAL | MUST |

### Conformance Level Descriptions

**Level 1: Structural Conformance**
- Execution blocking capability exists
- Decision states are implemented
- No observability requirements

**Level 2: Observable Conformance**
- Level 1 requirements
- Decision trail is accessible
- State transitions are logged

**Level 3: Verifiable Conformance**
- Level 2 requirements
- Cryptographic proof of decisions (when implemented)
- Tamper-evident audit integrity (when implemented)

### Reference Implementation

→ **[execution-guard-action](https://github.com/Nick-heo-eg/execution-guard-action)**
Conformance Level: Level 1 (Structural)

---

## 5. Modular Structure

AEBS consists of the following modular specifications:

### AEBS-1: Judgment Trail

Defines decision logging schema and temporal ordering requirements.

**Repository:** [ai-judgment-trail-spec](https://github.com/Nick-heo-eg/ai-judgment-trail-spec)

### AEBS-2: Execution Boundary

Defines state enforcement model and role separation requirements.

**Specification:** [spec/aebs-2-execution-boundary.md](spec/aebs-2-execution-boundary.md)

**Repository:** [ai-execution-boundary-spec](https://github.com/Nick-heo-eg/ai-execution-boundary-spec) (this repository)

### AEBS-3: Authority Transfer

Defines agent judgment delegation and escalation protocols.

**Repository:** [agent-judgment-spec](https://github.com/Nick-heo-eg/agent-judgment-spec)

### AEBS-OTel: Observability Extension

Defines OpenTelemetry integration patterns for execution boundary observability.

**Repository:** [judgment-boundary-otel-spec](https://github.com/Nick-heo-eg/judgment-boundary-otel-spec)

---

## 6. Conformance Levels

Systems MAY claim conformance at the following levels:

### Level 1: Structural Conformance

- Role separation requirements satisfied
- Temporal ordering enforced
- Independence requirements met

### Level 2: Observability Conformance

- Level 1 requirements satisfied
- Decision states recorded and observable
- AEBS-1 (Judgment Trail) implemented

### Level 3: Verifiable Conformance

- Level 2 requirements satisfied
- Cryptographic verification implemented (when applicable)
- Tamper-evident audit trail maintained

See [Conformance Tests](spec/conformance-tests.md) for verification procedures.

---

## 7. Scope and Non-Goals

### In Scope

AEBS defines:

- Structural separation between proposal, judgment, and execution
- Decision state semantics
- Temporal ordering requirements
- Independence constraints

### Out of Scope

AEBS does **NOT** define:

- AI safety mechanisms or content guardrails
- LLM alignment or fine-tuning techniques
- Policy semantics or rule languages
- Enforcement runtime implementations
- Specific cryptographic algorithms or key management (though Level 3 conformance requires cryptographic verification when implemented)
- Harm prevention guarantees
- Compliance certification procedures

**Scope Limitation:** AEBS addresses structural separation requirements. Implementation details (including choice of cryptographic primitives for Level 3) are out of scope.

---

## 8. Compatibility

### Framework Agnostic

AEBS does not mandate:

- Specific AI frameworks or libraries
- Programming languages or runtimes
- Deployment architectures
- Observability platforms

### Composability

AEBS is designed to be composable with:

- Observability standards (OpenTelemetry, Prometheus, etc.)
- Policy frameworks (OPA, Cedar, etc.)
- AI agent frameworks (LangChain, AutoGPT, etc.)
- Existing runtime enforcement systems

---

## 9. Reference Implementation

A minimal reference implementation is provided to demonstrate structural viability:

```bash
cd compliance/reference-harness
npm install
npm test
```

This harness demonstrates:
- State machine enforcement
- Default-deny behavior
- Runtime blocking capability
- Attack vector resistance

See [compliance/reference-harness/README.md](compliance/reference-harness/README.md) for details.

---

## 9.1 Security Validation (Phase B)

This repository includes runtime attack simulations demonstrating structural failure modes
in systems without an execution boundary, and how AEBS blocks them:

- **Direct execution bypass** — Execution without judgment
- **Default-deny enforcement** — undefined/null state handling
- **Stale decision / race condition** — Version-based freshness model
- **State tampering** — Fail-closed validation

See `/compliance/attack-vectors` and run:

```bash
cd compliance
npm install
npm test
```

Expected output:
```
PASS attack-direct-bypass
PASS attack-default-deny
PASS attack-race-condition
PASS attack-state-tamper
ALL PASS (AEBS Phase B)
```

---

## 10. Security Considerations

### Threat Model

AEBS assumes the following threats are in scope:

1. **Unauthorized execution** — Actions execute without judgment
2. **Judgment bypass** — Execution occurs despite STOP decision
3. **Authority confusion** — Unclear responsibility for decisions

### Security Properties

When correctly implemented, AEBS provides:

- **Structural prevention** — Execution cannot occur without ALLOW
- **Audit trail** — Decision outcomes are observable
- **Authority separation** — Judgment is separated from proposal and execution

### Security Assumptions and Limitations

AEBS assumes a trusted execution kernel and host environment.

AEBS does NOT provide protection against:

- Compromised execution kernels
- Compromised host operating systems
- Key exfiltration or signing key compromise
- Physical or hypervisor-level attacks
- Content safety evaluation
- Adversarial robustness

AEBS enforces structural and cryptographic binding under the assumption that the execution kernel itself enforces token verification faithfully.

These concerns require additional mechanisms beyond AEBS.

---

## 11. Privacy Considerations

AEBS implementations MAY collect:

- Proposal content (action intents)
- Judgment decisions (STOP/HOLD/ALLOW)
- Execution outcomes

Implementers MUST consider:

- Data retention policies
- PII handling in decision logs
- Regulatory compliance (GDPR, CCPA, etc.)

AEBS does not mandate specific privacy controls.

---

## 12. FAQ

### Q: Is AEBS a policy engine?

**A:** No. AEBS defines structural separation, not policy semantics. Policy engines (like OPA or Cedar) MAY be used to implement judgment logic, but AEBS does not prescribe policy languages.

### Q: Is AEBS equivalent to guardrails?

**A:** No. Guardrails constrain model outputs or content. AEBS constrains execution authority through structural separation.

### Q: Does AEBS guarantee safety?

**A:** No. AEBS ensures structural separation only. Safety properties depend on the judgment logic implementation, which is outside AEBS scope.

### Q: How does AEBS differ from RBAC or access control?

**A:** RBAC controls who can perform actions. AEBS controls whether proposed actions execute at all, regardless of who proposed them.

### Q: Is AEBS specific to LLM-based agents?

**A:** No. AEBS applies to any AI system that generates executable actions, including rule-based agents, symbolic planners, and hybrid systems.

---

## 13. Versioning and Evolution

### Version Scheme

AEBS follows semantic versioning:

- **Major version** — Breaking changes to normative requirements
- **Minor version** — Backward-compatible additions
- **Patch version** — Clarifications and corrections

### Evolution Process

1. **Proposals** — Community feedback via GitHub issues
2. **Discussion** — Open review period (minimum 30 days)
3. **Approval** — Consensus-based decision
4. **Publication** — Version increment and changelog

---

## 14. Status and Roadmap

### Current Status

**Version:** v1.0-rc
**Tag:** `v1.0-rc`

This release candidate is considered structurally stable and open for evaluation.

No normative changes are expected prior to v1.0 unless critical issues are identified.

### Feedback

- **Mechanism:** GitHub Issues and Discussions
- **Target:** v1.0 stable release following community review

### Roadmap

- [x] v0.9-draft — Structural definition and conformance tests
- [x] v1.0-rc — Release candidate with conformance matrix
- [ ] v1.0 — Stable specification
- [ ] v1.1 — Additional conformance levels and formal model extensions

---

## 15. Contributors

AEBS is developed as an open standard with community input.

Contributions are welcome via:

- **GitHub Issues:** [ai-execution-boundary-spec/issues](https://github.com/Nick-heo-eg/ai-execution-boundary-spec/issues)
- **Discussions:** [ai-execution-boundary-spec/discussions](https://github.com/Nick-heo-eg/ai-execution-boundary-spec/discussions)

---

## 16. License

MIT License — See [LICENSE](LICENSE) file for details.

This specification may be implemented by any party without restriction.

---

## 17. References

1. **RFC 2119** — Key words for use in RFCs to Indicate Requirement Levels
2. **OpenTelemetry** — Observability framework for cloud-native software
3. **AEBS-1 Specification** — [ai-judgment-trail-spec](https://github.com/Nick-heo-eg/ai-judgment-trail-spec)
4. **AEBS-3 Specification** — [agent-judgment-spec](https://github.com/Nick-heo-eg/agent-judgment-spec)
5. **AEBS-OTel Specification** — [judgment-boundary-otel-spec](https://github.com/Nick-heo-eg/judgment-boundary-otel-spec)

---

## Contact

For questions, feedback, or contributions:

- **GitHub Issues:** Technical questions and bug reports
- **GitHub Discussions:** Design discussions and feature requests

---

**AI Execution Boundary Standard (AEBS)**
**Defining STOP as a first-class outcome in AI systems**
