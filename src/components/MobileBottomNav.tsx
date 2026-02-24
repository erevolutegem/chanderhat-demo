"use client";

import React from "react";
import { Home, Trophy, User, PlusCircle, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999] bg-primary-dark border-t border-white/10 flex items-center justify-around h-16 px-2 safe-area-pb">
            <NavItem icon={<Home className="w-5 h-5" />} label="Home" active />
            <NavItem icon={<Trophy className="w-5 h-5" />} label="Sports" />

            <div className="relative -mt-8">
                <div className="w-14 h-14 bg-gradient-to-b from-accent-yellow to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.4)] border-4 border-primary-dark">
                    <PlusCircle className="w-8 h-8 text-primary-dark fill-current" />
                </div>
                <span className="text-[10px] font-bold text-accent-yellow block text-center mt-1">Deposit</span>
            </div>

            <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Promotion" />
            <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
        </div>
    );
};

const NavItem = ({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) => (
    <button className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-accent-yellow" : "text-white/40 hover:text-white/60"
    )}>
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
);

export default MobileBottomNav;
