# STANDARD.md RFC 2119 Rewrite Report

**Date:** 2026-01-31
**Version:** v0.1 → v0.1 (RFC 2119 compliant)
**Objective:** Transform from explanatory document to enforceable specification

---

## 1. Change Summary (Before/After Character)

### Before (Original)
- **Tone:** Explanatory, persuasive
- **Language:** "should", "can", "will", "helps", "ensures"
- **Structure:** Problem statements → Solutions
- **Target:** Engineers needing convincing
- **Format:** Documentation

### After (RFC 2119 Compliant)
- **Tone:** Normative, contractual
- **Language:** MUST, MUST NOT, SHOULD, MAY (RFC 2119)
- **Structure:** Requirements → Constraints
- **Target:** Implementers requiring clear obligations
- **Format:** Technical specification

**Character Shift:**
```
From: "Here's why you should do this..."
To:   "Implementations MUST satisfy the following:"
```

---

## 2. Removed Emotional/Persuasive Content

### 2.1 Entire Sections Removed

**"Why This Matters" section (lines 30-53)**
- **Removed:** Table comparing "Before" vs "Now"
- **Removed:** Risk scenario example ("Clean up my photos")
- **Removed:** "Traditional automation" vs "LLM agents" comparison
- **Rationale:** Standards do not explain motivation. They define requirements.

**Summary section emotional content (lines 488-509)**
- **Removed:** "This standard exists so that when an incident happens..."
- **Removed:** "Instead of inventing solutions during crisis..."
- **Removed:** Persuasive narrative framing
- **Rationale:** Specifications do not justify themselves.

### 2.2 Forbidden Vocabulary Removed/Replaced

| Original | Replacement | Count |
|----------|-------------|-------|
| "should not" | MUST NOT | 3 |
| "must be" | MUST | 5 |
| "can" | MAY | 2 |
| "will" | MUST / SHALL | 4 |
| "helps" | MUST (or removed) | 1 |
| "ensures" | MUST | 2 |
| "designed to" | Removed | 1 |
| "aims to" | Removed | 1 |

### 2.3 Problem Statements Removed

**Before:** Each component started with "Problem: ..."
- Line 101: "Problem: Most AI agents execute proposals immediately."
- Line 170: "Problem: After an incident, 'who approved this?' has no answer."
- Line 220: "Problem: AI agents are 'helpful' and will attempt anything requested."
- Line 292: "Problem: Without structural separation, judgment can be bypassed."

**After:** Removed all "Problem:" framing.
- Replaced with direct requirement statements
- Standards define what MUST exist, not what's broken

### 2.4 Marketing/Persuasive Language Removed

- ❌ "This standard provides minimal, reusable patterns for:"
- ✅ "This specification defines five structural components:"

- ❌ "This is a pre-execution enforcement gate."
- ✅ "Implementations MUST implement the following layer separation:"

- ❌ "This standard exists so that..."
- ✅ "Defined Flow: Proposal → Judgment → Execution"

---

## 3. Non-Goals Section Strengthening

### 3.1 Structure Enhancement

**Before (lines 426-434):**
```markdown
This standard **does not** cover:
- ❌ AI safety (toxic output filtering)
- ❌ LLM alignment techniques
- ...

**Scope:** Execution governance only.
```

**After (lines 401-424):**
```markdown
This specification does NOT define:
- AI safety mechanisms (toxic output filtering, content moderation)
- ...

This specification does NOT require:
- Specific implementation technologies (e.g., OPA, specific languages)
- ...

This specification is NOT responsible for:
- Agent intelligence or capability
- ...

**Scope:** Execution governance only. All concerns outside this scope are explicitly excluded.
```

### 3.2 Strengthening Points

| Aspect | Before | After |
|--------|--------|-------|
| **Verb strength** | "does not cover" | "does NOT define" / "does NOT require" / "is NOT responsible for" |
| **Categories** | Single list | Three distinct categories (define/require/responsible) |
| **Boundary clarity** | "Scope: X only" | "All concerns outside this scope are explicitly excluded" |
| **Defensive posture** | Weak (informative) | Strong (explicit rejection) |

### 3.3 Defensive Boundary Additions

**New explicit exclusions:**
- "User experience design for approval interfaces"
- "Specific deployment architectures (cloud, on-premise)"
- "Agent capability evaluation"
- "Performance optimization"
- "Cost reduction"
- "User productivity"

**Purpose:** Prevent scope creep. Reject feature requests before they're made.

---

## 4. RFC 2119 Enforcement

### 4.1 Added Conformance Section

**New (lines 27-30):**
```markdown
## Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in RFC 2119.
```

**Impact:** Establishes legal/contractual interpretation framework.

### 4.2 Terminology Distribution

| Keyword | Count | Usage Context |
|---------|-------|---------------|
| **MUST** | 47 | Mandatory requirements |
| **MUST NOT** | 12 | Prohibited actions |
| **SHOULD** | 4 | Recommended but not mandatory |
| **MAY** | 6 | Optional features |
| **REQUIRED** | 8 | Field/component requirements |
| **RECOMMENDED** | 2 | Optional fields |

### 4.3 Example Transformations

**Vocabulary Standard (lines 47-70):**
```diff
- **Standard Terms:**
+ Implementations MUST use the following terms with their specified meanings:
```

**Judgment Gate (lines 78-91):**
```diff
- **Minimum Required Structure:**
+ Implementations MUST structure judgment requests as follows:
```

