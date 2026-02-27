"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const SLIDES = [
    { img: "/images/banners/welcome.png", title: "100% Welcome Bonus", sub: "Deposit ৳1,000 — Get ৳2,000 FREE on your first bet", cta: "Claim Bonus", tag: "NEW MEMBERS", tagColor: "#f5c518" },
    { img: "/images/banners/cricket.png", title: "Live Cricket Betting", sub: "Best odds on IPL · T20 World Cup · BPL", cta: "Bet Now", tag: "CRICKET", tagColor: "#22c55e" },
    { img: "/images/banners/casino.png", title: "Live Casino", sub: "Evolution · Ezugi · Pragmatic Play · 500+ Tables", cta: "Play Now", tag: "CASINO", tagColor: "#a855f7" },
    { img: "/images/banners/aviator.png", title: "Aviator", sub: "Cash out before it flies away! 1000× multiplier", cta: "Play Aviator", tag: "CRASH", tagColor: "#e8173a" },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [direction, setDir] = useState<"next" | "prev">("next");
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const go = (idx: number, dir: "next" | "prev") => {
        setPrev(current);
        setDir(dir);
        setCurrent(idx);
    };

    const next = () => go((current + 1) % SLIDES.length, "next");
    const prev_ = () => go((current - 1 + SLIDES.length) % SLIDES.length, "prev");

    useEffect(() => {
        timerRef.current = setInterval(next, 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [current]);

    const slide = SLIDES[current];

    return (
        <div style={{ position: "relative", width: "100%", overflow: "hidden", height: 240, background: "#0d0c1a" }}>
            {/* Background image */}
            <Image key={current} src={slide.img} alt={slide.title} fill
                className="object-cover" priority
                style={{ transition: "opacity 0.5s ease" }} />

            {/* Overlay — left dark, right transparent */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(10,9,20,0.92) 0%, rgba(10,9,20,0.65) 45%, rgba(10,9,20,0.1) 100%)" }} />

            {/* Content */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 32px" }}>
                <div style={{ maxWidth: 520, animation: "fade-up 0.4s ease both" }}>
                    {/* Tag */}
                    <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 800,
                        letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10,
                        background: `${slide.tagColor}22`, color: slide.tagColor,
                        border: `1px solid ${slide.tagColor}44`
                    }}>{slide.tag}</span>

                    {/* Title */}
                    <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 8, letterSpacing: -0.5 }}>
                        {slide.title}
                    </h2>

                    {/* Subtitle */}
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20, lineHeight: 1.5 }}>
                        {slide.sub}
                    </p>

                    {/* CTA */}
                    <button style={{
                        padding: "11px 26px", borderRadius: 8, border: "none",
                        background: "linear-gradient(135deg, #e8173a 0%, #c8102e 100%)",
                        color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                        boxShadow: "0 4px 20px rgba(232,23,58,0.45)", transition: "box-shadow 0.2s, transform 0.1s",
                        letterSpacing: 0.2
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(232,23,58,0.65)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(232,23,58,0.45)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                        {slide.cta}
                    </button>
                </div>
            </div>

            {/* Left / Right click zones */}
            <button onClick={prev_} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15%", zIndex: 5, background: "none", border: "none", cursor: "pointer" }} />
            <button onClick={next} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15%", zIndex: 5, background: "none", border: "none", cursor: "pointer" }} />

            {/* Slide indicators */}
            <div style={{ position: "absolute", bottom: 12, right: 20, display: "flex", gap: 5, zIndex: 10 }}>
                {SLIDES.map((_, i) => (
                    <button key={i} onClick={() => go(i, i > current ? "next" : "prev")}
                        style={{
                            width: i === current ? 24 : 6, height: 6, borderRadius: 99,
                            background: i === current ? "#e8173a" : "rgba(255,255,255,0.28)",
                            border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s"
                        }} />
                ))}
            </div>

            {/* Slide counter */}
            <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", zIndex: 10 }}>
                {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
        </div>
    );
}
