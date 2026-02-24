"use client";

import React from "react";
import { TrendingUp, Globe, Users, DollarSign, Activity, ArrowUpRight, Download, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const OwnerOverview = () => {
    return (
        <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 md:gap-12">
                <div>
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight tracking-tighter text-gradient">
                        Global <span className="text-white">Performance</span>
                    </h2>
                    <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-white/30 mt-2 md:mt-3 pl-1 border-l-2 border-accent-yellow/30">
                        Real-time intelligence across all nodes
                    </p>
                </div>
                <button className="flex items-center justify-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 border border-white/5 shadow-2xl backdrop-blur-xl group">
                    <Download className="w-4 h-4 md:w-5 h-5 group-hover:translate-y-0.5 transition-transform" /> Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                <StatCard
                    icon={<Globe className="w-5 h-5 md:w-8 h-8" />}
                    label="Active Whitelabels"
                    value="08"
                    trend="+2 New"
                    gradient="from-blue-600/20 to-cyan-500/20"
                />
                <StatCard
                    icon={<Users className="w-5 h-5 md:w-8 h-8" />}
                    label="Global Playerbase"
                    value="12,450"
                    trend="+15.2%"
                    gradient="from-purple-600/20 to-pink-500/20"
                />
                <div className="h-48 md:h-72 w-full relative sm:col-span-2 lg:col-span-2 glass-card rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/30">Traffic Velocity</h4>
                        <Activity className="w-4 h-4 text-accent-yellow animate-glow" />
                    </div>
                    <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#facc15" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 0,180 Q 50,170 100,140 T 200,100 T 300,150 T 400,80 T 500,60 T 600,120 T 700,90 T 800,40 T 900,70 T 1000,30 V 200 H 0 Z"
                            fill="url(#chartGradient)"
                            className="animate-pulse duration-[4000ms]"
                        />
                        <path
                            d="M 0,180 Q 50,170 100,140 T 200,100 T 300,150 T 400,80 T 500,60 T 600,120 T 700,90 T 800,40 T 900,70 T 1000,30"
                            fill="none"
                            stroke="#facc15"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                        />
                    </svg>
                </div>
            </div>

            {/* Sites List (Simplified for Overview) */}
            <div className="glass-card rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[100px] group-hover:bg-accent-yellow/10 transition-all duration-1000" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
                    <div>
                        <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tighter italic mb-2">
                            Deployment <span className="text-accent-yellow">Matrix</span>
                        </h3>
                        <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-white/20">Operational status of all federated domains</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] md:text-xs font-black uppercase text-emerald-500 tracking-widest">All Systems Nominal</span>
                    </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                    <ServerItem domain="playbaji.live" status="Active" users="4,520" load="12%" />
                    <ServerItem domain="chanderhat.demo" status="Setup" users="12" load="01%" warning />
                    <ServerItem domain="sportsbet.pro" status="Active" users="8,910" load="45%" />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, gradient }: any) => (
    <div className={cn(
        "bg-white/[0.02] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 group hover:border-accent-yellow/20 transition-all relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700",
        gradient ? `before:${gradient}` : "before:from-white/5 before:to-transparent"
    )}>
        <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center text-accent-yellow transition-all group-hover:scale-110 group-hover:rotate-6 border border-white/5 shadow-xl">
                {icon}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5 group-hover:text-white transition-colors">
                {trend}
            </div>
        </div>
        <div className="space-y-1 md:space-y-2 relative z-10">
            <p className="text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
            <p className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{value}</p>
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent-yellow/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
);

const ServerItem = ({ domain, status, users, load, warning }: any) => (
    <div className="flex items-center justify-between p-5 md:p-8 bg-white/[0.02] rounded-2xl md:rounded-3xl border border-white/5 hover:border-accent-yellow/10 transition-all group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-yellow/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 md:gap-8 relative z-10">
            <div className={cn(
                "w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-xl transition-all group-hover:scale-110 group-hover:-rotate-3 shadow-2xl",
                warning ? "bg-orange-500/20 text-orange-400 border border-orange-500/20" : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
            )}>
                {domain[0].toUpperCase()}
            </div>
            <div>
                <p className="text-sm md:text-xl font-black text-white tracking-tight">{domain}</p>
                <div className="flex items-center gap-3 mt-1 md:mt-1.5">
                    <span className={cn(
                        "text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        warning ? "bg-orange-500/10 text-orange-400" : "bg-emerald-500/10 text-emerald-400"
                    )}>{status}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-6 md:gap-16 relative z-10">
            <div className="hidden sm:block text-right">
                <p className="text-[10px] md:text-xs uppercase font-black text-white/20 tracking-widest mb-1">Scale</p>
                <div className="flex items-center gap-2">
                    <div className="w-20 md:w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000", warning ? "bg-orange-500 w-[1%]" : "bg-accent-yellow w-[65%]")} />
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] md:text-xs uppercase font-black text-white/20 tracking-widest leading-none mb-1">Players</p>
                <p className="text-sm md:text-xl font-black text-white leading-none">{users}</p>
            </div>
            <button className="p-3 md:p-5 bg-white/5 hover:bg-accent-yellow hover:text-primary-dark rounded-xl md:rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-xl">
                <ArrowUpRight className="w-5 h-5 md:w-6 h-6 animate-pulse" />
            </button>
        </div>
    </div>
);


export default OwnerOverview;
