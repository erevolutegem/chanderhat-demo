"use client";
import React, { useState, useEffect, useRef } from "react";
import { Activity, Calendar, CalendarDays, RefreshCw, ChevronRight, X, Minus, Plus, Check, Tv, Wifi, WifiOff } from "lucide-react";
import { useRealtimeMatches } from "@/hooks/useRealtimeMatches";
import type { Match } from "@/hooks/useRealtimeMatches";
import LiveTVModal from "./LiveTVModal";

export type { Match };

type Tab = "inplay" | "today" | "tomorrow";

interface BetEntry {
    matchId: string; team: string; type: "Back" | "Lay";
    odd: string; teamName: string; stake: string;
    col: string; // "1" | "X" | "2"
}
interface LiveTV {
    matchId: string; home: string; away: string;
    sportId: string; league: string; ss: string | null; timer: string | null;
}

interface Props {
    sportId?: number;
    onCountChange?: (c: Record<string, number>) => void;
}

/* ── Back / Lay exact playbaji colours ── */
const BACK_COLORS = ["#72bbef", "#a6d7f8", "#c6e9fb"];   // dark → light
const LAY_COLORS = ["#f994ba", "#faa9ca", "#fbc4d7"];

export default function MatchList({ sportId, onCountChange }: Props) {
    const [tab, setTab] = useState<Tab>("inplay");
    const [activeBet, setActiveBet] = useState<BetEntry | null>(null);
    const [betOk, setBetOk] = useState(false);
    const [liveTV, setLiveTV] = useState<LiveTV | null>(null);

    const { matches, connected, loading, lastUpdate, reconnect } = useRealtimeMatches(sportId);

    useEffect(() => {
        if (!onCountChange) return;
        const c: Record<string, number> = {};
        matches.forEach(m => { c[m.sport_id] = (c[m.sport_id] ?? 0) + 1; });
        onCountChange(c);
    }, [matches, onCountChange]);

    useEffect(() => { setTab("inplay"); setActiveBet(null); }, [sportId]);

    const grouped: Record<string, Match[]> = {};
    matches.forEach(m => { (grouped[m.league] ??= []).push(m); });

    const selectOdd = (m: Match, col: string, type: "Back" | "Lay", odd: string) => {
        const teamName = col === "1" ? m.home : col === "2" ? m.away : "Draw";
        if (activeBet?.matchId === m.id && activeBet.col === col && activeBet.type === type) {
            setActiveBet(null); return;
        }
        setActiveBet({ matchId: m.id, team: col, type, odd, teamName, col, stake: "" });
        setBetOk(false);
    };

    const placeBet = () => {
        if (!activeBet || parseFloat(activeBet.stake) <= 0) return;
        setBetOk(true);
        setTimeout(() => { setActiveBet(null); setBetOk(false); }, 2000);
    };

    return (
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

            {/* ── Tab row ── */}
            <div className="overflow-x-auto scrollbar-hide" style={{ background: "#16163a", borderBottom: "1px solid #2a2a4a" }}>
                <div style={{ display: "flex", alignItems: "center", minWidth: "max-content" }}>
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
                    <div style={{ flex: 1 }} />
                    {/* Live / connection status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", fontSize: 11, fontWeight: 700, color: connected ? "#22c55e" : "#e02020" }}>
                        {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {connected ? "LIVE" : "Connecting…"}
                    </div>
                    <button onClick={reconnect} style={{ background: "none", border: "none", color: "#444466", cursor: "pointer", padding: "0 10px" }} title="Refresh">
                        <RefreshCw size={13} />
                    </button>
                </div>
            </div>

            {/* Mobile Scrollable Odds Table Container */}
            <div className="overflow-x-auto scrollbar-hide">
                <div style={{ minWidth: 600 }}>

                    {/* ── Table header (playbaji style) ── */}
                    <div style={{ display: "flex", background: "#1a1a32", borderBottom: "2px solid #2a2a4a" }}>
                        <div style={{ flex: 1, padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#555588", textTransform: "uppercase", letterSpacing: 0.5 }}>Event</div>
                        <div style={{ width: 100, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#555588", padding: "6px 0" }} className="hidden md:block">Matched</div>
                        {/* 6 odds columns: 1-Back, 1-Lay, X-Back, X-Lay, 2-Back, 2-Lay */}
                        {[
                            { label: "1", bg1: BACK_COLORS[0], bg2: LAY_COLORS[0] },
                            { label: "X", bg1: BACK_COLORS[0], bg2: LAY_COLORS[0] },
                            { label: "2", bg1: BACK_COLORS[0], bg2: LAY_COLORS[0] },
                        ].map(({ label, bg1, bg2 }) => (
                            <div key={label} style={{ display: "flex", flexShrink: 0 }}>
                                <div style={{ width: 54, textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 700, color: "#000", background: bg1 }}>{label}</div>
                                <div style={{ width: 54, textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 700, color: "#000", background: bg2 }}></div>
                            </div>
                        ))}
                    </div>

                    {/* Back / Lay sub-header */}
                    <div style={{ display: "flex", background: "#161628", borderBottom: "1px solid #2a2a4a" }}>
                        <div style={{ flex: 1 }} />
                        <div style={{ width: 100 }} className="hidden md:block" />
                        {[0, 1, 2].map(i => (
                            <React.Fragment key={i}>
                                <div style={{ width: 54, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#72bbef", padding: "3px 0", borderLeft: i > 0 ? "none" : "none" }}>Back</div>
                                <div style={{ width: 54, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#f994ba", padding: "3px 0" }}>Lay</div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* ── Loading skeleton ── */}
                    {loading && (
                        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{ display: "flex", gap: 4 }}>
                                    <div className="skeleton" style={{ flex: 1, height: 42, borderRadius: 4 }} />
                                    {[1, 2, 3, 4, 5, 6].map(j => <div key={j} className="skeleton" style={{ width: 54, height: 42, borderRadius: 4 }} />)}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!loading && matches.length === 0 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", gap: 12 }}>
                            <div style={{ fontSize: 44 }}>{sportId === 3 ? "🏏" : sportId === 1 ? "⚽" : sportId === 13 ? "🎾" : sportId === 18 ? "🏀" : "🎯"}</div>
                            <p style={{ color: "#7777aa", fontWeight: 600, fontSize: 14 }}>No live matches right now</p>
                            <button onClick={reconnect} style={{ padding: "8px 20px", borderRadius: 8, background: "#e02020", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13 }}>Refresh</button>
                        </div>
                    )}

                    {/* ── Match Groups ── */}
                    {Object.entries(grouped).map(([league, evs]) => (
                        <div key={league}>
                            {/* League header */}
                            <div style={{ background: "#1e1e3a", borderTop: "1px solid #2a2a4a", display: "flex", alignItems: "center", gap: 8, padding: "5px 10px" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", flexShrink: 0 }} />
                                <span style={{ color: "#ffd700", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{league}</span>
                                <span style={{ color: "#333355", fontSize: 10 }}>{evs.length}</span>
                            </div>

                            {evs.map(ev => {
                                const [hs, as_] = (ev.ss ?? "").split("-").map(s => s.trim());
                                const hWin = hs && as_ && Number(hs) > Number(as_);
                                const aWin = as_ && hs && Number(as_) > Number(hs);

                                // odds[0]=home/1, odds[1]=draw/X, odds[2]=away/2
                                const o1 = ev.odds.find(o => o.name === "1")?.value ?? ev.odds[0]?.value ?? null;
                                const oX = ev.odds.find(o => o.name === "X")?.value ?? null;
                                const o2 = ev.odds.find(o => o.name === "2")?.value ?? ev.odds[1]?.value ?? null;
                                const l1 = o1 ? (parseFloat(o1) + 0.1).toFixed(2) : null;
                                const lX = oX ? (parseFloat(oX) + 0.12).toFixed(2) : null;
                                const l2 = o2 ? (parseFloat(o2) + 0.1).toFixed(2) : null;

                                const isBet = (col: string, type: "Back" | "Lay") =>
                                    activeBet?.matchId === ev.id && activeBet?.col === col && activeBet?.type === type;

                                const OddCell = ({ col, type, val, bgActive }: { col: string; type: "Back" | "Lay"; val: string | null; bgActive: string }) => {
                                    const act = isBet(col, type);
                                    const isBack = type === "Back";
                                    const baseBg = isBack ? BACK_COLORS[0] : LAY_COLORS[0];
                                    return (
                                        <div onClick={() => val && selectOdd(ev, col, type, val)}
                                            style={{
                                                width: 54, textAlign: "center", padding: "10px 2px", cursor: val ? "pointer" : "not-allowed", borderLeft: "1px solid rgba(0,0,0,0.1)",
                                                background: act ? (isBack ? "#3a8ad4" : "#d4537a") : (val ? baseBg : "rgba(114,187,239,0.08)"),
                                                boxShadow: act ? `inset 0 0 0 2px #fff` : "none", transition: "all 0.1s"
                                            }}>
                                            <div style={{ fontSize: 13, fontWeight: 900, color: val ? "#000" : "#333355" }}>{val ?? "—"}</div>
                                        </div>
                                    );
                                };

                                return (
                                    <React.Fragment key={ev.id}>
                                        <div style={{ borderBottom: "1px solid #14142a", display: "flex", flexDirection: "column" }}>
                                            {/* Match row */}
                                            <div style={{
                                                display: "flex", alignItems: "stretch", minHeight: 64,
                                                background: activeBet?.matchId === ev.id ? "rgba(255,215,0,0.03)" : "transparent"
                                            }}>
                                                {/* Event info */}
                                                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "8px 10px", gap: 2, minWidth: 0 }}>
                                                    {/* Team names */}
                                                    <a href={`/match/${encodeURIComponent(ev.id)}`}
                                                        style={{ display: "block", textDecoration: "none" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                                            <span className="live-dot" style={{ flexShrink: 0 }} />
                                                            <ScoreFlash home={ev.home} away={ev.away}
                                                                hs={hs} as={as_} hWin={!!hWin} aWin={!!aWin}
                                                                timer={ev.timer}
                                                            />
                                                        </div>
                                                    </a>
                                                    {/* Icons row */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                                        <button onClick={() => setLiveTV({ matchId: ev.id, home: ev.home, away: ev.away, sportId: ev.sport_id, league: ev.league, ss: ev.ss, timer: ev.timer })}
                                                            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 18, borderRadius: 3, background: "#1a91e6", border: "none", cursor: "pointer" }} title="Live TV">
                                                            <Tv size={10} color="#fff" />
                                                        </button>
                                                        {ev.timer && (
                                                            <span style={{ display: "flex", alignItems: "center", gap: 2, padding: "1px 5px", borderRadius: 3, background: "#1e4d2b", color: "#22c55e", fontSize: 10, fontWeight: 700 }}>
                                                                ⏱ {ev.timer}'
                                                            </span>
                                                        )}
                                                        <a href={`/match/${encodeURIComponent(ev.id)}`}
                                                            style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 600, color: "#555588", textDecoration: "none" }}>
                                                            +Markets <ChevronRight size={10} />
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Matched column */}
                                                <div style={{ width: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#444466", padding: "0 4px", flexShrink: 0 }} className="hidden md:flex">
                                                    USD 0
                                                </div>

                                                {/* 6 odds cells */}
                                                <OddCell col="1" type="Back" val={o1} bgActive="#3a8ad4" />
                                                <OddCell col="1" type="Lay" val={l1} bgActive="#d4537a" />
                                                <OddCell col="X" type="Back" val={oX} bgActive="#3a8ad4" />
                                                <OddCell col="X" type="Lay" val={lX} bgActive="#d4537a" />
                                                <OddCell col="2" type="Back" val={o2} bgActive="#3a8ad4" />
                                                <OddCell col="2" type="Lay" val={l2} bgActive="#d4537a" />
                                            </div>

                                            {/* Inline bet panel */}
                                            {activeBet?.matchId === ev.id && (
                                                <BetPanel
                                                    bet={activeBet}
                                                    success={betOk}
                                                    onChange={s => setActiveBet(p => p ? { ...p, stake: s } : null)}
                                                    onClose={() => setActiveBet(null)}
                                                    onPlace={placeBet}
                                                />
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    ))}

                </div>
            </div>

            {lastUpdate && !loading && matches.length > 0 && (
                <div style={{ textAlign: "center", fontSize: 10, color: "#2a2a44", padding: "8px 0" }}>
                    🔴 Streaming live · {lastUpdate.toLocaleTimeString()}
                </div>
            )}

            {liveTV && (
                <LiveTVModal
                    matchId={liveTV.matchId} home={liveTV.home} away={liveTV.away}
                    sportId={liveTV.sportId} league={liveTV.league} ss={liveTV.ss} timer={liveTV.timer}
                    onClose={() => setLiveTV(null)}
                />
            )}
        </div>
    );
}

/* ── Score display with flash animation when score changes ── */
function ScoreFlash({ home, away, hs, as: as_, hWin, aWin, timer }: {
    home: string; away: string; hs?: string; as?: string;
    hWin: boolean; aWin: boolean; timer: string | null;
}) {
    const [hsFlash, setHsFlash] = useState(false);
    const [asFlash, setAsFlash] = useState(false);
    const prevHs = useRef(hs); const prevAs = useRef(as_);

    useEffect(() => {
        if (hs && hs !== prevHs.current) { prevHs.current = hs; setHsFlash(true); setTimeout(() => setHsFlash(false), 1200); }
        if (as_ && as_ !== prevAs.current) { prevAs.current = as_; setAsFlash(true); setTimeout(() => setAsFlash(false), 1200); }
    }, [hs, as_]);

    return (
        <div style={{ flex: 1, minWidth: 0 }}>
            {/* Home */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                    fontSize: 13, fontWeight: 700, color: hWin ? "#fff" : "#b0b0cc", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    transition: "color 0.3s"
                }}>{home}</span>
                {hs && (
                    <span style={{
                        fontWeight: 900, fontSize: 13, flexShrink: 0, color: hsFlash ? "#fff" : hWin ? "#ffd700" : "#555577",
                        background: hsFlash ? "#e02020" : "transparent", padding: hsFlash ? "0 5px" : "0", borderRadius: 4, transition: "all 0.3s"
                    }}>{hs}</span>
                )}
            </div>
            {/* Away */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{
                    fontSize: 13, fontWeight: 700, color: aWin ? "#fff" : "#b0b0cc", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    transition: "color 0.3s"
                }}>{away}</span>
                {as_ && (
                    <span style={{
                        fontWeight: 900, fontSize: 13, flexShrink: 0, color: asFlash ? "#fff" : aWin ? "#ffd700" : "#555577",
                        background: asFlash ? "#e02020" : "transparent", padding: asFlash ? "0 5px" : "0", borderRadius: 4, transition: "all 0.3s"
                    }}>{as_}</span>
                )}
            </div>
        </div>
    );
}

/* ── Inline Bet Panel ── */
function BetPanel({ bet, success, onChange, onClose, onPlace }: {
    bet: BetEntry; success: boolean; onChange: (s: string) => void; onClose: () => void; onPlace: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { setTimeout(() => ref.current?.focus(), 40); }, []);

    const stake = parseFloat(bet.stake) || 0;
    const odd = parseFloat(bet.odd) || 0;
    const isBack = bet.type === "Back";
    const profit = isBack ? stake * (odd - 1) : stake;
    const liab = !isBack ? stake * (odd - 1) : 0;
    const color = isBack ? "#72bbef" : "#f994ba";

    if (success) return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(46,204,113,0.08)", borderTop: `1px solid ${color}33` }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2ecc71", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={16} color="#fff" /></div>
            <div>
                <p style={{ color: "#2ecc71", fontWeight: 700, fontSize: 13 }}>Bet Placed! ✓</p>
                <p style={{ color: "#555578", fontSize: 11 }}>৳{stake.toFixed(0)} on {bet.teamName} @ {bet.odd}</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: "12px 14px", background: isBack ? "rgba(114,187,239,0.06)" : "rgba(249,148,186,0.06)", borderTop: `2px solid ${color}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ padding: "2px 8px", borderRadius: 4, background: color, color: "#000", fontSize: 11, fontWeight: 900 }}>{bet.type}</span>
                <span style={{ fontWeight: 700, color: "#fff", fontSize: 13, flex: 1 }}>{bet.teamName}</span>
                <span style={{ fontWeight: 900, color, fontSize: 15 }}>@ {bet.odd}</span>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#555578", cursor: "pointer" }}><X size={16} /></button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#7777aa", flexShrink: 0 }}>Stake ৳</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", borderRadius: 8, overflow: "hidden", border: `1px solid ${color}44`, background: "#0d0d1a" }}>
                    <button onClick={() => onChange(String(Math.max(0, stake - 100)))} style={{ padding: "8px 10px", background: "none", border: "none", color: "#7777aa", cursor: "pointer" }}><Minus size={14} /></button>
                    <input ref={ref} type="number" min="0" step="100" value={bet.stake} placeholder="0" onChange={e => onChange(e.target.value)}
                        style={{ flex: 1, background: "none", border: "none", outline: "none", textAlign: "center", fontWeight: 900, fontSize: 16, color: "#fff", padding: "8px 0" }} />
                    <button onClick={() => onChange(String(stake + 100))} style={{ padding: "8px 10px", background: "none", border: "none", color: "#7777aa", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                {[100, 500, 1000, 2000, 5000, 10000].map(v => (
                    <button key={v} onClick={() => onChange(String(stake + v))} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#1e1e3a", color: "#9999bb", border: "1px solid #2a2a4a", cursor: "pointer" }}>
                        +{v >= 1000 ? v / 1000 + "k" : v}
                    </button>
                ))}
                <button onClick={() => onChange("")} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#1e1e3a", color: "#555578", border: "1px solid #2a2a4a", cursor: "pointer" }}>Clear</button>
            </div>

            {stake > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "#0d0d1a", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                    <div><p style={{ fontSize: 10, color: "#444466" }}>Stake</p><p style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>৳{stake.toFixed(0)}</p></div>
                    <div><p style={{ fontSize: 10, color: "#444466" }}>{isBack ? "Profit" : "Return"}</p><p style={{ fontSize: 14, fontWeight: 900, color: "#2ecc71" }}>৳{profit.toFixed(2)}</p></div>
                    {!isBack && <div style={{ gridColumn: "1/-1" }}><p style={{ fontSize: 10, color: "#e02020" }}>Liability ৳{liab.toFixed(2)}</p></div>}
                </div>
            )}

            <button onClick={() => stake > 0 && onPlace()} style={{
                width: "100%", padding: "11px 0", borderRadius: 8, border: "none", fontWeight: 900, fontSize: 13,
                cursor: stake > 0 ? "pointer" : "not-allowed", background: stake > 0 ? (isBack ? "#005bb5" : "#8b0055") : "#1e1e3a", color: stake > 0 ? "#fff" : "#444466", transition: "all 0.15s"
            }}>
                {stake > 0 ? `Place ${bet.type} ৳${stake.toFixed(0)} @ ${bet.odd}` : "Enter stake amount"}
            </button>
        </div>
    );
}
