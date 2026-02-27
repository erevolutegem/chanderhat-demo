"use client";
import React from "react";
import { Star, ChevronRight, Activity } from "lucide-react";

const SPORTS = [
    { id: undefined, icon: "🏠", label: "All Sports", suffix: "" },
    { id: 3, icon: "🏏", label: "Cricket", suffix: "" },
    { id: 1, icon: "⚽", label: "Soccer", suffix: "" },
    { id: 13, icon: "🎾", label: "Tennis", suffix: "" },
    { id: 18, icon: "🏀", label: "Basketball", suffix: "" },
    { id: 12, icon: "🏈", label: "American Football", suffix: "" },
    { id: 4, icon: "🏒", label: "Ice Hockey", suffix: "" },
];

interface Props {
    selectedSport: number | undefined;
    onSelectSport: (id: number | undefined) => void;
    matchCounts: Record<string, number>;
}

export default function LeftSidebar({ selectedSport, onSelectSport, matchCounts }: Props) {
    return (
        <aside className="w-[200px] xl:w-[220px] flex-shrink-0 hidden lg:flex flex-col"
            style={{ background: "#12122a", borderRight: "1px solid #2a2a4a", minHeight: "calc(100vh - 112px)" }}>
            {/* Header */}
            <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid #2a2a4a" }}>
                <Activity className="w-4 h-4" style={{ color: "#e02020" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#ffd700" }}>In-Play</span>
            </div>

            {/* Sport List */}
            <nav className="flex-1 overflow-y-auto">
                {SPORTS.map((sport) => {
                    const count = sport.id !== undefined ? (matchCounts[String(sport.id)] ?? 0) : Object.values(matchCounts).reduce((a, b) => a + b, 0);
                    const isActive = selectedSport === sport.id;

                    return (
                        <button
                            key={String(sport.id)}
                            onClick={() => onSelectSport(sport.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all group"
                            style={{
                                background: isActive ? "rgba(224,32,32,0.12)" : "transparent",
                                borderLeft: isActive ? "3px solid #e02020" : "3px solid transparent",
                                borderBottom: "1px solid #1e1e3a",
                            }}
                        >
                            <span className="text-base flex-shrink-0">{sport.icon}</span>
                            <span className="flex-1 text-sm font-semibold truncate" style={{ color: isActive ? "#fff" : "#9999bb" }}>
                                {sport.label}
                            </span>
                            {count > 0 && (
                                <span className="text-xs font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                                    style={{ background: isActive ? "#e02020" : "#2a2a4a", color: "#fff" }}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Promo Widget */}
            <div className="p-3" style={{ borderTop: "1px solid #2a2a4a" }}>
                <div className="rounded-lg p-3 text-center" style={{ background: "linear-gradient(135deg, #e02020 0%, #8b0000 100%)" }}>
                    <div className="text-yellow-400 font-black text-sm mb-1">🎁 Welcome Bonus</div>
                    <div className="text-white text-[11px]">Up to ৳10,000</div>
                    <button className="mt-2 w-full py-1.5 rounded text-xs font-bold bg-yellow-400 text-black">Claim Now</button>
                </div>
            </div>
        </aside>
    );
}
