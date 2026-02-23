"use client";

import React from "react";
import { Play, Loader2 } from "lucide-react";
import { useGames } from "@/hooks/useGames";

const GameGrid = () => {
    const { games, loading } = useGames();

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-primary-dark">
                <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full bg-primary-dark pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic tracking-tight text-white/90">LIVE <span className="text-accent-yellow">MATCHES</span></h3>
                    <button className="text-accent-yellow text-sm font-bold border-b border-accent-yellow/0 hover:border-accent-yellow transition-all pb-1">VIEW ALL</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {games.length > 0 ? games.map((game) => (
                        <div
                            key={game.id}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-white/5 border border-white/5 hover:border-accent-yellow/50 transition-all font-sans"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                <span className="text-[10px] font-black tracking-widest bg-black/40 self-start px-2 py-1 rounded text-white/70">{game.provider}</span>

                                <div>
                                    <h4 className="text-sm md:text-base font-black text-white leading-tight drop-shadow-md line-clamp-2">{game.name}</h4>
                                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider mt-1">{game.type}</p>
                                </div>
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                    <Play className="w-6 h-6 text-primary-dark fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-white/30 font-bold italic uppercase tracking-widest border-2 border-dashed border-white/5 rounded-3xl">
                            No Live Games Available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameGrid;
