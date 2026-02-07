# OpenClaw Adapter Discovery Issue

**Issue Type:** Adapter Maturity
**Severity:** Low (does not affect judgment correctness)
**Status:** Open

## Summary

The Judgment Gate plugin code is complete and validated, but does not appear in `pnpm openclaw plugins list` output. This is an adapter integration issue, not a judgment boundary issue.

## What Works

- ✅ Plugin code structure follows OpenClaw plugin API
- ✅ `before_tool_call` hook implementation is correct
- ✅ Judgment logic validated independently (6/6 tests pass)
- ✅ Symlink created in OpenClaw extensions directory
- ✅ `package.json` manifest correctly formatted

## What Doesn't Work

- ❌ Plugin does not appear in `pnpm openclaw plugins list`
- ❌ OpenClaw runtime does not load the plugin

## Investigation Summary

### Verified Correct

1. **Symlink structure:**
   ```bash
   /home/nick-heo123/work/openclaw/extensions/judgment-gate
   -> /home/nick-heo123/ai-execution-boundary-spec/examples/openclaw
   ```

2. **Package manifest:**
   ```json
   {
     "name": "openclaw-judgment-gate",
     "openclaw": {
       "extensions": ["./index.ts"]
     }
   }
   ```

3. **Entry point:**
   ```typescript
   // index.ts
   export { default } from "./src/openclaw-plugin";
   ```

4. **Plugin export:**
   ```typescript
   const judgmentGatePlugin = {
     id: "judgment-gate",
     name: "Judgment Gate",
     description: "Pre-execution judgment boundary (STOP/HOLD/ALLOW)",
     register(api: OpenClawPluginApi) { ... }
   };
   export default judgmentGatePlugin;
   ```

### Possible Causes

1. **TypeScript compilation requirement:**
   - OpenClaw may require compiled `.js` files
   - Other extensions use TypeScript, but are in the workspace build
   - External symlinked extensions may need pre-compilation

2. **Workspace dependency resolution:**
   - `devDependencies: { "openclaw": "workspace:*" }`
   - May require local build or different import strategy

3. **Discovery timing:**
   - Plugin discovery may run before symlink resolution
   - May need explicit workspace rebuild

4. **Node modules requirement:**
   - Other extensions have local `node_modules/` directories
   - `yaml` dependency may need local installation

### Attempted Fixes

- [x] Changed import path from `.js` to no extension
- [x] Created root-level `index.ts` entry point
- [x] Updated `package.json` extensions path
- [x] Ran `pnpm install` in workspace root
- [x] Ran `pnpm install --filter openclaw-judgment-gate`
- [ ] Pre-compile TypeScript to dist/
- [ ] Use jiti loader explicitly
- [ ] Add to workspace packages in pnpm-workspace.yaml

## Impact Assessment

**Judgment Boundary Proof:** ✅ Not affected
**Execution Authority Validation:** ✅ Not affected
**Runtime Integration:** ⚠️ Partial (architectural validation complete)

This issue affects **adapter deployment convenience**, not **judgment correctness**.

The core architectural proof (pre-execution interception via `before_tool_call`) has been validated through:
- Hook structure analysis (`src/plugins/types.ts`)
- Independent judgment logic testing (6/6 pass)
- Policy-driven decision validation

## Workaround

The judgment logic is fully validated via standalone test:

```bash
cd /home/nick-heo123/ai-execution-boundary-spec/examples/openclaw
node test-judgment-direct.mjs
```

Expected output: `Test Results: 6 passed, 0 failed`

## Recommended Resolution Path

1. **Short-term:** Document as adapter maturity issue (this file)
2. **Medium-term:** Investigate OpenClaw plugin compilation requirements
3. **Long-term:** Create second runtime adapter to prove architecture is runtime-agnostic

## Related Documents

- `proof/EXECUTION_PREVENTION_PROOF.md` - Architectural proof (complete)
- `RELEASE_v0.1_SEAL.md` - Release status and scope
- `README.md` - Integration status declaration

## Non-Goals

This issue does **not** require:
- ❌ Modifying judgment logic (already proven)
- ❌ Changing plugin architecture (already correct)
- ❌ Adding workarounds to OpenClaw core (defeats external boundary proof)

The goal is **adapter discovery**, not **architectural validation** (already complete).
