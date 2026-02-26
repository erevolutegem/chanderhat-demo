"use client";

import React from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { id: undefined, label: "All", emoji: "⚡" },
    { id: 1, label: "Soccer", emoji: "⚽" },
    { id: 3, label: "Cricket", emoji: "🏏" },
    { id: 13, label: "Tennis", emoji: "🎾" },
    { id: 18, label: "Basketball", emoji: "🏀" },
    { id: 12, label: "Football", emoji: "🏈" },
    { id: 4, label: "Hockey", emoji: "🏒" },
];

interface GameMenuProps {
    onSelectSport: (id: number | undefined) => void;
    selectedSport: number | undefined;
}

const GameMenu = ({ onSelectSport, selectedSport }: GameMenuProps) => (
    <div className="w-full border-b border-[#2d3348]" style={{ background: "#1a1f2e" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {CATEGORIES.map((cat) => {
                const isActive = selectedSport === cat.id;
                return (
                    <button
                        key={String(cat.id)}
                        onClick={() => onSelectSport(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0",
                            isActive
                                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                                : "text-slate-400 hover:bg-[#242938] hover:text-white"
                        )}
                    >
                        <span className="text-base leading-none">{cat.emoji}</span>
                        {cat.label}
                    </button>
                );
            })}
        </div>
    </div>
);

export default GameMenu;
