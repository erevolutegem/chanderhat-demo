"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
    { id: 1, color: "bg-gradient-to-r from-indigo-900 to-accent-blue", title: "IPL 2024 SPECIAL", desc: "Get 100% Welcome Bonus on Cricket!" },
    { id: 2, color: "bg-gradient-to-r from-accent-red to-orange-600", title: "CASINO ROYALE", desc: "Live Dealer Games with High Stakes" },
    { id: 3, color: "bg-gradient-to-r from-emerald-800 to-teal-600", title: "SLOT MANIA", desc: "Spin to Win Jumbo Jackpots Every Day" },
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden group">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 flex items-center px-6 md:px-24 ${index === current ? "opacity-100" : "opacity-0"}`}
                >
                    <div className={`absolute inset-0 ${banner.color} opacity-90`} />
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic text-white tracking-tight leading-tight">
                            {banner.title}
                        </h2>
                        <p className="text-base md:text-xl text-white/80 font-medium max-w-xs md:max-w-none">
                            {banner.desc}
                        </p>
                        <button className="bg-accent-yellow hover:bg-yellow-500 text-primary-dark font-black px-6 md:px-8 py-2 md:py-3 rounded-full transition-all hover:scale-105 shadow-xl text-xs md:text-sm uppercase">
                            Join Now
                        </button>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-accent-yellow w-6" : "bg-white/30"}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