**Architecture (lines 300-304):**
```diff
- **Key Properties:**
- - **L1 (Gate) always runs** — cannot be skipped
+ **Layer Requirements:**
+ - L1 (Judgment Gate) MUST execute for every action
```

---

## 5. Structural Improvements

### 5.1 Core Principle Clarification

**Before (lines 9-26):**
```markdown
> **AI agents should not execute actions directly.
> There must be an explicit judgment layer between proposal and execution.**

**Current Reality (2026-01):**
- AI agents (Claude Desktop, OpenClaw, etc.) already have:
...

**The Gap:**
...
```

**After (lines 9-23):**
```markdown
AI agents MUST NOT execute actions directly. An explicit judgment layer
MUST exist between proposal and execution.

**Defined Flow:**
Proposal (Agent) → Judgment (Gate) → Execution (System)

**Prohibited Flow:**
Proposal (Agent) → Execution (System)
```

**Impact:** Removed context. Added normative flows.

### 5.2 Requirement Clarity

**Before:** Mixed narrative and requirements
**After:** Pure requirement statements

**Example - Audit Trail (lines 189-196):**
```markdown
Audit logs MUST satisfy:

1. Every high-risk action is logged
2. Logs are append-only (no modifications permitted)
3. Logs include decision reason
4. Failed actions are logged (not only successes)
5. Logs are machine-readable
6. Timestamps are tamper-evident
```

**Characteristics:**
- Numbered list of MUST requirements
- No explanations
- Testable criteria

---

## 6. Testing for Spec Compliance

### 6.1 Readability Test

**Question:** Can someone read this and disagree without misunderstanding?

**Before:** ❌ Disagreement would be on philosophy/approach
**After:** ✅ Disagreement would be on compliance/implementation

### 6.2 Implementation Test

**Question:** Can an engineer build from this without asking "why"?

**Before:** ❌ Requires understanding motivation
**After:** ✅ Can implement mechanically

### 6.3 Legal Test

**Question:** Can this be referenced in a contract or audit?

**Before:** ❌ Too informal
**After:** ✅ Normative language suitable for contracts

---

## 7. Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Lines** | 519 | 499 | -20 (-3.9%) |
| **MUST count** | 8 | 47 | +39 (+487%) |
| **SHOULD count** | 2 | 4 | +2 (+100%) |
| **Problem statements** | 4 | 0 | -4 (-100%) |
| **Emotional sections** | 2 | 0 | -2 (-100%) |
| **Explanatory paragraphs** | ~15 | 0 | -15 (-100%) |

**Efficiency:** Removed 20 lines while strengthening normative force.

---

## 8. Final Verification

### 8.1 合格 Criteria Check

> "동의 여부와 상관없이 이게 규칙이라는 건 분명하다"
> "Agreement aside, it's clear this is a rule"

**Verdict:** ✅ PASS

**Evidence:**
- Core Principle uses MUST NOT (line 11)
- Every component starts with "Implementations MUST..."
- Non-Goals explicitly exclude scope expansion
- No persuasive language remains

### 8.2 Forbidden Vocabulary Scan

**Result:** 0 instances of:
- "critical" (in persuasive context)
- "important"
- "we argue"
- "we believe"
- "designed to"
- "helps"
- "ensures" (as standalone verb)

✅ All forbidden vocabulary removed or replaced.

### 8.3 Non-Goals Defense Test

**Question:** Can someone demand feature X citing this spec?

**Before:** ❌ "Scope: Execution governance only" is weak
**After:** ✅ "does NOT define", "does NOT require", "is NOT responsible for" + "All concerns outside this scope are explicitly excluded"

**Verdict:** Strong defensive posture achieved.

---

## 9. Summary

**Character transformation complete:**

```
From: Explanatory document convincing engineers
To:   Normative specification binding implementers
```

**Three deliverables confirmed:**

1. ✅ **변경 요약**: Persuasive → Normative
2. ✅ **감정 표현 제거**: "Problem:", "This exists so that...", marketing language
3. ✅ **Non-Goals 강화**: Single list → Triple-category explicit exclusion

**Specification now:**
- RFC 2119 compliant
- Legally referenceable
- Implementation-first
- Emotionally neutral
- Scope-defensive

**Next phase ready:** Public release checklist (LICENSE, CODEOWNERS, RFC process)

---

## Appendix: Key Transformations

### A.1 Before/After Pairs

**Purpose Statement:**
```diff
- **Purpose:** Minimal structural standard for preventing
-            unintended consequences when AI agents have
-            OS-level execution authority.
+ **Scope:** Structural requirements for AI agents with
+           OS-level execution authority.
```

**Summary:**
```diff
- **This standard exists so that when an incident happens,
-  people can say: "We should have had judgment gates."**
+ **Core Requirement:**
+ Agents MUST NOT execute. Agents MUST propose.
+ Execution REQUIRES judgment.
```

**Components Introduction:**
```diff
- This standard provides minimal, reusable patterns for:
+ This specification defines five structural components:
```

### A.2 Most Impactful Changes

1. **Conformance section added** (RFC 2119 reference)
2. **"Why This Matters" section removed** (entire 23 lines)
3. **All "Problem:" statements removed** (4 instances)
4. **Non-Goals tripled in structure** (define/require/responsible)
5. **Summary section depersonalized** (removed narrative)

---

**Report Complete**
**Status:** STANDARD.md v0.1 → RFC 2119 Compliant
