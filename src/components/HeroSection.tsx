"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
    { title: "Welcome Bonus", sub: "100% up to ৳10,000", cta: "Claim Now", tag: "NEW MEMBER", bg: "linear-gradient(135deg, #1a0030 0%, #3c096c 50%, #e02020 100%)" },
    { title: "Live Sports Betting", sub: "Real-time odds on 500+ events", cta: "Bet Now", tag: "LIVE", bg: "linear-gradient(135deg, #000428 0%, #004e92 100%)" },
    { title: "Cricket Special", sub: "Best odds on IPL & International", cta: "View Matches", tag: "🏏 HOT", bg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
    { title: "Casino Games", sub: "Slots, Live Casino, Roulette", cta: "Play Now", tag: "CASINO", bg: "linear-gradient(135deg, #4a1942 0%, #c05c7e 100%)" },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);

    return (
        <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
            {/* Slide */}
            <div className="absolute inset-0 transition-all duration-500" style={{ background: SLIDES[current].bg }}>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="relative flex items-center h-full px-6 md:px-12">
                    <div className="animate-[fade-up_0.3s_ease]">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black mb-2"
                            style={{ background: "rgba(255,215,0,0.2)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.3)" }}>
                            {SLIDES[current].tag}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">{SLIDES[current].title}</h2>
                        <p className="text-sm md:text-base mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>{SLIDES[current].sub}</p>
                        <button className="px-5 py-2 rounded-lg text-sm font-black text-white transition-transform hover:scale-105"
                            style={{ background: "#e02020" }}>
                            {SLIDES[current].cta}
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button onClick={() => setCurrent((current - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-all z-10">
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrent((current + 1) % SLIDES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-all z-10">
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className="rounded-full transition-all"
                        style={{ width: i === current ? 20 : 6, height: 6, background: i === current ? "#e02020" : "rgba(255,255,255,0.3)" }} />
                ))}
            </div>
        </div>
    );
}
