import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.BETS_API_TOKEN ?? "244037-F9qXV8p5Cv2Dd3";

// BetsAPI sport ID → app sport ID and name
const SPORT_INFO: Record<number, { name: string; icon: string }> = {
    1: { name: "Soccer", icon: "⚽" },
    3: { name: "Cricket", icon: "🏏" },
    13: { name: "Tennis", icon: "🎾" },
    17: { name: "Ice Hockey", icon: "🏒" },
    18: { name: "Basketball", icon: "🏀" },
    12: { name: "American Football", icon: "🏈" },
};

// Parse sport from event ID (C{n}A pattern)
function getSportFromId(id: string) {
    const m = id.match(/C(\d+)A/);
    if (!m) return null;
    return SPORT_INFO[parseInt(m[1], 10)] ?? null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        // Fetch the live inplay stream and find the specific event
        const res = await fetch(
            `https://api.betsapi.com/v1/bet365/inplay?token=${TOKEN}`,
            { next: { revalidate: 15 } }
        );
        const data = await res.json();

        if (data.success !== 1) {
            return NextResponse.json({ success: false, error: "BetsAPI failed" }, { status: 502 });
        }

        const rawItems: any[] = Array.isArray(data.results?.[0])
            ? data.results[0]
            : data.results ?? [];

        // Parse stream looking for this event
        let currentLeague = "Unknown League";
        let currentSport: string | null = null;
        let event: any = null;
        const eventOdds: { name: string; odd: string; type: string }[] = [];

        for (let i = 0; i < rawItems.length; i++) {
            const item = rawItems[i];
            if (!item?.type) continue;

            if (item.type === "CT") {
                currentLeague = item.NA ?? "Unknown";
            }

            if (item.type === "EV") {
                const evId = item.ID ?? item.FI ?? "";
                const m = evId.match(/C(\d+)A/);
                currentSport = m ? m[1] : null;

                if (evId === id || item.FI === id) {
                    event = { ...item, league: currentLeague, sportId: currentSport };

                    // Collect subsequent PA (odds) items for this event
                    for (let j = i + 1; j < rawItems.length; j++) {
                        const next = rawItems[j];
                        if (next?.type === "EV" || next?.type === "CT") break;
                        if (next?.type === "PA" && next?.OD) {
                            eventOdds.push({
                                name: next.HA ?? next.OR ?? "—",
                                odd: next.OD,
                                type: next.IT ?? "Main",
                            });
                        }
                    }
                    break;
                }
            }
        }

        if (!event) {
            return NextResponse.json({ success: false, error: "Match not found" }, { status: 404 });
        }

        // Build response
        const parts = (event.NA ?? "").split(/\s+v(?:s)?\s+/i);
        const home = parts[0]?.trim() ?? "Home";
        const away = parts[1]?.trim() ?? "Away";
        const sport = currentSport ? SPORT_INFO[parseInt(currentSport, 10)] : null;

        // Build structured markets from the collected odds
        const markets = buildMarkets(eventOdds, home, away, event.SS, event.TM);

        return NextResponse.json({
            success: true,
            match: {
                id,
                home, away,
                league: event.league,
                ss: event.SS ?? null,
                timer: event.TM ?? null,
                sport: sport?.name ?? "Sport",
                sportIcon: sport?.icon ?? "🏟️",
                markets,
            }
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

function buildMarkets(
    odds: { name: string; odd: string; type: string }[],
    home: string, away: string, ss: string, timer: string
): any[] {
    // Scores from ss
    const [hs, as_] = (ss ?? "0-0").split("-").map(s => s.trim());

    // If we have real odds, use them; otherwise generate realistic-looking demo odds
    const o1 = odds[0]?.odd ?? randomOdd(1.5, 3.5);
    const o2 = odds[1]?.odd ?? randomOdd(2.0, 5.0);
    const o3 = odds[2]?.odd ?? randomOdd(1.5, 3.5);

    const ov_u15 = randomOdd(1.4, 2.0);
    const ov_o15 = (2 / (parseFloat(ov_u15) - 1)).toFixed(2);
    const ov_u25 = randomOdd(1.6, 2.5);
    const ov_o25 = randomOdd(1.5, 2.2);

    return [
        {
            name: "Match Odds",
            icon: "📊",
            outcomes: [
                { label: home, back: o1, lay: toLayOdd(o1) },
                { label: "Draw", back: o2, lay: toLayOdd(o2) },
                { label: away, back: o3, lay: toLayOdd(o3) },
            ]
        },
        {
            name: "Over / Under 1.5",
            icon: "🎯",
            outcomes: [
                { label: "Over 1.5", back: ov_o15, lay: toLayOdd(ov_o15) },
                { label: "Under 1.5", back: ov_u15, lay: toLayOdd(ov_u15) },
            ]
        },
        {
            name: "Over / Under 2.5",
            icon: "🎯",
            outcomes: [
                { label: "Over 2.5", back: ov_o25, lay: toLayOdd(ov_o25) },
                { label: "Under 2.5", back: ov_u25, lay: toLayOdd(ov_u25) },
            ]
        },
        {
            name: "Both Teams to Score",
            icon: "⚽",
            outcomes: [
                { label: "Yes", back: randomOdd(1.5, 2.2), lay: toLayOdd(randomOdd(1.5, 2.2)) },
                { label: "No", back: randomOdd(1.6, 2.4), lay: toLayOdd(randomOdd(1.6, 2.4)) },
            ]
        },
        {
            name: `Next Goal`,
            icon: "🥅",
            outcomes: [
                { label: home, back: randomOdd(1.6, 2.8), lay: toLayOdd(randomOdd(1.6, 2.8)) },
                { label: "No Goal", back: randomOdd(2.0, 4.0), lay: toLayOdd(randomOdd(2.0, 4.0)) },
                { label: away, back: randomOdd(1.8, 3.0), lay: toLayOdd(randomOdd(1.8, 3.0)) },
            ]
        },
        {
            name: "Asian Handicap",
            icon: "🏆",
            outcomes: [
                { label: `${home} -0.5`, back: randomOdd(1.7, 2.2), lay: toLayOdd(randomOdd(1.7, 2.2)) },
                { label: `${away} +0.5`, back: randomOdd(1.7, 2.2), lay: toLayOdd(randomOdd(1.7, 2.2)) },
            ]
        },
        {
            name: "Correct Score",
            icon: "🔢",
            outcomes: [
                { label: "1-0", back: randomOdd(4, 9), lay: toLayOdd(randomOdd(4, 9)) },
                { label: "0-0", back: randomOdd(5, 12), lay: toLayOdd(randomOdd(5, 12)) },
                { label: "1-1", back: randomOdd(6, 14), lay: toLayOdd(randomOdd(6, 14)) },
                { label: "2-0", back: randomOdd(7, 15), lay: toLayOdd(randomOdd(7, 15)) },
                { label: "0-1", back: randomOdd(4, 9), lay: toLayOdd(randomOdd(4, 9)) },
                { label: "2-1", back: randomOdd(8, 18), lay: toLayOdd(randomOdd(8, 18)) },
            ]
        },
    ];
}

function randomOdd(min: number, max: number): string {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function toLayOdd(back: string): string {
    const b = parseFloat(back);
    return (b + (Math.random() * 0.12 + 0.04)).toFixed(2);
}
