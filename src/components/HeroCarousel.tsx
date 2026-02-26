"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";

const BANNERS = [
    {
        id: 1,
        bg: "linear-gradient(135deg, #1e3a2f 0%, #0f2d20 100%)",
        accent: "#22c55e",
        tag: "🎁 Welcome Offer",
        title: "100% Deposit Bonus",
        desc: "Get up to ৳5,000 on your first deposit. Play cricket, soccer & more.",
        cta: "Claim Bonus",
    },
    {
        id: 2,
        bg: "linear-gradient(135deg, #1e2a3a 0%, #0f1d2d 100%)",
        accent: "#3b82f6",
        tag: "🏏 Cricket Special",
        title: "Live IPL Betting",
        desc: "Best odds on every IPL match. In-play & early markets available.",
        cta: "Bet Now",
    },
    {
        id: 3,
        bg: "linear-gradient(135deg, #2d1e3a 0%, #1d0f2d 100%)",
        accent: "#a855f7",
        tag: "🎰 Casino",
        title: "Live Casino Tables",
        desc: "Play with real dealers 24/7. Blackjack, Roulette, Baccarat & more.",
        cta: "Play Live",
    },
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setCurrent((p) => (p + 1) % BANNERS.length), 5500);
        return () => clearInterval(t);
    }, []);

    const prev = () => setCurrent((p) => (p - 1 + BANNERS.length) % BANNERS.length);
    const next = () => setCurrent((p) => (p + 1) % BANNERS.length);

    return (
        <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
            {BANNERS.map((b, i) => (
                <div
                    key={b.id}
                    className="absolute inset-0 transition-opacity duration-700 px-6 md:px-12 flex items-center"
                    style={{
                        background: b.bg,
                        opacity: i === current ? 1 : 0,
                        pointerEvents: i === current ? "auto" : "none",
                    }}
                >
                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,.3) 24px, rgba(255,255,255,.3) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,.3) 24px, rgba(255,255,255,.3) 25px)"
                    }} />

                    <div className="relative z-10 max-w-lg space-y-3">
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={{ background: b.accent + "22", color: b.accent }}>
                            {b.tag}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                            {b.title}
                        </h2>
                        <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                            {b.desc}
                        </p>
                        <button
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                            style={{ background: b.accent }}
                        >
                            {b.cta}
                        </button>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all">
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: i === current ? "24px" : "6px", background: i === current ? "#22c55e" : "rgba(255,255,255,0.3)" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
