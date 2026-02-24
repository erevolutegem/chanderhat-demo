"use client";

import React, { useState } from "react";
import OwnerSidebar from "@/components/OwnerSidebar";
import { Menu, Bell, User } from "lucide-react";

export default function OwnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-primary-dark text-white font-sans selection:bg-accent-yellow selection:text-primary-dark">
            <OwnerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="lg:pl-72 flex flex-col min-h-screen max-w-full overflow-x-hidden">
                {/* Top Header */}
                <header className="h-16 md:h-24 border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 bg-primary-dark/40 backdrop-blur-2xl z-[40]">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 transition-all active:scale-95"
                        >
                            <Menu className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <h1 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-white/20 truncate max-w-[120px] md:max-w-none">
                            Whitelabel <span className="text-accent-yellow/40">Management</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button className="relative p-2.5 md:p-3.5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-accent-yellow transition-all group active:scale-95">
                            <Bell className="w-4 h-4 md:w-5 h-5 group-hover:animate-swing" />
                            <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 md:w-2.5 h-2 md:h-2.5 bg-accent-red rounded-full ring-4 ring-primary-dark animate-pulse" />
                        </button>

                        <div className="flex items-center gap-3 md:gap-4 pl-3 pr-4 md:pl-4 md:pr-6 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all cursor-pointer group">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-accent-yellow to-orange-500 flex items-center justify-center font-black text-primary-dark text-[10px] md:text-xs shadow-lg shadow-accent-yellow/20 group-hover:scale-110 transition-transform">SO</div>
                            <div className="hidden sm:block">
                                <span className="block text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/60 leading-none">Site Owner</span>
                                <span className="text-[8px] md:text-[9px] font-bold text-accent-yellow/40 uppercase tracking-tighter leading-none mt-0.5">Premium Plan</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
