# Layer 1 Cleanup Plan

**Date:** 2026-02-12
**Goal:** Remove Layer 3 content, seal Layer 2 ambiguity, clarify public boundaries

---

## Phase 1: Immediate Deletion

### Remove Layer 3 Product/Compliance Content

```bash
cd ~/ai-execution-boundary-spec

# Delete regulator pack (entire directory)
git rm -r enterprise/compliance/regulator_pack/

# Delete messaging strategy
git rm docs/07_messaging.md
```

**Rationale:**
- `regulator_pack/` = product packaging for regulated customers
- `07_messaging.md` = marketing positioning language
- Both are Layer 3 (Product/Strategy), not Layer 1 (Spec)

---

## Phase 2: Seal OpenClaw Example

### Add Non-Production Disclaimer

Create `examples/openclaw/NON_PRODUCTION_NOTICE.md`:

```markdown
# Non-Production Example

**This code is a proof artifact, not a production framework.**

## Purpose

This example exists solely to demonstrate:
- Structural placement of judgment boundary
- Temporal ordering (judgment before execution)
- Audit trail format

## What This Is NOT

- ❌ Production-ready library
- ❌ Reusable framework
- ❌ npm package
- ❌ Supported software

## Usage

This code should be read, not deployed.

If you need production execution governance, see private runtime repositories or contact for licensing.

---

**Status:** Sealed proof artifact
**License:** MIT (reference only, no warranties)
```

### Remove Publishable Structure

If these exist, remove:
```bash
cd ~/ai-execution-boundary-spec/examples/openclaw

# Check for package publishable indicators
ls package.json 2>/dev/null && echo "Found package.json"
ls tsconfig.json 2>/dev/null && echo "Found tsconfig.json"

# If package.json exists and has "name" field, it looks publishable
# Consider removing or marking as example-only
```

---

## Phase 3: Fix README.md

### Changes Required

1. **Remove line 166:** Link to private repository
   ```diff
   - For architectural context, see:
   - [Three-Layer Architecture](https://github.com/Nick-heo-eg/execution-governance-spec/blob/master/ARCHITECTURE_THREE_LAYER.md)
   ```

2. **Remove line 273:** Obsolete private status
   ```diff
   - This is a private repository during initial development.
   ```

3. **Add Non-Operational Disclaimer** (after line 8):
   ```markdown
   > ⚠️ **Non-Operational Specification**
   >
   > This repository contains reference specifications and proof artifacts.
   > Code examples exist to illustrate structural boundaries, not for production deployment.
   > See individual example directories for usage restrictions.
   ```

4. **Clarify OpenClaw Example** (around line 218):
   ```diff
   - **[examples/openclaw/](examples/openclaw/)** - Pre-execution judgment boundary using agent framework native hooks
   + **[examples/openclaw/](examples/openclaw/)** - Pre-execution judgment boundary proof using agent framework native hooks
     - Demonstrates: structural position, temporal ordering, audit format
     - Shows: 4/4 dangerous scenarios blocked before execution
     - Proves: Prevention is achievable by structural design
   + - ⚠️ **Non-production proof artifact** - See [NON_PRODUCTION_NOTICE.md](examples/openclaw/NON_PRODUCTION_NOTICE.md)
   ```

---

## Phase 4: Add Layer Marker

Create `EXPOSURE_LAYER.md`:

```markdown
# Repository Exposure Classification

**Layer:** 1 (Public Specification & Proof)
**Visibility:** PUBLIC
**Governed by:** judgment-boundary/REPOSITORY_EXPOSURE_MATRIX.md

---

## Allowed Content

- Technical specifications and standards
- Reference architecture (non-operational)
- Proof artifacts demonstrating feasibility
- Documented limitations
- Research-oriented analysis

## Forbidden Content

- Runtime enforcement implementations
- Production deployment guidance
- Product packaging or pricing
- Competitive positioning
- Sales/marketing materials

---

**Last Verified:** 2026-02-12
```

---

## Execution Sequence

