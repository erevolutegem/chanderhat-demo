"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Zap, Trophy, Target, Dribbble, Monitor, BarChart2, Star, Shield } from "lucide-react";

interface SideNavProps {
    selectedSport: number | undefined;
    onSelectSport: (id: number | undefined) => void;
}

const SPORTS = [
    { id: undefined, label: "All Sports", icon: Monitor },
    { id: 1, label: "Soccer", icon: Dribbble, color: "#3b82f6" },
    { id: 3, label: "Cricket", icon: Target, color: "#22c55e" },
    { id: 13, label: "Tennis", icon: Zap, color: "#f59e0b" },
    { id: 18, label: "Basketball", icon: Trophy, color: "#f97316" },
    { id: 12, label: "American Football", icon: Shield, color: "#8b5cf6" },
];

const TOOLS = [
    { label: "Statistics", icon: BarChart2 },
    { label: "Favourites", icon: Star },
];

const SideNav = ({ selectedSport, onSelectSport }: SideNavProps) => (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-[#2d3348] sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto scrollbar-hide" style={{ background: "#161b28" }}>

        {/* Sports */}
        <div className="p-3">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Live Sports</p>
            {SPORTS.map((sport) => {
                const isActive = selectedSport === sport.id;
                const Icon = sport.icon;
                return (
                    <button
                        key={String(sport.id)}
                        onClick={() => onSelectSport(sport.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all mb-0.5",
                            isActive
                                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                : "text-slate-400 hover:bg-[#1e2433] hover:text-white"
                        )}
                    >
                        <Icon
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: isActive ? "#22c55e" : (sport.color || "#64748b") }}
                        />
                        {sport.label}
                    </button>
                );
            })}
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-[#2d3348] my-2" />

        {/* Tools */}
        <div className="p-3">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Tools</p>
            {TOOLS.map(({ label, icon: Icon }) => (
                <button
                    key={label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-[#1e2433] hover:text-white transition-all mb-0.5"
                >
                    <Icon className="w-4 h-4" />
                    {label}
                </button>
            ))}
        </div>

        {/* Promo Banner */}
        <div className="m-3 mt-auto p-3 rounded-xl bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30">
            <p className="text-xs font-bold text-green-400">🎁 Get Bonus</p>
            <p className="text-[11px] text-slate-400 mt-1">Deposit now & get 100% welcome bonus</p>
            <button className="mt-2 w-full py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-all">
                Claim Now
            </button>
        </div>
    </aside>
);

export default SideNav;
