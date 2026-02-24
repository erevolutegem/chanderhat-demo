import React from "react";
import { cn } from "@/lib/utils";
import { useSite } from "@/lib/SiteContext";

const Footer = () => {
    const { site } = useSite();
    const displayName = site?.name || "PLAYBAJI";
    const initial = displayName.charAt(0);
    const part1 = displayName.substring(0, 4);
    const part2 = displayName.substring(4);

    return (
        <footer className="w-full bg-secondary-dark text-white/60 py-12 px-4 border-t border-white/5 pb-24 lg:pb-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center overflow-hidden">
                            {site?.logoUrl ? (
                                <img src={site.logoUrl} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-primary-dark font-bold text-sm italic">{initial}</span>
                            )}
                        </div>
                        <span className="text-xl font-black italic tracking-tighter text-white uppercase">
                            {part1}<span className="text-accent-yellow">{part2}</span>
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        The world's leading sports betting exchange. We provide the best odds and high-performance gaming experience.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Responsible Gaming</a></li>
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Platforms</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Sportsbook</a></li>
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Live Casino</a></li>
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Slot Games</a></li>
                        <li><a href="#" className="hover:text-accent-yellow transition-colors">Table Games</a></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest opacity-40">Payment Methods</h4>
                        <div className="flex flex-wrap gap-3">
                            <PaymentIcon color="bg-bkash" label="bKash" />
                            <PaymentIcon color="bg-nagad" label="Nagad" />
                            <PaymentIcon color="bg-rocket" label="Rocket" />
                            <PaymentIcon color="bg-white/10" label="Visa" />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest opacity-40">Follow Us</h4>
                    <div className="flex gap-4">
                        <SocialIcon icon="f" />
                        <SocialIcon icon="t" />
                        <SocialIcon icon="i" />
                        <SocialIcon icon="y" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-white/5">
                <TrustBadge title="Licensed" desc="Curacao Gaming" />
                <TrustBadge title="Secure" desc="SSL Encrypted" />
                <TrustBadge title="Fast" desc="Instant Payout" />
                <TrustBadge title="Support" desc="24/7 Human" />
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                <p>© 2024 Playbaji. All Rights Reserved.</p>
                <div className="flex gap-6">
                    <span className="flex items-center gap-1">Fast Withdrawals <span className="text-accent-blue">●</span></span>
                    <span className="flex items-center gap-1">Secure Payments <span className="text-accent-blue">●</span></span>
                    <span className="flex items-center gap-1">24/7 Support <span className="text-accent-blue">●</span></span>
                </div>
            </div>
        </footer>
    );
};

const PaymentIcon = ({ color, label }: { color: string; label: string }) => (
    <div className={cn("px-2 py-1.5 rounded-md flex items-center justify-center text-[8px] font-black uppercase text-white shadow-sm transition-transform hover:scale-105 cursor-pointer", color)}>
        {label}
    </div>
);

const SocialIcon = ({ icon }: { icon: string }) => (
    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sm font-black text-white/40 hover:text-accent-yellow hover:border-accent-yellow transition-all cursor-pointer">
        {icon}
    </div>
);

const TrustBadge = ({ title, desc }: { title: string; desc: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase text-white tracking-widest">{title}</span>
        <span className="text-[9px] text-white/40">{desc}</span>
    </div>
);

export default Footer;
