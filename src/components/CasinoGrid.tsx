"use client";
import React from "react";
import Image from "next/image";

const GAMES = [
    { id: "sports", title: "Sports", img: "/images/casino/sports.webp", tag: "HOT", badge: "🏆" },
    { id: "aviator", title: "Aviator", img: "/images/casino/aviator.webp", tag: "CRASH", badge: "✈️" },
    { id: "evolution", title: "Evolution Gaming", img: "/images/casino/evolution.webp", tag: "LIVE", badge: "🎰" },
    { id: "jili", title: "Jili Games", img: "/images/casino/jili.webp", tag: "SLOTS", badge: "🎮" },
    { id: "pragmatic", title: "Pragmatic Play", img: "/images/casino/pragmatic.webp", tag: "SLOTS", badge: "🎯" },
    { id: "sexy", title: "AE Sexy", img: "/images/casino/sexy.webp", tag: "LIVE", badge: "🃏" },
    { id: "ezugi", title: "Ezugi Casino", img: "/images/casino/ezugi.webp", tag: "LIVE", badge: "♠️" },
    { id: "saba", title: "Saba Sports", img: "/images/casino/saba.webp", tag: "SPORTS", badge: "⚽" },
    { id: "slots", title: "Slot Games", img: "/images/casino/slots.webp", tag: "SLOTS", badge: "🎰" },
    { id: "newking", title: "New King", img: "/images/casino/newking.webp", tag: "NEW", badge: "👑" },
    { id: "horseracing", title: "Horse Racing", img: "/images/casino/horseracing.webp", tag: "RACING", badge: "🐎" },
];

const TAG_COLORS: Record<string, string> = {
    HOT: "#e02020",
    CRASH: "#ff6600",
    LIVE: "#2ecc71",
    SLOTS: "#9b59b6",
    SPORTS: "#3498db",
    NEW: "#ffd700",
    RACING: "#e67e22",
};

export default function CasinoGrid() {
    return (
        <section className="py-4 px-3">
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full" style={{ background: "#e02020" }} />
                    <h2 className="font-black text-white text-base">Casino & Games</h2>
                </div>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                    style={{ background: "#1e1e3a", color: "#7777aa", border: "1px solid #2a2a4a" }}>
                    View All
                </button>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {GAMES.map(game => (
                    <button key={game.id}
                        className="group relative rounded-xl overflow-hidden aspect-[3/4] transition-all hover:scale-105 hover:shadow-2xl focus:outline-none"
                        style={{ border: "1px solid #2a2a4a" }}>
                        <Image
                            src={game.img}
                            alt={game.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                            style={{ background: "rgba(0,0,0,0.7)" }}>
                            <div className="text-2xl">{game.badge}</div>
                            <span className="text-xs font-black text-white px-2.5 py-1 rounded-full"
                                style={{ background: "#e02020" }}>PLAY NOW</span>
                        </div>
                        {/* Tag badge */}
                        <div className="absolute top-1.5 left-1.5">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm text-white"
                                style={{ background: TAG_COLORS[game.tag] ?? "#e02020" }}>
                                {game.tag}
                            </span>
                        </div>
                        {/* Title at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
                            <p className="text-[10px] font-bold text-white truncate">{game.title}</p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
