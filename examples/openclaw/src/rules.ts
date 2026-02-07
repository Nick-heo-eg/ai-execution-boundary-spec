import fs from "fs";
import YAML from "yaml";

export function loadRules() {
  const raw = fs.readFileSync(new URL("../rules/policy.yaml", import.meta.url), "utf8");
  const doc = YAML.parse(raw);
  return (doc.rules ?? []).map((r: any) => ({
    ...r,
    matches: (ctx: any) => matchRule(r.when, ctx)
  }));
}

function matchRule(when: any, ctx: any) {
  if (!when) return false;

  if (when.tool_in && !when.tool_in.includes(ctx.tool)) return false;
  if (when.source_in && !when.source_in.includes(ctx.source)) return false;

  if (when.any_regex_in_args) {
    const text = String(ctx.args ?? "");
    const ok = when.any_regex_in_args.some((re: string) => new RegExp(re, "i").test(text));
    if (!ok) return false;
  }

  if (when.risk_hints_any) {
    const hints = Array.isArray(ctx.risk_hints) ? ctx.risk_hints : [];
    const ok = when.risk_hints_any.some((h: string) => hints.includes(h));
    if (!ok) return false;
  }

  if (when.action_any) {
    if (!when.action_any.includes(ctx.action)) return false;
  }

  return true;
}
