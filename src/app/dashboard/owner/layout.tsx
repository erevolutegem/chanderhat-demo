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
                <header className="h-14 md:h-20 border-b border-white/5 flex items-center justify-between px-3 md:px-6 sticky top-0 bg-primary-dark/80 backdrop-blur-xl z-[40]">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 bg-white/5 rounded-lg text-white/60"
                        >
                            <Menu className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <h1 className="text-[10px] md:text-lg font-black uppercase tracking-widest text-white/40 truncate max-w-[120px] md:max-w-none">Whitelabel Management</h1>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <button className="relative p-2 md:p-2.5 bg-white/5 rounded-full text-white/40 hover:text-accent-yellow transition-colors">
                            <Bell className="w-4 h-4 md:w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 bg-accent-red rounded-full ring-2 ring-primary-dark" />
                        </button>

                        <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 rounded-full border border-white/10">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-accent-yellow to-orange-500 flex items-center justify-center font-black text-primary-dark text-[10px] md:text-xs">SO</div>
                            <span className="hidden sm:inline text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60">Site Owner</span>
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
