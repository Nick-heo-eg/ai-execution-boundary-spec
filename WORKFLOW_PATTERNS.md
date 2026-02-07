# Reusable Workflow Patterns

**Purpose:** Document proven patterns from ai-execution-boundary-spec for future projects

**Status:** Internal reference (not for public repo)

---

## Pattern 1: Public Release Preparation

### Objective
Remove meta-documentation and process artifacts before public release

### When to Use
- Transforming internal work to public standard/spec
- Releasing documentation that must appear "already complete"
- Positioning as reference (not work-in-progress)

### Checklist

#### Phase 1: Content Quality
- [ ] Remove all "why we did this" explanations
- [ ] Remove problem-solution narratives
- [ ] Remove vendor/product names
- [ ] Remove emotional/persuasive language
- [ ] Apply RFC 2119 or equivalent normative language

#### Phase 2: Meta-Documentation Removal
- [ ] Remove process reports (REWRITE_REPORT, QA_REPORT, etc.)
- [ ] Remove internal guides (COMMIT_GUIDE, CHECKLIST, etc.)
- [ ] Update .gitignore to exclude future meta-docs
- [ ] Verify `git ls-files` shows no meta-documentation

#### Phase 3: Final Verification
- [ ] No "we/our" language in normative documents
- [ ] No AI collaboration mentions (Claude, Co-Authored-By, etc.)
- [ ] LICENSE appropriate for target use case
- [ ] CODEOWNERS or equivalent authority structure
- [ ] README focuses on "what it is" not "why it exists"

### Key Principle

> **Public repos show results, not process.**
> Meta-documentation weakens authority.

---

## Pattern 2: Vendor Neutrality

### Objective
Prevent obsolescence and maintain credibility by removing specific product references

### Detection

```bash
# Scan for product names
grep -ri "openclaw\|claude.*desktop\|chatgpt\|copilot" .

# Scan for company names
grep -ri "anthropic\|openai\|microsoft\|google" .
```

### Replacement Strategy

| Instead of | Use |
|------------|-----|
| "OpenClaw, Claude Desktop" | "AI agents with OS-level execution authority" |
| "ChatGPT generates" | "LLM-based systems generate" |
| "Anthropic's API" | "LLM API" |

### Exception
Examples directory may reference specific products if marked "Non-normative"

---

## Pattern 3: RFC 2119 Transformation

### Objective
Convert persuasive/explanatory documentation to normative specification

### Forbidden Words

| Remove | Replace With |
|--------|--------------|
| can | MAY |
| will | MUST / SHALL |
| should | MUST / SHOULD (based on intent) |
| helps | MUST / REQUIRED |
| ensures | MUST |
| designed to | (remove entirely) |
| we believe | (remove entirely) |
| important/critical | (remove, use MUST instead) |

### Structure Transformation

**Before (Persuasive):**
```
This is important because accidents happen.
You should implement gates.
```

**After (Normative):**
```
Implementations MUST implement judgment gates.
```

### Verification

```bash
grep -iE "can |will |helps|ensures|designed to|we believe" SPEC.md
# Result should be: 0 matches
```

---

## Pattern 4: Non-Goals Defense

### Objective
Prevent scope creep by explicitly defining what spec does NOT cover

### Structure (Three Categories)

```markdown
This specification does NOT define:
- [List areas outside scope]

This specification does NOT require:
- [List implementation choices left open]

This specification is NOT responsible for:
- [List areas of non-accountability]

**Scope:** [One sentence boundary]
All concerns outside this scope are explicitly excluded.
```

### When to Strengthen
- Before public release
- After receiving scope expansion requests
- When positioning against broader frameworks

---

## Pattern 5: Pre-Incident Positioning

### Objective
Present solution before problem becomes obvious, without predicting disaster

### Language Guidelines

✅ **Allowed:**
- "Pre-incident reference"
- "Structural requirements for..."
- "Minimum boundaries"
- "Should exist before..."

❌ **Forbidden:**
- "This will prevent..."
- "Recent incidents show..."
- "Before disaster strikes..."
- "To avoid catastrophe..."

### Tone
- Declarative (not predictive)
- Structural (not protective)
- Reference (not solution)

### Key Phrase

> **"The structure that should have existed before."**

---

## Pattern 6: Commit Message Hygiene

### Objective
Remove AI collaboration traces from commit history

### Pre-Commit Checklist

```bash
# Check commit message
git log -1 --format=%B | grep -iE "claude|co-author|anthropic|ai-assisted"

# Should return: nothing
```

### Clean Commit Template

```
<type>: <subject>

<body explaining what/why, not how it was created>

Status: <current state>
```

### Forbidden in Commits
- "Generated with Claude Code"
- "Co-Authored-By: Claude"
- "AI-assisted refactoring"
- References to AI tools in commit body

---

## Pattern 7: .gitignore Strategy for Internal Docs

### Objective
Keep process artifacts local without manual deletion

### Template

```gitignore
# Internal process documents (not for public repo)
*_REPORT.md
*_CHECKLIST.md
*_GUIDE.md
*_INSTRUCTIONS.md
REWRITE_*.md
QA_*.md
WORKFLOW_*.md
```

### Verification

```bash
git ls-files | grep -E "REPORT|GUIDE|CHECKLIST|INSTRUCTIONS"
# Should return: nothing
```

---

## Pattern 8: README Tone Control

### Objective
Introduce project without selling or explaining why it exists

### Structure

```markdown
# Project Name

**Purpose:** [What it does in one sentence]

## What This Is

[Declarative statements]

This is **not**:
- [What it's not]

This **is**:
- [What it is]

## [Core content sections]

## Non-Goals

[Explicit exclusions]
```

### Forbidden Patterns
- "Why This Exists" section
- "The Problem" framing
- "Our Solution" language
- Before/After narratives

---

## Pattern 9: Silent Authority

### Principle

> **The less you explain, the stronger the authority.**

### Application
- Standards don't justify themselves
- Specifications declare, not persuade
- References exist, not argue

### Test

Ask: "Could this be disputed based on process criticism?"

If yes → remove process exposure
If no → authority is structural

---

## Anti-Patterns to Avoid

### ❌ Over-Documentation
Adding meta-documentation to show thoroughness
→ Weakens authority, creates attack surface

### ❌ Process Transparency
Showing "how we got here"
→ Makes work appear unfinished

### ❌ Vendor Examples in Specs
Referencing specific products in normative text
→ Creates obsolescence risk

### ❌ Problem-First Framing
Starting with "the problem is..."
→ Positions as reactive, not authoritative

---

## Application Checklist for New Projects

- [ ] Determine: Is this a standard/spec or implementation?
- [ ] If spec: Apply RFC 2119 pattern
- [ ] If public: Apply meta-doc removal pattern
- [ ] Always: Apply vendor neutrality pattern
- [ ] Always: Apply commit hygiene pattern
- [ ] Before release: Apply Non-Goals defense
- [ ] Review: Does README sell or declare?
- [ ] Final: Run silent authority test

---

## Success Metrics

**A workflow pattern succeeded if:**

1. Output appears "already complete" (not work-in-progress)
2. No process artifacts visible in public repo
3. Authority comes from structure, not explanation
4. Vendor-neutral (won't obsolete)
5. Scope-defensive (resists expansion)

---

**These patterns extracted from:** ai-execution-boundary-spec v0.1 release process
**Proven effective for:** Spec-first, pre-incident positioning, vendor-neutral standards
