"use client";

import React from "react";
import {
    Trophy,
    Monitor,
    Zap,
    Target,
    Dribbble,
    Sword,
    Gamepad2,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SideNavProps {
    onSelectSport: (id: number | undefined) => void;
    selectedSport: number | undefined;
}

const SideNav = ({ onSelectSport, selectedSport }: SideNavProps) => {
    const categories = [
        { icon: <Zap className="w-4 h-4" />, label: "Soccer", id: 1 },
        { icon: <Trophy className="w-4 h-4" />, label: "Cricket", id: 3 },
        { icon: <Target className="w-4 h-4" />, label: "Tennis", id: 13 },
        { icon: <Dribbble className="w-4 h-4" />, label: "Basketball", id: 18 },
        { icon: <Zap className="w-4 h-4" />, label: "American Football", id: 12 },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-112px)] sticky top-[112px] bg-secondary-dark/50 border-r border-white/5 overflow-y-auto custom-scrollbar">
            <div className="p-4 flex flex-col gap-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2 mb-2">Sports Categories</h5>

                <button
                    onClick={() => onSelectSport(undefined)}
                    className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                        selectedSport === undefined ? "bg-accent-yellow text-primary-dark shadow-lg shadow-accent-yellow/10" : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span className={cn(selectedSport === undefined ? "text-primary-dark" : "text-accent-yellow")}>
                            <Monitor className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-bold">All Sports</span>
                    </div>
                </button>

                {categories.map((cat) => (
                    <SideItem
                        key={cat.id}
                        icon={cat.icon}
                        label={cat.label}
                        active={selectedSport === cat.id}
                        onClick={() => onSelectSport(cat.id)}
                    />
                ))}

                <div className="my-6 border-t border-white/5" />

                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2 mb-2">Analysis</h5>
                <SideItem icon={<BarChart3 className="w-4 h-4" />} label="Statistics" onClick={() => { }} />
                <SideItem icon={<Zap className="w-4 h-4 text-orange-400" />} label="Hot Events" onClick={() => { }} />
            </div>
        </aside>
    );
};

const SideItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
            active ? "bg-accent-yellow text-primary-dark shadow-lg shadow-accent-yellow/10" : "text-white/60 hover:bg-white/5 hover:text-white"
        )}
    >
        <div className="flex items-center gap-3">
            <span className={cn(
                "transition-colors",
                active ? "text-primary-dark" : "text-accent-yellow group-hover:text-accent-yellow"
            )}>
                {icon}
            </span>
            <span className="text-sm font-bold">{label}</span>
        </div>
    </button>
);

export default SideNav;
