"use client";

import React from "react";
import { TrendingUp, Globe, Users, DollarSign, Activity, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const OwnerOverview = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white">Global <span className="text-accent-yellow text-4xl">Performance</span></h2>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mt-2">Real-time statistics across all domains</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Download Report</button>
                    <button className="px-6 py-3 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-accent-yellow/10">Create New Site</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Globe className="w-6 h-6" />} label="Total Sites" value="08" trend="+2 New" />
                <StatCard icon={<Users className="w-6 h-6" />} label="Total Players" value="12,450" trend="+15%" />
                <StatCard icon={<DollarSign className="w-6 h-6" />} label="Net Revenue" value="$45,280" trend="+24%" green />
                <StatCard icon={<Activity className="w-6 h-6" />} label="Active Sessions" value="1,204" trend="Live" pulse />
            </div>

            {/* Revenue Analytics Chart */}
            <div className="bg-secondary-dark rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-xl font-black uppercase text-white flex items-center gap-3">
                            <div className="w-2 h-6 bg-accent-yellow rounded-full" />
                            Revenue Analytics
                        </h3>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-1">Net revenue growth over the last 30 days</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent-yellow" />
                                <span className="text-[10px] font-black text-white/40 uppercase">This Month</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                <span className="text-[10px] font-black text-white/40 uppercase">Prev Month</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full relative">
                    <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d">
                        {/* Grid Lines */}
                        {[0, 50, 100, 150].map(y => (
                            <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="white" strokeOpacity="0.03" strokeWidth="1" />
                        ))}

                        {/* Area Gradient */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffc107" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ffc107" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Chart Path */}
                        <path
                            d="M 0,180 Q 50,170 100,140 T 200,100 T 300,150 T 400,80 T 500,60 T 600,120 T 700,90 T 800,40 T 900,70 T 1000,30 V 200 H 0 Z"
                            fill="url(#chartGradient)"
                            className="animate-pulse duration-[4000ms]"
                        />
                        <path
                            d="M 0,180 Q 50,170 100,140 T 200,100 T 300,150 T 400,80 T 500,60 T 600,120 T 700,90 T 800,40 T 900,70 T 1000,30"
                            fill="none"
                            stroke="#ffc107"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(255,193,7,0.5)]"
                        />

                        {/* Data Points */}
                        {[100, 300, 500, 800, 1000].map((x, i) => (
                            <circle key={i} cx={x} cy={i === 4 ? 30 : (x / 10)} r="4" fill="#ffc107" />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Sites List (Simplified for Overview) */}
            <div className="bg-secondary-dark rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp className="w-48 h-48 text-accent-yellow" />
                </div>

                <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3">
                    <div className="w-2 h-6 bg-accent-yellow rounded-full" />
                    Live Domains Status
                </h3>

                <div className="space-y-4">
                    <ServerItem domain="playbaji.live" status="Active" users="450" load="12%" />
                    <ServerItem domain="chanderhat.demo" status="Setup" users="02" load="01%" warning />
                    <ServerItem domain="sportsbet.pro" status="Active" users="890" load="45%" />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, green, pulse }: any) => (
    <div className="bg-secondary-dark/50 p-6 rounded-3xl border border-white/5 group hover:border-accent-yellow/20 transition-all hover:bg-secondary-dark">
        <div className="flex justify-between items-start mb-6">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                green ? "bg-emerald-500/10 text-emerald-400" : "bg-accent-yellow/10 text-accent-yellow"
            )}>
                {icon}
            </div>
            <div className={cn("text-[10px] font-black uppercase px-2 py-1 rounded-md", green ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40")}>
                {trend}
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-white italic">{value}</p>
        </div>
    </div>
);

const ServerItem = ({ domain, status, users, load, warning }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex items-center gap-4">
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-inner",
                warning ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
            )}>
                {domain[0]}
            </div>
            <div>
                <p className="text-sm font-black text-white">{domain}</p>
                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{status}</p>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-white/20 text-right">Players</p>
                <p className="text-sm font-black text-white">{users}</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2.5 bg-white/5 hover:bg-accent-yellow hover:text-primary-dark rounded-xl transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

export default OwnerOverview;
