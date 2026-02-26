"use client";

import React from "react";
import { Home, Trophy, Wallet, LayoutGrid, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
    { icon: Home, label: "Home", active: true },
    { icon: Trophy, label: "Sports" },
    { icon: Wallet, label: "Deposit", cta: true },
    { icon: LayoutGrid, label: "Promotions" },
    { icon: User, label: "Account" },
];

const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999] border-t border-[#2d3348] flex items-center h-14 px-2" style={{ background: "#1a1f2e" }}>
        {ITEMS.map(({ icon: Icon, label, active, cta }) => (
            <button
                key={label}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-0.5 transition-all py-2",
                    cta
                        ? "text-green-400"
                        : active
                            ? "text-green-400"
                            : "text-slate-600 hover:text-slate-400"
                )}
            >
                {cta ? (
                    <div className="w-9 h-9 -mt-5 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 border-2 border-[#1a1f2e]">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                ) : (
                    <Icon className="w-5 h-5" />
                )}
                <span className={cn("text-[9px] font-bold uppercase tracking-tight", cta && "-mt-1")}>{label}</span>
            </button>
        ))}
    </div>
);

export default MobileBottomNav;
