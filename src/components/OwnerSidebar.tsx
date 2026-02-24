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
                "fixed top-0 left-0 bottom-0 z-[1001] w-72 md:w-80 bg-secondary-dark/80 backdrop-blur-3xl border-r border-white/5 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)] lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent-yellow/[0.03] to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="p-8 md:p-10 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-yellow rounded-xl md:rounded-2xl flex items-center justify-center rotate-6 shadow-2xl shadow-accent-yellow/30 group-hover:rotate-12 transition-transform">
                                <Globe className="w-6 md:w-7 h-6 md:h-7 text-primary-dark" />
                            </div>
                            <div>
                                <h2 className="text-white font-black text-xl md:text-2xl italic tracking-tighter leading-tight uppercase">
                                    OWNER <span className="text-accent-yellow text-[10px] md:text-sm block -mt-1 non-italic font-black tracking-[0.2em]">CORE</span>
                                </h2>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all active:scale-95">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-5 md:px-6 py-6 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all group shrink-0 relative overflow-hidden",
                                    pathname === item.href
                                        ? "text-primary-dark"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                {pathname === item.href && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-yellow to-orange-400 z-0 animate-in fade-in zoom-in-95 duration-500" />
                                )}
                                <span className={cn(
                                    "relative z-10 transition-transform group-hover:scale-110",
                                    pathname === item.href ? "text-primary-dark" : "text-accent-yellow"
                                )}>
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5 md:w-6 h-6" })}
                                </span>
                                <span className="relative z-10 text-[10px] md:text-xs lg:text-sm uppercase tracking-[0.2em] leading-none">{item.label}</span>
                                {pathname === item.href && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-primary-dark rounded-full z-10 animate-pulse" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-6 md:p-8 border-t border-white/5 relative z-10">
                        <button className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-400/60 font-black hover:text-red-400 hover:bg-red-400/5 transition-all uppercase tracking-[0.3em] text-[10px] md:text-xs group">
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default OwnerSidebar;
