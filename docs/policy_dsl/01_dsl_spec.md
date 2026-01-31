# Policy DSL Specification (v0.1)

## Core Concepts
- intent: what the agent wants to do
- risk: low | medium | high | critical
- decision: ALLOW | HOLD | DENY | ESCALATE
- approver: human | security | finance | policy

## Evaluation Order
1. Match intent
2. Check risk
3. Resolve decision
4. Require approver if needed
