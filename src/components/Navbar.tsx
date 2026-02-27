"use client";
import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "In-Play", href: "/", icon: "🔴", live: true },
    { label: "Cricket", href: "/?sport=3", icon: "🏏" },
    { label: "Soccer", href: "/?sport=1", icon: "⚽" },
    { label: "Tennis", href: "/?sport=13", icon: "🎾" },
    { label: "Basketball", href: "/?sport=18", icon: "🏀" },
    { label: "Casino", href: "#", icon: "🎰" },
    { label: "Slots", href: "#", icon: "🃏" },
];

export default function Navbar({ onLoginClick }: { onLoginClick?: () => void }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            {/* ── Sticky wrapper ── */}
            <div className="sticky top-0 z-50">

                {/* TOP BAR */}
                <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #0d0d2a 100%)", borderBottom: "1px solid #2a2a4a" }}>
                    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 12px", height: 56, display: "flex", alignItems: "center", gap: 12 }}>

                        {/* Hamburger (mobile) */}
                        <button onClick={() => setMenuOpen(true)} style={{ display: "flex", color: "#9999bb", background: "none", border: "none", cursor: "pointer" }} className="lg:hidden">
                            <Menu size={20} />
                        </button>

                        {/* Logo */}
                        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e02020", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 14 }}>P</div>
                            <span style={{ fontWeight: 900, color: "#fff", fontSize: 18, letterSpacing: -0.5, display: "none" }} className="sm:!inline">
                                Play<span style={{ color: "#ffd700" }}>Baji</span>
                            </span>
                        </a>

                        {/* Spacer */}
                        <div style={{ flex: 1 }} />

                        {/* Search */}
                        {searchOpen ? (
                            <div style={{ display: "flex", alignItems: "center", background: "#0d0d1a", border: "1px solid #2a2a4a", borderRadius: 8, padding: "0 10px", height: 36, gap: 8, width: 200 }}>
                                <Search size={14} color="#555578" />
                                <input autoFocus onBlur={() => setSearchOpen(false)} placeholder="Search matches…"
                                    style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, width: "100%" }} />
                            </div>
                        ) : (
                            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", color: "#9999bb", cursor: "pointer", padding: 6, display: "none" }} className="sm:!flex">
                                <Search size={16} />
                            </button>
                        )}

                        {/* Auth buttons */}
                        <button onClick={onLoginClick}
                            style={{ padding: "6px 14px", background: "none", border: "1px solid #3a3a5a", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                            Login
                        </button>
                        <button onClick={onLoginClick}
                            style={{ padding: "6px 14px", background: "#e02020", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                            Register
                        </button>
                    </div>
                </div>

                {/* NAV STRIP */}
                <div style={{ background: "#0d0d1a", borderBottom: "2px solid #e02020", overflowX: "auto" }}>
                    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 8px", display: "flex", alignItems: "center" }}>
                        {NAV_LINKS.map(({ label, href, icon, live }) => (
                            <a key={label} href={href}
                                style={{
                                    display: "flex", alignItems: "center", gap: 5,
                                    padding: "10px 14px", textDecoration: "none",
                                    fontSize: 13, fontWeight: 600, color: "#9999bb",
                                    borderBottom: "2px solid transparent",
                                    whiteSpace: "nowrap", flexShrink: 0, transition: "color 0.15s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#ffd700"; e.currentTarget.style.borderBottomColor = "#ffd700"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#9999bb"; e.currentTarget.style.borderBottomColor = "transparent"; }}
                            >
                                {live && <span className="live-dot" />}
                                <span>{icon}</span>
                                <span>{label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            {menuOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 300 }} className="lg:hidden">
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" }} onClick={() => setMenuOpen(false)} />
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "linear-gradient(180deg,#1a1a3e 0%,#0d0d2a 100%)", borderRight: "1px solid #2a2a4a", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 56, borderBottom: "1px solid #2a2a4a" }}>
                            <span style={{ fontWeight: 900, color: "#fff", fontSize: 18 }}>Play<span style={{ color: "#ffd700" }}>Baji</span></span>
                            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#9999bb", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                            {NAV_LINKS.map(({ label, href, icon, live }) => (
                                <a key={label} href={href} onClick={() => setMenuOpen(false)}
                                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 12px", borderRadius: 10, textDecoration: "none", color: "#9999bb", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                                    {live && <span className="live-dot" />}
                                    <span style={{ fontSize: 18 }}>{icon}</span>
                                    {label}
                                </a>
                            ))}
                        </div>
                        <div style={{ padding: 12, borderTop: "1px solid #2a2a4a", display: "flex", flexDirection: "column", gap: 8 }}>
                            <button onClick={() => { onLoginClick?.(); setMenuOpen(false); }}
                                style={{ padding: "10px", border: "1px solid #3a3a5a", borderRadius: 10, color: "#fff", fontWeight: 600, fontSize: 13, background: "none", cursor: "pointer" }}>Login</button>
                            <button onClick={() => { onLoginClick?.(); setMenuOpen(false); }}
                                style={{ padding: "10px", background: "#e02020", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Register</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
