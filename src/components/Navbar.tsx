"use client";
import React, { useState } from "react";
import { Search, Menu, X, Wallet, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar({ onLoginClick }: { onLoginClick?: () => void }) {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* Playbaji Header - Dark, Dense, Professional */}
            <div className="bg-[var(--bg)] border-b border-[var(--border)] sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-4 h-[60px] flex items-center gap-4">

                    {/* Hamburger — mobile only */}
                    <button onClick={() => setMenuOpen(true)} className="lg:hidden text-[var(--text-2)] p-1 flex">
                        <Menu size={24} />
                    </button>

                    {/* Logo (Text/Brand) */}
                    <a href="/" className="flex items-center gap-2 flex-shrink-0 text-white no-underline">
                        <div className="hidden sm:flex flex-col leading-none">
                            <span className="font-black text-[22px] tracking-tight">
                                play<span className="text-[var(--primary)]">baji</span>
                            </span>
                        </div>
                    </a>

                    {/* Desktop Search Bar (Centered, matching Playbaji) */}
                    <div className="hidden lg:flex flex-1 max-w-[400px] ml-8">
                        <div className="flex items-center bg-[var(--bg-2)] border border-[var(--border)] rounded w-full px-3 h-[36px] gap-2 focus-within:border-[var(--text-3)] transition-colors">
                            <Search size={16} className="text-[var(--text-3)]" />
                            <input
                                placeholder="Search Events"
                                className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[var(--text-3)]"
                            />
                        </div>
                    </div>

                    {/* Spacer for mobile */}
                    <div className="flex-1 lg:hidden" />

                    {/* Right Side Actions / Auth */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Balance */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                                    <Wallet size={14} className="text-[var(--primary)]" />
                                    <span className="text-[13px] font-bold text-white">৳ {user.balance.toFixed(2)}</span>
                                </div>
                                {/* Username */}
                                <div className="hidden sm:flex items-center gap-2 px-2">
                                    <span className="text-[13px] font-semibold text-[var(--text-2)]">{user.username}</span>
                                </div>
                                {/* Settings & Logout */}
                                <button className="p-1.5 text-[var(--text-2)] hover:text-white transition-colors hidden sm:flex">
                                    <Settings size={18} />
                                </button>
                                <button onClick={logout} title="Log out" className="p-1.5 text-[var(--text-2)] hover:text-[var(--primary)] transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onLoginClick}
                                    className="px-4 h-[36px] bg-transparent text-white text-[13px] font-semibold hover:text-[var(--primary)] transition-colors whitespace-nowrap hidden sm:block"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={onLoginClick}
                                    className="px-5 h-[36px] bg-[var(--primary)] text-black text-[13px] font-bold rounded hover:bg-[var(--primary-d)] transition-colors whitespace-nowrap"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN HEADER NAV (Categories beneath header) */}
            <div className="bg-[var(--surface)] border-b border-[var(--border)] overflow-x-auto scrollbar-hide hidden lg:block">
                <div className="max-w-[1440px] mx-auto px-4 flex items-center h-[50px]">
                    {[
                        { label: "Home", href: "/" },
                        { label: "In-Play", href: "/#", active: true }, // Playbaji highlights In-Play often
                        { label: "Multi Markets", href: "/#" },
                        { label: "Cricket", href: "/?sport=3" },
                        { label: "Soccer", href: "/?sport=1" },
                        { label: "Tennis", href: "/?sport=13" },
                        { label: "Premium Casino", href: "/#" },
                        { label: "Live Casino", href: "/#" },
                        { label: "Slot", href: "/#" },
                        { label: "Table", href: "/#" },
                        { label: "E-Game", href: "/#" },
                        { label: "Aviator", href: "/#" }
                    ].map((item, i) => (
                        <a
                            key={i}
                            href={item.href}
                            className={`px-4 h-full flex items-center text-[14px] font-semibold whitespace-nowrap transition-colors border-b-[3px]
                                ${item.active
                                    ? "text-[var(--primary)] border-[var(--primary)]"
                                    : "text-white border-transparent hover:text-[var(--primary)]"
                                }
                            `}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* MOBILE DRAWER */}
            {menuOpen && (
                <>
                    <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-sm" />
                    <div className="slide-down fixed top-0 left-0 right-0 z-[201] bg-[var(--bg)] border-b border-[var(--border)] pb-4">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                            <span className="font-black text-[20px] text-white">play<span className="text-[var(--primary)]">baji</span></span>
                            <button onClick={() => setMenuOpen(false)} className="text-[var(--text-2)] p-1"><X size={24} /></button>
                        </div>
                        {[
                            { label: "Home", href: "/" },
                            { label: "In-Play", href: "/#" },
                            { label: "Cricket", href: "/?sport=3" },
                            { label: "Soccer", href: "/?sport=1" },
                            { label: "Live Casino", href: "/#" },
                            { label: "Slot Games", href: "/#" }
                        ].map((link) => (
                            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                                className="flex items-center px-5 py-3.5 text-white text-[15px] font-semibold border-b border-[var(--border)]">
                                {link.label}
                            </a>
                        ))}
                        <div className="p-4 flex gap-3">
                            {user ? (
                                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex-1 py-3 rounded bg-red-500/10 text-red-500 font-bold border border-red-500/20">Log out</button>
                            ) : (
                                <>
                                    <button onClick={() => { onLoginClick?.(); setMenuOpen(false); }} className="flex-1 py-3 rounded border border-[var(--border)] text-white font-bold">Login</button>
                                    <button onClick={() => { onLoginClick?.(); setMenuOpen(false); }} className="flex-1 py-3 rounded bg-[var(--primary)] text-black font-bold">Sign Up</button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
