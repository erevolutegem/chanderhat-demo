import { NextRequest } from "next/server";

const TOKEN = process.env.BETS_API_TOKEN ?? "244037-F9qXV8p5Cv2Dd3";
const POLL_MS = 1000; // poll BetsAPI every 1 second

export const runtime = "nodejs"; // SSE needs nodejs runtime
export const dynamic = "force-dynamic";

interface Match {
    id: string;
    sport_id: string;
    league: string;
    home: string;
    away: string;
    ss: string | null;
    timer: string | null;
    odds: { name: string; value: string }[];
}

async function fetchMatches(sportId?: string): Promise<Match[]> {
    try {
        const res = await fetch(
            `https://api.betsapi.com/v1/bet365/inplay?token=${TOKEN}`,
            { cache: "no-store" }
        );
        const data = await res.json();
        if (data.success !== 1) return [];

        const rawItems: any[] = Array.isArray(data.results?.[0])
            ? data.results[0]
            : data.results ?? [];

        const matches: Match[] = [];
        let currentLeague = "Unknown";
        let currentSportId = "";

        for (let i = 0; i < rawItems.length; i++) {
            const item = rawItems[i];
            if (!item?.type) continue;

            if (item.type === "CT") {
                currentLeague = item.NA ?? "Unknown";
            }

            if (item.type === "EV") {
                const evId = item.ID ?? item.FI ?? "";
                const m = evId.match(/C(\d+)A/);
                currentSportId = m ? m[1] : "";

                if (sportId && currentSportId !== sportId) continue;

                const name = item.NA ?? "";
                const parts = name.split(/\s+v(?:s)?\s+/i);
                const odds: { name: string; value: string }[] = [];

                for (let j = i + 1; j < rawItems.length; j++) {
                    const nx = rawItems[j];
                    if (nx?.type === "EV" || nx?.type === "CT") break;
                    if (nx?.type === "PA" && nx?.OD) {
                        odds.push({ name: nx.HA ?? nx.OR ?? "—", value: nx.OD });
                    }
                }

                matches.push({
                    id: evId,
                    sport_id: currentSportId,
                    league: currentLeague,
                    home: parts[0]?.trim() ?? "Home",
                    away: parts[1]?.trim() ?? "Away",
                    ss: item.SS ?? null,
                    timer: item.TM ?? null,
                    odds,
                });
            }
        }

        return matches;
    } catch {
        return [];
    }
}

function encode(data: object): Uint8Array {
    return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function GET(req: NextRequest) {
    const sportId = req.nextUrl.searchParams.get("sportId") ?? undefined;
    const matchId = req.nextUrl.searchParams.get("matchId") ?? undefined;

    let closed = false;
    req.signal.addEventListener("abort", () => { closed = true; });

    const stream = new ReadableStream({
        async start(controller) {
            controller.enqueue(new TextEncoder().encode(": ping\n\n"));

            let lastSnapshot = "";

            while (!closed) {
                try {
                    const matches = await fetchMatches(sportId);

                    // If matchId specified, filter to just that match
                    const payload = matchId
                        ? matches.filter(m => m.id === matchId)
                        : matches;

                    const snapshot = JSON.stringify(payload);

                    if (snapshot !== lastSnapshot) {
                        lastSnapshot = snapshot;
                        if (matchId) {
                            // For single match page: send match object directly
                            controller.enqueue(encode({ type: "match", data: payload[0] ?? null }));
                        } else {
                            controller.enqueue(encode({ type: "matches", data: payload }));
                        }
                    } else {
                        controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
                    }
                } catch {
                    controller.enqueue(encode({ type: "error", message: "fetch failed" }));
                }

                await new Promise<void>(resolve => {
                    const t = setTimeout(resolve, POLL_MS);
                    req.signal.addEventListener("abort", () => { clearTimeout(t); resolve(); });
                });
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no", // disable nginx buffering
        },
    });
}
