export function assert(condition: any, msg: string): void {
  if (!condition) throw new Error(`ASSERT_FAIL: ${msg}`);
}

export function assertThrows(fn: () => void, pattern: RegExp, msg: string): void {
  try {
    fn();
  } catch (e: any) {
    const text = String(e?.message ?? e);
    if (!pattern.test(text)) {
      throw new Error(`ASSERT_FAIL: ${msg} (threw "${text}")`);
    }
    return;
  }
  throw new Error(`ASSERT_FAIL: ${msg} (did not throw)`);
}
