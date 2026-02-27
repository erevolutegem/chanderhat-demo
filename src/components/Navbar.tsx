"use client";
import React, { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown, Wallet, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { label: "In-Play", href: "/", badge: "LIVE", badgeColor: "#e8173a" },
    { label: "Cricket", href: "/?sport=3", icon: "🏏" },
    { label: "Soccer", href: "/?sport=1", icon: "⚽" },
    { label: "Tennis", href: "/?sport=13", icon: "🎾" },
    { label: "Basketball", href: "/?sport=18", icon: "🏀" },
    { label: "Live Casino", href: "#", icon: "🎲" },
    { label: "Slots", href: "#", icon: "🃏" },
    { label: "Aviator", href: "#", icon: "✈️" },
    { label: "Promotions", href: "#", icon: "🎁" },
];

export default function Navbar({ onLoginClick }: { onLoginClick?: () => void }) {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearch] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <div className="sticky top-0 z-50" style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none" }}>

                {/* ─── TOP BAR ─────────────────────────────────────────── */}
                <div style={{ background: "linear-gradient(180deg,#1c1b2e 0%,#151424 100%)", borderBottom: "1px solid #2d2c45" }}>
                    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 16px", height: 58, display: "flex", alignItems: "center", gap: 10 }}>

                        {/* Hamburger — mobile only */}
                        <button onClick={() => setMenuOpen(true)} className="lg:hidden"
                            style={{ background: "none", border: "none", color: "#9997b8", cursor: "pointer", padding: 4, display: "flex" }}>
                            <Menu size={22} />
                        </button>

                        {/* Logo */}
                        <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "linear-gradient(135deg, #e8173a 0%, #ff4d6d 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 900, color: "#fff", fontSize: 16, letterSpacing: -0.5,
                                boxShadow: "0 2px 12px rgba(232,23,58,0.45)"
                            }}>P</div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span style={{ fontWeight: 900, fontSize: 19, color: "#fff", letterSpacing: -0.8, lineHeight: 1 }}>
                                    Play<span style={{ color: "#f5c518" }}>Baji</span>
                                </span>
                                <span style={{ fontSize: 9, fontWeight: 600, color: "#5e5c7a", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>SPORTS BETTING</span>
                            </div>
                        </a>

                        {/* Spacer */}
                        <div style={{ flex: 1 }} />

                        {/* Search */}
                        {searchOpen ? (
                            <div style={{ display: "flex", alignItems: "center", background: "#0d0c1a", border: "1px solid #3d3c58", borderRadius: 8, padding: "0 12px", height: 38, gap: 8, width: 220 }}>
                                <Search size={13} color="#5e5c7a" />
                                <input autoFocus onBlur={() => setSearch(false)} placeholder="Search teams, leagues…"
                                    style={{ background: "none", border: "none", outline: "none", color: "#e2e1ef", fontSize: 13, width: "100%" }} />
                            </div>
                        ) : (
                            <button onClick={() => setSearch(true)} className="hidden sm:flex" title="Search"
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "#5e5c7a", padding: 6, borderRadius: 6, transition: "color 0.15s"
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#9997b8")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#5e5c7a")}>
                                <Search size={17} />
                            </button>
                        )}

                        {/* Auth state: Logged In vs Logged Out */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Balance chip */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <Wallet size={14} className="text-emerald-500" />
                                    <span className="text-[13px] font-bold text-emerald-400">৳ {user.balance.toFixed(2)}</span>
                                </div>
                                {/* Username */}
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#1a192a", border: "1px solid #2d2c45" }}>
                                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[13px] font-semibold text-[#e2e1ef]">{user.username}</span>
                                </div>
                                {/* Logout */}
                                <button onClick={logout} title="Log out" className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={onLoginClick}
                                    style={{ padding: "8px 16px", background: "none", border: "1px solid #3d3c58", borderRadius: 8, color: "#e2e1ef", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "border-color 0.15s", whiteSpace: "nowrap" }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#9997b8")}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#3d3c58")}>
                                    Log in
                                </button>
                                <button onClick={onLoginClick}
                                    style={{ padding: "8px 18px", background: "linear-gradient(135deg,#e8173a 0%,#c8102e 100%)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(232,23,58,0.35)", transition: "box-shadow 0.15s" }}
                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,23,58,0.55)")}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 10px rgba(232,23,58,0.35)")}>
                                    Join Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── NAV STRIP ───────────────────────────────────────── */}
                <div style={{ background: "#100f1e", borderBottom: "1px solid #2d2c45", overflowX: "auto" }} className="scrollbar-hide">
                    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "stretch" }}>
                        {NAV_LINKS.map(({ label, href, icon, badge, badgeColor }) => (
                            <a key={label} href={href}
                                style={{
                                    display: "flex", alignItems: "center", gap: 5, padding: "0 14px", height: 40, textDecoration: "none",
                                    fontSize: 13, fontWeight: 600, color: "#9997b8", whiteSpace: "nowrap", flexShrink: 0,
                                    borderBottom: "2px solid transparent", transition: "color 0.15s, border-color 0.15s"
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#e8173a"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#9997b8"; (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}>
                                {icon && <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>}
                                {label}
                                {badge && (
                                    <span style={{ padding: "1px 5px", borderRadius: 4, background: badgeColor ?? "#e8173a", color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase" }}>
                                        {badge}
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── MOBILE DRAWER ───────────────────────────────────────── */}
            {menuOpen && (
                <>
                    <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, backdropFilter: "blur(4px)" }} />
                    <div className="slide-down" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 201, background: "#1c1b2e", borderBottom: "2px solid #2d2c45", paddingBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #2d2c45" }}>
                            <span style={{ fontWeight: 900, fontSize: 17, color: "#fff" }}>Play<span style={{ color: "#f5c518" }}>Baji</span></span>
                            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#9997b8", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        {NAV_LINKS.map(({ label, href, icon, badge }) => (
                            <a key={label} href={href} onClick={() => setMenuOpen(false)}
                                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", textDecoration: "none", color: "#e2e1ef", fontSize: 14, fontWeight: 600, borderBottom: "1px solid #201f30" }}>
                                {icon && <span>{icon}</span>}
                                <span style={{ flex: 1 }}>{label}</span>
                                {badge && <span style={{ padding: "2px 6px", borderRadius: 4, background: "#e8173a", color: "#fff", fontSize: 10, fontWeight: 800 }}>{badge}</span>}
                            </a>
                        ))}
                        <div style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                            {user ? (
                                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ flex: 1, padding: "11px 0", borderRadius: 8, border: "1px solid #3d3c58", background: "rgba(255,0,0,0.1)", color: "#ff4d4d", fontWeight: 700, cursor: "pointer" }}>Log out</button>
                            ) : (
                                <>
                                    <button onClick={() => { onLoginClick?.(); setMenuOpen(false); }} style={{ flex: 1, padding: "11px 0", borderRadius: 8, border: "1px solid #3d3c58", background: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Log in</button>
                                    <button onClick={() => { onLoginClick?.(); setMenuOpen(false); }} style={{ flex: 1, padding: "11px 0", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#e8173a,#c8102e)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Join Now</button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
