"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, RefreshCw, Activity, ChevronDown,
    ChevronUp, Minus, Plus, X, Check, Clock, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";

interface Outcome {
    label: string;
    back: string;
    lay: string;
}
interface Market {
    name: string;
    icon: string;
    outcomes: Outcome[];
}
interface MatchDetail {
    id: string;
    home: string;
    away: string;
    league: string;
    ss: string | null;
    timer: string | null;
    sport: string;
    sportIcon: string;
    markets: Market[];
}

interface ActiveBet {
    outcomeLabel: string;
    marketName: string;
    type: "Back" | "Lay";
    odd: string;
    stake: string;
}

export default function MatchPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [match, setMatch] = useState<MatchDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeBet, setActiveBet] = useState<ActiveBet | null>(null);
    const [betSuccess, setBetSuccess] = useState(false);
    const [openMarkets, setOpenMarkets] = useState<Set<string>>(new Set(["Match Odds"]));
    const [authOpen, setAuthOpen] = useState(false);
    const [starred, setStarred] = useState(false);

    const fetchMatch = async () => {
        setError(null);
        try {
            const res = await fetch(`/api/games/${encodeURIComponent(id)}`, { cache: "no-store" });
            const data = await res.json();
            if (!data.success) throw new Error(data.error ?? "Not found");
            setMatch(data.match);
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMatch(); }, [id]);
    // Auto-refresh score every 30s
    useEffect(() => {
        const iv = setInterval(fetchMatch, 30_000);
        return () => clearInterval(iv);
    }, [id]);

    const toggleMarket = (name: string) => {
        setOpenMarkets(prev => {
            const s = new Set(prev);
            s.has(name) ? s.delete(name) : s.add(name);
            return s;
        });
    };

    const handleSelectOdd = (market: string, outcome: string, type: "Back" | "Lay", odd: string) => {
        if (activeBet?.marketName === market && activeBet?.outcomeLabel === outcome && activeBet?.type === type) {
            setActiveBet(null); return;
        }
        setActiveBet({ marketName: market, outcomeLabel: outcome, type, odd, stake: "" });
        setBetSuccess(false);
    };

    const handlePlaceBet = () => {
        if (!activeBet || parseFloat(activeBet.stake) <= 0) return;
        setBetSuccess(true);
        setTimeout(() => { setActiveBet(null); setBetSuccess(false); }, 2500);
    };

    const [hs, as_] = (match?.ss ?? "0-0").split("-").map(s => s.trim());

    return (
        <>
            <div className="min-h-screen pb-8" style={{ background: "#1a1a2e" }}>
                <Navbar onLoginClick={() => setAuthOpen(true)} />

                {/* ── Back bar ── */}
                <div className="flex items-center gap-3 px-3 py-2.5 border-b" style={{ background: "#12122a", borderColor: "#2a2a4a" }}>
                    <button onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-white"
                        style={{ color: "#7777aa" }}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    {match && (
                        <span className="text-sm" style={{ color: "#444466" }}>
                            {match.sportIcon} {match.league}
                        </span>
                    )}
                    <div className="flex-1" />
                    <button onClick={fetchMatch} className="text-slate-500 hover:text-white p-1 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => setStarred(v => !v)} className="p-1 transition-colors"
                        style={{ color: starred ? "#ffd700" : "#444466" }}>
                        <Star className="w-4 h-4" fill={starred ? "#ffd700" : "none"} />
                    </button>
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col gap-3 p-4 max-w-2xl mx-auto">
                        <div className="skeleton h-32 rounded-xl" />
                        <div className="skeleton h-40 rounded-xl" />
                        <div className="skeleton h-40 rounded-xl" />
                    </div>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="text-5xl">⚠️</div>
                        <p className="font-bold text-white">Match not found</p>
                        <p className="text-sm" style={{ color: "#555578" }}>{error}</p>
                        <button onClick={() => router.back()}
                            className="px-5 py-2 rounded-lg text-sm font-bold text-white"
                            style={{ background: "#e02020" }}>
                            Go Back
                        </button>
                    </div>
                )}

                {match && (
                    <div className="max-w-2xl mx-auto px-3 pt-4 space-y-3">
                        {/* ── Live Score Header ── */}
                        <div className="rounded-xl overflow-hidden border"
                            style={{ background: "linear-gradient(135deg, #1e1e3a 0%, #16163a 100%)", borderColor: "#2a2a4a" }}>
                            {/* Live badge + league */}
                            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "#12122a", borderBottom: "1px solid #2a2a4a" }}>
                                <span className="badge-live"><span className="live-dot" />LIVE</span>
                                <span className="text-xs font-semibold truncate px-2" style={{ color: "#8888aa" }}>{match.league}</span>
                                {match.timer && (
                                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#e02020" }}>
                                        <Clock className="w-3 h-3" />{match.timer}&apos;
                                    </span>
                                )}
                            </div>

                            {/* Teams + Score */}
                            <div className="px-6 py-5">
                                <div className="flex items-center gap-3 mb-4">
                                    {/* Home */}
                                    <div className="flex-1 text-right">
                                        <div className="text-lg font-black text-white leading-tight">{match.home}</div>
                                        <div className="text-xs mt-1" style={{ color: "#555578" }}>Home</div>
                                    </div>

                                    {/* Score */}
                                    <div className="flex-shrink-0 text-center">
                                        {match.ss ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-black" style={{ color: Number(hs) > Number(as_) ? "#ffd700" : "#fff" }}>{hs}</span>
                                                <span className="text-xl font-black" style={{ color: "#444466" }}>–</span>
                                                <span className="text-3xl font-black" style={{ color: Number(as_) > Number(hs) ? "#ffd700" : "#fff" }}>{as_}</span>
                                            </div>
                                        ) : (
                                            <div className="text-2xl font-black" style={{ color: "#444466" }}>vs</div>
                                        )}
                                        <div className="text-[11px] font-bold mt-1" style={{ color: "#e02020" }}>
                                            {match.sport}
                                        </div>
                                    </div>

                                    {/* Away */}
                                    <div className="flex-1 text-left">
                                        <div className="text-lg font-black text-white leading-tight">{match.away}</div>
                                        <div className="text-xs mt-1" style={{ color: "#555578" }}>Away</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Markets ── */}
                        {match.markets.map((market) => (
                            <MarketSection
                                key={market.name}
                                market={market}
                                isOpen={openMarkets.has(market.name)}
                                onToggle={() => toggleMarket(market.name)}
                                activeBet={activeBet}
                                onSelectOdd={(label, type, odd) => handleSelectOdd(market.name, label, type, odd)}
                                betSuccess={betSuccess}
                                onStakeChange={s => setActiveBet(prev => prev ? { ...prev, stake: s } : null)}
                                onPlace={handlePlaceBet}
                                onCloseBet={() => setActiveBet(null)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} type="login" />
        </>
    );
}

/* ─── Market Section ─────────────────────────────────────────────────────── */
function MarketSection({ market, isOpen, onToggle, activeBet, onSelectOdd, betSuccess, onStakeChange, onPlace, onCloseBet }: {
    market: Market;
    isOpen: boolean;
    onToggle: () => void;
    activeBet: ActiveBet | null;
    onSelectOdd: (label: string, type: "Back" | "Lay", odd: string) => void;
    betSuccess: boolean;
    onStakeChange: (v: string) => void;
    onPlace: () => void;
    onCloseBet: () => void;
}) {
    const isActive = activeBet?.marketName === market.name;

    return (
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#2a2a4a" }}>
            {/* Header */}
            <button onClick={onToggle}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                style={{ background: "#1e1e3a" }}>
                <span className="text-base">{market.icon}</span>
                <span className="flex-1 font-bold text-white text-sm">{market.name}</span>
                <span className="text-xs mr-2" style={{ color: "#555578" }}>{market.outcomes.length} selections</span>
                {isOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "#555578" }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "#555578" }} />}
            </button>

            {isOpen && (
                <div style={{ background: "#16163a" }}>
                    {/* Column headers */}
                    <div className="flex items-center px-4 py-1.5" style={{ borderBottom: "1px solid #1a1a32" }}>
                        <div className="flex-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: "#444466" }}>Selection</div>
                        <div className="flex gap-1">
                            {["Back", "Lay"].map(l => (
                                <div key={l} className="w-[72px] text-center text-[11px] font-bold"
                                    style={{ color: l === "Back" ? "#72bbef" : "#f994ba" }}>{l}</div>
                            ))}
                        </div>
                    </div>

                    {/* Outcomes */}
                    {market.outcomes.map(outcome => {
                        const bActive = isActive && activeBet?.outcomeLabel === outcome.label && activeBet?.type === "Back";
                        const lActive = isActive && activeBet?.outcomeLabel === outcome.label && activeBet?.type === "Lay";

                        return (
                            <React.Fragment key={outcome.label}>
                                <div className="flex items-center px-4 py-2 border-b gap-3" style={{ borderColor: "#1a1a32" }}>
                                    <span className="flex-1 text-sm font-semibold" style={{ color: "#ddddf0" }}>{outcome.label}</span>
                                    <div className="flex gap-1">
                                        <OddButton
                                            type="Back" odd={outcome.back} active={bActive}
                                            onClick={() => onSelectOdd(outcome.label, "Back", outcome.back)} />
                                        <OddButton
                                            type="Lay" odd={outcome.lay} active={lActive}
                                            onClick={() => onSelectOdd(outcome.label, "Lay", outcome.lay)} />
                                    </div>
                                </div>

                                {/* Inline bet panel for this outcome */}
                                {isActive && activeBet?.outcomeLabel === outcome.label && (
                                    <InlineBetPanel
                                        bet={activeBet}
                                        onStakeChange={onStakeChange}
                                        onClose={onCloseBet}
                                        onPlace={onPlace}
                                        success={betSuccess && activeBet?.outcomeLabel === outcome.label}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ─── Odd Button ─────────────────────────────────────────────────────────── */
function OddButton({ type, odd, active, onClick }: { type: "Back" | "Lay"; odd: string; active: boolean; onClick: () => void }) {
    const isBack = type === "Back";
    return (
        <button onClick={onClick}
            className="rounded text-center transition-all w-[72px] py-1.5 select-none"
            style={{
                background: active
                    ? (isBack ? "#3a8ad4" : "#d4537a")
                    : (isBack ? "#72bbef" : "#f994ba"),
                color: "#000",
                transform: active ? "scale(0.95)" : "scale(1)",
                boxShadow: active ? `0 0 14px ${isBack ? "#72bbef55" : "#f994ba55"}` : "none",
                border: active ? `1.5px solid ${isBack ? "#72bbef" : "#f994ba"}` : "1px solid transparent",
            }}>
            <div className="text-[9px] font-semibold" style={{ opacity: 0.7 }}>{type}</div>
            <div className="text-sm font-black">{odd}</div>
        </button>
    );
}

/* ─── Inline Bet Panel ───────────────────────────────────────────────────── */
function InlineBetPanel({ bet, onStakeChange, onClose, onPlace, success }: {
    bet: ActiveBet; onStakeChange: (v: string) => void;
    onClose: () => void; onPlace: () => void; success: boolean;
}) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { ref.current?.focus(); }, []);

    const stakeNum = parseFloat(bet.stake) || 0;
    const oddNum = parseFloat(bet.odd) || 0;
    const isBack = bet.type === "Back";
    const profit = isBack ? stakeNum * (oddNum - 1) : stakeNum;
    const liability = !isBack ? stakeNum * (oddNum - 1) : 0;

    if (success) {
        return (
            <div className="flex items-center gap-3 px-4 py-3 animate-[fade-up_0.2s_ease]"
                style={{ background: "rgba(46,204,113,0.08)", borderBottom: "1px solid #1a1a32" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#2ecc71" }}>
                    <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold" style={{ color: "#2ecc71" }}>Bet Placed!</p>
                    <p className="text-xs" style={{ color: "#555578" }}>{bet.type} ৳{stakeNum.toFixed(0)} on {bet.outcomeLabel} @ {bet.odd}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-3 animate-[fade-up_0.15s_ease]"
            style={{ background: isBack ? "rgba(114,187,239,0.06)" : "rgba(249,148,186,0.06)", borderBottom: `2px solid ${isBack ? "#72bbef33" : "#f994ba33"}` }}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-black" style={{ background: isBack ? "#72bbef" : "#f994ba", color: "#000" }}>{bet.type}</span>
                <span className="text-sm font-bold text-white flex-1">{bet.outcomeLabel}</span>
                <span className="text-base font-black" style={{ color: isBack ? "#72bbef" : "#f994ba" }}>@ {bet.odd}</span>
                <button onClick={onClose} className="text-slate-600 hover:text-white p-0.5 transition-colors ml-1"><X className="w-4 h-4" /></button>
            </div>

            {/* Stake input */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold flex-shrink-0" style={{ color: "#7777aa" }}>Stake ৳</span>
                <div className="flex flex-1 items-center rounded-lg border overflow-hidden" style={{ background: "#0d0d1a", borderColor: isBack ? "#72bbef33" : "#f994ba33" }}>
                    <button onClick={() => onStakeChange(String(Math.max(0, stakeNum - 100)))}
                        className="px-2.5 py-2 hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex-shrink-0">
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input ref={ref} type="number" min="0" step="100"
                        value={bet.stake} placeholder="0"
                        onChange={e => onStakeChange(e.target.value)}
                        className="flex-1 bg-transparent text-center text-base font-black text-white outline-none py-2 w-0 min-w-0" />
                    <button onClick={() => onStakeChange(String(stakeNum + 100))}
                        className="px-2.5 py-2 hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex-shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Quick chips */}
            <div className="flex gap-1.5 flex-wrap mb-3">
                {[100, 500, 1000, 5000, 10000].map(v => (
                    <button key={v} onClick={() => onStakeChange(String(stakeNum + v))}
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: "#1e1e3a", color: "#9999bb", border: "1px solid #2a2a4a" }}>
                        +{v >= 1000 ? `${v / 1000}k` : v}
                    </button>
                ))}
                <button onClick={() => onStakeChange("")}
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: "#1e1e3a", color: "#555578", border: "1px solid #2a2a4a" }}>Clear</button>
            </div>

            {/* Returns */}
            {stakeNum > 0 && (
                <div className="grid grid-cols-2 gap-2 rounded-lg p-2.5 mb-3" style={{ background: "#0d0d1a" }}>
                    <div>
                        <p className="text-[10px]" style={{ color: "#444466" }}>Stake</p>
                        <p className="font-black text-sm text-white">৳{stakeNum.toFixed(0)}</p>
                    </div>
                    <div>
                        <p className="text-[10px]" style={{ color: "#444466" }}>{isBack ? "Potential Profit" : "Potential Return"}</p>
                        <p className="font-black text-sm" style={{ color: "#2ecc71" }}>৳{profit.toFixed(2)}</p>
                    </div>
                    {!isBack && (
                        <div className="col-span-2">
                            <p className="text-[10px]" style={{ color: "#e02020" }}>Liability: ৳{liability.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Place Bet */}
            <button onClick={() => stakeNum > 0 && onPlace()}
                className="w-full py-2.5 rounded-lg font-black text-sm transition-all"
                style={{
                    background: stakeNum > 0 ? (isBack ? "#005bb5" : "#8b0055") : "#1e1e3a",
                    color: stakeNum > 0 ? "#fff" : "#444466",
                }}>
                {stakeNum > 0 ? `Place ${bet.type} ৳${stakeNum.toFixed(0)} @ ${bet.odd}` : "Enter stake to place bet"}
            </button>
        </div>
    );
}
