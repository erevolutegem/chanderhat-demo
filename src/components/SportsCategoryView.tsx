"use client";

import React, { useState, useEffect } from "react";
import { Activity, Clock, ChevronRight, Loader2, Calendar, CalendarDays, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────
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

// ─── Tab Config ─────────────────────────────────────────────────────────────
const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "inplay", label: "In Play", icon: <Activity className="w-3.5 h-3.5" /> },
    { key: "today", label: "Today", icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: "tomorrow", label: "Tomorrow", icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

// ─── Sports Config ──────────────────────────────────────────────────────────
const SPORT_LABELS: Record<string, string> = {
    "1": "Soccer",
    "3": "Cricket",
    "13": "Tennis",
    "18": "Basketball",
    "12": "American Football",
    "4": "Ice Hockey",
    "16": "Baseball",
};

// ─── Main Component ────────────────────────────────────────────────────────
interface SportsCategoryViewProps {
    sportId?: number;
    onSelectGame: (id: string) => void;
}

const SportsCategoryView = ({ sportId, onSelectGame }: SportsCategoryViewProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>("inplay");
    const [matches, setMatches] = useState<MatchEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // When sport changes, reset to inplay tab
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
                let url: string;
                if (activeTab === "inplay") {
                    url = sportId
                        ? `${apiUrl}/games/live?sportId=${sportId}`
                        : `${apiUrl}/games/live`;
                } else {
                    // Today or Tomorrow
                    const params = new URLSearchParams({ date: activeTab });
                    if (sportId) params.set("sportId", String(sportId));
                    url = `${apiUrl}/games/upcoming?${params.toString()}`;
                }

                console.log("[SportsCategoryView] Fetching:", url);
                const resp = await fetch(url, { cache: "no-store" });
                if (!resp.ok) throw new Error(`HTTP ${resp.status} — ${url}`);

                const data = await resp.json();
                if (cancelled) return;

                if (Array.isArray(data?.results) && data.results.length > 0) {
                    setMatches(data.results);
                } else {
                    setMatches([]);
                    setError(data?.error || "No matches available");
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message);
                    setMatches([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        // Only auto-refresh on inplay tab
        let interval: NodeJS.Timeout | undefined;
        if (activeTab === "inplay") {
            interval = setInterval(load, 30000);
        }

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [sportId, activeTab]);

    // Group by league
    const grouped = matches.reduce<Record<string, MatchEvent[]>>((acc, m) => {
        const key = m.league || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});

    const sportLabel = sportId ? (SPORT_LABELS[String(sportId)] ?? "Sport") : "All Sports";

    return (
        <div className="w-full bg-primary-dark pb-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black italic tracking-tight text-white">
                            {sportLabel} <span className="text-accent-yellow">MATCHES</span>
                        </h3>
                        {activeTab === "inplay" && matches.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                                <Zap className="w-3 h-3" /> {matches.length} LIVE
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-6 bg-white/5 p-1 rounded-xl w-fit border border-white/5">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all",
                                activeTab === tab.key
                                    ? "bg-accent-yellow text-primary-dark shadow-lg"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                        <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Loading matches...</p>
                    </div>
                ) : error && matches.length === 0 ? (
                    <div className="py-16 text-center text-white/30 font-bold italic uppercase tracking-widest border-2 border-dashed border-white/5 rounded-3xl">
                        {error}
                    </div>
                ) : matches.length === 0 ? (
                    <div className="py-16 text-center text-white/30 font-bold italic uppercase tracking-widest border-2 border-dashed border-white/5 rounded-3xl">
                        No Matches Available
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([league, events]) => (
                            <LeagueSection
                                key={league}
                                league={league}
                                events={events}
                                isInPlay={activeTab === "inplay"}
                                onSelectGame={onSelectGame}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── League Section ─────────────────────────────────────────────────────────
const LeagueSection = ({
    league, events, isInPlay, onSelectGame,
}: {
    league: string;
    events: MatchEvent[];
    isInPlay: boolean;
    onSelectGame: (id: string) => void;
}) => (
    <div className="rounded-2xl overflow-hidden border border-white/5">
        {/* League Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border-b border-white/5">
            <div className="w-5 h-5 rounded bg-accent-yellow/20 flex items-center justify-center">
                <Zap className="w-3 h-3 text-accent-yellow" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white/70">{league}</span>
            <span className="ml-auto text-[10px] font-bold text-white/30">{events.length} matches</span>
        </div>

        {/* Match Rows */}
        <div className="divide-y divide-white/5">
            {events.map((event) => (
                <MatchRow
                    key={event.id}
                    event={event}
                    isInPlay={isInPlay}
                    onSelect={() => onSelectGame(event.id)}
                />
            ))}
        </div>
    </div>
);

// ─── Match Row ───────────────────────────────────────────────────────────────
const MatchRow = ({
    event, isInPlay, onSelect,
}: {
    event: MatchEvent;
    isInPlay: boolean;
    onSelect: () => void;
}) => {
    const score = event.ss ? event.ss.split("-") : null;
    const homeScore = score?.[0]?.trim() ?? null;
    const awayScore = score?.[1]?.trim() ?? null;

    const scheduledDate = event.scheduled_time
        ? new Date(event.scheduled_time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null;

    return (
        <div
            onClick={onSelect}
            className="group flex items-center gap-3 px-4 py-3.5 bg-[#0D1117] hover:bg-white/5 cursor-pointer transition-all"
        >
            {/* Left: Status */}
            <div className="w-14 flex-shrink-0 text-center">
                {isInPlay ? (
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-black text-red-500 uppercase animate-pulse">LIVE</span>
                        <span className="text-xs font-black text-white/60">{event.timer ?? "0"}&apos;</span>
                    </div>
                ) : (
                    <span className="text-xs font-bold text-white/40">{scheduledDate ?? "--:--"}</span>
                )}
            </div>

            {/* Middle: Teams */}
            <div className="flex-1 min-w-0">
                {/* Home */}
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-white truncate max-w-[160px] sm:max-w-none">
                        {event.home}
                    </span>
                    {homeScore !== null && (
                        <span className={cn(
                            "text-base font-black ml-2 flex-shrink-0",
                            Number(homeScore) > Number(awayScore) ? "text-accent-yellow" : "text-white"
                        )}>
                            {homeScore}
                        </span>
                    )}
                </div>
                {/* Away */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white/60 truncate max-w-[160px] sm:max-w-none">
                        {event.away}
                    </span>
                    {awayScore !== null && (
                        <span className={cn(
                            "text-base font-black ml-2 flex-shrink-0",
                            Number(awayScore) > Number(homeScore) ? "text-accent-yellow" : "text-white/60"
                        )}>
                            {awayScore}
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Odds */}
            <div className="flex gap-1.5 flex-shrink-0">
                {event.odds && event.odds.length > 0 ? (
                    event.odds.slice(0, 3).map((odd, idx) => (
                        <OddButton
                            key={idx}
                            label={odd.name || (idx === 0 ? "1" : idx === 1 ? "X" : "2")}
                            value={odd.value}
                        />
                    ))
                ) : (
                    // Placeholder shown for upcoming matches with no odds yet
                    ["1", "X", "2"].map((label) => (
                        <OddButton key={label} label={label} value="--" disabled />
                    ))
                )}
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-accent-yellow transition-colors flex-shrink-0" />
        </div>
    );
};

// ─── Odd Button ──────────────────────────────────────────────────────────────
const OddButton = ({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) => (
    <div className={cn(
        "flex flex-col items-center justify-center w-14 py-2 rounded-lg border text-center transition-all",
        disabled
            ? "border-white/5 bg-white/[0.02] cursor-default"
            : "border-white/10 bg-white/5 hover:bg-accent-yellow hover:border-accent-yellow hover:text-primary-dark cursor-pointer active:scale-95 group/odd"
    )}>
        <span className={cn(
            "text-[9px] font-black uppercase",
            disabled ? "text-white/20" : "text-white/40 group-hover/odd:text-primary-dark"
        )}>
            {label}
        </span>
        <span className={cn(
            "text-xs font-black",
            disabled ? "text-white/20" : "text-accent-yellow group-hover/odd:text-primary-dark"
        )}>
            {value}
        </span>
    </div>
);

export default SportsCategoryView;
