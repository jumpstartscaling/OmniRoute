import { NextResponse } from "next/server";
import { requireManagementAuth } from "@/lib/api/requireManagementAuth";
import { getRoutingEvents } from "@/lib/usage/routingEvents";

export async function GET(request: Request) {
  const authError = await requireManagementAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const hours = Number.parseInt(searchParams.get("hours") || "24", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "1000", 10);
    const events = getRoutingEvents({ hours, limit });
    const executionKeys = new Set(
      events
        .filter((row) => Number(row.fallback_count || 0) > 0 || Number(row.target_index || 0) > 0)
        .map((row) => typeof row.combo_execution_key === "string" ? row.combo_execution_key : `row:${row.id}`)
    );
    return NextResponse.json({
      ok: true,
      truth_state: events.length ? "HISTORICAL" : "UNKNOWN",
      authority: "OmniRoute provider-routing event ledger",
      events,
      summary: {
        event_count: events.length,
        retry_events: events.filter((row) => Number(row.is_retry || 0) > 0).length,
        fallback_events: executionKeys.size,
      },
      observed_at: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, truth_state: "FAILED", error: String(error) }, { status: 500 });
  }
}
