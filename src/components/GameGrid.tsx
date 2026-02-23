import React from "react";
import { Play } from "lucide-react";

const games = [
    { id: 1, provider: "JILI", name: "Super Ace", type: "Slot", color: "from-blue-600 to-indigo-900" },
    { id: 2, provider: "AE SEXY", name: "Baccarat", type: "Live", color: "from-pink-600 to-purple-900" },
    { id: 3, provider: "EVOLUTION", name: "Crazy Time", type: "Live", color: "from-accent-red to-orange-900" },
    { id: 4, provider: "PRAGMATIC", name: "Gates of Olympus", type: "Slot", color: "from-yellow-600 to-amber-900" },
    { id: 5, provider: "PG SOFT", name: "Fortune Tiger", type: "Slot", color: "from-emerald-600 to-green-900" },
    { id: 6, provider: "KINGMAKER", name: "Thai Fish", type: "Table", color: "from-cyan-600 to-blue-900" },
    { id: 7, provider: "SPADEGAMING", name: "Fishing", type: "Slot", color: "from-orange-600 to-red-900" },
    { id: 8, provider: "FA CHAI", name: "Golden Empire", type: "Slot", color: "from-violet-600 to-purple-900" },
];

const GameGrid = () => {
    return (
        <div className="w-full bg-primary-dark pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic tracking-tight text-white/90">FEATURED <span className="text-accent-yellow">GAMES</span></h3>
                    <button className="text-accent-yellow text-sm font-bold border-b border-accent-yellow/0 hover:border-accent-yellow transition-all pb-1">VIEW ALL</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-white/5 border border-white/5 hover:border-accent-yellow/50 transition-all"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                <span className="text-[10px] font-black tracking-widest bg-black/40 self-start px-2 py-1 rounded text-white/70">{game.provider}</span>

                                <div>
                                    <h4 className="text-lg font-black text-white leading-tight drop-shadow-md">{game.name}</h4>
                                    <p className="text-xs text-white/60 font-medium">{game.type}</p>
                                </div>
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                    <Play className="w-6 h-6 text-primary-dark fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameGrid;
