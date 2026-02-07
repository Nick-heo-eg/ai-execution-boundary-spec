import { judge } from "./judge.js";
import { audit } from "./logger.js";

export function before_tool_call(rawCtx: any) {
  const ctx = normalize(rawCtx);
  const res = judge(ctx);

  if (res.decision !== "ALLOW") audit(res, ctx);

  // enforce mode는 OpenClaw 쪽 config로 토글하는 걸 권장.
  // 여기서는 기본 enforce(차단)로 두고, 필요하면 mode로 분기.
  if (res.decision === "STOP") throw new Error(`Judgment STOP: ${res.reason}`);
  if (res.decision === "HOLD") throw new Error(`Judgment HOLD: ${res.reason}`);

  return rawCtx;
}

function normalize(raw: any) {
  return {
    source: raw?.source ?? "tool",
    tool: raw?.tool?.name ?? raw?.tool ?? "unknown",
    action: raw?.action ?? raw?.tool?.action ?? "unknown",
    args: raw?.args ?? raw?.tool?.args ?? "",
    risk_hints: raw?.risk_hints ?? raw?.riskHints ?? []
  };
}
