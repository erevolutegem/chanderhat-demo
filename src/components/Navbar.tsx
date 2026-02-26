"use client";

import React, { useState } from "react";
import { Search, Menu, X, Bell, ChevronDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSite } from "@/lib/SiteContext";
import AuthModals from "./AuthModals";
import { useBackendStatus } from "@/hooks/useBackendStatus";

const SPORTS_LINKS = [
    { label: "In-Play", hot: true },
    { label: "Cricket" },
    { label: "Soccer" },
    { label: "Tennis" },
    { label: "Basketball" },
    { label: "Exchange" },
    { label: "Casino" },
    { label: "Slots" },
];

const Navbar = () => {
    const { site } = useSite();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "login" | "signup" }>({ isOpen: false, type: "login" });
    const backendStatus = useBackendStatus();

    const displayName = site?.name || "CHANDERHAT";

    return (
        <>
            {/* ── Top Bar ─────────────────────────────────────────── */}
            <nav className="w-full sticky top-0 z-50 border-b border-[#2d3348]" style={{ background: "#1a1f2e" }}>
                <div className="max-w-7xl mx-auto px-3 md:px-6 h-14 flex items-center gap-3">

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                            <span className="text-white font-black text-sm">C</span>
                        </div>
                        <span className="text-white font-black text-lg tracking-tight hidden sm:block">
                            Chander<span className="text-green-400">Hat</span>
                        </span>
                    </a>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-[#242938] border border-[#353c52] rounded-lg px-3 h-9">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search matches..."
                            className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none flex-1"
                        />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* API Status dot */}
                    <div className="hidden sm:flex items-center gap-1.5">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            backendStatus === "online" ? "bg-green-400" : "bg-red-400"
                        )} />
                        <span className="text-[11px] text-slate-500 font-medium">
                            {backendStatus === "online" ? "Live" : "Offline"}
                        </span>
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setAuthModal({ isOpen: true, type: "login" })}
                            className="px-4 py-1.5 text-sm font-semibold text-white border border-[#353c52] rounded-lg hover:border-green-500/50 hover:text-green-400 transition-all"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setAuthModal({ isOpen: true, type: "signup" })}
                            className="px-4 py-1.5 text-sm font-bold text-white bg-green-600 hover:bg-green-500 rounded-lg transition-all"
                        >
                            Join Now
                        </button>
                    </div>
                </div>

                {/* ── Desktop Sports Nav ────────────────────────────── */}
                <div className="hidden lg:block border-t border-[#2d3348]" style={{ background: "#161b28" }}>
                    <div className="max-w-7xl mx-auto px-6 flex items-center h-10 gap-1">
                        {SPORTS_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href="#"
                                className="flex items-center gap-1.5 px-3 h-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded transition-all whitespace-nowrap"
                            >
                                {link.hot && <span className="live-dot" />}
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* ── Mobile Drawer ─────────────────────────────────────── */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileOpen(false)} />
                    <div className="absolute top-0 left-0 bottom-0 w-72 bg-[#1a1f2e] border-r border-[#2d3348] flex flex-col shadow-2xl animate-slide-up">
                        <div className="flex items-center justify-between px-4 h-14 border-b border-[#2d3348]">
                            <span className="text-white font-black text-lg">
                                Chander<span className="text-green-400">Hat</span>
                            </span>
                            <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">Sports</p>
                            {SPORTS_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href="#"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-[#242938] hover:text-white transition-all"
                                >
                                    {link.hot && <span className="live-dot" />}
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="p-4 border-t border-[#2d3348] space-y-2">
                            <button
                                onClick={() => { setAuthModal({ isOpen: true, type: "login" }); setIsMobileOpen(false); }}
                                className="w-full py-2.5 border border-[#353c52] rounded-lg text-sm font-semibold text-white hover:border-green-500/50 transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setAuthModal({ isOpen: true, type: "signup" }); setIsMobileOpen(false); }}
                                className="w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold text-white transition-all"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AuthModals
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ ...authModal, isOpen: false })}
                type={authModal.type}
            />
        </>
    );
};

export default Navbar;
