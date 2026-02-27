"use client";
import React, { useState, useEffect } from "react";
import { X, Tv, Volume2, VolumeX, RefreshCw } from "lucide-react";

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

type StreamState =
    | { status: "loading" }
    | { status: "live"; url: string; type: string }
    | { status: "unavailable" };

export default function LiveTVModal({
    matchId, home, away, sportId, league, ss, timer, onClose
}: Props) {
    const [stream, setStream] = useState<StreamState>({ status: "loading" });
    const [score, setScore] = useState(ss);
    const [elapsed, setElapsed] = useState(timer);
    const [muted, setMuted] = useState(false);

    /* Fetch stream URL from BetsAPI via our proxy */
    const loadStream = async () => {
        setStream({ status: "loading" });
        try {
            const r = await fetch(`/api/stream/${encodeURIComponent(matchId)}`, { cache: "no-store" });
            const d = await r.json();
            if (d.available && d.url) {
                setStream({ status: "live", url: d.url, type: d.type ?? "iframe" });
            } else {
                setStream({ status: "unavailable" });
            }
        } catch {
            setStream({ status: "unavailable" });
        }
    };

    useEffect(() => { loadStream(); }, [matchId]);

    /* Score auto-update every 10s */
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

    // Append mute param if URL is an iframe embed
    const iframeUrl = stream.status === "live"
        ? (stream.url + (muted ? (stream.url.includes("?") ? "&mute=1" : "?mute=1") : ""))
        : null;

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
                    {stream.status === "live" && (
                        <button onClick={() => setMuted(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: muted ? "#e02020" : "#9999bb" }}>
                            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    )}
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#555578", cursor: "pointer" }}><X size={20} /></button>
                </div>

                {/* Live Score Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", background: "linear-gradient(135deg,#1a1a3e 0%,#16163a 100%)", borderBottom: "1px solid #2a2a4a", gap: 20, flexShrink: 0 }}>
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

                {/* Stream area */}
                <div style={{ flexShrink: 0 }}>
                    {stream.status === "loading" && (
                        <div style={{ width: "100%", aspectRatio: "16/9", background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                            <div style={{ width: 50, height: 50, borderRadius: "50%", border: "3px solid #2a2a4a", borderTop: "3px solid #e02020", animation: "spin 1s linear infinite" }} />
                            <p style={{ color: "#555578", fontSize: 13 }}>Checking stream…</p>
                        </div>
                    )}

                    {stream.status === "unavailable" && (
                        <div style={{ width: "100%", aspectRatio: "16/9", background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                            {/* Clean "no stream" placeholder — no broken video */}
                            <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#1e1e3a", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #2a2a4a" }}>
                                <Tv size={32} color="#333355" />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontWeight: 700, color: "#555588", fontSize: 14, marginBottom: 6 }}>Stream not available</p>
                                <p style={{ color: "#333355", fontSize: 12 }}>Live stream for this match is not provided by the broadcaster</p>
                            </div>
                            <button onClick={loadStream}
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "#1e1e3a", border: "1px solid #2a2a4a", color: "#7777aa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                                <RefreshCw size={13} /> Try again
                            </button>
                        </div>
                    )}

                    {stream.status === "live" && iframeUrl && (
                        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                            <iframe
                                key={iframeUrl}
                                src={iframeUrl}
                                style={{ width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={`${home} vs ${away}`}
                            />
                        </div>
                    )}
                </div>

                {/* Footer note */}
                <div style={{ padding: "8px 16px", background: "#0d0d1a", borderTop: "1px solid #1a1a32", flexShrink: 0 }}>
                    <p style={{ fontSize: 10, color: "#333355", textAlign: "center" }}>
                        Live stream provided by Bet365 via BetsAPI · Score updates every 10 seconds
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
