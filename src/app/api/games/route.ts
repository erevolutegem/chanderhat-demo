import { NextRequest, NextResponse } from "next/server";

const TOKEN = "244037-F9qXV8p5Cv2Dd3";

// Detect BetsAPI sport_id from competition/league name
function detectSportId(ctName: string): number {
    const n = (ctName || "").toLowerCase();

    // Cricket — must check before soccer to avoid false matches
    if (n.includes("ipl") || n.includes("bpl") || n.includes("psl") || n.includes("cpl") ||
        n.includes("t20") || n.includes("odi") || n.includes("test match") ||
        n.includes("county") || n.includes("cricket") || n.includes("ashes") ||
        n.includes("bbл") || n.includes("ranji") || n.includes("syed mushtaq"))
        return 3;

    // Tennis
    if (n.includes("atp") || n.includes("wta") || n.includes("itf") ||
        n.includes("davis cup") || n.includes("fed cup") || n.includes("grand slam") ||
        n.includes("wimbledon") || n.includes("us open") || n.includes("roland garros") ||
        n.includes("australian open") || n.includes("tennis"))
        return 13;

    // Basketball
    if (n.includes("nba") || n.includes("ncaa basketball") || n.includes("euroleague") ||
        n.includes("eurocup") || n.includes("nbl") || n.includes("basketball"))
        return 18;

    // American Football
    if (n.includes("nfl") || n.includes("ncaa football") || n.includes("american football") ||
        n.includes("cfl"))
        return 12;

    // Ice Hockey
    if (n.includes("nhl") || n.includes("khl") || n.includes("ahl") || n.includes("shl") ||
        n.includes("hockey") || n.includes("ice"))
        return 4;

    // Default: Soccer (most common)
    return 1;
}

function parseBet365Stream(items: any[]): any[] {
    const events: any[] = [];
    let currentSportId = 1;
    let currentLeague = "Unknown League";
    let currentEV: any = null;
    let currentMA: any = null;

    for (const item of items) {
        if (!item?.type) continue;

        if (item.type === "CT") {
            currentSportId = detectSportId(item.NA || "");
            currentLeague = item.NA || "Unknown League";
            currentEV = null;
            currentMA = null;
        } else if (item.type === "EV") {
            const name = item.NA || "";
            const leagueLower = currentLeague.toLowerCase();
            const nameLower = name.toLowerCase();

            // Skip virtual/esports
            const isVirtual = item.VI === "1" ||
                leagueLower.includes("esoccer") ||
                leagueLower.includes("ebasketball") ||
                leagueLower.includes("virtual") ||
                nameLower.includes("esoccer");

            if (isVirtual) { currentEV = null; continue; }

            const parts = name.split(/\s+v(?:s)?\s+/i);
            const home = parts[0]?.trim() || "Home";
            const away = parts[1]?.trim() || "Away";

            currentEV = {
                id: item.ID || item.FI,
                sport_id: String(currentSportId),
                league: currentLeague,
                home,
                away,
                name,
                ss: item.SS || null,
                timer: item.TM || null,
                time_status: "1",
                odds: [],
            };
            events.push(currentEV);
            currentMA = null;
        } else if (item.type === "MA" && currentEV) {
            currentMA = item;
        } else if (item.type === "PA" && currentEV && currentMA) {
            // Collect 1X2 match result odds
            const maName = (currentMA.NA || "").toLowerCase();
            if (maName.includes("match result") || maName.includes("1x2") ||
                maName.includes("match winner") || maName.includes("moneyline")) {
                const pos = item.OR === "0" ? "1" : item.OR === "1" ? "X" : "2";
                currentEV.odds.push({ name: pos, value: item.OD });
            }
        }
    }

    return events;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const sportIdParam = searchParams.get("sportId");
    const tab = searchParams.get("tab") || "inplay";
    const requestedSportId = sportIdParam ? parseInt(sportIdParam, 10) : null;

    try {
        // Fetch the full Bet365 inplay stream
        const resp = await fetch(
            `https://api.betsapi.com/v1/bet365/inplay?token=${TOKEN}`,
            { next: { revalidate: 30 } }
        );

        if (!resp.ok) {
            return NextResponse.json({ success: false, error: `API ${resp.status}`, results: [] });
        }

        const data = await resp.json();
        if (data?.success !== 1) {
            return NextResponse.json({ success: false, error: "API returned failure", results: [] });
        }

        const rawItems: any[] = Array.isArray(data.results?.[0])
            ? data.results[0]
            : data.results || [];

        let events = parseBet365Stream(rawItems);

        // Filter by sport if requested
        if (requestedSportId !== null) {
            events = events.filter(ev => ev.sport_id === String(requestedSportId));
        }

        return NextResponse.json({
            success: true,
            results: events,
            count: events.length,
            timestamp: new Date().toISOString(),
            source: "bet365-inplay",
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message, results: [] }, { status: 500 });
    }
}
