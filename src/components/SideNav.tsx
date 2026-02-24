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

const SideNav = () => {
    return (
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-112px)] sticky top-[112px] bg-secondary-dark/50 border-r border-white/5 overflow-y-auto custom-scrollbar">
            <div className="p-4 flex flex-col gap-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2 mb-2">Sports Categories</h5>

                <SideItem icon={<Monitor className="w-4 h-4" />} label="E-Sports" count={12} active />
                <SideItem icon={<Trophy className="w-4 h-4" />} label="Cricket" count={8} />
                <SideItem icon={<Zap className="w-4 h-4" />} label="Soccer" count={45} />
                <SideItem icon={<Target className="w-4 h-4" />} label="Tennis" count={5} />
                <SideItem icon={<Dribbble className="w-4 h-4" />} label="Basketball" count={22} />
                <SideItem icon={<Sword className="w-4 h-4" />} label="Boxing" />
                <SideItem icon={<Gamepad2 className="w-4 h-4" />} label="Virtual" />

                <div className="my-6 border-t border-white/5" />

                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2 mb-2">Analysis</h5>
                <SideItem icon={<BarChart3 className="w-4 h-4" />} label="Statistics" />
                <SideItem icon={<Zap className="w-4 h-4 text-orange-400" />} label="Hot Events" />
            </div>
        </aside>
    );
};

const SideItem = ({ icon, label, count, active }: { icon: React.ReactNode; label: string; count?: number; active?: boolean }) => (
    <button className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
        active ? "bg-accent-yellow text-primary-dark shadow-lg shadow-accent-yellow/10" : "text-white/60 hover:bg-white/5 hover:text-white"
    )}>
        <div className="flex items-center gap-3">
            <span className={cn(
                "transition-colors",
                active ? "text-primary-dark" : "text-accent-yellow group-hover:text-accent-yellow"
            )}>
                {icon}
            </span>
            <span className="text-sm font-bold">{label}</span>
        </div>
        {count !== undefined && (
            <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded",
                active ? "bg-black/20 text-primary-dark" : "bg-white/10 text-white/40 group-hover:bg-white/20 group-hover:text-white"
            )}>
                {count}
            </span>
        )}
    </button>
);

export default SideNav;
