"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Tv, Star, RefreshCw,
    ChevronDown, ChevronUp, X, Minus, Plus, Check,
    Wifi, WifiOff
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Outcome { label: string; back: string; lay: string; }
interface Market { name: string; icon: string; outcomes: Outcome[]; }
interface MatchData {
    id: string; home: string; away: string;
    league: string; ss: string | null; timer: string | null;
    sport: string; sportIcon: string; markets: Market[];
}
interface ActiveBet {
    outcome: string; market: string;
    type: "Back" | "Lay"; odd: string; stake: string;
}

/* ─── YouTube sport channels ─────────────────────────────────────────── */
const SPORT_CHANNELS: Record<string, { name: string; videoId: string }[]> = {
    "Cricket": [{ name: "Star Sports", videoId: "coGknt1Qf2E" }, { name: "Cricbuzz", videoId: "IYZ_cHg2mw4" }],
    "Soccer": [{ name: "Sports Live", videoId: "1cJkCnGGWX8" }],
    "Tennis": [{ name: "Tennis Live", videoId: "lPJqalMO6LY" }],
    "Basketball": [{ name: "NBA Live", videoId: "wBjQ-ser2l0" }],
    "default": [{ name: "Sports Live", videoId: "coGknt1Qf2E" }],
};

function randomOdd(min: number, max: number) {
    return (Math.random() * (max - min) + min).toFixed(2);
}
function layOdd(back: string) {
    return (parseFloat(back) + Math.random() * 0.15 + 0.04).toFixed(2);
}
function buildMarkets(home: string, away: string): Market[] {
    const o1 = randomOdd(1.5, 3.5); const o2 = randomOdd(2, 5); const o3 = randomOdd(1.5, 3.5);
    return [
        { name: "Match Odds", icon: "📊", outcomes: [{ label: home, back: o1, lay: layOdd(o1) }, { label: "Draw", back: o2, lay: layOdd(o2) }, { label: away, back: o3, lay: layOdd(o3) }] },
        { name: "Over / Under 2.5", icon: "🎯", outcomes: [{ label: "Over 2.5", back: randomOdd(1.6, 2.2), lay: layOdd(randomOdd(1.6, 2.2)) }, { label: "Under 2.5", back: randomOdd(1.6, 2.5), lay: layOdd(randomOdd(1.6, 2.5)) }] },
        { name: "Over / Under 1.5", icon: "🎯", outcomes: [{ label: "Over 1.5", back: randomOdd(1.3, 1.8), lay: layOdd(randomOdd(1.3, 1.8)) }, { label: "Under 1.5", back: randomOdd(1.9, 3.0), lay: layOdd(randomOdd(1.9, 3.0)) }] },
        { name: "Both Teams Score", icon: "⚽", outcomes: [{ label: "Yes", back: randomOdd(1.5, 2.2), lay: layOdd(randomOdd(1.5, 2.2)) }, { label: "No", back: randomOdd(1.6, 2.4), lay: layOdd(randomOdd(1.6, 2.4)) }] },
        { name: "Next Goal", icon: "🥅", outcomes: [{ label: home, back: randomOdd(1.6, 2.8), lay: layOdd(randomOdd(1.6, 2.8)) }, { label: "No Goal", back: randomOdd(2, 4), lay: layOdd(randomOdd(2, 4)) }, { label: away, back: randomOdd(1.8, 3), lay: layOdd(randomOdd(1.8, 3)) }] },
        { name: "Asian Handicap", icon: "🏆", outcomes: [{ label: `${home} -0.5`, back: randomOdd(1.7, 2.2), lay: layOdd(randomOdd(1.7, 2.2)) }, { label: `${away} +0.5`, back: randomOdd(1.7, 2.2), lay: layOdd(randomOdd(1.7, 2.2)) }] },
        { name: "Correct Score", icon: "🔢", outcomes: [{ label: "1-0", back: randomOdd(4, 9), lay: layOdd(randomOdd(4, 9)) }, { label: "0-0", back: randomOdd(5, 12), lay: layOdd(randomOdd(5, 12)) }, { label: "1-1", back: randomOdd(6, 14), lay: layOdd(randomOdd(6, 14)) }, { label: "2-0", back: randomOdd(7, 15), lay: layOdd(randomOdd(7, 15)) }, { label: "0-1", back: randomOdd(4, 9), lay: layOdd(randomOdd(4, 9)) }, { label: "2-1", back: randomOdd(8, 18), lay: layOdd(randomOdd(8, 18)) }] },
    ];
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function MatchDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [match, setMatch] = useState<MatchData | null>(null);
    const [score, setScore] = useState<string | null>(null);
    const [timer, setTimer] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    const [tvOpen, setTvOpen] = useState(true);
    const [muted, setMuted] = useState(false);
    type StreamState = { status: "loading" } | { status: "live"; url: string } | { status: "unavailable" };
    const [streamState, setStreamState] = useState<StreamState>({ status: "loading" });

    const [openMarkets, setOpenMarkets] = useState<Set<string>>(new Set(["Match Odds"]));
    const [activeBet, setActiveBet] = useState<ActiveBet | null>(null);
    const [betOk, setBetOk] = useState(false);
    const [starred, setStarred] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    /* ── Initial fetch ── */
    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`/api/games/${encodeURIComponent(id)}`, { cache: "no-store" });
                const d = await r.json();
                if (d.success && d.match) {
                    setMatch(d.match);
                    setScore(d.match.ss);
                    setTimer(d.match.timer);
                }
            } finally { setInitLoading(false); }
        })();
    }, [id]);

    /* ── Fetch BetsAPI stream ── */
    useEffect(() => {
        if (!id) return;
        setStreamState({ status: "loading" });
        fetch(`/api/stream/${encodeURIComponent(id)}`, { cache: "no-store" })
            .then(r => r.json())
            .then(d => {
                if (d.available && d.url) setStreamState({ status: "live", url: d.url });
                else setStreamState({ status: "unavailable" });
            })
            .catch(() => setStreamState({ status: "unavailable" }));
    }, [id]);

    /* ── SSE real-time score stream ── */
    useEffect(() => {
        const url = `/api/games/stream?matchId=${encodeURIComponent(id)}`;
        const es = new EventSource(url);

        es.onopen = () => setConnected(true);
        es.onerror = () => setConnected(false);
        es.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.type === "match" && msg.data) {
                    setScore(msg.data.ss);
                    setTimer(msg.data.timer);
                }
            } catch { }
        };

        return () => es.close();
    }, [id]);

    /* ── Score flash ── */
    const prevScore = useRef(score);
    const [scoreFlash, setScoreFlash] = useState(false);
    useEffect(() => {
        if (prevScore.current !== score && score) {
            prevScore.current = score;
            setScoreFlash(true);
            setTimeout(() => setScoreFlash(false), 1200);
        }
    }, [score]);

    const [hs, as_] = (score ?? "").split("-").map(s => s.trim());
    const hWin = hs && as_ && Number(hs) > Number(as_);
    const aWin = as_ && hs && Number(as_) > Number(hs);


    const toggleMarket = (n: string) => setOpenMarkets(prev => {
        const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s;
    });

    const selectOdd = (market: string, outcome: string, type: "Back" | "Lay", odd: string) => {
        if (activeBet?.market === market && activeBet?.outcome === outcome && activeBet?.type === type) {
            setActiveBet(null); return;
        }
        setActiveBet({ market, outcome, type, odd, stake: "" });
        setBetOk(false);
    };

    const placeBet = () => {
        if (!activeBet || parseFloat(activeBet.stake) <= 0) return;
        setBetOk(true);
        setTimeout(() => { setActiveBet(null); setBetOk(false); }, 2200);
    };

    /* ─── Render ──────────────────────────────────────────────────── */
    return (
        <>
            <div style={{ minHeight: "100vh", background: "#1a1a2e", paddingBottom: 48 }}>
                <Navbar onLoginClick={() => setAuthOpen(true)} />

                {/* Back bar */}
                <div style={{ background: "#12122a", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", gap: 12, padding: "8px 14px" }}>
                    <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#7777aa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    {match && <span style={{ fontSize: 12, color: "#444466" }}>{match.sportIcon} {match.league}</span>}
                    <div style={{ flex: 1 }} />
                    {/* Connection status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: connected ? "#2ecc71" : "#e02020" }}>
                        {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {connected ? "LIVE" : "..."}
                    </div>
                    <button onClick={() => setStarred(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: starred ? "#ffd700" : "#444466" }}>
                        <Star size={16} fill={starred ? "#ffd700" : "none"} />
                    </button>
                </div>

                {initLoading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, maxWidth: 900, margin: "0 auto" }}>
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 + i * 40, borderRadius: 12 }} />)}
                    </div>
                )}

                {!initLoading && match && (
                    <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>

                        {/* ── LIVE SCORE HEADER ── */}
                        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #2a2a4a", background: "linear-gradient(135deg,#1e1e3a 0%,#14142e 100%)" }}>
                            <div style={{ background: "#12122a", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 20, background: "rgba(224,32,32,0.15)", color: "#e02020", fontSize: 11, fontWeight: 900, border: "1px solid rgba(224,32,32,0.3)" }}>
                                    <span className="live-dot" /> LIVE
                                </span>
                                <span style={{ fontSize: 12, color: "#7777aa", textAlign: "center" }}>{match.league}</span>
                                {timer && <span style={{ fontSize: 12, fontWeight: 700, color: "#e02020" }}>⏱ {timer}'</span>}
                            </div>

                            <div style={{ padding: "20px 24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    {/* Home */}
                                    <div style={{ flex: 1, textAlign: "right" }}>
                                        <p style={{ fontWeight: 900, fontSize: 18, color: hWin ? "#fff" : "#9999bb", lineHeight: 1.2 }}>{match.home}</p>
                                        <p style={{ fontSize: 11, color: "#555578", marginTop: 4 }}>Home</p>
                                    </div>

                                    {/* Score */}
                                    <div style={{ textAlign: "center", minWidth: 110 }}>
                                        {score ? (
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                                                <span style={{ fontSize: 40, fontWeight: 900, color: hWin ? "#ffd700" : "#fff", background: scoreFlash && hWin ? "rgba(224,32,32,0.3)" : "transparent", borderRadius: 8, padding: "2px 8px", transition: "all 0.3s" }}>{hs}</span>
                                                <span style={{ fontSize: 24, fontWeight: 900, color: "#444466" }}>-</span>
                                                <span style={{ fontSize: 40, fontWeight: 900, color: aWin ? "#ffd700" : "#fff", background: scoreFlash && aWin ? "rgba(224,32,32,0.3)" : "transparent", borderRadius: 8, padding: "2px 8px", transition: "all 0.3s" }}>{as_}</span>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: 28, fontWeight: 900, color: "#444466" }}>vs</span>
                                        )}
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#e02020", marginTop: 4 }}>{match.sport}</p>
                                    </div>

                                    {/* Away */}
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                        <p style={{ fontWeight: 900, fontSize: 18, color: aWin ? "#fff" : "#9999bb", lineHeight: 1.2 }}>{match.away}</p>
                                        <p style={{ fontSize: 11, color: "#555578", marginTop: 4 }}>Away</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── LIVE TV PLAYER ── */}
                        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #2a2a4a" }}>
                            {/* TV Header */}
                            <div style={{ background: "#1e1e3a", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
                                <Tv size={15} color="#e02020" />
                                <span style={{ fontWeight: 900, color: "#fff", fontSize: 13 }}>Live TV</span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 7px", borderRadius: 20, background: "rgba(224,32,32,0.15)", color: "#e02020", fontSize: 10, fontWeight: 700, border: "1px solid rgba(224,32,32,0.3)" }}>
                                    <span className="live-dot" /> ON AIR
                                </span>
                                <div style={{ flex: 1 }} />
                                {streamState.status === "live" && (
                                    <button onClick={() => setMuted(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: muted ? "#e02020" : "#7777aa" }}>
                                        {muted ? "🔇" : "🔊"}
                                    </button>
                                )}
                                <button onClick={() => setTvOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#7777aa" }}>
                                    {tvOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            {/* Player area */}
                            {tvOpen && (
                                <div style={{ width: "100%", aspectRatio: "16/9", background: "#050510", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                    {streamState.status === "loading" && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #2a2a4a", borderTop: "3px solid #e02020", animation: "spin 1s linear infinite" }} />
                                            <p style={{ color: "#555578", fontSize: 13 }}>Checking stream…</p>
                                        </div>
                                    )}
                                    {streamState.status === "unavailable" && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center", padding: "0 24px" }}>
                                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#1e1e3a", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #2a2a4a" }}>
                                                <Tv size={28} color="#333355" />
                                            </div>
                                            <p style={{ color: "#555588", fontSize: 14, fontWeight: 700 }}>Stream not available</p>
                                            <p style={{ color: "#333355", fontSize: 12 }}>Live stream is not provided by the broadcaster for this match</p>
                                            <button onClick={() => {
                                                setStreamState({ status: "loading" });
                                                fetch(`/api/stream/${encodeURIComponent(id)}`, { cache: "no-store" })
                                                    .then(r => r.json())
                                                    .then(d => d.available && d.url ? setStreamState({ status: "live", url: d.url }) : setStreamState({ status: "unavailable" }))
                                                    .catch(() => setStreamState({ status: "unavailable" }));
                                            }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, background: "#1e1e3a", border: "1px solid #2a2a4a", color: "#7777aa", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                                                <RefreshCw size={12} /> Try again
                                            </button>
                                        </div>
                                    )}
                                    {streamState.status === "live" && (
                                        <iframe
                                            key={streamState.url}
                                            src={streamState.url + (muted ? (streamState.url.includes("?") ? "&mute=1" : "?mute=1") : "")}
                                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={`${match.home} vs ${match.away}`}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── BETTING MARKETS ── */}
                        {match.markets.map(market => (
                            <MarketSection
                                key={market.name}
                                market={market}
                                isOpen={openMarkets.has(market.name)}
                                onToggle={() => toggleMarket(market.name)}
                                activeBet={activeBet}
                                onSelect={(o, t, odd) => selectOdd(market.name, o, t, odd)}
                                betOk={betOk}
                                onStakeChange={s => setActiveBet(p => p ? { ...p, stake: s } : null)}
                                onPlace={placeBet}
                                onCloseBet={() => setActiveBet(null)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} type="login" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

/* ─── Market Section ─────────────────────────────────────────────── */
function MarketSection({ market, isOpen, onToggle, activeBet, onSelect, betOk, onStakeChange, onPlace, onCloseBet }: {
    market: Market; isOpen: boolean; onToggle: () => void;
    activeBet: ActiveBet | null;
    onSelect: (o: string, t: "Back" | "Lay", odd: string) => void;
    betOk: boolean; onStakeChange: (s: string) => void;
    onPlace: () => void; onCloseBet: () => void;
}) {
    return (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a4a" }}>
            {/* Header */}
            <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "#1e1e3a", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 16 }}>{market.icon}</span>
                <span style={{ flex: 1, fontWeight: 700, color: "#fff", fontSize: 13 }}>{market.name}</span>
                <span style={{ fontSize: 11, color: "#555578", marginRight: 6 }}>{market.outcomes.length} selections</span>
                {isOpen ? <ChevronUp size={15} color="#555578" /> : <ChevronDown size={15} color="#555578" />}
            </button>

            {isOpen && (
                <div style={{ background: "#16163a" }}>
                    {/* Column headers */}
                    <div style={{ display: "flex", alignItems: "center", padding: "5px 14px", borderBottom: "1px solid #1a1a32" }}>
                        <div style={{ flex: 1, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#444466" }}>Selection</div>
                        {["Back", "Lay"].map(l => <div key={l} style={{ width: 76, textAlign: "center", fontSize: 11, fontWeight: 700, color: l === "Back" ? "#72bbef" : "#f994ba" }}>{l}</div>)}
                    </div>

                    {market.outcomes.map(outcome => {
                        const bActive = activeBet?.market === market.name && activeBet?.outcome === outcome.label && activeBet?.type === "Back";
                        const lActive = activeBet?.market === market.name && activeBet?.outcome === outcome.label && activeBet?.type === "Lay";

                        return (
                            <React.Fragment key={outcome.label}>
                                <div style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid #1a1a32", gap: 10 }}>
                                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#ddddf0" }}>{outcome.label}</span>
                                    <OddButton type="Back" odd={outcome.back} active={bActive} onClick={() => onSelect(outcome.label, "Back", outcome.back)} />
                                    <OddButton type="Lay" odd={outcome.lay} active={lActive} onClick={() => onSelect(outcome.label, "Lay", outcome.lay)} />
                                </div>

                                {/* Inline bet panel */}
                                {(bActive || lActive) && activeBet && (
                                    <InlineBet bet={activeBet} success={betOk} onChange={onStakeChange} onClose={onCloseBet} onPlace={onPlace} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ─── Odd Button ─────────────────────────────────────────────────── */
function OddButton({ type, odd, active, onClick }: { type: "Back" | "Lay"; odd: string; active: boolean; onClick: () => void }) {
    const isBack = type === "Back";
    return (
        <button onClick={onClick} style={{
            width: 76, padding: "6px 4px", borderRadius: 5, border: active ? `1.5px solid ${isBack ? "#72bbef" : "#f994ba"}` : "1px solid transparent",
            background: active ? (isBack ? "#3a8ad4" : "#d4537a") : (isBack ? "#72bbef" : "#f994ba"),
            color: "#000", cursor: "pointer", transform: active ? "scale(0.94)" : "scale(1)", transition: "all 0.1s",
            boxShadow: active ? `0 0 14px ${isBack ? "#72bbef55" : "#f994ba55"}` : "none"
        }}>
            <div style={{ fontSize: 9, opacity: 0.7 }}>{type}</div>
            <div style={{ fontSize: 14, fontWeight: 900 }}>{odd}</div>
        </button>
    );
}

/* ─── Inline Bet Form ────────────────────────────────────────────── */
function InlineBet({ bet, success, onChange, onClose, onPlace }: { bet: ActiveBet; success: boolean; onChange: (s: string) => void; onClose: () => void; onPlace: () => void }) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { setTimeout(() => ref.current?.focus(), 40); }, []);

    const stake = parseFloat(bet.stake) || 0;
    const odd = parseFloat(bet.odd) || 0;
    const isBack = bet.type === "Back";
    const profit = isBack ? stake * (odd - 1) : stake;
    const liab = !isBack ? stake * (odd - 1) : 0;
    const color = isBack ? "#72bbef" : "#f994ba";

    if (success) return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(46,204,113,0.08)", borderBottom: "1px solid #1a1a32" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2ecc71", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={16} color="#fff" /></div>
            <div><p style={{ color: "#2ecc71", fontWeight: 700, fontSize: 13 }}>Bet Placed!</p><p style={{ color: "#555578", fontSize: 11 }}>৳{stake.toFixed(0)} on {bet.outcome} @ {bet.odd}</p></div>
        </div>
    );

    return (
        <div style={{ padding: "12px 16px", background: isBack ? "rgba(114,187,239,0.06)" : "rgba(249,148,186,0.06)", borderBottom: `2px solid ${color}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ padding: "2px 8px", borderRadius: 4, background: color, color: "#000", fontSize: 11, fontWeight: 900 }}>{bet.type}</span>
                <span style={{ fontWeight: 700, color: "#fff", fontSize: 13, flex: 1 }}>{bet.outcome}</span>
                <span style={{ fontWeight: 900, color, fontSize: 15 }}>@ {bet.odd}</span>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#555578", cursor: "pointer" }}><X size={16} /></button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#7777aa", flexShrink: 0 }}>Stake ৳</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", borderRadius: 8, overflow: "hidden", border: `1px solid ${color}33`, background: "#0d0d1a" }}>
                    <button onClick={() => onChange(String(Math.max(0, stake - 100)))} style={{ padding: "8px 10px", background: "none", border: "none", color: "#7777aa", cursor: "pointer" }}><Minus size={14} /></button>
                    <input ref={ref} type="number" min="0" step="100" value={bet.stake} placeholder="0" onChange={e => onChange(e.target.value)}
                        style={{ flex: 1, background: "none", border: "none", outline: "none", textAlign: "center", fontWeight: 900, fontSize: 16, color: "#fff", padding: "8px 0" }} />
                    <button onClick={() => onChange(String(stake + 100))} style={{ padding: "8px 10px", background: "none", border: "none", color: "#7777aa", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {[100, 500, 1000, 5000, 10000].map(v => (
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
                    {!isBack && <div style={{ gridColumn: "1/-1" }}><p style={{ fontSize: 10, color: "#e02020" }}>Liability: ৳{liab.toFixed(2)}</p></div>}
                </div>
            )}

            <button onClick={() => stake > 0 && onPlace()} style={{
                width: "100%", padding: "11px 0", borderRadius: 8, border: "none", fontWeight: 900, fontSize: 13,
                cursor: stake > 0 ? "pointer" : "not-allowed", background: stake > 0 ? (isBack ? "#005bb5" : "#8b0055") : "#1e1e3a", color: stake > 0 ? "#fff" : "#444466", transition: "all 0.15s"
            }}>
                {stake > 0 ? `Place ${bet.type} ৳${stake.toFixed(0)} @ ${bet.odd}` : "Enter stake to continue"}
            </button>
        </div>
    );
}
