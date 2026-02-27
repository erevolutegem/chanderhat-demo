"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
    {
        img: "/images/banners/welcome.png",
        title: "100% Welcome Bonus",
        sub: "Deposit ৳1,000 — Get ৳2,000 FREE",
        cta: "Claim Now",
        tag: "🎁 NEW MEMBER",
    },
    {
        img: "/images/banners/cricket.png",
        title: "Live Cricket Betting",
        sub: "Best odds on IPL & T20 World Cup",
        cta: "Bet Now",
        tag: "🏏 HOT",
    },
    {
        img: "/images/banners/casino.png",
        title: "Live Casino",
        sub: "Evolution Gaming · Ezugi · Pragmatic Play",
        cta: "Play Now",
        tag: "🎲 CASINO",
    },
    {
        img: "/images/banners/aviator.png",
        title: "Aviator",
        sub: "Cash out before it flies away!",
        cta: "Play Aviator",
        tag: "✈️ CRASH",
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);

    // Auto-slide every 4s
    useEffect(() => {
        const iv = setInterval(() => setCurrent(v => (v + 1) % SLIDES.length), 4000);
        return () => clearInterval(iv);
    }, []);

    const slide = SLIDES[current];

    return (
        <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
            {/* Image */}
            <Image
                key={current}
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority
                style={{ transition: "opacity 0.4s ease" }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />

            {/* Content */}
            <div className="absolute inset-0 flex items-center px-6 md:px-12">
                <div>
                    <span className="inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full mb-2"
                        style={{ background: "rgba(255,215,0,0.18)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.3)" }}>
                        {slide.tag}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">{slide.title}</h2>
                    <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>{slide.sub}</p>
                    <button className="px-5 py-2 rounded-lg text-sm font-black text-white transition-all hover:scale-105"
                        style={{ background: "#e02020" }}>
                        {slide.cta}
                    </button>
                </div>
            </div>

            {/* Prev / Next (invisible click zones) */}
            <button className="absolute left-0 top-0 bottom-0 w-1/4 z-10" onClick={() => setCurrent((current - 1 + SLIDES.length) % SLIDES.length)} />
            <button className="absolute right-0 top-0 bottom-0 w-1/4 z-10" onClick={() => setCurrent((current + 1) % SLIDES.length)} />

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className="rounded-full transition-all"
                        style={{ width: i === current ? 22 : 6, height: 6, background: i === current ? "#e02020" : "rgba(255,255,255,0.35)" }} />
                ))}
            </div>
        </div>
    );
}
