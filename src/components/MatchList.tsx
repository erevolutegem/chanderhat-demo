"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Calendar, CalendarDays, RefreshCw, ChevronRight, X, Minus, Plus, Check, Tv, Wifi, WifiOff } from "lucide-react";
import { useRealtimeMatches } from "@/hooks/useRealtimeMatches";
import type { Match } from "@/hooks/useRealtimeMatches";
import LiveTVModal from "./LiveTVModal";

export type { Match };

type Tab = "inplay" | "today" | "tomorrow";

interface BetEntry {
    matchId: string;
    team: string;
    type: "Back" | "Lay";
    odd: string;
    teamName: string;
    stake: string;
}

interface LiveTV {
    matchId: string; home: string; away: string;
    sportId: string; league: string; ss: string | null; timer: string | null;
}

const SPORT_LABELS: Record<string, string> = {
    "1": "Soccer", "3": "Cricket", "13": "Tennis",
    "18": "Basketball", "4": "Ice Hockey", "12": "American Football",
};

interface Props {
    sportId?: number;
    onCountChange?: (c: Record<string, number>) => void;
}

export default function MatchList({ sportId, onCountChange }: Props) {
    const [tab, setTab] = useState<Tab>("inplay");
    const [activeBet, setActiveBet] = useState<BetEntry | null>(null);
    const [betOk, setBetOk] = useState(false);
    const [liveTV, setLiveTV] = useState<LiveTV | null>(null);

    // ─── Real-time SSE connection ────────────────────────────────────────────
    const { matches, connected, error, lastUpdate, reconnect } = useRealtimeMatches(sportId);

    // Notify parent of match counts whenever matches change
    useEffect(() => {
        if (!onCountChange) return;
        const c: Record<string, number> = {};
        matches.forEach(m => { c[m.sport_id] = (c[m.sport_id] ?? 0) + 1; });
        onCountChange(c);
    }, [matches, onCountChange]);

    // Reset bet when sport changes
    useEffect(() => { setTab("inplay"); setActiveBet(null); }, [sportId]);

    // Group matches by league
    const grouped: Record<string, Match[]> = {};
    matches.forEach(m => { (grouped[m.league] ??= []).push(m); });
    const sportLabel = sportId ? (SPORT_LABELS[String(sportId)] ?? "Sport") : "All Sports";
    const loading = !connected && matches.length === 0 && !error;

    const selectOdd = (m: Match, team: string, type: "Back" | "Lay", odd: string, teamName: string) => {
        if (activeBet?.matchId === m.id && activeBet.team === team && activeBet.type === type) {
            setActiveBet(null); return;
        }
        setActiveBet({ matchId: m.id, team, type, odd, teamName, stake: "" });
        setBetOk(false);
    };

    const placeBet = () => {
        if (!activeBet || parseFloat(activeBet.stake) <= 0) return;
        setBetOk(true);
        setTimeout(() => { setActiveBet(null); setBetOk(false); }, 2000);
    };

    return (
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

            {/* ── Section Header ── */}
            <div style={{ background: "#1e1e3a", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", position: "sticky", top: 112, zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={16} color="#e02020" />
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{sportLabel}</span>
                    {matches.length > 0 && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 20, background: "rgba(224,32,32,0.15)", color: "#e02020", fontSize: 11, fontWeight: 700, border: "1px solid rgba(224,32,32,0.3)" }}>
                            <span className="live-dot" />{matches.length} Live
                        </span>
                    )}
                </div>
                {/* Connection status indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div title={connected ? "Streaming live" : "Reconnecting…"} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: connected ? "#2ecc71" : "#e02020" }}>
                        {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                        <span style={{ fontWeight: 700 }}>{connected ? "LIVE" : "..."}</span>
                    </div>
                    <button onClick={reconnect} style={{ background: "none", border: "none", color: "#555578", cursor: "pointer" }} title="Reconnect">
                        <RefreshCw size={13} />
                    </button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div style={{ background: "#16163a", borderBottom: "1px solid #2a2a4a", display: "flex" }}>
                {([["inplay", "In-Play", Activity], ["today", "Today", Calendar], ["tomorrow", "Tomorrow", CalendarDays]] as const).map(([key, label, Icon]) => (
                    <button key={key} onClick={() => setTab(key)}
                        style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", borderBottom: "2px solid", transition: "all 0.15s",
                            borderColor: tab === key ? "#e02020" : "transparent",
                            color: tab === key ? "#fff" : "#777799",
                            background: tab === key ? "rgba(224,32,32,0.08)" : "transparent"
                        }}>
                        <Icon size={14} />{label}
                    </button>
                ))}
            </div>

            {/* ── Column headers (desktop) ── */}
            <div className="hidden md:flex" style={{ background: "#12122a", borderBottom: "1px solid #1e1e3a", alignItems: "center", padding: "5px 12px" }}>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#444466" }}>Event</div>
                <div style={{ display: "flex", gap: 4 }}>
                    {["Back", "Lay"].map(l => <div key={l} style={{ width: 70, textAlign: "center", fontSize: 11, fontWeight: 700, color: l === "Back" ? "#72bbef" : "#f994ba" }}>{l}</div>)}
                </div>
            </div>

            {/* ── Loading skeleton ── */}
            {loading && (
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i}>
                            <div className="skeleton" style={{ height: 26, marginBottom: 2, borderRadius: 6 }} />
                            <div className="skeleton" style={{ height: 48, marginBottom: 2 }} />
                            <div className="skeleton" style={{ height: 48 }} />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Error state ── */}
            {!loading && error && matches.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 12 }}>
                    <WifiOff size={40} color="#333355" />
                    <p style={{ color: "#7777aa", fontWeight: 600, fontSize: 14 }}>Connection error</p>
                    <button onClick={reconnect} style={{ padding: "8px 20px", borderRadius: 8, background: "#e02020", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Retry</button>
                </div>
            )}

            {/* ── Empty state ── */}
            {!loading && !error && matches.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 20px", gap: 12 }}>
                    <div style={{ fontSize: 48 }}>{sportId === 3 ? "🏏" : sportId === 1 ? "⚽" : sportId === 13 ? "🎾" : sportId === 18 ? "🏀" : "🎯"}</div>
                    <p style={{ color: "#7777aa", fontWeight: 600, fontSize: 14 }}>No live {sportLabel} matches right now</p>
                    <p style={{ color: "#444466", fontSize: 12 }}>Matches appear here as they start.</p>
                </div>
            )}

            {/* ── Match groups ── */}
            {Object.entries(grouped).map(([league, evs]) => (
                <div key={league}>
                    {/* League header */}
                    <div style={{ background: "#1e1e3a", borderTop: "1px solid #2a2a4a", borderBottom: "1px solid #14142a", display: "flex", alignItems: "center", gap: 8, padding: "5px 12px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", flexShrink: 0 }} />
                        <span style={{ color: "#ffd700", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{league}</span>
                        <span style={{ color: "#333355", fontSize: 10 }}>{evs.length}</span>
                    </div>

                    {evs.map(ev => {
                        const [hs, as_] = (ev.ss ?? "").split("-").map(s => s.trim());
                        const hWin = hs && as_ && Number(hs) > Number(as_);
                        const aWin = hs && as_ && Number(as_) > Number(hs);
                        const o1 = ev.odds[0]?.value ?? null;
                        const o2 = ev.odds[1]?.value ?? null;
                        const o3 = ev.odds[2]?.value ?? null;
                        const isBetOpen = activeBet?.matchId === ev.id;

                        const OddBtn = ({ team, type, odd }: { team: string; type: "Back" | "Lay"; odd: string | null }) => {
                            const on = isBetOpen && activeBet?.team === team && activeBet?.type === type;
                            const isBack = type === "Back";
                            return (
                                <button disabled={!odd}
                                    onClick={() => odd && selectOdd(ev, team, type, odd, team === "home" ? ev.home : ev.away)}
                                    style={{
                                        width: 70, padding: "5px 4px", borderRadius: 4,
                                        border: on ? `1.5px solid ${isBack ? "#72bbef" : "#f994ba"}` : "1px solid transparent",
                                        background: on ? (isBack ? "#3a8ad4" : "#d4537a") : (isBack ? "#72bbef" : "#f994ba"),
                                        color: "#000", cursor: odd ? "pointer" : "not-allowed", opacity: odd ? 1 : 0.35,
                                        transform: on ? "scale(0.94)" : "scale(1)", transition: "all 0.1s",
                                        boxShadow: on ? `0 0 12px ${isBack ? "#72bbef44" : "#f994ba44"}` : "none"
                                    }}>
                                    <div style={{ fontSize: 9, opacity: 0.7 }}>{type}</div>
                                    <div style={{ fontSize: 13, fontWeight: 900 }}>{odd ?? "—"}</div>
                                </button>
                            );
                        };

                        return (
                            <React.Fragment key={ev.id}>
                                <div style={{ borderBottom: "1px solid #14142a", background: isBetOpen ? "rgba(255,255,255,0.015)" : "transparent" }}>
                                    {/* Home row */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px" }}>
                                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                                            <span className="live-dot" style={{ flexShrink: 0 }} />
                                            <a href={`/match/${encodeURIComponent(ev.id)}`}
                                                style={{ flex: 1, fontSize: 13, fontWeight: 600, color: hWin ? "#fff" : "#b0b0cc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none", cursor: "pointer" }}
                                                onMouseEnter={e => (e.currentTarget.style.color = "#ffd700")}
                                                onMouseLeave={e => (e.currentTarget.style.color = hWin ? "#fff" : "#b0b0cc")}>
                                                {ev.home}
                                            </a>
                                            {hs && <ScoreFlash value={hs} win={!!hWin} />}
                                        </div>
                                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                            <OddBtn team="home" type="Back" odd={o1} />
                                            <OddBtn team="home" type="Lay" odd={o2} />
                                        </div>
                                    </div>
                                    {/* Away row */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px 7px" }}>
                                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                                            <span style={{ width: 7, height: 7, flexShrink: 0 }} />
                                            <a href={`/match/${encodeURIComponent(ev.id)}`}
                                                style={{ flex: 1, fontSize: 13, fontWeight: 600, color: aWin ? "#fff" : "#b0b0cc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none", cursor: "pointer" }}
                                                onMouseEnter={e => (e.currentTarget.style.color = "#ffd700")}
                                                onMouseLeave={e => (e.currentTarget.style.color = aWin ? "#fff" : "#b0b0cc")}>
                                                {ev.away}
                                            </a>
                                            {as_ && <ScoreFlash value={as_} win={!!aWin} />}
                                        </div>
                                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                            <OddBtn team="away" type="Back" odd={o2} />
                                            <OddBtn team="away" type="Lay" odd={o3} />
                                        </div>
                                    </div>
                                    {/* Bottom bar */}
                                    <div style={{ display: "flex", alignItems: "center", padding: "2px 12px 8px", gap: 6 }}>
                                        {ev.timer && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#1e1e3a", color: "#e02020" }}>⏱ {ev.timer}'</span>}
                                        {/* Live TV */}
                                        <button onClick={() => setLiveTV({ matchId: ev.id, home: ev.home, away: ev.away, sportId: ev.sport_id, league: ev.league, ss: ev.ss, timer: ev.timer })}
                                            style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(224,32,32,0.12)", color: "#e02020", border: "1px solid rgba(224,32,32,0.3)", cursor: "pointer" }}>
                                            <Tv size={10} /> Live TV
                                        </button>
                                        <MoreMarketsBtn id={ev.id} />
                                    </div>
                                </div>
                                {/* Inline bet panel */}
                                {isBetOpen && (
                                    <BetPanel
                                        bet={activeBet!}
                                        success={betOk}
                                        onChange={s => setActiveBet(p => p ? { ...p, stake: s } : null)}
                                        onClose={() => setActiveBet(null)}
                                        onPlace={placeBet}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            ))}

            {/* Last update footer */}
            {lastUpdate && matches.length > 0 && (
                <div style={{ textAlign: "center", fontSize: 10, color: "#2a2a44", padding: "8px 0" }}>
                    🔴 Streaming live · Last update {lastUpdate.toLocaleTimeString()}
                </div>
            )}

            {/* Live TV Modal */}
            {liveTV && (
                <LiveTVModal
                    matchId={liveTV.matchId}
                    home={liveTV.home}
                    away={liveTV.away}
                    sportId={liveTV.sportId}
                    league={liveTV.league}
                    ss={liveTV.ss}
                    timer={liveTV.timer}
                    onClose={() => setLiveTV(null)}
                />
            )}
        </div>
    );
}

/* ── Score flash: highlights briefly when value changes ── */
function ScoreFlash({ value, win }: { value: string; win: boolean }) {
    const [flash, setFlash] = useState(false);
    const prev = useRef(value);

    useEffect(() => {
        if (prev.current !== value) {
            prev.current = value;
            setFlash(true);
            const t = setTimeout(() => setFlash(false), 1200);
            return () => clearTimeout(t);
        }
    }, [value]);

    return (
        <span style={{
            fontWeight: 900, fontSize: 13, flexShrink: 0,
            color: flash ? "#fff" : win ? "#ffd700" : "#444466",
            background: flash ? "#e02020" : "transparent",
            padding: flash ? "0 5px" : "0", borderRadius: 4,
            transition: "all 0.3s",
        }}>
            {value}
        </span>
    );
}

/* ── More Markets button ── */
function MoreMarketsBtn({ id }: { id: string }) {
    const router = useRouter();
    return (
        <button onClick={() => router.push(`/match/${encodeURIComponent(id)}`)}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#1e1e3a", color: "#7777aa", border: "1px solid #2a2a4a", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e02020"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a4a"; e.currentTarget.style.color = "#7777aa"; }}>
            More Markets <ChevronRight size={12} />
        </button>
    );
}

/* ── Inline Bet Panel ── */
function BetPanel({ bet, success, onChange, onClose, onPlace }: {
    bet: BetEntry; success: boolean;
    onChange: (s: string) => void; onClose: () => void; onPlace: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { setTimeout(() => ref.current?.focus(), 50); }, []);

    const stake = parseFloat(bet.stake) || 0;
    const odd = parseFloat(bet.odd) || 0;
    const isBack = bet.type === "Back";
    const profit = isBack ? stake * (odd - 1) : stake;
    const liab = !isBack ? stake * (odd - 1) : 0;
    const color = isBack ? "#72bbef" : "#f994ba";

    if (success) return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(46,204,113,0.08)", borderBottom: "1px solid #14142a" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2ecc71", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={16} color="#fff" />
            </div>
            <div>
                <p style={{ color: "#2ecc71", fontWeight: 700, fontSize: 13 }}>Bet Placed!</p>
                <p style={{ color: "#555578", fontSize: 11 }}>৳{stake.toFixed(0)} on {bet.teamName} @ {bet.odd}</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: "12px 16px", background: isBack ? "rgba(114,187,239,0.06)" : "rgba(249,148,186,0.06)", borderBottom: `2px solid ${color}33` }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ padding: "2px 8px", borderRadius: 4, background: color, color: "#000", fontSize: 11, fontWeight: 900 }}>{bet.type}</span>
                <span style={{ fontWeight: 700, color: "#fff", fontSize: 13, flex: 1 }}>{bet.teamName}</span>
                <span style={{ fontWeight: 900, color, fontSize: 15 }}>@ {bet.odd}</span>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#555578", cursor: "pointer" }}><X size={16} /></button>
            </div>
            {/* Stake input */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#7777aa", flexShrink: 0 }}>Stake ৳</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", borderRadius: 8, overflow: "hidden", border: `1px solid ${color}33`, background: "#0d0d1a" }}>
                    <button onClick={() => onChange(String(Math.max(0, stake - 100)))} style={{ padding: "8px 10px", background: "none", border: "none", color: "#7777aa", cursor: "pointer" }}><Minus size={14} /></button>
                    <input ref={ref} type="number" min="0" step="100" value={bet.stake} placeholder="0"
                        onChange={e => onChange(e.target.value)}
                        style={{ flex: 1, background: "none", border: "none", outline: "none", textAlign: "center", fontWeight: 900, fontSize: 16, color: "#fff", padding: "8px 0" }} />
                    <button onClick={() => onChange(String(stake + 100))} style={{ padding: "8px 10px", background: "none", border: "none", color: "#7777aa", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
            </div>
            {/* Quick chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {[100, 200, 500, 1000, 2000, 5000].map(v => (
                    <button key={v} onClick={() => onChange(String(stake + v))}
                        style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#1e1e3a", color: "#9999bb", border: "1px solid #2a2a4a", cursor: "pointer" }}>
                        +{v >= 1000 ? v / 1000 + "k" : v}
                    </button>
                ))}
                <button onClick={() => onChange("")} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#1e1e3a", color: "#555578", border: "1px solid #2a2a4a", cursor: "pointer" }}>Clear</button>
            </div>
            {/* Returns */}
            {stake > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "#0d0d1a", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                    <div><p style={{ fontSize: 10, color: "#444466" }}>Stake</p><p style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>৳{stake.toFixed(0)}</p></div>
                    <div><p style={{ fontSize: 10, color: "#444466" }}>{isBack ? "Profit" : "Return"}</p><p style={{ fontSize: 14, fontWeight: 900, color: "#2ecc71" }}>৳{profit.toFixed(2)}</p></div>
                    {!isBack && <div style={{ gridColumn: "1/-1" }}><p style={{ fontSize: 10, color: "#e02020" }}>Liability: ৳{liab.toFixed(2)}</p></div>}
                </div>
            )}
            {/* Place bet */}
            <button onClick={() => stake > 0 && onPlace()}
                style={{
                    width: "100%", padding: "11px 0", borderRadius: 8, border: "none", fontWeight: 900, fontSize: 13,
                    cursor: stake > 0 ? "pointer" : "not-allowed",
                    background: stake > 0 ? (isBack ? "#005bb5" : "#8b0055") : "#1e1e3a",
                    color: stake > 0 ? "#fff" : "#444466", transition: "all 0.15s"
                }}>
                {stake > 0 ? `Place ${bet.type} ৳${stake.toFixed(0)} @ ${bet.odd}` : "Enter stake to continue"}
            </button>
        </div>
    );
}
