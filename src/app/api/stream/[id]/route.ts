import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.BETS_API_TOKEN ?? "244037-F9qXV8p5Cv2Dd3";

/**
 * GET /api/stream/[id]
 * Fetches the live stream URL for a match from BetsAPI.
 * BetsAPI endpoint: GET /v1/bet365/stream/{event_id}
 * Returns: { available: true, url: "..." } or { available: false }
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: eventId } = await params;

    if (!eventId) {
        return NextResponse.json({ available: false, error: "No event ID" });
    }

    try {
        const res = await fetch(
            `https://api.betsapi.com/v1/bet365/stream/${encodeURIComponent(eventId)}?token=${TOKEN}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            return NextResponse.json({ available: false, error: `BetsAPI ${res.status}` });
        }

        const data = await res.json();

        // BetsAPI returns { success: 1, results: { url: "...", ... } }
        if (data?.success === 1 && data?.results?.url) {
            return NextResponse.json({
                available: true,
                url: data.results.url,
                type: data.results.type ?? "iframe",
            });
        }

        return NextResponse.json({ available: false, reason: "No stream from provider" });
    } catch (err: any) {
        return NextResponse.json({ available: false, error: err.message });
    }
}
