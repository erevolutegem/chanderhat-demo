"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Activity, Calendar, CalendarDays, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MatchEvent {
    id: string;
    sport_id: string | null;
    league: string;
    home: string;
    away: string;
    name: string;
    ss: string | null;
    timer: string | null;
    time_status: string;
    scheduled_time?: number;
    odds?: { name: string; value: string }[];
}

type TabKey = "inplay" | "today" | "tomorrow";

const TABS = [
    { key: "inplay" as TabKey, label: "In Play", icon: Activity },
    { key: "today" as TabKey, label: "Today", icon: Calendar },
    { key: "tomorrow" as TabKey, label: "Tomorrow", icon: CalendarDays },
];

const SPORT_NAMES: Record<string, string> = {
    "1": "Soccer", "3": "Cricket", "13": "Tennis",
    "18": "Basketball", "12": "American Football", "4": "Ice Hockey",
};

interface Props {
    sportId?: number;
    onSelectGame: (id: string) => void;
}

export default function SportsCategoryView({ sportId, onSelectGame }: Props) {
    const [tab, setTab] = useState<TabKey>("inplay");
    const [matches, setMatches] = useState<MatchEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reset tab when sport changes
    useEffect(() => { setTab("inplay"); }, [sportId]);

    // Fetch matches
    useEffect(() => {
        let dead = false;
        setLoading(true);
        setErrorMsg(null);
        setMatches([]);


        const go = async () => {
            try {
                const p = new URLSearchParams();
                if (tab !== "inplay") p.set("tab", tab);
                if (sportId) p.set("sportId", String(sportId));
                // Use Next.js API route which calls BetsAPI directly (server-side, no CORS issues)
                const url = `/api/games${p.toString() ? `?${p}` : ""}`;

                const r = await fetch(url, { cache: "no-store" });
                if (!r.ok) throw new Error(`Error ${r.status} fetching matches`);

                const d = await r.json();
                if (dead) return;
                setMatches(Array.isArray(d?.results) ? d.results : []);
            } catch (e: any) {
                if (!dead) setErrorMsg(e.message);
            } finally {
                if (!dead) setLoading(false);
            }
        };

        go();
        const iv = tab === "inplay" ? setInterval(go, 30_000) : undefined;
        return () => { dead = true; clearInterval(iv); };
    }, [sportId, tab]);

    // Group by league
    const byLeague: Record<string, MatchEvent[]> = {};
    for (const m of matches) {
        (byLeague[m.league || "Other"] ??= []).push(m);
    }

    const headline = sportId ? (SPORT_NAMES[sportId] || "Sport") : "All Sports";

    return (
        <main className="max-w-screen-xl mx-auto px-3 md:px-6 py-5 pb-24 lg:pb-8">
            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-lg font-bold text-white">{headline}</h1>
                {tab === "inplay" && matches.length > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                        {matches.length} Live
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 border-b border-[#1e2433] pb-3">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            tab === key
                                ? "bg-green-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-white hover:bg-[#1e2433]"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* States */}
            {loading && (
                <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Loading matches...</span>
                </div>
            )}

            {!loading && matches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="text-5xl">
                        {tab === "inplay"
                            ? (SPORT_NAMES[String(sportId)] === "Cricket" ? "🏏" :
                                SPORT_NAMES[String(sportId)] === "Soccer" ? "⚽" :
                                    SPORT_NAMES[String(sportId)] === "Tennis" ? "🎾" :
                                        SPORT_NAMES[String(sportId)] === "Basketball" ? "🏀" : "🎯")
                            : "📅"}
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-slate-400 font-semibold text-sm">
                            {tab === "inplay"
                                ? `No live ${SPORT_NAMES[String(sportId)] || "sport"} matches right now`
                                : `No ${tab} scheduled matches found`}
                        </p>
                        <p className="text-slate-600 text-xs max-w-xs">
                            {tab === "inplay"
                                ? "Live matches appear here as they start. Check back later or try the Today tab."
                                : "Upcoming matches will appear here once scheduled."}
                        </p>
                    </div>
                    {errorMsg && <p className="text-red-900 text-xs text-center max-w-sm">{errorMsg}</p>}
                </div>
            )}

            {/* Match list */}
            {!loading && matches.length > 0 && (
                <div className="space-y-4">
                    {Object.entries(byLeague).map(([league, evs]) => (
                        <section key={league}>
                            {/* League header */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-t-xl border-b border-[#1e2433]" style={{ background: "#1a2030" }}>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex-1 truncate">{league}</span>
                                <span className="text-xs text-slate-600">{evs.length} matches</span>
                            </div>

                            {/* Rows */}
                            <div className="rounded-b-xl overflow-hidden border border-[#1e2433] border-t-0 divide-y divide-[#1e2433]" style={{ background: "#161d2a" }}>
                                {evs.map(ev => (
                                    <MatchRow
                                        key={ev.id}
                                        ev={ev}
                                        live={tab === "inplay"}
                                        onClick={() => onSelectGame(ev.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}

// ── Match Row ─────────────────────────────────────────────────────────────────
function MatchRow({ ev, live, onClick }: { ev: MatchEvent; live: boolean; onClick: () => void }) {
    const parts = ev.ss ? ev.ss.split("-").map(s => s.trim()) : [];
    const hs = parts[0] ?? null;
    const as_ = parts[1] ?? null;
    const hWin = hs !== null && as_ !== null && +hs > +as_;
    const aWin = hs !== null && as_ !== null && +as_ > +hs;

    const time = ev.scheduled_time
        ? new Date(ev.scheduled_time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null;

    return (
        <div
            onClick={onClick}
            className="group flex items-center gap-2 md:gap-4 px-3 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors"
        >
            {/* Status */}
            <div className="w-12 flex-shrink-0 flex flex-col items-center">
                {live ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mb-1" />
                        <span className="text-[10px] font-bold text-slate-500">{ev.timer ?? "0"}&apos;</span>
                    </>
                ) : (
                    <span className="text-[11px] text-slate-500">{time ?? "--:--"}</span>
                )}
            </div>

            {/* Teams + Scores */}
            <div className="flex-1 min-w-0">
                {/* Home */}
                <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-sm font-semibold truncate", hWin ? "text-white" : "text-slate-300")}>
                        {ev.home}
                    </span>
                    {hs !== null && (
                        <span className={cn("text-sm font-black ml-3 flex-shrink-0 w-5 text-right", hWin ? "text-green-400" : "text-slate-500")}>
                            {hs}
                        </span>
                    )}
                </div>
                {/* Away */}
                <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-semibold truncate", aWin ? "text-white" : "text-slate-500")}>
                        {ev.away}
                    </span>
                    {as_ !== null && (
                        <span className={cn("text-sm font-black ml-3 flex-shrink-0 w-5 text-right", aWin ? "text-green-400" : "text-slate-600")}>
                            {as_}
                        </span>
                    )}
                </div>
            </div>

            {/* Odds */}
            <div className="hidden sm:flex gap-1 flex-shrink-0">
                {ev.odds && ev.odds.length > 0
                    ? ev.odds.slice(0, 3).map((o, i) => (
                        <OddChip key={i} label={o.name || (i === 0 ? "1" : i === 1 ? "X" : "2")} value={o.value} />
                    ))
                    : ["1", "X", "2"].map(l => <OddChip key={l} label={l} value="—" muted />)
                }
            </div>

            <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0" />
        </div>
    );
}

// ── Odd Chip ─────────────────────────────────────────────────────────────────
function OddChip({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center w-14 py-1.5 rounded-lg border text-center transition-all",
            muted
                ? "border-[#1e2433] bg-transparent"
                : "border-[#263040] bg-[#131820] hover:border-green-500 hover:bg-green-600/10 cursor-pointer active:scale-95 group/o"
        )}>
            <span className={cn("text-[9px] font-bold uppercase", muted ? "text-slate-700" : "text-slate-500 group-hover/o:text-green-400")}>{label}</span>
            <span className={cn("text-xs font-black", muted ? "text-slate-700" : "text-green-400")}>{value}</span>
        </div>
    );
}
