"use client";

import React, { useState } from "react";
import { Zap, Plus, Edit, Trash2, Key, Link2, Activity, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const ApiManager = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [apis, setApis] = useState([
        { id: 1, name: "BetsAPI V1", provider: "BetsAPI", key: "sk_live_**********8a", status: "Connected", latency: "120ms" },
        { id: 2, name: "Stripe Gateway", provider: "Stripe", key: "rk_test_**********4f", status: "Active", latency: "45ms" },
        { id: 3, name: "Telegram Bot", provider: "Telegram", key: "62512:**********aq", status: "Idle", latency: "0ms" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl md:text-3xl font-black uppercase italic text-white leading-tight">Provider <span className="text-accent-yellow text-2xl md:text-4xl">Gateways</span></h2>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1.5">Configure and monitor external service integrations</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10"
                >
                    <Plus className="w-5 h-5" /> Register New Gateway
                </button>
            </div>

            {/* API Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                {apis.map((api) => (
                    <div key={api.id} className="bg-secondary-dark/50 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 p-5 md:p-8 group hover:border-accent-yellow/20 transition-all flex flex-col sm:flex-row items-center gap-5 md:gap-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-14 h-14 md:w-20 h-20 rounded-xl md:rounded-3xl bg-white/[0.03] flex items-center justify-center text-accent-yellow border border-white/5 relative z-10 shrink-0">
                            <Zap className="w-6 h-6 md:w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex-1 w-full relative z-10 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-3 sm:mb-2 gap-3 sm:gap-0">
                                <div>
                                    <h4 className="text-lg md:text-xl font-black text-white italic tracking-tight leading-none mb-1">{api.name}</h4>
                                    <p className="text-[8px] md:text-[10px] uppercase font-black text-white/20 tracking-[0.2em] flex items-center justify-center sm:justify-start gap-1.5 md:gap-2 leading-none">
                                        <Server className="w-2.5 h-2.5 md:w-3 md:h-3" /> {api.provider}
                                    </p>
                                </div>
                                <span className={cn(
                                    "px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 border",
                                    api.status === "Connected" || api.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-white/5 text-white/40 border-white/5"
                                )}>
                                    <div className={cn("w-1 md:w-1.5 h-1 md:h-1.5 rounded-full", api.status === "Connected" || api.status === "Active" ? "bg-emerald-400" : "bg-white/20")} />
                                    {api.status}
                                </span>
                            </div>

                            <div className="bg-black/20 rounded-lg md:rounded-xl p-2.5 md:p-3 flex items-center gap-3 border border-white/5 mb-5 md:mb-6">
                                <Key className="w-3 md:w-4 h-3 md:h-4 text-white/20" />
                                <code className="text-[10px] md:text-xs font-mono text-white/40 tracking-wider truncate flex-1">{api.key}</code>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start gap-5 md:gap-6 mt-auto">
                                <div className="flex items-center gap-2 leading-none">
                                    <Activity className="w-3 md:w-3.5 h-3 md:h-3.5 text-accent-yellow/40" />
                                    <span className="text-[10px] md:text-xs font-bold text-white/20 italic leading-none">{api.latency} Latency</span>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-white/40 hover:text-white transition-all">
                                        <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                    <button className="p-2 md:p-2.5 bg-white/5 hover:bg-red-500/10 rounded-lg md:rounded-xl text-white/40 hover:text-red-400 transition-all">
                                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add API Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4">
                    <div className="bg-secondary-dark border border-white/5 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-12 relative animate-in zoom-in-95 duration-300 shadow-[0_0_80px_rgba(0,0,0,0.5)] custom-scrollbar">
                        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
                            <div className="p-2.5 md:p-4 bg-accent-yellow/10 rounded-xl md:rounded-2xl text-accent-yellow border border-accent-yellow/20">
                                <Link2 className="w-5 h-5 md:w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-3xl font-black text-white italic uppercase leading-tight">New <span className="text-accent-yellow">API Gateway</span></h3>
                                <p className="text-[8px] md:text-[10px] uppercase font-black text-white/20 tracking-widest mt-0.5 md:mt-1">Integrate third-party data or services</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-4">
                                <FormInput label="Internal Name" placeholder="e.g. Master Wallet" />
                                <FormInput label="Provider" placeholder="e.g. PayPal" />
                            </div>
                            <FormInput label="Endpoint URL" placeholder="https://api.provider.com/v1" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-4">
                                <FormInput label="API Key / Client ID" placeholder="****************" type="password" />
                                <FormInput label="Secret Key" placeholder="****************" type="password" />
                            </div>
                        </div>

                        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all order-2 sm:order-1">Discard</button>
                            <button className="flex-1 py-4 md:py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all order-1 sm:order-2">Initialize Gateway</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormInput = ({ label, placeholder, type = "text" }: any) => (
    <div className="space-y-1.5 md:space-y-2 flex-1">
        <label className="text-[9px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4.5 px-5 md:px-6 text-xs md:text-sm font-bold text-white transition-all focus:border-accent-yellow/40 leading-none"
        />
    </div>
);

export default ApiManager;
