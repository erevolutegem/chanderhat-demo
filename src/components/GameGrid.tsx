"use client";

import React from "react";
import { Play, Loader2 } from "lucide-react";
import { useGames } from "@/hooks/useGames";

interface GameGridProps {
    sportId?: number;
    onSelectGame: (id: string) => void;
}

const GameGrid = ({ sportId, onSelectGame }: GameGridProps) => {
    const { games, loading, error } = useGames(sportId);

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
                {/* Error / Diagnostic Info */}
                {games.length === 0 && error && (
                    <div className="mb-6 p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-center text-xs font-bold uppercase tracking-wider">
                        Diagnostic: {error}
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic tracking-tight text-white/90">
                        {sportId ? "LIVE" : "FEATURED"} <span className="text-accent-yellow">MATCHES</span>
                    </h3>
                    <button className="text-accent-yellow text-sm font-bold border-b border-accent-yellow/0 hover:border-accent-yellow transition-all pb-1 uppercase">VIEW ALL</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {games.length > 0 ? games.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => onSelectGame(game.id.toString())}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-white/5 border border-white/5 hover:border-accent-yellow/50 transition-all font-sans"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                <div className="flex-1">
                                    {/* Provider badge removed per user request */}
                                </div>

                                <div>
                                    <h4 className="text-sm md:text-base font-black text-white leading-tight drop-shadow-md line-clamp-2">
                                        {game.name}
                                    </h4>
                                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider mt-1">
                                        {game.type}
                                    </p>

                                    {/* Odds Section */}
                                    {game.odds && game.odds.length > 0 && (
                                        <div className="flex gap-2 mt-3 pointer-events-auto">
                                            {game.odds.slice(0, 3).map((odd, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-1 bg-black/40 hover:bg-accent-yellow group/odd transition-all rounded-md py-1.5 flex flex-col items-center border border-white/5 active:scale-95 cursor-pointer"
                                                >
                                                    <span className="text-[8px] text-white/50 group-hover/odd:text-primary-dark font-bold uppercase truncate w-full text-center px-1">
                                                        {odd.name || (idx === 0 ? "1" : idx === 1 ? "X" : "2")}
                                                    </span>
                                                    <span className="text-xs font-black text-accent-yellow group-hover/odd:text-primary-dark">
                                                        {odd.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                            {error ? "Unable to load live data" : "No Live Games Currently Available"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameGrid;
