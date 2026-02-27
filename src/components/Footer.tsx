"use client";
import React from "react";
import Image from "next/image";
import { Shield, Lock, Phone, Mail } from "lucide-react";

const FOOTER_LINKS = [
    {
        title: "Company",
        links: ["About Us", "Contact Us", "Careers", "Press"],
    },
    {
        title: "Sports",
        links: ["Cricket", "Football", "Tennis", "Basketball", "Horse Racing"],
    },
    {
        title: "Casino",
        links: ["Live Casino", "Slots", "Aviator", "Poker", "Roulette"],
    },
    {
        title: "Support",
        links: ["Help Center", "Responsible Gambling", "Privacy Policy", "Terms & Conditions"],
    },
];

const PAYMENT_METHODS = [
    { label: "bKash", bg: "#E2136E", text: "bKash" },
    { label: "Nagad", bg: "#F05829", text: "Nagad" },
    { label: "Rocket", bg: "#8C3494", text: "Rocket" },
    { label: "DBBL", bg: "#003B7A", text: "DBBL" },
    { label: "Visa", bg: "#1A1F71", text: "VISA" },
];

export default function Footer() {
    return (
        <footer style={{ background: "#0d0d1a", borderTop: "1px solid #2a2a4a" }}>
            {/* Top section */}
            <div className="max-w-[1400px] mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                                style={{ background: "#e02020" }}>P</div>
                            <span className="font-black text-white text-lg">Play<span style={{ color: "#ffd700" }}>Baji</span></span>
                        </div>
                        <p className="text-xs leading-relaxed mb-4" style={{ color: "#555578" }}>
                            Bangladesh's premier live sports betting platform. Real-time odds on cricket, soccer, tennis and more.
                        </p>
                        {/* Contact */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs" style={{ color: "#555578" }}>
                                <Phone className="w-3 h-3" />
                                <span>+880 1XXX-XXXXXX</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "#555578" }}>
                                <Mail className="w-3 h-3" />
                                <span>support@playbaji.live</span>
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
                    {FOOTER_LINKS.map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#ffd700" }}>{title}</h4>
                            <ul className="space-y-2">
                                {links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-xs transition-colors hover:text-white"
                                            style={{ color: "#555578" }}>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment methods */}
            <div className="border-t" style={{ borderColor: "#1e1e3a" }}>
                <div className="max-w-[1400px] mx-auto px-4 py-4">
                    <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: "#444466" }}>Payment Methods</p>
                    <div className="flex flex-wrap gap-2">
                        {PAYMENT_METHODS.map(pm => (
                            <div key={pm.label}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-black text-white"
                                style={{ background: pm.bg }}>
                                {pm.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t" style={{ borderColor: "#1e1e3a" }}>
                <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[11px]" style={{ color: "#333355" }}>
                        © 2025 PlayBaji. All Rights Reserved. Licensed and Regulated.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#333355" }}>
                            <Shield className="w-3 h-3" style={{ color: "#2ecc71" }} />
                            <span>Secure SSL</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#333355" }}>
                            <Lock className="w-3 h-3" style={{ color: "#3498db" }} />
                            <span>256-bit Encrypted</span>
                        </div>
                        <div className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "#1e1e38", color: "#e02020" }}>18+</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
