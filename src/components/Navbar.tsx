"use client";

import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSite } from "@/lib/SiteContext";
import AuthModals from "./AuthModals";

const SPORT_LINKS = ["Home", "In-Play", "Cricket", "Soccer", "Tennis", "Basketball", "Casino"];

const Navbar = () => {
    const { site } = useSite();
    const [menuOpen, setMenuOpen] = useState(false);
    const [auth, setAuth] = useState<{ isOpen: boolean; type: "login" | "signup" }>({ isOpen: false, type: "login" });

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-[#1e2433]" style={{ background: "#131820" }}>
                {/* Main bar */}
                <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-3">
                    {/* Hamburger - mobile only */}
                    <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center font-black text-white text-sm">C</div>
                        <span className="hidden sm:block font-black text-white text-lg">
                            Chander<span className="text-green-400">Hat</span>
                        </span>
                    </a>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1 flex-1">
                        {SPORT_LINKS.map((link, i) => (
                            <a key={link} href="#"
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                    i === 0 ? "text-green-400 bg-green-600/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}>
                                {i === 1 && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse align-middle" />}
                                {link}
                            </a>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="hidden lg:flex items-center gap-2 bg-[#1e2433] border border-[#2a3040] rounded-lg px-3 h-9 w-52">
                        <Search className="w-3.5 h-3.5 text-slate-600" />
                        <input placeholder="Search..." className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none flex-1 w-full" />
                    </div>

                    {/* Auth */}
                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                        <button onClick={() => setAuth({ isOpen: true, type: "login" })}
                            className="px-3 py-1.5 text-sm font-semibold text-slate-300 border border-[#2a3040] rounded-lg hover:border-green-600/50 hover:text-white transition-all">
                            Login
                        </button>
                        <button onClick={() => setAuth({ isOpen: true, type: "signup" })}
                            className="px-3 py-1.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-500 transition-all">
                            Register
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-[200] md:hidden">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-64 border-r border-[#1e2433] flex flex-col" style={{ background: "#131820" }}>
                        <div className="flex items-center justify-between px-4 h-14 border-b border-[#1e2433]">
                            <span className="font-black text-white">Chander<span className="text-green-400">Hat</span></span>
                            <button onClick={() => setMenuOpen(false)} className="text-slate-500"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-3 space-y-1">
                            {SPORT_LINKS.map((link, i) => (
                                <a key={link} href="#" onClick={() => setMenuOpen(false)}
                                    className={cn("flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                                        i === 0 ? "text-green-400 bg-green-600/10" : "text-slate-400 hover:bg-[#1e2433] hover:text-white"
                                    )}>
                                    {i === 1 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                                    {link}
                                </a>
                            ))}
                        </div>
                        <div className="mt-auto p-3 space-y-2 border-t border-[#1e2433]">
                            <button onClick={() => { setAuth({ isOpen: true, type: "login" }); setMenuOpen(false); }}
                                className="w-full py-2.5 border border-[#2a3040] rounded-lg text-sm font-semibold text-white">Login</button>
                            <button onClick={() => { setAuth({ isOpen: true, type: "signup" }); setMenuOpen(false); }}
                                className="w-full py-2.5 bg-green-600 rounded-lg text-sm font-bold text-white">Register</button>
                        </div>
                    </div>
                </div>
            )}

            <AuthModals isOpen={auth.isOpen} onClose={() => setAuth({ ...auth, isOpen: false })} type={auth.type} />
        </>
    );
};

export default Navbar;
