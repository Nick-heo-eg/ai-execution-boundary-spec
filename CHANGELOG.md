# Changelog

All notable changes to the AI Execution Boundary Standard (AEBS) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0-rc] - 2026-02-22

### Added
- **Conformance Level Matrix**: Three-tier conformance structure (Level 1-3)
- **RFC 2119 Compliance**: Normative language enforcement (MUST/SHOULD/MAY)
- **Reference Implementation Designation**: execution-guard-action identified as Level 1 conformant implementation
- **Terminology Lock**: Canonical definitions for Intent, Judgment, Execution (cross-referenced from execution-boundary/TERMINOLOGY.md)
- **Default-deny enforcement rule**: Execution MUST NOT occur without explicit ALLOW judgment

### Clarified
- **Scope Limitation**: AEBS addresses structural separation only, not detection accuracy
- **Non-goals Explicitly Restated**:
  - Not a compliance certification framework
  - Not a detection/classification system
  - Not a universal safety guarantee
- **Authority Transfer Model**: Formalized handoff between Proposal, Judgment, and Execution roles
- **Decision State Semantics**: STOP/HOLD/ALLOW definitions now normative

### Stabilized
- **Decision State Model**: Three-state judgment outcome (STOP/HOLD/ALLOW) locked
- **Structural Separation Requirement**: Judgment MUST occur before execution
- **Pre-execution Traceability**: All decisions MUST be recorded before side effects
- **Enforcement Gate Pattern**: Code-level blocking requirements formalized

### Changed
- **Status**: Draft → Release Candidate
- **Normative vs Informative**: Clear separation of normative requirements from implementation guidance
- **Example Structure**: All examples now include conformance level annotations

---

## [v0.9-draft] - 2026-02-19

### Added
- Initial draft specification
- Core concepts: Proposal, Judgment, Execution separation
- Decision states: STOP, HOLD, ALLOW
- Basic conformance requirements
- Enterprise extension patterns

### Established
- Vendor-neutral positioning
- Structural governance focus
- Pre-execution traceability principle
- Default-deny philosophy

---

## Release Philosophy

### What Triggers a Major Version (X.0.0)
- Breaking changes to normative requirements
- Removal of conformance levels
- Fundamental model restructuring

### What Triggers a Minor Version (1.X.0)
- New conformance levels added
- Additional normative requirements (backward-compatible)
- New normative decision states

### What Triggers a Patch Version (1.0.X)
- Clarifications to existing requirements
- Typo fixes in normative text
- Non-normative example improvements

---

## Conformance Tracking

AEBS conformance is verified through:
1. Structural analysis (code inspection)
2. Runtime behavior testing
3. Decision trail completeness validation

Reference Implementation: [execution-guard-action](https://github.com/Nick-heo-eg/execution-guard-action)

---

## Feedback and Contributions

Submit feedback via:
- GitHub Issues: https://github.com/Nick-heo-eg/ai-execution-boundary-spec/issues

Acceptance criteria for v1.0 stable:
- [ ] No critical normative ambiguities reported
- [ ] At least one Level 1 conformant implementation verified
- [ ] Terminology consistency across ecosystem repositories

---

## Version History

| Version | Date | Status | Key Changes |
|---------|------|--------|-------------|
| v1.0-rc | 2026-02-22 | Release Candidate | Conformance matrix, RFC 2119 compliance |
| v0.9-draft | 2026-02-19 | Draft | Initial specification |

---

**Next Milestone**: v1.0 stable
