# AEBS Runtime Attack Simulations (Phase B)

These files demonstrate structural failure modes in systems that do **not**
implement an execution boundary, and show how AEBS blocks those attempts.

These are **architectural proofs**, not vulnerability disclosures.

Each file contains:
- "Without AEBS" — expected to EXECUTE (demonstrates the failure mode)
- "With AEBS" — expected to be BLOCKED by the boundary
