"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Activity, Calendar, CalendarDays, ChevronRight, Tv, Star, RefreshCw } from "lucide-react";

export interface Match {
    id: string;
    sport_id: string;
    league: string;
    home: string;
    away: string;
    name: string;
    ss: string | null;
    timer: string | null;
    time_status: string;
    odds: { name: string; value: string }[];
}

type Tab = "inplay" | "today" | "tomorrow";

const TABS = [
    { key: "inplay" as Tab, label: "In-Play", icon: Activity },
    { key: "today" as Tab, label: "Today", icon: Calendar },
    { key: "tomorrow" as Tab, label: "Tomorrow", icon: CalendarDays },
];

const SPORT_NAME: Record<string, string> = {
    "1": "Soccer", "3": "Cricket", "13": "Tennis",
    "18": "Basketball", "4": "Ice Hockey", "12": "American Football",
};

interface Props {
    sportId?: number;
    onSelectGame?: (id: string) => void;
    onCountChange?: (counts: Record<string, number>) => void;
    onAddToBetSlip?: (match: Match, selection: string, odd: string) => void;
}

export default function MatchList({ sportId, onSelectGame, onCountChange, onAddToBetSlip }: Props) {
    const [tab, setTab] = useState<Tab>("inplay");
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => { setTab("inplay"); }, [sportId]);

    const fetch_ = useCallback(async (initial = false) => {
        if (initial) setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams();
            if (tab !== "inplay") p.set("tab", tab);
            if (sportId) p.set("sportId", String(sportId));
            const res = await fetch(`/api/games${p.toString() ? `?${p}` : ""}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const list: Match[] = Array.isArray(data?.results) ? data.results : [];
            setMatches(list);
            setLastUpdated(new Date());

            // Report counts to parent
            if (onCountChange) {
                const counts: Record<string, number> = {};
                for (const m of list) {
                    counts[m.sport_id] = (counts[m.sport_id] || 0) + 1;
                }
                onCountChange(counts);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            if (initial) setLoading(false);
        }
    }, [sportId, tab, onCountChange]);

    useEffect(() => {
        let dead = false;
        fetch_(true);
        const iv = tab === "inplay" ? setInterval(() => !dead && fetch_(), 30_000) : undefined;
        return () => { dead = true; clearInterval(iv); };
    }, [fetch_, tab]);

    // Group by league
    const grouped: Record<string, Match[]> = {};
    for (const m of matches) {
        (grouped[m.league] ??= []).push(m);
    }

    const sportLabel = sportId ? (SPORT_NAME[String(sportId)] || "Sport") : "All Sports";

    return (
        <div className="flex-1 min-w-0">
            {/* ── Section header ── */}
            <div className="flex items-center justify-between px-3 py-2.5" style={{ background: "#1e1e3a", borderBottom: "1px solid #2a2a4a" }}>
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" style={{ color: "#e02020" }} />
                    <span className="font-bold text-white text-sm">{sportLabel}</span>
                    {tab === "inplay" && matches.length > 0 && (
                        <span className="badge-live"><span className="live-dot" />{matches.length} Live</span>
                    )}
                </div>
                <button onClick={() => fetch_()} className="text-slate-500 hover:text-white p-1 rounded transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* ── Tabs ────────────────── */}
            <div className="flex" style={{ background: "#16163a", borderBottom: "1px solid #2a2a4a" }}>
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2"
                        style={{
                            borderColor: tab === key ? "#e02020" : "transparent",
                            color: tab === key ? "#fff" : "#7777aa",
                            background: tab === key ? "rgba(224,32,32,0.08)" : "transparent",
                        }}>
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Back/Lay Headers (desktop) ── */}
            <div className="hidden md:flex items-center px-3 py-1.5" style={{ background: "#12122a", borderBottom: "1px solid #1e1e3a" }}>
                <div className="flex-1" />
                <div className="flex gap-1.5 mr-12">
                    {["Back", "Lay"].map(l => (
                        <div key={l} className="w-[62px] text-center text-[11px] font-bold" style={{ color: l === "Back" ? "#72bbef" : "#f994ba" }}>{l}</div>
                    ))}
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="space-y-3 p-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="rounded-lg overflow-hidden">
                            <div className="skeleton h-8 mb-0.5 rounded-t-lg" />
                            <div className="skeleton h-14 mb-0.5" />
                            <div className="skeleton h-14 rounded-b-lg" />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Empty ── */}
            {!loading && matches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="text-5xl">
                        {sportId === 3 ? "🏏" : sportId === 1 ? "⚽" : sportId === 13 ? "🎾" : sportId === 18 ? "🏀" : "🎯"}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "#7777aa" }}>
                        No live {sportLabel} matches right now
                    </p>
                    <p className="text-xs text-center max-w-[240px]" style={{ color: "#444466" }}>
                        Live matches appear as they start. Check back soon.
                    </p>
                    {error && <p className="text-xs" style={{ color: "#ff4444" }}>{error}</p>}
                </div>
            )}

            {/* ── Match Groups ── */}
            {!loading && matches.length > 0 && (
                <div className="divide-y" style={{ borderColor: "#1e1e3a" }}>
                    {Object.entries(grouped).map(([league, evs]) => (
                        <div key={league}>
                            {/* League Row */}
                            <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1e1e3a" }}>
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ffd700" }} />
                                <span className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: "#ffd700" }}>{league}</span>
                                <span className="ml-auto text-xs" style={{ color: "#444466" }}>{evs.length}</span>
                            </div>

                            {/* Match Rows */}
                            {evs.map(ev => (
                                <MatchRow key={ev.id} ev={ev} onMoreClick={() => onSelectGame?.(ev.id)} onBet={(sel, odd) => onAddToBetSlip?.(ev, sel, odd)} />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Last updated ── */}
            {lastUpdated && !loading && (
                <div className="px-3 py-2 text-center text-[11px]" style={{ color: "#333355" }}>
                    Updated {lastUpdated.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
function MatchRow({ ev, onMoreClick, onBet }: { ev: Match; onMoreClick: () => void; onBet: (sel: string, odd: string) => void }) {
    const parts = ev.ss ? ev.ss.split("-").map(s => s.trim()) : [];
    const hs = parts[0] ?? null;
    const as_ = parts[1] ?? null;
    const hWin = hs !== null && as_ !== null && Number(hs) > Number(as_);
    const aWin = hs !== null && as_ !== null && Number(as_) > Number(hs);

    const back = ev.odds.find(o => o.name === "1" || o.name === "Back");
    const lay = ev.odds.find(o => o.name === "X" || o.name === "2" || o.name === "Lay");

    return (
        <div className="flex items-stretch hover:bg-white/[0.02] transition-colors cursor-pointer border-b"
            style={{ borderColor: "#1a1a32" }}>
            {/* Live indicator + timer */}
            <div className="w-12 flex flex-col items-center justify-center py-2 flex-shrink-0 border-r" style={{ borderColor: "#1a1a32" }}>
                <span className="live-dot mb-1" />
                <span className="text-[10px] font-bold" style={{ color: "#7777aa" }}>{ev.timer ?? "0"}&apos;</span>
            </div>

            {/* Teams */}
            <div className="flex-1 min-w-0 px-2.5 py-2" onClick={onMoreClick}>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex-1 text-sm font-semibold truncate" style={{ color: hWin ? "#fff" : "#bbbbd0" }}>{ev.home}</span>
                    {hs !== null && <span className="text-sm font-black flex-shrink-0 w-4 text-right" style={{ color: hWin ? "#ffd700" : "#555578" }}>{hs}</span>}
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-semibold truncate" style={{ color: aWin ? "#fff" : "#bbbbd0" }}>{ev.away}</span>
                    {as_ !== null && <span className="text-sm font-black flex-shrink-0 w-4 text-right" style={{ color: aWin ? "#ffd700" : "#555578" }}>{as_}</span>}
                </div>
            </div>

            {/* Odds: Back / Lay */}
            <div className="hidden md:flex items-center gap-1.5 px-2 flex-shrink-0">
                <button onClick={() => onBet("Back", back?.value ?? "")} className="btn-back" disabled={!back}>
                    <div className="text-[11px] font-normal leading-none mb-0.5" style={{ opacity: 0.7 }}>Back</div>
                    <div className="text-sm font-black">{back?.value ?? "—"}</div>
                </button>
                <button onClick={() => onBet("Lay", lay?.value ?? "")} className="btn-lay" disabled={!lay}>
                    <div className="text-[11px] font-normal leading-none mb-0.5" style={{ opacity: 0.7 }}>Lay</div>
                    <div className="text-sm font-black">{lay?.value ?? "—"}</div>
                </button>
            </div>

            {/* More Markets */}
            <button onClick={onMoreClick} className="flex items-center px-2.5 flex-shrink-0 border-l hover:bg-white/5 transition-colors"
                style={{ borderColor: "#1a1a32" }}>
                <ChevronRight className="w-4 h-4" style={{ color: "#444466" }} />
            </button>
        </div>
    );
}
