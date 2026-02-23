import React from "react";
import { cn } from "@/lib/utils";

const Footer = () => {
    return (
        <footer className="w-full bg-secondary-dark text-white/60 py-12 px-4 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center">
                            <span className="text-primary-dark font-bold text-sm italic">PB</span>
                        </div>
                        <span className="text-xl font-black italic tracking-tighter text-white">PLAY<span className="text-accent-yellow">BAJI</span></span>
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

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Compliance</h4>
                    <div className="flex flex-wrap gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center font-bold text-xs">18+</div>
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center font-bold text-xs underlineital">GC</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
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

export default Footer;
