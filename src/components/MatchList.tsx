"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Activity, Calendar, CalendarDays,
    ChevronRight, RefreshCw, X, Minus, Plus, Check
} from "lucide-react";

export interface Match {
    id: string;
    sport_id: string;
    league: string;
    home: string;
    away: string;
    ss: string | null;
    timer: string | null;
    odds: { name: string; value: string }[];
}

type Tab = "inplay" | "today" | "tomorrow";

interface BetEntry {
    matchId: string;
    matchName: string;
    team: string;      // "home" | "away"
    type: "Back" | "Lay";
    odd: string;
    stake: string;
}

const TABS = [
    { key: "inplay" as Tab, label: "In-Play", Icon: Activity },
    { key: "today" as Tab, label: "Today", Icon: Calendar },
    { key: "tomorrow" as Tab, label: "Tomorrow", Icon: CalendarDays },
];

const SPORT_NAME: Record<string, string> = {
    "1": "Soccer", "3": "Cricket", "13": "Tennis",
    "18": "Basketball", "4": "Ice Hockey", "12": "American Football",
};

const QUICK_STAKES = [100, 200, 500, 1000, 5000, 10000];

interface Props {
    sportId?: number;
    onCountChange?: (counts: Record<string, number>) => void;
}

export default function MatchList({ sportId, onCountChange }: Props) {
    const [tab, setTab] = useState<Tab>("inplay");
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [activeBet, setActiveBet] = useState<BetEntry | null>(null);
    const [betSuccess, setBetSuccess] = useState(false);

    useEffect(() => { setTab("inplay"); setActiveBet(null); }, [sportId]);

    const fetch_ = useCallback(async (initial = false) => {
        if (initial) setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams();
            if (sportId) p.set("sportId", String(sportId));
            const res = await fetch(`/api/games${p.toString() ? `?${p}` : ""}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const list: Match[] = Array.isArray(data?.results) ? data.results : [];
            setMatches(list);
            setLastUpdated(new Date());
            if (onCountChange) {
                const counts: Record<string, number> = {};
                for (const m of list) counts[m.sport_id] = (counts[m.sport_id] || 0) + 1;
                onCountChange(counts);
            }
        } catch (e: any) { setError(e.message); }
        finally { if (initial) setLoading(false); }
    }, [sportId, onCountChange]);

    useEffect(() => {
        let dead = false;
        fetch_(true);
        const iv = tab === "inplay" ? setInterval(() => !dead && fetch_(), 30_000) : undefined;
        return () => { dead = true; clearInterval(iv); };
    }, [fetch_, tab]);

    // Group by league
    const grouped: Record<string, Match[]> = {};
    for (const m of matches) (grouped[m.league] ??= []).push(m);

    const sportLabel = sportId ? (SPORT_NAME[String(sportId)] ?? "Sport") : "All Sports";

    const handleSelectOdd = (match: Match, team: string, type: "Back" | "Lay", odd: string) => {
        if (activeBet?.matchId === match.id && activeBet?.type === type && activeBet?.team === team) {
            setActiveBet(null);
            return;
        }
        setActiveBet({
            matchId: match.id,
            matchName: team === "home" ? match.home : match.away,
            team, type, odd, stake: "",
        });
        setBetSuccess(false);
    };

    const handlePlaceBet = () => {
        if (!activeBet || !activeBet.stake || parseFloat(activeBet.stake) <= 0) return;
        setBetSuccess(true);
        setTimeout(() => { setActiveBet(null); setBetSuccess(false); }, 2000);
    };

    return (
        <div className="flex-1 min-w-0 flex flex-col">
            {/* Section header */}
            <div className="flex items-center justify-between px-3 py-2.5 sticky top-[112px] z-10"
                style={{ background: "#1e1e3a", borderBottom: "1px solid #2a2a4a" }}>
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

            {/* Tabs */}
            <div className="flex" style={{ background: "#16163a", borderBottom: "1px solid #2a2a4a" }}>
                {TABS.map(({ key, label, Icon }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2"
                        style={{ borderColor: tab === key ? "#e02020" : "transparent", color: tab === key ? "#fff" : "#7777aa", background: tab === key ? "rgba(224,32,32,0.08)" : "transparent" }}>
                        <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                ))}
            </div>

            {/* Column headers */}
            <div className="hidden md:flex items-center px-3 py-1.5" style={{ background: "#12122a", borderBottom: "1px solid #1e1e3a" }}>
                <div className="flex-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: "#444466" }}>Event</div>
                <div className="flex gap-1" style={{ minWidth: 168 }}>
                    {["Back", "Lay"].map(l => (
                        <div key={l} className="flex-1 text-center text-[11px] font-bold" style={{ color: l === "Back" ? "#72bbef" : "#f994ba" }}>{l}</div>
                    ))}
                </div>
            </div>

            {/* Loading skeletons */}
            {loading && (
                <div className="p-3 space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-lg overflow-hidden">
                            <div className="skeleton h-7 mb-px" />
                            <div className="skeleton h-12 mb-px" />
                            <div className="skeleton h-12" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && matches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="text-5xl">{sportId === 3 ? "🏏" : sportId === 1 ? "⚽" : sportId === 13 ? "🎾" : sportId === 18 ? "🏀" : "🎯"}</div>
                    <p className="text-sm font-semibold" style={{ color: "#7777aa" }}>No live {sportLabel} matches right now</p>
                    <p className="text-xs" style={{ color: "#444466" }}>Live matches appear as they start. Check back soon.</p>
                    {error && <p className="text-xs" style={{ color: "#ff4444" }}>{error}</p>}
                </div>
            )}

            {/* Match list */}
            {!loading && Object.entries(grouped).map(([league, evs]) => (
                <div key={league}>
                    {/* League header */}
                    <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: "#1e1e3a", borderTop: "1px solid #2a2a4a", borderBottom: "1px solid #14142a" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ffd700" }} />
                        <span className="text-[11px] font-bold uppercase tracking-wide truncate" style={{ color: "#ffd700" }}>{league}</span>
                        <span className="ml-auto text-[10px]" style={{ color: "#333355" }}>{evs.length}</span>
                    </div>

                    {evs.map(ev => (
                        <React.Fragment key={ev.id}>
                            <MatchRow
                                ev={ev}
                                activeBet={activeBet}
                                onSelectOdd={handleSelectOdd}
                            />
                            {/* Inline bet panel */}
                            {activeBet?.matchId === ev.id && (
                                <InlineBetPanel
                                    bet={activeBet}
                                    onStakeChange={s => setActiveBet(prev => prev ? { ...prev, stake: s } : null)}
                                    onClose={() => setActiveBet(null)}
                                    onPlace={handlePlaceBet}
                                    success={betSuccess}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ))}

            {lastUpdated && !loading && matches.length > 0 && (
                <div className="px-3 py-2 text-center text-[10px]" style={{ color: "#2a2a44" }}>
                    Auto-refreshes every 30s · Last updated {lastUpdated.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
}

/* ─── Match Row ──────────────────────────────────────────────────────────── */
function MatchRow({ ev, activeBet, onSelectOdd }: {
    ev: Match;
    activeBet: BetEntry | null;
    onSelectOdd: (m: Match, team: string, type: "Back" | "Lay", odd: string) => void;
}) {
    const router = useRouter();
    const parts = ev.ss?.split("-").map(s => s.trim()) ?? [];
    const hs = parts[0] ?? null;
    const as_ = parts[1] ?? null;
    const hWin = hs !== null && as_ !== null && Number(hs) > Number(as_);
    const aWin = as_ !== null && hs !== null && Number(as_) > Number(hs);

    // Build odds: we'll show Back (odd1) and Lay (odd2) for each team line
    const odd1 = ev.odds[0]?.value ?? null;
    const odd2 = ev.odds[1]?.value ?? null;
    const odd3 = ev.odds[2]?.value ?? null;

    const isBetActive = activeBet?.matchId === ev.id;

    const OddBtn = ({ team, type, odd }: { team: string; type: "Back" | "Lay"; odd: string | null }) => {
        const isActive = isBetActive && activeBet?.team === team && activeBet?.type === type;
        const isBack = type === "Back";
        return (
            <button
                onClick={() => odd && onSelectOdd(ev, team, type, odd)}
                disabled={!odd}
                className="flex-1 py-1.5 rounded text-center transition-all select-none"
                style={{
                    background: isActive
                        ? (isBack ? "#3a8ad4" : "#d4537a")
                        : (isBack ? "#72bbef" : "#f994ba"),
                    color: "#000",
                    opacity: odd ? 1 : 0.4,
                    transform: isActive ? "scale(0.96)" : "scale(1)",
                    boxShadow: isActive ? `0 0 12px ${isBack ? "#72bbef66" : "#f994ba66"}` : "none",
                    border: isActive ? `1px solid ${isBack ? "#72bbef" : "#f994ba"}` : "1px solid transparent",
                    minWidth: 58,
                }}>
                <div className="text-[9px] font-semibold leading-none" style={{ opacity: 0.7 }}>{type}</div>
                <div className="text-sm font-black leading-tight">{odd ?? "—"}</div>
            </button>
        );
    };

    return (
        <div className="border-b" style={{ borderColor: "#14142a", background: isBetActive ? "rgba(255,255,255,0.02)" : "transparent" }}>
            {/* Home row */}
            <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="live-dot flex-shrink-0" />
                    <span className="text-sm font-semibold truncate" style={{ color: hWin ? "#fff" : "#bbbbd0" }}>{ev.home}</span>
                    {hs !== null && <span className="ml-auto font-black text-sm flex-shrink-0 pl-2" style={{ color: hWin ? "#ffd700" : "#555578" }}>{hs}</span>}
                </div>
                <div className="hidden md:flex gap-1 flex-shrink-0">
                    <OddBtn team="home" type="Back" odd={odd1} />
                    <OddBtn team="home" type="Lay" odd={odd2} />
                </div>
                {/* Mobile: just one Back button */}
                <div className="flex md:hidden gap-1 flex-shrink-0">
                    <OddBtn team="home" type="Back" odd={odd1} />
                </div>
            </div>

            {/* Away row */}
            <div className="flex items-center gap-2 px-3 pb-2">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="w-[7px] h-[7px] flex-shrink-0" />
                    <span className="text-sm font-semibold truncate" style={{ color: aWin ? "#fff" : "#bbbbd0" }}>{ev.away}</span>
                    {as_ !== null && <span className="ml-auto font-black text-sm flex-shrink-0 pl-2" style={{ color: aWin ? "#ffd700" : "#555578" }}>{as_}</span>}
                </div>
                <div className="hidden md:flex gap-1 flex-shrink-0">
                    <OddBtn team="away" type="Back" odd={odd2} />
                    <OddBtn team="away" type="Lay" odd={odd3} />
                </div>
                {/* Mobile */}
                <div className="flex md:hidden gap-1 flex-shrink-0">
                    <OddBtn team="away" type="Back" odd={odd2} />
                </div>
            </div>

            {/* Bottom bar: timer + more markets link */}
            <div className="px-3 pb-2 flex items-center gap-2">
                {ev.timer && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#1e1e3a", color: "#e02020" }}>
                        ⏱ {ev.timer}&apos;
                    </span>
                )}
                {ev.ss && <span className="text-[10px]" style={{ color: "#444466" }}>{ev.ss}</span>}
                <button
                    onClick={() => router.push(`/match/${encodeURIComponent(ev.id)}`)}
                    className="ml-auto flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all"
                    style={{ background: "#1e1e3a", color: "#7777aa", border: "1px solid #2a2a4a" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#e02020"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a4a"; e.currentTarget.style.color = "#7777aa"; }}
                >
                    More Markets <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

/* ─── Inline Bet Panel ───────────────────────────────────────────────────── */
function InlineBetPanel({ bet, onStakeChange, onClose, onPlace, success }: {
    bet: BetEntry;
    onStakeChange: (v: string) => void;
    onClose: () => void;
    onPlace: () => void;
    success: boolean;
}) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { ref.current?.focus(); }, []);

    const stakeNum = parseFloat(bet.stake) || 0;
    const oddNum = parseFloat(bet.odd.replace(",", "")) || 0;
    const profit = bet.type === "Back" ? stakeNum * (oddNum - 1) : stakeNum;
    const liability = bet.type === "Lay" ? stakeNum * (oddNum - 1) : stakeNum;
    const isBack = bet.type === "Back";

    if (success) {
        return (
            <div className="flex items-center justify-center gap-3 py-4 px-4 animate-[fade-up_0.2s_ease]"
                style={{ background: "rgba(46,204,113,0.08)", borderBottom: "1px solid #14142a" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#2ecc71" }}>
                    <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold" style={{ color: "#2ecc71" }}>Bet Placed Successfully!</p>
                    <p className="text-xs" style={{ color: "#555578" }}>৳{stakeNum.toFixed(0)} on {bet.matchName}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 py-3 animate-[fade-up_0.15s_ease]"
            style={{ background: isBack ? "rgba(114,187,239,0.06)" : "rgba(249,148,186,0.06)", borderBottom: "2px solid", borderColor: isBack ? "#72bbef44" : "#f994ba44" }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-black" style={{ background: isBack ? "#72bbef" : "#f994ba", color: "#000" }}>
                        {bet.type}
                    </span>
                    <span className="text-sm font-bold text-white">{bet.matchName}</span>
                    <span className="text-base font-black" style={{ color: isBack ? "#72bbef" : "#f994ba" }}>@ {bet.odd}</span>
                </div>
                <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-1">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Stake row */}
            <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold flex-shrink-0" style={{ color: "#7777aa" }}>Stake ৳</span>
                <div className="flex items-center flex-1 rounded-lg overflow-hidden border" style={{ borderColor: isBack ? "#72bbef44" : "#f994ba44", background: "#0d0d1a" }}>
                    <button onClick={() => onStakeChange(String(Math.max(0, stakeNum - 100)))}
                        className="px-2.5 py-2 hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex-shrink-0">
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input ref={ref} type="number" min="0" step="100"
                        value={bet.stake}
                        onChange={e => onStakeChange(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent text-center text-base font-black text-white outline-none py-2 w-0 min-w-0" />
                    <button onClick={() => onStakeChange(String(stakeNum + 100))}
                        className="px-2.5 py-2 hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex-shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Quick stake chips */}
            <div className="flex gap-1.5 flex-wrap mb-3">
                {[100, 200, 500, 1000, 2000, 5000].map(v => (
                    <button key={v} onClick={() => onStakeChange(String(stakeNum + v))}
                        className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                        style={{ background: "#1e1e3a", color: "#9999bb", border: "1px solid #2a2a4a" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = isBack ? "#72bbef" : "#f994ba")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a4a")}>
                        +{v >= 1000 ? `${v / 1000}k` : v}
                    </button>
                ))}
                <button onClick={() => onStakeChange("")}
                    className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                    style={{ background: "#1e1e3a", color: "#555578", border: "1px solid #2a2a4a" }}>
                    Clear
                </button>
            </div>

            {/* Returns summary */}
            {stakeNum > 0 && (
                <div className="rounded-lg p-2.5 mb-3 grid grid-cols-2 gap-2" style={{ background: "#0d0d1a" }}>
                    <div>
                        <p className="text-[10px]" style={{ color: "#444466" }}>Stake</p>
                        <p className="text-sm font-black text-white">৳{stakeNum.toFixed(0)}</p>
                    </div>
                    <div>
                        <p className="text-[10px]" style={{ color: "#444466" }}>{isBack ? "Potential Profit" : "Potential Return"}</p>
                        <p className="text-sm font-black" style={{ color: "#2ecc71" }}>৳{profit.toFixed(2)}</p>
                    </div>
                    {!isBack && (
                        <div className="col-span-2">
                            <p className="text-[10px]" style={{ color: "#e02020" }}>Liability (you owe if loses): ৳{liability.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Place Bet button */}
            <button
                onClick={handlePlaceBetClick}
                disabled={stakeNum <= 0}
                className="w-full py-2.5 rounded-lg font-black text-sm transition-all"
                style={{
                    background: stakeNum > 0 ? (isBack ? "#005bb5" : "#b5005b") : "#1e1e3a",
                    color: stakeNum > 0 ? "#fff" : "#444466",
                    cursor: stakeNum > 0 ? "pointer" : "not-allowed",
                }}>
                {stakeNum > 0
                    ? `Place ${bet.type} ৳${stakeNum.toFixed(0)} @ ${bet.odd}`
                    : "Enter stake to place bet"}
            </button>
        </div>
    );

    function handlePlaceBetClick() { if (stakeNum > 0) onPlace(); }
}
