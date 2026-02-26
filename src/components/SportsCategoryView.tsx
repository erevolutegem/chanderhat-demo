"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Activity, Calendar, CalendarDays, ChevronRight, Lock } from "lucide-react";
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

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "inplay", label: "In Play", icon: <Activity className="w-3.5 h-3.5" /> },
    { key: "today", label: "Today", icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: "tomorrow", label: "Tomorrow", icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

const SPORT_LABELS: Record<string, string> = {
    "1": "Soccer", "3": "Cricket", "13": "Tennis",
    "18": "Basketball", "12": "American Football", "4": "Ice Hockey",
};

interface SportsCategoryViewProps {
    sportId?: number;
    onSelectGame: (id: string) => void;
}

const SportsCategoryView = ({ sportId, onSelectGame }: SportsCategoryViewProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>("inplay");
    const [matches, setMatches] = useState<MatchEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setActiveTab("inplay");
    }, [sportId]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setMatches([]);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://dev.chanderhat.com";

        const load = async () => {
            try {
                const params = new URLSearchParams();
                if (activeTab !== "inplay") params.set("tab", activeTab);
                if (sportId) params.set("sportId", String(sportId));
                const qs = params.toString();
                const url = `${apiUrl}/games/live${qs ? `?${qs}` : ""}`;

                const resp = await fetch(url, { cache: "no-store" });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                const data = await resp.json();
                if (cancelled) return;

                if (Array.isArray(data?.results) && data.results.length > 0) {
                    setMatches(data.results);
                } else {
                    setMatches([]);
                    setError(data?.error || null);
                }
            } catch (err: any) {
                if (!cancelled) { setError(err.message); setMatches([]); }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        const interval = activeTab === "inplay" ? setInterval(load, 30000) : undefined;

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [sportId, activeTab]);

    // Group matches by league
    const grouped = matches.reduce<Record<string, MatchEvent[]>>((acc, m) => {
        const key = m.league || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});

    const sportLabel = sportId ? SPORT_LABELS[String(sportId)] || "Sport" : "All Sports";

    return (
        <div className="flex-1 min-h-screen" style={{ background: "#0f1219" }}>
            <div className="max-w-full">

                {/* Header row */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white">{sportLabel}</h2>
                        {activeTab === "inplay" && matches.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/20">
                                <span className="live-dot" /> {matches.length} LIVE
                            </span>
                        )}
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-1 px-4 mb-3">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                activeTab === tab.key
                                    ? "bg-green-600 text-white"
                                    : "bg-[#1e2433] text-slate-400 hover:text-white hover:bg-[#242938]"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-7 h-7 text-green-500 animate-spin" />
                        <p className="text-sm text-slate-500">Loading matches...</p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 mx-4 rounded-2xl border border-dashed border-[#2d3348]">
                        <Activity className="w-8 h-8 text-slate-700" />
                        <p className="text-sm font-semibold text-slate-500">No matches available</p>
                        {error && <p className="text-xs text-slate-600 max-w-xs text-center">{error}</p>}
                    </div>
                ) : (
                    <div className="space-y-px px-4 pb-8">
                        {Object.entries(grouped).map(([league, events]) => (
                            <LeagueBlock
                                key={league}
                                league={league}
                                events={events}
                                isLive={activeTab === "inplay"}
                                onSelect={onSelectGame}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── League Block ─────────────────────────────────────────────────────────────
const LeagueBlock = ({ league, events, isLive, onSelect }: {
    league: string; events: MatchEvent[]; isLive: boolean; onSelect: (id: string) => void;
}) => (
    <div className="rounded-xl overflow-hidden border border-[#2d3348] mb-3 animate-slide-up" style={{ background: "#1e2433" }}>
        {/* League header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2d3348]" style={{ background: "#242938" }}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-1 truncate">{league}</span>
            <span className="text-[10px] text-slate-600">{events.length}</span>
        </div>
        {/* Rows */}
        <div className="divide-y divide-[#2d3348]">
            {events.map((ev) => (
                <MatchRow key={ev.id} event={ev} isLive={isLive} onSelect={() => onSelect(ev.id)} />
            ))}
        </div>
    </div>
);

// ── Match Row ─────────────────────────────────────────────────────────────────
const MatchRow = ({ event, isLive, onSelect }: { event: MatchEvent; isLive: boolean; onSelect: () => void }) => {
    const scores = event.ss ? event.ss.split("-").map(s => s.trim()) : [null, null];
    const homeScore = scores[0];
    const awayScore = scores[1];
    const homeWin = homeScore !== null && awayScore !== null && Number(homeScore) > Number(awayScore);
    const awayWin = homeScore !== null && awayScore !== null && Number(awayScore) > Number(homeScore);

    const scheduledTime = event.scheduled_time
        ? new Date(event.scheduled_time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null;

    return (
        <div
            onClick={onSelect}
            className="group flex items-center gap-3 px-3 py-3 hover:bg-[#242938] cursor-pointer transition-colors"
        >
            {/* Timer / Status */}
            <div className="w-11 flex-shrink-0 text-center">
                {isLive ? (
                    <div>
                        <span className="live-dot mx-auto block mb-0.5" />
                        <span className="text-[10px] font-bold text-slate-500">{event.timer ?? "0"}&apos;</span>
                    </div>
                ) : (
                    <span className="text-[11px] font-medium text-slate-500">{scheduledTime ?? "--:--"}</span>
                )}
            </div>

            {/* Teams */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-semibold truncate", homeWin ? "text-white" : "text-slate-300")}>
                        {event.home}
                    </span>
                    {homeScore !== null && (
                        <span className={cn("text-sm font-black ml-1 flex-shrink-0", homeWin ? "text-green-400" : "text-slate-400")}>
                            {homeScore}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-semibold truncate", awayWin ? "text-white" : "text-slate-500")}>
                        {event.away}
                    </span>
                    {awayScore !== null && (
                        <span className={cn("text-sm font-black ml-1 flex-shrink-0", awayWin ? "text-green-400" : "text-slate-500")}>
                            {awayScore}
                        </span>
                    )}
                </div>
            </div>

            {/* Odds */}
            <div className="flex gap-1 flex-shrink-0">
                {event.odds && event.odds.length > 0 ? (
                    event.odds.slice(0, 3).map((odd, i) => (
                        <OddBtn key={i} label={odd.name || (i === 0 ? "1" : i === 1 ? "X" : "2")} value={odd.value} />
                    ))
                ) : (
                    ["1", "X", "2"].map(l => <OddBtn key={l} label={l} value="—" disabled />)
                )}
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
        </div>
    );
};

// ── Odd Button ────────────────────────────────────────────────────────────────
const OddBtn = ({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) => (
    <div className={cn(
        "flex flex-col items-center justify-center w-12 py-1.5 rounded-lg border text-center transition-all select-none",
        disabled
            ? "bg-[#161b28] border-[#2d3348] cursor-default"
            : "bg-[#161b28] border-[#2d3348] hover:border-green-500 hover:bg-green-600/10 cursor-pointer active:scale-95 group/odd"
    )}>
        <span className={cn("text-[8px] font-bold uppercase", disabled ? "text-slate-700" : "text-slate-500 group-hover/odd:text-green-400")}>
            {label}
        </span>
        <span className={cn("text-xs font-black", disabled ? "text-slate-700" : "text-green-400")}>
            {value}
        </span>
    </div>
);

export default SportsCategoryView;
