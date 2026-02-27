"use client";
import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Trash2, DollarSign, Loader2 } from "lucide-react";
import type { Match } from "./MatchList";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface BetSelection {
    matchId: string;
    matchName: string;
    selection: string;
    odd: string;
    stake: string;
}

interface Props {
    bets: BetSelection[];
    onRemove: (matchId: string) => void;
    onStakeChange: (matchId: string, stake: string) => void;
    onClear: () => void;
}

export default function BetSlip({ bets, onRemove, onStakeChange, onClear }: Props) {
    const { user, token, updateBalance } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlaceBets = async () => {
        if (!user || !token) {
            setError("Please log in to place bets.");
            return;
        }

        setLoading(true);
        setError(null);
        let newBalance = user.balance;

        try {
            for (const bet of bets) {
                const stake = parseFloat(bet.stake) || 0;
                if (stake <= 0) continue;

                // For now map selection back to a common oddsType pattern (Back)
                // In a full implementation, you'd store oddsType in BetSelection
                const payload = {
                    matchId: bet.matchId,
                    matchName: bet.matchName,
                    market: "Match Odds",
                    selection: bet.selection,
                    oddsType: "Back", // Default to Back
                    odds: parseFloat(bet.odd.replace(",", "")),
                    stake: stake
                };

                const res = await fetch(`${API_URL}/bets`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `Failed to place bet on ${bet.matchName}`);
                }

                newBalance = data.newBalance;
                onRemove(bet.matchId); // Remove successfully placed bet
            }

            // After loop, update global balance
            updateBalance(newBalance);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalStake = bets.reduce((acc, b) => acc + (parseFloat(b.stake) || 0), 0);
    const totalReturn = bets.reduce((acc, b) => {
        const odd = parseFloat(b.odd.replace(",", ""));
        const stake = parseFloat(b.stake) || 0;
        return acc + (isNaN(odd) ? stake : stake * odd);
    }, 0);

    return (
        <aside className="w-[260px] xl:w-[280px] flex-shrink-0 hidden lg:flex flex-col"
            style={{ background: "#12122a", borderLeft: "1px solid #2a2a4a", minHeight: "calc(100vh - 112px)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none"
                style={{ background: "#1e1e3a", borderBottom: "1px solid #2a2a4a" }}
                onClick={() => setCollapsed(!collapsed)}>
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" style={{ color: "#ffd700" }} />
                    <span className="font-black text-sm text-white uppercase tracking-wide">Bet Slip</span>
                    {bets.length > 0 && (
                        <span className="text-xs font-black px-1.5 py-0.5 rounded-full text-white" style={{ background: "#e02020" }}>
                            {bets.length}
                        </span>
                    )}
                </div>
                {collapsed ? <ChevronDown className="w-4 h-4" style={{ color: "#555578" }} />
                    : <ChevronUp className="w-4 h-4" style={{ color: "#555578" }} />}
            </div>

            {!collapsed && (
                <>
                    {bets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-2">
                            <DollarSign className="w-10 h-10" style={{ color: "#2a2a4a" }} />
                            <p className="text-sm font-semibold" style={{ color: "#444466" }}>Your bet slip is empty</p>
                            <p className="text-xs" style={{ color: "#333355" }}>Click on Back or Lay odds to add selections</p>
                        </div>
                    ) : (
                        <>
                            {/* Bet Items */}
                            <div className="flex-1 overflow-y-auto">
                                {bets.map(bet => (
                                    <div key={bet.matchId} className="p-3 border-b" style={{ borderColor: "#1e1e3a" }}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{bet.matchName}</p>
                                                <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
                                                    {bet.selection} @ <span style={{ color: "#ffd700" }}>{bet.odd}</span>
                                                </p>
                                            </div>
                                            <button onClick={() => onRemove(bet.matchId)} className="ml-2 p-1 rounded hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {/* Stake Input */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold" style={{ color: "#8888aa" }}>Stake</span>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={bet.stake}
                                                onChange={e => onStakeChange(bet.matchId, e.target.value)}
                                                className="flex-1 rounded px-2 py-1.5 text-sm font-bold text-white outline-none"
                                                style={{ background: "#1e1e3a", border: "1px solid #3a3a5a" }}
                                            />
                                        </div>
                                        {/* Potential Return */}
                                        {bet.stake && parseFloat(bet.stake) > 0 && (
                                            <p className="text-xs mt-1.5" style={{ color: "#2ecc71" }}>
                                                Potential: ৳{(parseFloat(bet.stake) * (parseFloat(bet.odd) || 1)).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Summary + Actions */}
                            <div className="p-3 space-y-2.5" style={{ borderTop: "1px solid #2a2a4a" }}>
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "#8888aa" }}>Total Stake</span>
                                    <span className="font-bold text-white">৳{totalStake.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "#8888aa" }}>Est. Return</span>
                                    <span className="font-bold" style={{ color: "#2ecc71" }}>৳{totalReturn.toFixed(2)}</span>
                                </div>

                                {error && (
                                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePlaceBets}
                                    disabled={loading || totalStake <= 0}
                                    className="w-full py-2.5 rounded-lg font-bold text-white text-sm transition-all flex items-center justify-center gap-2"
                                    style={{ background: loading || totalStake <= 0 ? "#555" : "#e02020", opacity: loading ? 0.7 : 1 }}
                                    onMouseEnter={e => { if (!loading && totalStake > 0) e.currentTarget.style.background = "#c01818" }}
                                    onMouseLeave={e => { if (!loading && totalStake > 0) e.currentTarget.style.background = "#e02020" }}>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {loading ? "Processing..." : "Place Bets"}
                                </button>
                                <button onClick={onClear} disabled={loading} className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all"
                                    style={{ color: "#555578", border: "1px solid #2a2a4a" }}
                                    onMouseEnter={e => (!loading && (e.currentTarget.style.color = "#fff"))}
                                    onMouseLeave={e => (!loading && (e.currentTarget.style.color = "#555578"))}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear All
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </aside>
    );
}
