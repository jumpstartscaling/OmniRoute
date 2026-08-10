import test from "node:test";
import assert from "node:assert/strict";
import { resolveBuiltinAutoSpec } from "../../open-sse/services/autoCombo/builtinCatalog.ts";

test("advertised chat auto ids resolve to the chat category", () => {
  assert.deepEqual(resolveBuiltinAutoSpec("auto/best-chat", "best-chat"), {
    category: "chat",
  });
  assert.deepEqual(resolveBuiltinAutoSpec("auto/pro-chat", "pro-chat"), {
    category: "chat",
    tier: "pro",
  });
  assert.deepEqual(resolveBuiltinAutoSpec("auto/chat", "chat"), {
    category: "chat",
  });
});
