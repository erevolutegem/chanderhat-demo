import React from "react";
import { useSite } from "@/lib/SiteContext";

const Footer = () => {
    const { site } = useSite();
    const displayName = site?.name || "ChanderHat";

    return (
        <footer className="border-t border-[#2d3348] pb-20 lg:pb-0" style={{ background: "#161b28" }}>
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="col-span-2 md:col-span-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
                            <span className="text-white font-black text-xs">C</span>
                        </div>
                        <span className="text-white font-black text-base">
                            Chander<span className="text-green-400">Hat</span>
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Bangladesh's trusted sports betting platform. Safe, secure & fair.
                    </p>
                    <div className="flex gap-2">
                        {["bKash", "Nagad", "Rocket"].map(p => (
                            <span key={p} className="text-[9px] font-bold px-2 py-1 rounded bg-[#242938] text-slate-400 border border-[#353c52]">{p}</span>
                        ))}
                    </div>
                </div>

                {/* Sports */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sports</p>
                    {["Cricket", "Soccer", "Tennis", "Basketball", "Exchange"].map(s => (
                        <a key={s} href="#" className="block text-xs text-slate-400 hover:text-green-400 transition-colors">{s}</a>
                    ))}
                </div>

                {/* Support */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Support</p>
                    {["Help Center", "Terms & Conditions", "Responsible Gaming", "Privacy Policy"].map(s => (
                        <a key={s} href="#" className="block text-xs text-slate-400 hover:text-green-400 transition-colors">{s}</a>
                    ))}
                </div>

                {/* Trust */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Trust</p>
                    <div className="flex flex-col gap-2">
                        {[["✅", "Licensed & Regulated"], ["🔒", "SSL Secured"], ["⚡", "Instant Payouts"], ["🎧", "24/7 Support"]].map(([icon, label]) => (
                            <div key={label as string} className="flex items-center gap-2">
                                <span className="text-sm">{icon}</span>
                                <span className="text-xs text-slate-400">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-[#2d3348] py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-[11px] text-slate-600">© {new Date().getFullYear()} ChanderHat. All rights reserved.</p>
                    <p className="text-[11px] text-slate-600">18+ Gamble Responsibly.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
