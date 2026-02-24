"use client";

import React, { useState } from "react";
import { Zap, Plus, Edit, Trash2, Key, Link2, Activity, ShieldCircle, Server } from "lucide-react";
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white italic">Provider <span className="text-accent-yellow text-4xl">Gateways</span></h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Configure and monitor external service integrations</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10"
                >
                    <Plus className="w-5 h-5" /> Register New Gateway
                </button>
            </div>

            {/* API Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {apis.map((api) => (
                    <div key={api.id} className="bg-secondary-dark/50 rounded-[2.5rem] border border-white/5 p-8 group hover:border-accent-yellow/20 transition-all flex items-center gap-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center text-accent-yellow border border-white/5 relative z-10">
                            <Zap className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-xl font-black text-white italic tracking-tight">{api.name}</h4>
                                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] flex items-center gap-2">
                                        <Server className="w-3 h-3" /> {api.provider}
                                    </p>
                                </div>
                                <span className={cn(
                                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
                                    api.status === "Connected" || api.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-white/5 text-white/40"
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full", api.status === "Connected" || api.status === "Active" ? "bg-emerald-400" : "bg-white/20")} />
                                    {api.status}
                                </span>
                            </div>

                            <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3 border border-white/5 mb-6">
                                <Key className="w-4 h-4 text-white/20" />
                                <code className="text-xs font-mono text-white/40 tracking-wider truncate flex-1">{api.key}</code>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-accent-yellow/40" />
                                    <span className="text-xs font-bold text-white/20 italic">{api.latency} Latency</span>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all">
                                        <Trash2 className="w-4 h-4" />
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
                    <div className="bg-secondary-dark border border-white/5 w-full max-w-xl rounded-[3rem] p-12 relative animate-in zoom-in-95 duration-300 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-accent-yellow/10 rounded-2xl text-accent-yellow border border-accent-yellow/20">
                                <Link2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white italic uppercase">New <span className="text-accent-yellow">API Connection</span></h3>
                                <p className="text-[10px] uppercase font-black text-white/20 tracking-widest mt-1">Integrate third-party data or services</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Internal Name" placeholder="e.g. Master Wallet" />
                                <FormInput label="Provider" placeholder="e.g. PayPal" />
                            </div>
                            <FormInput label="Endpoint URL" placeholder="https://api.provider.com/v1" />
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="API Key / Client ID" placeholder="****************" type="password" />
                                <FormInput label="Secret Key" placeholder="****************" type="password" />
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Discard</button>
                            <button className="flex-1 py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Initialize Gateway</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormInput = ({ label, placeholder, type = "text" }: any) => (
    <div className="space-y-2.5 flex-1">
        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white transition-all focus:border-accent-yellow/40"
        />
    </div>
);

export default ApiManager;
