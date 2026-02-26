"use client";

import React from "react";
import { Trophy, Dribbble, Ghost, Target, Play, Flame, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
    { name: "All", id: undefined, icon: Flame, color: "text-red-400" },
    { name: "Soccer", id: 1, icon: Dribbble, color: "text-blue-400" },
    { name: "Tennis", id: 13, icon: Target, color: "text-emerald-400" },
    { name: "Basketball", id: 18, icon: Play, color: "text-orange-400" },
    { name: "American Football", id: 12, icon: Trophy, color: "text-yellow-400" },
    { name: "Cricket", id: 3, icon: Flame, color: "text-red-400" },
];

interface GameMenuProps {
    onSelectSport: (id: number | undefined) => void;
    selectedSport: number | undefined;
}

const GameMenu = ({ onSelectSport, selectedSport }: GameMenuProps) => {
    return (
        <div className="w-full bg-primary-dark py-4 md:py-6 px-4 relative">
            <div className="absolute top-0 right-4 text-[8px] text-white/10 font-mono italic">SYNC_v4.0.0</div>
            <div className="max-w-7xl mx-auto flex overflow-x-auto gap-4 md:gap-6 scrollbar-hide pb-2">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        onClick={() => onSelectSport(cat.id)}
                        className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group"
                    >
                        <div className={cn(
                            "w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border flex items-center justify-center transition-all duration-300",
                            (selectedSport === cat.id || (selectedSport === undefined && cat.id === undefined))
                                ? "border-yellow-400 bg-white/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                                : "border-white/5 group-hover:border-white/20 group-hover:bg-white/10"
                        )}>
                            <div className={cn("transition-transform duration-300 group-hover:scale-110", cat.color)}>
                                <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                                "text-xs md:text-sm font-bold transition-colors",
                                (selectedSport === cat.id || (selectedSport === undefined && cat.id === undefined))
                                    ? "text-white"
                                    : "text-white/60 group-hover:text-white"
                            )}>
                                {cat.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameMenu;
