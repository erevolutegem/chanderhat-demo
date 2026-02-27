"use client";
import React, { useState } from "react";
import { Search, Menu, X, ChevronDown, Star, Tv, Bell } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "In-Play", href: "/?tab=inplay", live: true },
    { label: "Cricket", href: "/?sport=3" },
    { label: "Soccer", href: "/?sport=1" },
    { label: "Tennis", href: "/?sport=13" },
    { label: "Basketball", href: "/?sport=18" },
    { label: "Casino", href: "#" },
];

export default function Navbar({ onLoginClick }: { onLoginClick?: () => void }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            {/* ── Top Bar ─────────────────────────────────────── */}
            <div className="sticky top-0 z-50">
                <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #0d0d2a 100%)", borderBottom: "1px solid #2a2a4a" }}>
                    <div className="max-w-[1400px] mx-auto px-3 h-14 flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ background: "#e02020" }}>P</div>
                            <span className="hidden sm:block font-black text-white text-lg tracking-tight">
                                Play<span style={{ color: "#ffd700" }}>Baji</span>
                            </span>
                        </a>

                        {/* Live count chips */}
                        <div className="hidden md:flex items-center gap-1.5 ml-2">
                            {[{ label: "🏏", count: 4 }, { label: "⚽", count: 32 }, { label: "🎾", count: 11 }].map(({ label, count }) => (
                                <div key={label} style={{ background: "#e02020", borderRadius: 4 }} className="flex items-center gap-1 px-2 py-0.5 text-white text-xs font-bold">
                                    {label} {count}
                                </div>
                            ))}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Search */}
                        {searchOpen ? (
                            <div className="flex items-center bg-[#0d0d2a] border border-[#2a2a4a] rounded-lg px-3 h-9 gap-2 w-52">
                                <Search className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                                <input autoFocus placeholder="Search matches..." className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none flex-1 w-full" onBlur={() => setSearchOpen(false)} />
                            </div>
                        ) : (
                            <button onClick={() => setSearchOpen(true)} className="hidden sm:flex text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
                                <Search className="w-4 h-4" />
                            </button>
                        )}

                        {/* Auth */}
                        <div className="flex items-center gap-2">
                            <button onClick={onLoginClick} className="px-3 py-1.5 text-sm font-semibold text-white border border-[#3a3a5a] rounded-lg hover:border-slate-400 transition-all">
                                Login
                            </button>
                            <button onClick={onLoginClick} className="px-3 py-1.5 text-sm font-bold text-white rounded-lg transition-all" style={{ background: "#e02020" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#c01818")}
                                onMouseLeave={e => (e.currentTarget.style.background = "#e02020")}>
                                Register
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Nav Strip ─────────────────────────────────── */}
                <div style={{ background: "#0d0d1a", borderBottom: "2px solid #e02020" }}>
                    <div className="max-w-[1400px] mx-auto px-3 flex items-center gap-0 overflow-x-auto scrollbar-hide">
                        {NAV_LINKS.map(({ label, href, live }) => (
                            <a key={label} href={href}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 border-transparent hover:border-yellow-400 hover:text-yellow-400 transition-all"
                                style={{ color: "#9999bb" }}>
                                {live && <span className="live-dot" />}
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Mobile Drawer ──────────────────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 flex flex-col animate-[slide-in_0.2s_ease]"
                        style={{ background: "linear-gradient(180deg, #1a1a3e 0%, #0d0d2a 100%)", borderRight: "1px solid #2a2a4a" }}>
                        <div className="flex items-center justify-between px-4 h-14" style={{ borderBottom: "1px solid #2a2a4a" }}>
                            <span className="font-black text-white text-lg">Play<span style={{ color: "#ffd700" }}>Baji</span></span>
                            <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {NAV_LINKS.map(({ label, href, live }) => (
                                <a key={label} href={href} onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-white/5 transition-colors"
                                    style={{ color: "#9999bb" }}>
                                    {live && <span className="live-dot" />}
                                    {label}
                                </a>
                            ))}
                        </div>
                        <div className="p-3 space-y-2" style={{ borderTop: "1px solid #2a2a4a" }}>
                            <button className="w-full py-2.5 border border-[#3a3a5a] rounded-lg text-sm font-semibold text-white">Login</button>
                            <button className="w-full py-2.5 rounded-lg text-sm font-bold text-white" style={{ background: "#e02020" }}>Register</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
