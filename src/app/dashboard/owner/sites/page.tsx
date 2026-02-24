"use client";

import React from "react";
import { Globe, Plus, Search, ExternalLink, Settings, MoreVertical, Trash2, Edit, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const SitesManager = () => {
    const [isDeployModalOpen, setIsDeployModalOpen] = React.useState(false);
    const [sites] = React.useState([
        { id: 1, domain: "playbaji.live", template: "playbaji", users: "1,250", revenue: "$45,280", status: "online", growth: "+12%" },
        { id: 2, domain: "chanderhat.demo", template: "classic", users: "12", revenue: "$120", status: "setup", growth: "0%" },
        { id: 3, domain: "sportsbet.pro", template: "dark-premium", users: "890", revenue: "$12,450", status: "online", growth: "+5%" },
    ]);

    return (
        <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 md:gap-12">
                <div>
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight tracking-tighter text-gradient">
                        My <span className="text-white">Whitelabels</span>
                    </h2>
                    <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-white/30 mt-2 md:mt-3 pl-1 border-l-2 border-accent-yellow/30">
                        Operational matrix of federated sportsbooks
                    </p>
                </div>
                <button
                    onClick={() => setIsDeployModalOpen(true)}
                    className="flex items-center justify-center gap-4 px-8 md:px-10 py-4 md:py-6 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-accent-yellow/20 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> Deploy New Site
                </button>
            </div>

            {/* Deploy Modal */}
            <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent-yellow transition-all duration-500 group-focus-within:scale-110" />
                    <input
                        type="text"
                        placeholder="Search Whitelabel Cluster..."
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-accent-yellow/40 outline-none rounded-2xl md:rounded-[2rem] py-4.5 md:py-6 pl-16 pr-8 text-xs md:text-sm font-black text-white transition-all shadow-2xl backdrop-blur-xl tracking-wider placeholder:text-white/10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar shrink-0 no-scrollbar">
                    <FilterBadge label="All Systems" active />
                    <FilterBadge label="Online" />
                    <FilterBadge label="Maintenance" />
                    <FilterBadge label="Setup" />
                </div>
            </div>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                {sites.map((site) => (
                    <div key={site.id} className="glass-card p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 hover:border-accent-yellow/20 transition-all group relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-yellow/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-accent-yellow text-xl md:text-3xl shadow-2xl border border-white/5 italic group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                                    {site.domain[0].toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-base md:text-xl italic leading-none tracking-tight group-hover:text-accent-yellow transition-colors">{site.domain}</h4>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1 md:mt-2">{site.template}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-pulse",
                                site.status === 'online' ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" : "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
                            <div className="p-4 md:p-6 bg-white/[0.03] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 group-hover:border-white/10 transition-colors">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Network Nodes</p>
                                <p className="text-xl md:text-3xl font-black text-white italic">{site.users}</p>
                            </div>
                            <div className="p-4 md:p-6 bg-white/[0.03] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 group-hover:border-white/10 transition-colors">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Aggregate yield</p>
                                <p className="text-xl md:text-3xl font-black text-accent-yellow italic">{site.revenue}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 md:gap-4 relative z-10">
                            <button className="flex-1 px-6 py-4 md:py-5 bg-white/5 hover:bg-white/10 rounded-2xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-white/5 active:scale-95 group/manage">
                                <Settings className="w-4 h-4 md:w-5 h-5 group-hover/manage:rotate-90 transition-transform duration-500" /> Control
                            </button>
                            <button className="p-4 md:p-5 bg-white/5 hover:bg-accent-yellow hover:text-primary-dark rounded-2xl md:rounded-[1.5rem] transition-all shadow-2xl border border-white/5 group/btn active:scale-95">
                                <ExternalLink className="w-5 h-5 md:w-6 h-6 group-hover/btn:scale-110 transition-transform" />
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
        "px-6 py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all border shrink-0 active:scale-95",
        active ? "bg-accent-yellow border-accent-yellow text-primary-dark shadow-2xl shadow-accent-yellow/20" : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
    )}>
        {label}
    </button>
);

const DeployModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-primary-dark/80 backdrop-blur-3xl z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-secondary-dark border-t sm:border border-white/5 w-full max-w-2xl max-h-[95vh] flex flex-col rounded-t-[2.5rem] sm:rounded-[3.5rem] relative animate-in slide-in-from-bottom-20 duration-500 overflow-hidden group shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                <div className="absolute -right-32 -top-32 w-80 h-80 bg-accent-yellow/5 rounded-full blur-[100px]" />

                {/* Modal Header */}
                <div className="p-8 md:p-12 pb-4 md:pb-6 flex items-center justify-between border-b border-white/5">
                    <div>
                        <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                            Deploy <span className="text-accent-yellow">Whitelabel</span>
                        </h3>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-2">Initialize new node in the matrix</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all active:scale-95">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-6 md:space-y-8">
                            <ModalInput label="Domain Namespace" placeholder="e.g. baji-live.net" />
                            <ModalInput label="Operational Title" placeholder="e.g. Baji Live" />
                            <div className="space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.2em] pl-1">Configuration Template</label>
                                <div className="relative group">
                                    <select className="w-full bg-white/[0.03] border border-white/5 outline-none rounded-2xl md:rounded-[1.5rem] py-4.5 md:py-6 px-6 md:px-8 text-xs md:text-sm font-black text-white focus:border-accent-yellow/40 transition-all appearance-none cursor-pointer tracking-wider">
                                        <option className="bg-secondary-dark">Modern Playbaji (v2)</option>
                                        <option className="bg-secondary-dark">Midnight Sports</option>
                                        <option className="bg-secondary-dark">Classic Premium</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-accent-yellow transition-colors">
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.2em] pl-1">Identity Assets</label>
                            <div className="w-full h-48 md:h-full bg-white/[0.02] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 group/drop hover:border-accent-yellow/40 transition-all cursor-pointer shadow-inner">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover/drop:scale-110 group-hover/drop:bg-accent-yellow/10 transition-all">
                                    <Globe className="w-8 h-8 text-white/20 group-hover/drop:text-accent-yellow transition-colors" />
                                </div>
                                <p className="text-[10px] md:text-xs font-black uppercase text-white/30 group-hover/drop:text-white transition-colors leading-relaxed tracking-widest">
                                    Upload Brand Logo<br />
                                    <span className="text-[8px] md:text-[9px] font-bold text-white/10 block mt-2 opacity-50">PNG/SVG MAX 2MB</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-8 md:p-12 pt-6 md:pt-8 bg-secondary-dark/80 backdrop-blur-3xl border-t border-white/5 flex flex-col sm:flex-row gap-4">
                    <button onClick={onClose} className="flex-1 py-5 md:py-6 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all order-2 sm:order-1 active:scale-95">Cancel Operation</button>
                    <button className="flex-1 py-5 md:py-6 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-accent-yellow/20 order-1 sm:order-2 active:scale-95">Initiate Deployment</button>
                </div>
            </div>
        </div>
    );
};

const ModalInput = ({ label, placeholder }: any) => (
    <div className="space-y-3">
        <label className="text-[9px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.2em] pl-1">{label}</label>
        <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-white/[0.03] border border-white/5 outline-none rounded-2xl md:rounded-[1.5rem] py-4.5 md:py-6 px-6 md:px-8 text-xs md:text-sm font-black text-white transition-all focus:border-accent-yellow/40 tracking-wider placeholder:text-white/5"
        />
    </div>
);


export default SitesManager;
