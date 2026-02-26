"use client";

import React from "react";
import { cn } from "@/lib/utils";

const CATS = [
    { id: undefined, label: "All Sports", emoji: "⚡" },
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
    <div className="border-b border-[#1e2433] overflow-x-auto scrollbar-hide" style={{ background: "#131820" }}>
        <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-1 py-2 min-w-max md:min-w-0">
            {CATS.map(cat => (
                <button
                    key={String(cat.id)}
                    onClick={() => onSelectSport(cat.id)}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all select-none",
                        selectedSport === cat.id
                            ? "bg-green-600 text-white"
                            : "text-slate-500 hover:text-white hover:bg-[#1e2433]"
                    )}
                >
                    <span>{cat.emoji}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                </button>
            ))}
        </div>
    </div>
);

export default GameMenu;