```bash
# 1. Navigate to repository
cd ~/ai-execution-boundary-spec

# 2. Create feature branch
git checkout -b cleanup/layer1-boundaries

# 3. Delete Layer 3 content
git rm -r enterprise/compliance/regulator_pack/
git rm docs/07_messaging.md

# 4. Verify deletion
git status

# 5. Stage cleanup commit
git commit -m "Remove Layer 3 product/compliance content

- Delete enterprise/compliance/regulator_pack/ (product packaging)
- Delete docs/07_messaging.md (marketing positioning)
- Align repository with Layer 1 (Public Specification) boundaries

Ref: judgment-boundary/REPOSITORY_EXPOSURE_MATRIX.md"

# 6. Add non-production notice to openclaw example
cat > examples/openclaw/NON_PRODUCTION_NOTICE.md <<'EOF'
# Non-Production Example

**This code is a proof artifact, not a production framework.**

## Purpose

This example exists solely to demonstrate:
- Structural placement of judgment boundary
- Temporal ordering (judgment before execution)
- Audit trail format

## What This Is NOT

- ❌ Production-ready library
- ❌ Reusable framework
- ❌ npm package
- ❌ Supported software

## Usage

This code should be read, not deployed.

If you need production execution governance, see private runtime repositories or contact for licensing.

---

**Status:** Sealed proof artifact
**License:** MIT (reference only, no warranties)
EOF

git add examples/openclaw/NON_PRODUCTION_NOTICE.md

# 7. Add layer marker
cat > EXPOSURE_LAYER.md <<'EOF'
# Repository Exposure Classification

**Layer:** 1 (Public Specification & Proof)
**Visibility:** PUBLIC
**Governed by:** judgment-boundary/REPOSITORY_EXPOSURE_MATRIX.md

---

## Allowed Content

- Technical specifications and standards
- Reference architecture (non-operational)
- Proof artifacts demonstrating feasibility
- Documented limitations
- Research-oriented analysis

## Forbidden Content

- Runtime enforcement implementations
- Production deployment guidance
- Product packaging or pricing
- Competitive positioning
- Sales/marketing materials

---

**Last Verified:** 2026-02-12
EOF

git add EXPOSURE_LAYER.md

# 8. Commit markers
git commit -m "Add non-production notice and layer marker

- Add NON_PRODUCTION_NOTICE.md to openclaw example
- Add EXPOSURE_LAYER.md (Layer 1 classification)
- Seal proof artifacts as reference-only"

# 9. Update README (manual edit required)
# See Phase 3 above for exact changes

# 10. After README edit, commit
git add README.md
git commit -m "Update README for Layer 1 compliance

- Remove link to private repository (execution-governance-spec)
- Remove obsolete 'private repository' statement
- Add non-operational disclaimer
- Clarify openclaw example as proof artifact
- Update proof artifact documentation"

# 11. Review all changes
git log --oneline -5

# 12. Merge to main
git checkout main
git merge cleanup/layer1-boundaries

# 13. Push
git push origin main

# 14. Verify on GitHub
gh repo view --web
```

---

## Verification Checklist

After execution:

- [ ] `enterprise/compliance/regulator_pack/` deleted
- [ ] `docs/07_messaging.md` deleted
- [ ] `examples/openclaw/NON_PRODUCTION_NOTICE.md` created
- [ ] `EXPOSURE_LAYER.md` created
- [ ] README.md updated (4 changes)
- [ ] No broken links in README
- [ ] Repository still renders correctly on GitHub
- [ ] All commits have clear messages

---

## Risk Assessment Post-Cleanup

**Remaining public content:**
- ✅ STANDARD.md (specification)
- ✅ JUDGMENT_BOUNDARY_MINIMAL_SPEC.md (core spec)
- ✅ Proof artifacts (openclaw/proof/, shell-boundary/proof/)
- ✅ Technical documentation (docs/)
- ⚠️ openclaw implementation (sealed as proof artifact)
- ✅ enterprise/ evaluation templates (non-normative)

**Layer 1 compliance:** HIGH

**Public exposure risk:** LOW

---

## What Remains in `enterprise/`

After cleanup, `enterprise/` contains:
- `01-05_*.md` - Evaluation scope, setup, validation patterns
- `README.md` - Marked "Non-Normative Reference Materials"
- `checklist.md`, `incident_response.md` - Templates
- `compliance/regulatory_mapping.md` - Generic regulatory concepts

**Status:** Borderline Layer 1 (evaluation patterns) vs Layer 3 (customer materials)

**Decision:** Keep for now (marked non-normative), monitor

---

**Status:** Ready for execution
**Estimated time:** 15 minutes
**Rollback plan:** Branch cleanup/layer1-boundaries can be deleted if issues found
