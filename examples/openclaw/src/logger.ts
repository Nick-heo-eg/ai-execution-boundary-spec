export function audit(res: any, ctx: any) {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    decision: res.decision,
    rule_id: res.rule_id,
    reason: res.reason,
    context: {
      source: ctx.source,
      tool: ctx.tool,
      action: ctx.action,
      risk_hints: ctx.risk_hints
    }
  }));
}
