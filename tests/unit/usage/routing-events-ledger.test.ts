import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeRoutingEventPayload } from "../../../src/lib/usage/routingEvents.ts";

describe("routing event ledger normalization", () => {
  it("preserves retry and fallback evidence with bounded metadata", () => {
    const row = normalizeRoutingEventPayload("combo.target.failed", {
      comboName: "auto/best-chat",
      comboExecutionKey: "combo-123",
      targetIndex: 1,
      provider: "openrouter",
      model: "openrouter/auto",
      attempt: 2,
      isRetry: true,
      fallbackCount: 1,
      error: "provider unavailable",
      latencyMs: 321,
      timestamp: 1700000000123,
    });

    assert.deepEqual(row, {
      event: "combo.target.failed",
      timestamp: 1700000000123,
      comboName: "auto/best-chat",
      comboExecutionKey: "combo-123",
      targetIndex: 1,
      provider: "openrouter",
      model: "openrouter/auto",
      attempt: 2,
      isRetry: 1,
      fallbackCount: 1,
      error: "provider unavailable",
      latencyMs: 321,
    });
  });

  it("fails closed to redacted bounded defaults", () => {
    const row = normalizeRoutingEventPayload("combo.target.attempt", {
      comboName: " ",
      comboExecutionKey: " ",
      targetIndex: "not-a-number",
      provider: " ",
      model: " ",
      attempt: -1,
      isRetry: "true",
      fallbackCount: -1,
      error: "x".repeat(600),
      latencyMs: null,
      timestamp: 0,
    });

    assert.equal(row.comboName, "unknown");
    assert.equal(row.comboExecutionKey, null);
    assert.equal(row.targetIndex, 0);
    assert.equal(row.provider, "unknown");
    assert.equal(row.model, "unknown");
    assert.equal(row.attempt, 0);
    assert.equal(row.isRetry, 0);
    assert.equal(row.fallbackCount, 0);
    assert.equal((row.error as string).length, 500);
    assert.equal(row.latencyMs, null);
  });
});
