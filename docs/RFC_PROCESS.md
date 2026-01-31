# RFC Process

**Scope:** Changes to STANDARD.md or core specification components.

---

## When Required

RFC process is REQUIRED for:
- Changes to STANDARD.md normative requirements
- Addition/removal of standard components
- Changes to forbidden actions baseline
- Changes to audit log format
- Changes to vocabulary definitions

RFC process is NOT required for:
- Documentation updates
- Example additions
- Typo fixes
- Non-normative clarifications

---

## Process

### 1. Open Issue

Create GitHub issue with:
- **Title:** `[RFC] Brief description`
- **Content:**
  - Problem statement
  - Proposed change
  - Rationale
  - Backwards compatibility impact

### 2. Discussion Period

Minimum 7 days for community feedback.

### 3. Pull Request

Submit PR with:
- Changes to specification
- Rationale document (if major change)
- Updated version number (if applicable)

### 4. Approval

PR requires approval from CODEOWNERS.

---

## Rejection Criteria

PRs will be rejected if they:
- Expand scope beyond execution governance
- Add vendor-specific requirements
- Weaken existing MUST requirements
- Remove items from forbidden actions baseline

---

## Version Numbering

- **Patch (0.1.x):** Clarifications, typos, examples
- **Minor (0.x.0):** New optional components, SHOULD requirements
- **Major (x.0.0):** Breaking changes, new MUST requirements

---

## Template

```markdown
## RFC: [Title]

**Status:** Proposed
**Author:** [Name]
**Date:** [YYYY-MM-DD]

### Problem

[What gap or issue does this address?]

### Proposal

[Specific changes to specification]

### Rationale

[Why this change is necessary]

### Backwards Compatibility

[Impact on existing implementations]

### Alternatives Considered

[Other approaches and why they were rejected]
```

---

## Current Status

**Version:** v0.1 (Draft)
**Open RFCs:** 0
**Next version:** v0.2 (planned)
