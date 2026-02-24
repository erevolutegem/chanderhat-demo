"use client";

import React, { useState } from "react";
import { Coins, Plus, Edit2, Trash2, RefreshCcw, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const CurrencyManager = () => {
    const [currencies, setCurrencies] = useState([
        { id: 1, code: "BDT", symbol: "৳", rate: 1.0, isDefault: true },
        { id: 2, code: "INR", symbol: "₹", rate: 0.85, isDefault: false },
        { id: 3, code: "USD", symbol: "$", rate: 110.5, isDefault: false },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white line-clamp-1">Currency <span className="text-accent-yellow text-4xl">Management</span></h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Configure exchange rates and default site coins</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10">
                    <Plus className="w-5 h-5" /> Add New Currency
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Currency Table */}
                <div className="xl:col-span-2 bg-secondary-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-black uppercase text-white tracking-widest flex items-center gap-3">
                            <div className="w-2 h-6 bg-accent-yellow rounded-full" />
                            Active Currencies
                        </h3>
                        <button className="p-2 text-white/20 hover:text-white transition-colors">
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                                    <th className="px-8 py-6">Currency</th>
                                    <th className="px-8 py-6">Symbol</th>
                                    <th className="px-8 py-6">Exchange Rate</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currencies.map((curr) => (
                                    <tr key={curr.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-accent-yellow">
                                                    {curr.code[0]}
                                                </div>
                                                <span className="font-black text-white">{curr.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/60 font-medium">{curr.symbol}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-black">1.00 {curr.code}</span>
                                                <span className="text-white/20">=</span>
                                                <span className="text-accent-yellow font-bold">{curr.rate} BASE</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {curr.isDefault ? (
                                                <span className="px-3 py-1 bg-accent-yellow text-primary-dark text-[8px] font-black uppercase rounded-full tracking-widest">Default</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-white/5 text-white/40 text-[8px] font-black uppercase rounded-full tracking-widest">Active</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Convert Tool */}
                <div className="bg-gradient-to-br from-secondary-dark to-black p-8 rounded-[2.5rem] border border-white/5 flex flex-col shadow-2xl">
                    <h3 className="font-black uppercase text-white tracking-widest flex items-center gap-3 mb-8">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        Rate Calculator
                    </h3>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-3 pl-1">Amount to Convert</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-accent-yellow">$</span>
                                <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/5 focus:border-accent-yellow/50 outline-none rounded-2xl py-5 pl-12 pr-6 text-xl font-black text-white transition-all" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center -my-2 relative z-10">
                            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-accent-yellow hover:scale-110 transition-all hover:bg-white/10 shadow-2xl">
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-3 pl-1">Target Currency</label>
                            <select className="w-full bg-white/5 border border-white/5 focus:border-accent-yellow/50 outline-none rounded-2xl py-5 px-6 text-sm font-black text-white appearance-none transition-all">
                                <option className="bg-secondary-dark">Select Currency</option>
                                <option className="bg-secondary-dark">BDT (৳)</option>
                                <option className="bg-secondary-dark">INR (₹)</option>
                            </select>
                        </div>

                        <div className="pt-6 border-t border-white/5 mt-auto">
                            <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 text-center">
                                <p className="text-[10px] font-black uppercase text-emerald-400/60 tracking-[0.2em] mb-1">Estimated Value</p>
                                <p className="text-3xl font-black text-emerald-400 italic">৳ 12,450.00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyManager;
