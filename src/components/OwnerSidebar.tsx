"use client";

import React from "react";
import { LayoutDashboard, Globe, Coins, Settings, Bell, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const OwnerSidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/dashboard/owner" },
        { icon: <Globe className="w-5 h-5" />, label: "My Sites", href: "/dashboard/owner/sites" },
        { icon: <Users className="w-5 h-5" />, label: "Players", href: "/dashboard/owner/users" },
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
                "fixed top-0 left-0 bottom-0 z-[1001] w-72 bg-secondary-dark border-r border-white/5 transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent-yellow rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-accent-yellow/20">
                                <Globe className="w-6 h-6 text-primary-dark" />
                            </div>
                            <div>
                                <h2 className="text-white font-black text-xl italic tracking-tighter leading-tight">OWNER <span className="text-accent-yellow text-sm block -mt-1 non-italic font-black">PANEL</span></h2>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-white/40 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all group",
                                    pathname === item.href
                                        ? "bg-accent-yellow text-primary-dark shadow-lg shadow-accent-yellow/20"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className={cn(
                                    "transition-colors",
                                    pathname === item.href ? "text-primary-dark" : "text-accent-yellow group-hover:scale-110"
                                )}>
                                    {item.icon}
                                </span>
                                <span className="text-sm uppercase tracking-widest">{item.label}</span>
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
