import { getDbInstance } from "../db/core";

export type RoutingEventName =
  | "combo.target.attempt"
  | "combo.target.failed"
  | "combo.target.succeeded";

export type RoutingEventPayload = {
  comboName?: unknown;
  comboExecutionKey?: unknown;
  targetIndex?: unknown;
  provider?: unknown;
  model?: unknown;
  attempt?: unknown;
  isRetry?: unknown;
  fallbackCount?: unknown;
  error?: unknown;
  latencyMs?: unknown;
  timestamp?: unknown;
};

function text(value: unknown, fallback: string, max = 300): string {
  if (typeof value !== "string" || value.trim().length === 0) return fallback;
  return value.trim().slice(0, max);
}

function integer(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function timestamp(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : Date.now();
}

export function persistRoutingEvent(event: RoutingEventName, payload: RoutingEventPayload): void {
  try {
    const db = getDbInstance();
    db.prepare(
      `
        INSERT INTO routing_event_ledger (
          event, timestamp, combo_name, combo_execution_key, target_index,
          provider, model, attempt, is_retry, fallback_count, error, latency_ms
        ) VALUES (
          @event, @timestamp, @comboName, @comboExecutionKey, @targetIndex,
          @provider, @model, @attempt, @isRetry, @fallbackCount, @error, @latencyMs
        )
      `
    ).run({
      event,
      timestamp: timestamp(payload.timestamp),
      comboName: text(payload.comboName, "unknown"),
      comboExecutionKey: typeof payload.comboExecutionKey === "string"
        ? payload.comboExecutionKey.trim().slice(0, 200) || null
        : null,
      targetIndex: integer(payload.targetIndex),
      provider: text(payload.provider, "unknown"),
      model: text(payload.model, "unknown"),
      attempt: integer(payload.attempt),
      isRetry: payload.isRetry === true ? 1 : 0,
      fallbackCount: integer(payload.fallbackCount),
      error: typeof payload.error === "string" ? payload.error.slice(0, 500) : null,
      latencyMs: payload.latencyMs == null ? null : integer(payload.latencyMs),
    });
  } catch {
    // Routing telemetry must never affect the provider response path.
  }
}

export function getRoutingEvents({ hours = 24, limit = 1000 } = {}): Array<Record<string, unknown>> {
  const boundedHours = Math.min(Math.max(integer(hours, 24), 1), 168);
  const boundedLimit = Math.min(Math.max(integer(limit, 1000), 1), 5000);
  const cutoff = Date.now() - boundedHours * 60 * 60 * 1000;
  return getDbInstance()
    .prepare(
      `
        SELECT id, event, timestamp, combo_name, combo_execution_key,
               target_index, provider, model, attempt, is_retry,
               fallback_count, error, latency_ms
        FROM routing_event_ledger
        WHERE timestamp >= ?
        ORDER BY timestamp DESC, id DESC
        LIMIT ?
      `
    )
    .all(cutoff, boundedLimit) as Array<Record<string, unknown>>;
}
