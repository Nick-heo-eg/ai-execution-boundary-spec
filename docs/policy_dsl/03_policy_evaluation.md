# Policy Evaluation Semantics

- If decision == ALLOW → execution may proceed
- If decision == HOLD → execution blocked until approval
- If decision == DENY → execution forbidden
- If decision == ESCALATE → multi-party approval required

Default fallback:
- Unmatched intent → HOLD
