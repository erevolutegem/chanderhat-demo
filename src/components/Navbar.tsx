"use client";

import React from "react";
import { Search, Info, Settings, Clock, User, Lock, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
    return (
        <nav className="w-full bg-primary-dark text-white shadow-lg sticky top-0 z-50">
            {/* Top Header */}
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-accent-yellow rounded-full flex items-center justify-center">
                        <span className="text-primary-dark font-bold text-xl italic">PB</span>
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter text-white">PLAY<span className="text-accent-yellow">BAJI</span></span>
                </div>

                {/* Search */}
                <div className="hidden md:flex flex-1 max-w-sm items-center bg-white/10 rounded-full px-4 h-10 border border-white/20">
                    <Search className="w-4 h-4 text-white/60" />
                    <input
                        type="text"
                        placeholder="Search Event"
                        className="bg-transparent border-none outline-none px-3 text-sm flex-1 placeholder:text-white/40"
                    />
                </div>

                {/* Auth Section */}
                <div className="flex items-center gap-2">
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
                    <button className="bg-accent-red hover:bg-red-700 text-white font-bold px-6 py-1.5 rounded transition-colors text-sm uppercase">
                        Login
                    </button>
                </div>
            </div>

            {/* Main Nav Links */}
            <div className="bg-secondary-dark border-y border-white/5">
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
                        <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                            <span className="text-xs uppercase bg-accent-yellow/20 text-accent-yellow px-1 px-1 rounded">ON</span>
                            <span className="text-xs">ONE CLICK BET</span>
                        </div>
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

export default Navbar;
