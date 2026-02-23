"use client";

import React, { useState } from "react";
import { Search, Menu, X, Clock, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackendStatus } from "@/hooks/useBackendStatus";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const backendStatus = useBackendStatus();

    return (
        <nav className="w-full bg-primary-dark text-white shadow-lg sticky top-0 z-50">
            {/* Top Header */}
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-10 h-10 bg-accent-yellow rounded-full flex items-center justify-center">
                            <span className="text-primary-dark font-bold text-xl italic">PB</span>
                        </div>
                        <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase">PLAY<span className="text-accent-yellow">BAJI</span></span>
                    </div>
                </div>

                {/* Search - Hidden on Small Mobile */}
                <div className="hidden sm:flex flex-1 max-w-sm items-center bg-white/10 rounded-full px-4 h-10 border border-white/20">
                    <Search className="w-4 h-4 text-white/60" />
                    <input
                        type="text"
                        placeholder="Search Event"
                        className="bg-transparent border-none outline-none px-3 text-sm flex-1 placeholder:text-white/40"
                    />
                </div>

                {/* Auth & API Status Section */}
                <div className="flex items-center gap-2">
                    {/* Backend Status Indicator */}
                    <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            backendStatus === 'online' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                                backendStatus === 'offline' ? "bg-red-400" : "bg-white/20"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">API Status</span>
                    </div>

                    <div className="hidden lg:flex gap-2">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                            <input type="text" placeholder="Username" className="bg-white/10 rounded px-9 py-1.5 text-sm w-32 outline-none border border-white/10 focus:border-accent-yellow" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                            <input type="password" placeholder="Password" className="bg-white/10 rounded px-9 py-1.5 text-sm w-32 outline-none border border-white/10 focus:border-accent-yellow" />
                        </div>
                    </div>
                    {/* Mobile Auth Button */}
                    <button className="bg-accent-red hover:bg-red-700 text-white font-bold px-4 md:px-6 py-1.5 rounded transition-colors text-sm uppercase whitespace-nowrap">
                        Login
                    </button>
                </div>
            </div>

            {/* Desktop Main Nav Links - Hidden on Mobile */}
            <div className="hidden lg:block bg-secondary-dark border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center h-full gap-6">
                        <NavLink href="#" active>Home</NavLink>
                        <NavLink href="#">In-Play</NavLink>
                        <NavLink href="#">Cricket</NavLink>
                        <NavLink href="#">Soccer</NavLink>
                        <NavLink href="#">Tennis</NavLink>
                        <NavLink href="#">Exchange</NavLink>
                        <NavLink href="#">Casino</NavLink>
                    </div>

                    <div className="flex items-center gap-4 text-white/60">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>GMT+6</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div className={cn(
                "fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300",
                isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )} onClick={() => setIsMenuOpen(false)} />

            {/* Mobile Sidebar Content */}
            <div className={cn(
                "fixed top-0 left-0 bottom-0 w-[280px] bg-primary-dark z-50 lg:hidden transition-transform duration-300 shadow-2xl",
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 h-full flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center">
                                <span className="text-primary-dark font-bold text-sm italic">PB</span>
                            </div>
                            <span className="text-xl font-black italic tracking-tighter text-white">PLAY<span className="text-accent-yellow">BAJI</span></span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
                    </div>

                    <div className="flex flex-col gap-1 overflow-y-auto">
                        <MobileNavLink href="#" active>Home</MobileNavLink>
                        <MobileNavLink href="#">In-Play</MobileNavLink>
                        <MobileNavLink href="#">Cricket</MobileNavLink>
                        <MobileNavLink href="#">Soccer</MobileNavLink>
                        <MobileNavLink href="#">Tennis</MobileNavLink>
                        <MobileNavLink href="#">Exchange</MobileNavLink>
                        <MobileNavLink href="#">Casino</MobileNavLink>
                    </div>

                    <div className="mt-auto border-t border-white/10 pt-6 space-y-4">
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>System Time: GMT+6</span>
                        </div>
                        <button className="w-full bg-white/10 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                            Join Now
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
    <a
        href={href}
        className={cn(
            "h-full flex items-center px-1 border-b-2 transition-all hover:text-accent-yellow",
            active ? "border-accent-yellow text-accent-yellow" : "border-transparent text-white/80"
        )}
    >
        {children}
    </a>
);

const MobileNavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
    <a
        href={href}
        className={cn(
            "p-3 rounded-lg text-lg font-bold transition-all",
            active ? "bg-accent-yellow text-primary-dark" : "text-white/80 hover:bg-white/5"
        )}
    >
        {children}
    </a>
);

export default Navbar;
