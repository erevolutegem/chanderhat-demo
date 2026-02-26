import { NextRequest, NextResponse } from "next/server";

const BETSAPI_TOKEN = process.env.BETSAPI_TOKEN || "244037-F9qXV8p5Cv2Dd3";
const BASE = "https://api.betsapi.com";

const SPORT_IDS = [1, 3, 13, 18, 12, 4]; // Soccer, Cricket, Tennis, Basketball, AmFootball, Hockey

function normalizeEvent(ev: any, sportId: number) {
    return {
        id: String(ev.id),
        sport_id: String(sportId),
        league: ev.league?.name || "Unknown League",
        home: ev.home?.name || "Home",
        away: ev.away?.name || "Away",
        name: `${ev.home?.name || "Home"} vs ${ev.away?.name || "Away"}`,
        ss: ev.ss || null,
        timer: ev.timer?.tm || ev.timer || null,
        time_status: String(ev.time_status || "1"),
        scheduled_time: ev.time || null,
        odds: [],
    };
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const sportIdParam = searchParams.get("sportId");
    const tab = searchParams.get("tab") || "inplay"; // inplay | today | tomorrow

    const sportsToFetch = sportIdParam
        ? [parseInt(sportIdParam, 10)]
        : SPORT_IDS;

    // Choose endpoint
    const isUpcoming = tab === "today" || tab === "tomorrow";
    const endpoint = isUpcoming ? "/v1/events/upcoming" : "/v1/events/inplay";
    const dayOffset = tab === "tomorrow" ? 1 : 0;

    try {
        const results = await Promise.all(
            sportsToFetch.map(async (sid) => {
                const params = new URLSearchParams({
                    token: BETSAPI_TOKEN,
                    sport_id: String(sid),
                    ...(isUpcoming ? { day: String(dayOffset), per_page: "50" } : {}),
                });

                const resp = await fetch(`${BASE}${endpoint}?${params}`, {
                    next: { revalidate: 20 },
                });

                if (!resp.ok) return [];

                const data = await resp.json();
                if (data?.success !== 1 || !Array.isArray(data.results)) return [];

                return data.results
                    .filter((ev: any) => {
                        const league = ev.league?.name?.toLowerCase() || "";
                        return !league.includes("esoccer") &&
                            !league.includes("ebasketball") &&
                            !league.includes("virtual");
                    })
                    .map((ev: any) => normalizeEvent(ev, sid));
            })
        );

        const allEvents = results.flat();

        return NextResponse.json({
            success: true,
            results: allEvents,
            count: allEvents.length,
            timestamp: new Date().toISOString(),
            source: "betsapi-direct",
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message, results: [] }, { status: 500 });
    }
}
