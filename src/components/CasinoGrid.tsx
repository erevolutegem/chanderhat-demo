"use client";
import React from 'react';
import Image from 'next/image';

interface CasinoGame {
    id: string;
    name: string;
    image: string; // The full cover path
}

export default function CasinoGrid({ title, games }: { title: string, games: CasinoGame[] }) {
    return (
        <section className="mt-8">
            <h2 className="text-white text-[18px] lg:text-[20px] font-black mb-4 uppercase tracking-tight flex items-center gap-2">
                <div className="w-[4px] h-[18px] bg-[var(--primary)] rounded-full"></div>
                {title}
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden group cursor-pointer border border-[var(--border)]"
                    >
                        {/* Background Image (Placholder fallback for now) */}
                        <div className="absolute inset-0 bg-slate-800">
                            {/* <Image src={game.image} fill alt={game.name} className="object-cover group-hover:scale-105 transition-transform duration-300" /> */}
                            {/* Simple colored block to mock game art */}
                            <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center p-4 text-center">
                                <span className="text-white/20 font-black text-2xl">{game.name}</span>
                            </div>
                        </div>

                        {/* Playbaji Bottom Overlay Strip */}
                        <div className="absolute bottom-0 left-0 right-0 h-[36px] bg-black/80 backdrop-blur-sm flex items-center justify-between pl-3 pr-0 border-t border-[var(--border)] group-hover:bg-black transition-colors">
                            {/* Game Name */}
                            <span className="text-white text-[12px] md:text-[14px] font-bold truncate pr-2">
                                {game.name}
                            </span>

                            {/* Slanted "Play Now" Button matching Playbaji */}
                            <div className="h-full bg-[var(--custom-purple)] flex items-center justify-center px-3"
                                style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
                            >
                                <span className="text-white text-[11px] font-bold uppercase tracking-wide ml-1">Play Now</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
