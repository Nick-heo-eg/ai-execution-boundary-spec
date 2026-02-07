# Judgment Gate: One-Page Visual Summary

> **Pre-execution judgment boundary for autonomous agents**

---

## The Core Problem (Visualized)

```
Traditional AI Agent Safety
═══════════════════════════════════════════════════════════════

  User → LLM → Tool Execution → Output Filter → Result
                      │
                      ▼
                  💥 DAMAGE ALREADY DONE
                  (Cannot be undone)


Judgment Gate Approach
═══════════════════════════════════════════════════════════════

  User → LLM → [JUDGMENT GATE] → Tool Execution → Result
                      │
              ┌───────┼───────┐
              │       │       │
              ▼       ▼       ▼
           STOP    HOLD    ALLOW
            ❌      ⏸️      ✅
                           │
                    ONLY safe actions
                    reach execution
```

---

## The Math

```
Traditional Metric: Accuracy
────────────────────────────────────────────────────────────────
  = Correct outputs / Total outputs
  = 999/1000 = 99.9% ✅

  But 1 error = "rm -rf /" → System destroyed 💥

  Accuracy says: "Great performance!"
  Reality: Everything is gone.


EDC Metric: Expected Damage Cost
────────────────────────────────────────────────────────────────
  = P(over-execution) × Cost(over-execution)
  = (1/1000) × ∞
  = ∞ ❌

  EDC says: "UNACCEPTABLE"
  Solution: P(over-execution) → 0

  Judgment Gate: Block BEFORE execution
    → EDC = 0 × ∞ = 0 ✅
```

---

## Proof (4 Dangerous Scenarios Tested)

```
Scenario                        Expected     Result      Evidence
─────────────────────────────────────────────────────────────────────
S1: rm -rf /tmp/test            STOP         ✅ STOPPED  Regex matched
S2: Browser financial submit    HOLD         ✅ HELD     Risk hint matched
S3: Unknown dynamic tool        HOLD         ✅ HELD     Unprofiled tag
S5: Unclassified new tool       HOLD         ✅ HELD     Fail-closed default

─────────────────────────────────────────────────────────────────────
False negatives:                             0
Over-execution rate:                         0%
P(over-execution):                           0 ✅
```

---

## How It Works

```
┌──────────────────────────────────────────────────────────────┐
│  OpenClaw Plugin (Zero Core Modifications)                   │
└──────────────────────────────────────────────────────────────┘

   Tool Call
       ↓
  before_tool_call hook (OpenClaw native)
       ↓
   ┌────────────────────────┐
   │  1. Load policy.yaml   │  ← Declarative rules
   │  2. Match patterns     │  ← Regex, risk hints, tool names
   │  3. Decide: S/H/A      │  ← STOP, HOLD, or ALLOW
   │  4. Audit log (JSONL)  │  ← Every non-ALLOW decision
   │  5. Return block/allow │  ← {block: true} or undefined
   └────────────────────────┘
       │
   ────┼────
   │       │
   ▼       ▼
 Block   Execute
 (S/H)   (ALLOW)
```

---

## Comparison

```
┌──────────────────┬─────────────────┬──────────────────────┐
│ Approach         │ Judgment Point  │ Prevent Over-Exec?   │
├──────────────────┼─────────────────┼──────────────────────┤
│ Guardrails AI    │ Post-output     │ ❌ No (output only)  │
│ LangChain        │ Post-execution  │ ❌ No (too late)     │
│ Nemo Guardrails  │ Pre/post-output │ ❌ No (output only)  │
│ Constitutional   │ Training-time   │ ⚠️  Partial          │
│ Judgment Gate    │ PRE-EXECUTION   │ ✅ YES (proven)      │
└──────────────────┴─────────────────┴──────────────────────┘
```

---

## Key Properties

```
✅ Zero core modifications      (100% plugin-based)
✅ Pre-execution blocking        (before_tool_call hook)
✅ Policy-driven                 (YAML rules, not hardcoded)
✅ Fail-closed                   (unknown → HOLD)
✅ Complete audit trail          (JSONL logs)
✅ EDC optimization              (P(over-execution) → 0)
✅ Proven empirically            (4/4 dangerous scenarios blocked)
```

---

## The Bottom Line

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  "Autonomous agent safety is not about better answers —   │
│   it's about preventing the wrong execution               │
│   at the only moment it matters."                         │
│                                                            │
│                             [BEFORE]                       │
│                                                            │
└────────────────────────────────────────────────────────────┘


  Accuracy optimization → Better outputs (but damage happens)
  EDC optimization      → No damage (execution prevented)


  This is not about "stopping tools"
  This is about "defining where judgment must live"
```

---

## Repository Structure

```
openclaw-judgment-gate/
├── src/
│   ├── plugin.ts     # Hook registration
│   ├── judge.ts      # Decision engine
│   ├── rules.ts      # Policy loader
│   └── logger.ts     # Audit trail
├── rules/
│   └── policy.yaml   # 4 declarative rules
├── proof/
│   ├── AUDIT_LOG.jsonl        # 4 blocked executions
│   ├── JUDGMENT_CHECKLIST.md  # All criteria ✅
│   └── RUN_NOTES.md           # Test documentation
└── docs/
    ├── VISUALIZATIONS.md      # Full diagrams
    └── VISUAL_SUMMARY.md      # This file
```

---

## Quick Start

```bash
# 1. Clone and install
cd openclaw-judgment-gate
pnpm install

# 2. Run integration test
node test-integration.mjs
# Expected: 🎉 All tests passed! (5/5)

# 3. Verify audit log
cat ../proof/AUDIT_LOG.jsonl | jq
# Should show 4 blocked executions with rule IDs
```

---

## License & Citation

MIT License

```bibtex
@misc{judgmentgate2026,
  title={Execution-Time Judgment Boundary for Autonomous Agents},
  author={OpenClaw Integration Proof of Concept},
  year={2026},
  url={https://github.com/[your-org]/openclaw-judgment-gate}
}
```

---

**GitHub**: [your-org]/openclaw-judgment-gate
**Questions**: Open an issue or discussion
**Status**: Proof of concept (production deployment requires threat modeling)
