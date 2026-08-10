-- Persist the provider-routing events already emitted by the runtime.
-- This is metadata only: no request bodies, credentials, or provider payloads.
CREATE TABLE IF NOT EXISTS routing_event_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  combo_name TEXT NOT NULL,
  combo_execution_key TEXT,
  target_index INTEGER NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  attempt INTEGER NOT NULL DEFAULT 0,
  is_retry INTEGER NOT NULL DEFAULT 0,
  fallback_count INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  latency_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_routing_event_ledger_timestamp
  ON routing_event_ledger(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_routing_event_ledger_execution
  ON routing_event_ledger(combo_execution_key, timestamp DESC);
