"use client";

import React, { useState, useEffect } from "react";
import { X, Trophy, Activity, Clock, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameDetailModalProps {
    gameId: string | null;
    onClose: () => void;
}

const GameDetailModal = ({ gameId, onClose }: GameDetailModalProps) => {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;

        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.chanderhat.com';
                const response = await fetch(`${apiUrl}/games/details/${gameId}`);
                if (!response.ok) throw new Error("Failed to fetch match details");
                const data = await response.json();

                if (data && data.success && data.results) {
                    setDetails(data.results[0]);
                } else {
                    setError("Details not available for this event");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [gameId]);

    if (!gameId) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-accent-yellow/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-accent-yellow animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-tighter text-white/40 italic">Live Match Center</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-accent-yellow animate-spin" />
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Loading Live Data...</p>
                        </div>
                    ) : error ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <p className="text-accent-red font-black uppercase mb-2">Match View Unavailable</p>
                            <p className="text-white/40 text-xs">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Scorecast */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-red rounded-full text-[10px] font-black italic">
                                        <Play className="w-3 h-3 fill-current" /> LIVE
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1 text-center group">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-900 rounded-full mb-4 flex items-center justify-center text-3xl font-black shadow-lg group-hover:scale-110 transition-transform">
                                            {details?.extra?.home_score || "0"}
                                        </div>
                                        <p className="text-sm font-black text-white line-clamp-1">{details?.home?.name || "Home"}</p>
                                    </div>

                                    <div className="px-6 flex flex-col items-center gap-2">
                                        <span className="text-3xl font-black text-white/10">VS</span>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                            <Clock className="w-3 h-3 text-accent-yellow" />
                                            <span className="text-[10px] font-black text-accent-yellow">{details?.timer || "00:00"}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center group">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-600 to-purple-900 rounded-full mb-4 flex items-center justify-center text-3xl font-black shadow-lg group-hover:scale-110 transition-transform">
                                            {details?.extra?.away_score || "0"}
                                        </div>
                                        <p className="text-sm font-black text-white line-clamp-1">{details?.away?.name || "Away"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Markets from API */}
                            <div className="space-y-6">
                                {details && Array.isArray(details) ? (
                                    (() => {
                                        const markets: any[] = [];
                                        let currentMA: any = null;

                                        details.forEach((item: any) => {
                                            if (item.type === 'MA') {
                                                currentMA = { name: item.NA, odds: [] };
                                                markets.push(currentMA);
                                            } else if (item.type === 'PA' && currentMA) {
                                                currentMA.odds.push({ label: item.NA, value: item.OD });
                                            }
                                        });

                                        return markets.slice(0, 5).map((m, idx) => (
                                            <div key={idx} className="space-y-3">
                                                <h5 className="text-[10px] font-black uppercase text-white/30 tracking-widest">{m.name}</h5>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {m.odds.map((o: any, oIdx: number) => (
                                                        <div key={oIdx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between hover:border-accent-yellow/30 transition-colors group cursor-pointer">
                                                            <span className="text-[10px] font-bold text-white/60 group-hover:text-white">{o.label}</span>
                                                            <span className="text-[10px] font-black text-accent-yellow">{o.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ));
                                    })()
                                ) : (
                                    <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase text-white/20">Waiting for live markets...</p>
                                    </div>
                                )}
                            </div>

                            <button className="w-full py-4 bg-accent-yellow text-primary-dark font-black rounded-xl uppercase tracking-tighter hover:bg-yellow-400 active:scale-95 transition-all shadow-xl shadow-accent-yellow/10">
                                Place Live Bet Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetailModal;
