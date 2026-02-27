import { NextRequest, NextResponse } from "next/server";

const TOKEN = "244037-F9qXV8p5Cv2Dd3";

// BetsAPI sport IDs embedded in event ID (pattern: C<id>A)
// Maps BetsAPI's internal sport number → our app sport_id
const BETS_SPORT_MAP: Record<number, number> = {
    1: 1,   // Soccer
    3: 3,   // Cricket
    13: 13,  // Tennis
    17: 4,   // Ice Hockey (BetsAPI=17, our UI uses 4)
    18: 18,  // Basketball
    12: 12,  // American Football
};

// Sport IDs to include in "All Sports" view
const INCLUDED_SPORTS = new Set([1, 3, 13, 17, 18, 12]);

// League names to always skip (esports, virtual, golf outrights, etc.)
const SKIP_NAME_PATTERNS = [
    "esoccer", "ebasketball", "cs2", "valorant", "virtual",
    "sports based games", "hsbc", "golf", "tt elite", "call of duty",
];

function extractBetsApiSport(id: string): number | null {
    const m = id?.match(/C(\d+)A/);
    return m ? parseInt(m[1], 10) : null;
}

function shouldSkipLeague(league: string): boolean {
    const l = league.toLowerCase();
    return SKIP_NAME_PATTERNS.some(p => l.includes(p));
}

function parseBet365Stream(items: any[]): any[] {
    const events: any[] = [];
    let currentLeague = "Unknown League";

    for (const item of items) {
        if (!item?.type) continue;

        if (item.type === "CT") {
            currentLeague = item.NA || "Unknown League";
        } else if (item.type === "EV") {
            const id = item.ID || item.FI || "";
            const betsApiSport = extractBetsApiSport(id);

            // Skip if sport not identifiable or not a sport we handle
            if (!betsApiSport || !INCLUDED_SPORTS.has(betsApiSport)) continue;

            // Skip virtual/esports by league name
            if (shouldSkipLeague(currentLeague)) continue;

            const appSportId = BETS_SPORT_MAP[betsApiSport] ?? betsApiSport;

            const nameParts = (item.NA || "").split(/\s+v(?:s)?\s+/i);
            const home = nameParts[0]?.trim() || item.NA || "Home";
            const away = nameParts[1]?.trim() || "Away";

            events.push({
                id,
                sport_id: String(appSportId),
                league: currentLeague,
                home,
                away,
                name: item.NA || `${home} vs ${away}`,
                ss: item.SS || null,
                timer: item.TM || null,
                time_status: "1",
                odds: [],
            });
        } else if (item.type === "PA") {
            // Attach odds to last event
            if (events.length > 0) {
                const last = events[events.length - 1];
                if (last.odds.length < 3) {
                    const label = item.OR === "0" ? "1" : item.OR === "1" ? "X" : "2";
                    if (item.OD) last.odds.push({ name: label, value: item.OD });
                }
            }
        }
    }

    return events;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const sportIdParam = searchParams.get("sportId");
    // tab param kept for future upcoming endpoint
    // const tab = searchParams.get("tab") || "inplay";

    const requestedAppSport = sportIdParam ? parseInt(sportIdParam, 10) : null;

    try {
        const resp = await fetch(
            `https://api.betsapi.com/v1/bet365/inplay?token=${TOKEN}`,
            { next: { revalidate: 25 } }
        );

        if (!resp.ok) {
            return NextResponse.json({ success: false, error: `BetsAPI ${resp.status}`, results: [] });
        }

        const data = await resp.json();
        if (data?.success !== 1) {
            return NextResponse.json({ success: false, error: "BetsAPI failure", results: [] });
        }

        const rawItems: any[] = Array.isArray(data.results?.[0])
            ? data.results[0]
            : data.results || [];

        let events = parseBet365Stream(rawItems);

        // Filter by sport if specified
        if (requestedAppSport !== null) {
            events = events.filter(ev => ev.sport_id === String(requestedAppSport));
        }

        return NextResponse.json({
            success: true,
            results: events,
            count: events.length,
            timestamp: new Date().toISOString(),
            source: "bet365-v2",
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message, results: [] }, { status: 500 });
    }
}
