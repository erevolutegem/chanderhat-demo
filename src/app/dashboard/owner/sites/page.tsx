"use client";

import React from "react";
import { Globe, Plus, Search, ExternalLink, Settings, MoreVertical, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

const SitesManager = () => {
    const [isDeployModalOpen, setIsDeployModalOpen] = React.useState(false);
    const [sites] = React.useState([
        { id: 1, domain: "playbaji.live", template: "playbaji", users: 1250, revenue: "$45,280", status: "online" },
        { id: 2, domain: "chanderhat.demo", template: "classic", users: 12, revenue: "$120", status: "setup" },
        { id: 3, domain: "sportsbet.pro", template: "dark-premium", users: 890, revenue: "$12,450", status: "online" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl md:text-3xl font-black uppercase italic text-white leading-tight">My <span className="text-accent-yellow text-2xl md:text-4xl">Whitelabels</span></h2>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1.5">Scale and manage your network of sportsbooks</p>
                </div>
                <button
                    onClick={() => setIsDeployModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10"
                >
                    <Plus className="w-5 h-5" /> Deploy New Site
                </button>
            </div>

            {/* Deploy Modal */}
            <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-yellow transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Whitelabel..."
                        className="w-full bg-secondary-dark border border-white/5 focus:border-accent-yellow/50 outline-none rounded-xl py-3.5 pl-12 pr-6 text-xs font-bold text-white transition-all shadow-inner"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar shrink-0">
                    <FilterBadge label="All Sites" active />
                    <FilterBadge label="Online" />
                    <FilterBadge label="Maintenance" />
                </div>
            </div>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {sites.map((site) => (
                    <div key={site.id} className="bg-secondary-dark/50 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:border-accent-yellow/20 transition-all group relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute -right-4 -top-4 w-20 md:w-24 h-20 md:h-24 bg-accent-yellow/5 rounded-full blur-3xl group-hover:bg-accent-yellow/10 transition-all" />

                        <div className="flex justify-between items-start mb-5 md:mb-6">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-accent-yellow text-lg md:text-xl shadow-inner italic">
                                    {site.domain[0].toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-sm md:text-base italic leading-tight">{site.domain}</h4>
                                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/20">{site.template}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full",
                                site.status === 'online' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                            <div className="p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/20 mb-0.5">Total Users</p>
                                <p className="text-lg md:text-xl font-black text-white">{site.users}</p>
                            </div>
                            <div className="p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/20 mb-0.5">Net Revenue</p>
                                <p className="text-lg md:text-xl font-black text-emerald-400">{site.revenue}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                <Settings className="w-3.5 h-3.5" /> Manage
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-accent-yellow hover:text-primary-dark rounded-xl transition-all shadow-xl group/btn">
                                <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FilterBadge = ({ label, active }: { label: string; active?: boolean }) => (
    <button className={cn(
        "px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
        active ? "bg-accent-yellow border-accent-yellow text-primary-dark shadow-lg shadow-accent-yellow/10" : "bg-white/5 border-white/5 text-white/40 hover:text-white"
    )}>
        {label}
    </button>
);

const DeployModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
            <div className="bg-secondary-dark border border-white/5 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative animate-in zoom-in-95 duration-300 custom-scrollbar">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-yellow/10 rounded-full blur-[80px]" />

                <h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-6 md:mb-8 leading-tight">Deploy <span className="text-accent-yellow">Whitelabel</span></h3>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="flex-1 space-y-5 md:space-y-6">
                        <div className="space-y-2">
                            <label className="text-[8px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">Domain Name</label>
                            <input type="text" placeholder="e.g. baji-live.net" className="w-full bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/40 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">Site Title</label>
                            <input type="text" placeholder="e.g. Baji Live" className="w-full bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/40 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">Choose Template</label>
                            <select className="w-full bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/40 transition-all appearance-none cursor-pointer">
                                <option className="bg-secondary-dark">Modern Playbaji (v2)</option>
                                <option className="bg-secondary-dark">Midnight Sports</option>
                                <option className="bg-secondary-dark">Classic Premium</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full md:w-52 h-36 md:h-52 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-4 md:p-6 group hover:border-accent-yellow/40 transition-all cursor-pointer">
                        <Globe className="w-6 h-6 md:w-10 h-10 text-white/20 group-hover:text-accent-yellow transition-colors mb-2 md:mb-3" />
                        <p className="text-[7px] md:text-[10px] font-black uppercase text-white/20 group-hover:text-white transition-colors leading-tight">Upload Site Logo<br /><span className="text-[7px] font-medium tracking-normal mt-1 block">PNG or SVG (Max 2MB)</span></p>
                    </div>
                </div>

                <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4">
                    <button onClick={onClose} className="flex-1 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all order-2 sm:order-1">Cancel</button>
                    <button className="flex-1 py-4 md:py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/20 order-1 sm:order-2">Initiate Deployment</button>
                </div>
            </div>
        </div>
    );
};

const ModalInput = ({ label, placeholder }: any) => (
    <div className="space-y-2.5">
        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">{label}</label>
        <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white transition-all focus:border-accent-yellow/40"
        />
    </div>
);

export default SitesManager;
