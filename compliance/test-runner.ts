import { run_attack_direct_bypass } from "./attack-vectors/attack-direct-bypass";
import { run_attack_default_deny } from "./attack-vectors/attack-default-deny";
import { run_attack_race_condition } from "./attack-vectors/attack-race-condition";
import { run_attack_state_tamper } from "./attack-vectors/attack-state-tamper";

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (e: any) {
    console.error(`FAIL ${name}`);
    console.error(String(e?.stack ?? e));
    process.exitCode = 1;
  }
}

run("attack-direct-bypass", run_attack_direct_bypass);
run("attack-default-deny", run_attack_default_deny);
run("attack-race-condition", run_attack_race_condition);
run("attack-state-tamper", run_attack_state_tamper);

if (process.exitCode) process.exit(process.exitCode);
console.log("ALL PASS (AEBS Phase B)");
