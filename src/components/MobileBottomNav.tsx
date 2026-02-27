"use client";
import React from "react";
import { Home, Activity, Star, DollarSign, User } from "lucide-react";

interface Props {
    betCount?: number;
    onLoginClick?: () => void;
    onBetSlipClick?: () => void;
}

const NAV_ITEMS = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Activity, label: "In-Play", id: "inplay", dot: true },
    { icon: Star, label: "Favourites", id: "fav" },
    { icon: DollarSign, label: "Bet Slip", id: "betslip", badge: true },
    { icon: User, label: "Account", id: "account" },
];

export default function MobileBottomNav({ betCount = 0, onLoginClick, onBetSlipClick }: Props) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex border-t"
            style={{ background: "#0d0d1a", borderColor: "#2a2a4a", paddingBottom: "env(safe-area-inset-bottom)" }}>
            {NAV_ITEMS.map(({ icon: Icon, label, id, dot, badge }) => {
                const isDeposit = id === "betslip";
                const onClick = isDeposit ? onBetSlipClick : id === "account" ? onLoginClick : undefined;
                return (
                    <button key={id} onClick={onClick}
                        className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative transition-colors hover:bg-white/5"
                        style={{ color: "#6666aa" }}>
                        <div className="relative">
                            <Icon className="w-5 h-5" />
                            {dot && <span className="absolute -top-0.5 -right-0.5 live-dot" style={{ width: 6, height: 6 }} />}
                            {badge && betCount > 0 && (
                                <span className="absolute -top-1 -right-1.5 text-[9px] font-black text-white px-1 rounded-full" style={{ background: "#e02020", minWidth: 14, textAlign: "center" }}>
                                    {betCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-semibold">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
