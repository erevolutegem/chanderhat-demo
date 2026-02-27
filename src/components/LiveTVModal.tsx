"use client";
import React, { useState, useEffect } from "react";
import { X, Tv, Wifi, WifiOff, Volume2, VolumeX, Maximize2, RefreshCw } from "lucide-react";

// Sport-specific YouTube live stream channel IDs / search queries
const SPORT_STREAMS: Record<string, { label: string; channels: { name: string; videoId: string }[] }> = {
    "3": {
        label: "Cricket",
        channels: [
            { name: "Star Sports Live", videoId: "coGknt1Qf2E" },
            { name: "Cricbuzz Live", videoId: "IYZ_cHg2mw4" },
            { name: "Cricket Commentary", videoId: "Tv4GGp9BL4Y" },
        ]
    },
    "1": {
        label: "Soccer / Football",
        channels: [
            { name: "Sports Live HD", videoId: "1cJkCnGGWX8" },
            { name: "Football Central", videoId: "Xm6G9bZHN90" },
        ]
    },
    "13": {
        label: "Tennis",
        channels: [
            { name: "Tennis Live", videoId: "lPJqalMO6LY" },
        ]
    },
    "18": {
        label: "Basketball",
        channels: [
            { name: "Basketball Stream", videoId: "wBjQ-ser2l0" },
        ]
    },
};

const DEFAULT_STREAM = { name: "Sports Live", videoId: "coGknt1Qf2E" };

interface Props {
    matchId: string;
    home: string;
    away: string;
    sportId: string;
    league: string;
    ss?: string | null;
    timer?: string | null;
    onClose: () => void;
}

export default function LiveTVModal({ matchId, home, away, sportId, league, ss, timer, onClose }: Props) {
    const sportData = SPORT_STREAMS[sportId] ?? { label: "Sports", channels: [DEFAULT_STREAM] };
    const [chanIdx, setChanIdx] = useState(0);
    const [muted, setMuted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(ss);
    const [elapsed, setElapsed] = useState(timer);

    const channel = sportData.channels[chanIdx] ?? DEFAULT_STREAM;

    // Refresh score every 10s
    useEffect(() => {
        const iv = setInterval(async () => {
            try {
                const r = await fetch(`/api/games/${encodeURIComponent(matchId)}`, { cache: "no-store" });
                const d = await r.json();
                if (d.success && d.match) {
                    setScore(d.match.ss);
                    setElapsed(d.match.timer);
                }
            } catch { }
        }, 10_000);
        return () => clearInterval(iv);
    }, [matchId]);

    const [hs, as_] = (score ?? "").split("-").map(s => s.trim());
    const hWin = hs && as_ && Number(hs) > Number(as_);
    const aWin = hs && as_ && Number(as_) > Number(hs);

    const iframeUrl = `https://www.youtube-nocookie.com/embed/${channel.videoId}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&showinfo=0`;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            {/* Backdrop */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)" }} onClick={onClose} />

            {/* Modal */}
            <div style={{
                position: "relative", width: "100%", maxWidth: 820, borderRadius: 16, overflow: "hidden",
                background: "#0d0d1a", border: "1px solid #2a2a4a", boxShadow: "0 25px 80px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", maxHeight: "90vh"
            }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#1e1e3a", borderBottom: "1px solid #2a2a4a", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Tv size={16} color="#e02020" />
                        <span style={{ fontWeight: 900, color: "#fff", fontSize: 13 }}>LIVE TV</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: "rgba(224,32,32,0.15)", border: "1px solid rgba(224,32,32,0.3)", color: "#e02020", fontSize: 11, fontWeight: 700 }}>
                            <span className="live-dot" /> LIVE
                        </span>
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span style={{ color: "#9999bb", fontSize: 12 }}>{league}</span>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#555578", cursor: "pointer" }}><X size={20} /></button>
                </div>

                {/* Live Score Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", background: "linear-gradient(135deg, #1a1a3e 0%, #16163a 100%)", borderBottom: "1px solid #2a2a4a", gap: 20, flexShrink: 0 }}>
                    <div style={{ flex: 1, textAlign: "right" }}>
                        <p style={{ fontWeight: 900, fontSize: 15, color: hWin ? "#fff" : "#9999bb" }}>{home}</p>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 90 }}>
                        {score ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 28, fontWeight: 900, color: hWin ? "#ffd700" : "#fff" }}>{hs}</span>
                                <span style={{ fontSize: 20, fontWeight: 900, color: "#444466" }}>–</span>
                                <span style={{ fontSize: 28, fontWeight: 900, color: aWin ? "#ffd700" : "#fff" }}>{as_}</span>
                            </div>
                        ) : (
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#444466" }}>vs</span>
                        )}
                        {elapsed && <p style={{ fontSize: 11, color: "#e02020", fontWeight: 700, marginTop: 2 }}>⏱ {elapsed}'</p>}
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                        <p style={{ fontWeight: 900, fontSize: 15, color: aWin ? "#fff" : "#9999bb" }}>{away}</p>
                    </div>
                </div>

                {/* Video Player */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000", flexShrink: 0 }}>
                    {loading && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#050510", zIndex: 1 }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid #2a2a4a", borderTop: "3px solid #e02020", animation: "spin 1s linear infinite" }} />
                            <p style={{ color: "#555578", fontSize: 13 }}>Loading stream…</p>
                        </div>
                    )}
                    <iframe
                        src={iframeUrl}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={`Live: ${home} vs ${away}`}
                        onLoad={() => setLoading(false)}
                    />
                </div>

                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#1e1e3a", flexShrink: 0 }}>
                    {/* Channel selector */}
                    <div style={{ display: "flex", gap: 6, flex: 1, overflow: "hidden" }}>
                        {sportData.channels.map((ch, i) => (
                            <button key={i} onClick={() => { setChanIdx(i); setLoading(true); }}
                                style={{
                                    padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: "1px solid", cursor: "pointer", flexShrink: 0,
                                    background: chanIdx === i ? "rgba(224,32,32,0.15)" : "transparent",
                                    borderColor: chanIdx === i ? "#e02020" : "#2a2a4a",
                                    color: chanIdx === i ? "#e02020" : "#7777aa"
                                }}>
                                {ch.name}
                            </button>
                        ))}
                    </div>
                    {/* Mute / fullscreen */}
                    <button onClick={() => setMuted(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: muted ? "#e02020" : "#9999bb" }}>
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>

                {/* Notice */}
                <div style={{ padding: "8px 16px", background: "#0d0d1a", borderTop: "1px solid #1a1a32" }}>
                    <p style={{ fontSize: 10, color: "#333355", textAlign: "center" }}>
                        Streams are provided by third-party sources. Score auto-updates every 10 seconds.
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
