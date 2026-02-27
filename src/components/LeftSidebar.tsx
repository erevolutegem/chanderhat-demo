"use client";
import React from "react";
import { Activity, Trophy, Star, TrendingUp } from "lucide-react";

const SPORTS = [
    { id: undefined, label: "All Sports", icon: "⚡", color: "#e8173a" },
    { id: 3, label: "Cricket", icon: "🏏", color: "#22c55e" },
    { id: 1, label: "Soccer", icon: "⚽", color: "#3b82f6" },
    { id: 13, label: "Tennis", icon: "🎾", color: "#f59e0b" },
    { id: 18, label: "Basketball", icon: "🏀", color: "#f97316" },
    { id: 12, label: "Am. Football", icon: "🏈", color: "#8b5cf6" },
    { id: 4, label: "Ice Hockey", icon: "🏒", color: "#0ea5e9" },
];

interface Props {
    selectedSport: number | undefined;
    onSelectSport: (id: number | undefined) => void;
    matchCounts: Record<string, number>;
}

export default function LeftSidebar({ selectedSport, onSelectSport, matchCounts }: Props) {
    const totalLive = Object.values(matchCounts).reduce((a, b) => a + b, 0);

    return (
        <aside style={{
            width: 210, flexShrink: 0, display: "flex", flexDirection: "column",
            background: "#131220", borderRight: "1px solid #2d2c45", minHeight: "calc(100vh - 98px)"
        }}
            className="hidden lg:flex">

            {/* ── Section label ── */}
            <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #2d2c45", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#e8173a", letterSpacing: 1.5, textTransform: "uppercase" }}>Live</span>
                </div>
                {totalLive > 0 && (
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#9997b8" }}>
                        {totalLive} matches
                    </span>
                )}
            </div>

            {/* ── In-Play sport list ── */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0" }} className="scrollbar-hide">
                {SPORTS.map(sport => {
                    const count = sport.id !== undefined
                        ? (matchCounts[String(sport.id)] ?? 0)
                        : totalLive;
                    const active = selectedSport === sport.id;

                    return (
                        <button key={String(sport.id)}
                            onClick={() => onSelectSport(sport.id)}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 14px", border: "none", cursor: "pointer", textAlign: "left",
                                borderLeft: `3px solid ${active ? sport.color : "transparent"}`,
                                background: active ? `${sport.color}12` : "transparent",
                                transition: "background 0.15s, border-color 0.15s",
                            }}
                            onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "#1a192a"; } }}
                            onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
                        >
                            {/* Icon */}
                            <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>{sport.icon}</span>

                            {/* Label */}
                            <span style={{
                                flex: 1, fontSize: 13, fontWeight: active ? 700 : 500,
                                color: active ? "#fff" : "#9997b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                transition: "color 0.15s"
                            }}>{sport.label}</span>

                            {/* Count badge */}
                            {count > 0 && (
                                <span style={{
                                    fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 99, flexShrink: 0,
                                    background: active ? sport.color : "#2d2c45",
                                    color: active ? "#fff" : "#9997b8"
                                }}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* ─── Divider ─── */}
            <div style={{ borderTop: "1px solid #2d2c45" }} />

            {/* ─── Quick Links ─── */}
            <div style={{ padding: "8px 0" }}>
                {[
                    { icon: Trophy, label: "My Bets", color: "#f5c518" },
                    { icon: TrendingUp, label: "Results", color: "#22c55e" },
                    { icon: Star, label: "Favourites", color: "#a855f7" },
                ].map(({ icon: Icon, label, color }) => (
                    <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#1a192a")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                        <Icon size={14} color={color} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#9997b8" }}>{label}</span>
                    </button>
                ))}
            </div>

            {/* ─── Promo widget ─── */}
            <div style={{ padding: "12px", borderTop: "1px solid #2d2c45" }}>
                <div style={{
                    borderRadius: 10, padding: "14px 12px", textAlign: "center",
                    background: "linear-gradient(135deg,#1a192a 0%,#221d3a 100%)",
                    border: "1px solid #3d3c58", position: "relative", overflow: "hidden"
                }}>
                    {/* Glow accent */}
                    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(232,23,58,0.15)", filter: "blur(20px)" }} />
                    <div style={{ fontSize: 22, marginBottom: 4 }}>🎁</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 2 }}>Welcome Bonus</div>
                    <div style={{ fontSize: 11, color: "#9997b8", marginBottom: 10 }}>Up to <span style={{ color: "#f5c518", fontWeight: 700 }}>৳10,000</span></div>
                    <button style={{
                        width: "100%", padding: "8px 0", borderRadius: 6, border: "none",
                        background: "linear-gradient(135deg,#f5c518,#c9a012)", color: "#000", fontWeight: 800, fontSize: 12, cursor: "pointer"
                    }}>
                        Claim Now →
                    </button>
                </div>
            </div>
        </aside>
    );
}
