"use client";

import React from "react";
import { LayoutDashboard, Globe, Users, Coins, Settings, Bell, LogOut, Menu, X, Layout, UsersRound, Key, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const OwnerSidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/dashboard/owner" },
        { icon: <Globe className="w-5 h-5" />, label: "My Sites", href: "/dashboard/owner/sites" },
        { icon: <Users className="w-5 h-5" />, label: "Players", href: "/dashboard/owner/users" },
        { icon: <Layout className="w-5 h-5" />, label: "Templates", href: "/dashboard/owner/templates" },
        { icon: <UsersRound className="w-5 h-5" />, label: "WL Owners", href: "/dashboard/owner/owners" },
        { icon: <Zap className="w-5 h-5" />, label: "API Settings", href: "/dashboard/owner/api" },
        { icon: <Coins className="w-5 h-5" />, label: "Currencies", href: "/dashboard/owner/currencies" },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/dashboard/owner/settings" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed top-0 left-0 bottom-0 z-[1001] w-72 bg-secondary-dark border-r border-white/5 transition-transform duration-500 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-accent-yellow rounded-lg md:rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-accent-yellow/20">
                                <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary-dark" />
                            </div>
                            <div>
                                <h2 className="text-white font-black text-lg md:text-xl italic tracking-tighter leading-tight uppercase">OWNER <span className="text-accent-yellow text-[9px] md:text-sm block -mt-0.5 md:-mt-1 non-italic font-black">PANEL</span></h2>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-white/40 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all group shrink-0",
                                    pathname === item.href
                                        ? "bg-accent-yellow text-primary-dark shadow-lg shadow-accent-yellow/20"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className={cn(
                                    "transition-colors",
                                    pathname === item.href ? "text-primary-dark" : "text-accent-yellow group-hover:scale-110"
                                )}>
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4 md:w-5 h-5" })}
                                </span>
                                <span className="text-[10px] md:text-xs lg:text-sm uppercase tracking-widest leading-none">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 mb-6">
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 font-bold hover:bg-red-400/10 transition-all uppercase tracking-widest text-xs">
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default OwnerSidebar;
