"use client";

import React from "react";
import { Trophy, Dribbble, Ghost, Target, Play, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
    { name: "Sports", icon: Dribbble, live: 12, color: "text-accent-blue" },
    { name: "Casino", icon: Trophy, live: 5, color: "text-accent-yellow" },
    { name: "Live", icon: Flame, live: 24, color: "text-accent-red" },
    { name: "Virtual", icon: Ghost, live: 0, color: "text-purple-400" },
    { name: "Table", icon: Target, live: 3, color: "text-emerald-400" },
    { name: "Slots", icon: Play, live: 15, color: "text-orange-400" },
];

const GameMenu = () => {
    return (
        <div className="w-full bg-primary-dark py-6 px-4">
            <div className="max-w-7xl mx-auto flex overflow-x-auto gap-4 scrollbar-hide">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="flex-shrink-0 min-w-[120px] bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-accent-yellow/30 transition-all group"
                    >
                        <div className={cn("p-3 rounded-full bg-white/5 group-hover:scale-110 transition-all", cat.color)}>
                            <cat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-white/80 group-hover:text-white">{cat.name}</span>
                        {cat.live > 0 && (
                            <span className="text-[10px] bg-accent-red text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                                {cat.live} LIVE
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameMenu;
