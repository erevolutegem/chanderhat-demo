"use client";

import React, { useState } from "react";
import { Search, User, Mail, Globe, Calendar, Filter, MoreVertical, ShieldCheck, Ban, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const UsersManager = () => {
    const [players] = useState([
        { id: 1, name: "Ariful Islam", email: "arif@example.com", site: "playbaji.live", joined: "2024-02-01", balance: "৳ 12,450", status: "Active" },
        { id: 2, name: "Tanvir Hasan", email: "tanvir@example.com", site: "sportsbet.pro", joined: "2024-02-15", balance: "₹ 8,900", status: "Active" },
        { id: 3, name: "Mehedi Joy", email: "joy@example.com", site: "playbaji.live", joined: "2024-02-20", balance: "৳ 450", status: "Blocked" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl md:text-3xl font-black uppercase italic text-white leading-tight">Project <span className="text-accent-yellow text-2xl md:text-5xl">Players</span></h2>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1.5">Manage all users across your whitelabel network</p>
                </div>
                <button className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border border-white/5">
                    <Filter className="w-4 h-4 md:w-5 h-5" /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-yellow transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        className="w-full bg-secondary-dark border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-16 pr-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/20 transition-all shadow-xl"
                    />
                </div>
                <div className="flex gap-3">
                    <select className="flex-1 lg:w-48 bg-secondary-dark border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/20 transition-all appearance-none cursor-pointer shadow-xl">
                        <option>All Sites</option>
                        <option>playbaji.live</option>
                        <option>sportsbet.pro</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-secondary-dark rounded-[2rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 md:px-8 py-4 md:py-6">Player Info</th>
                                <th className="px-6 md:px-8 py-4 md:py-6">Domain</th>
                                <th className="px-6 md:px-8 py-4 md:py-6">Balance</th>
                                <th className="px-6 md:px-8 py-4 md:py-6 text-center">Status</th>
                                <th className="px-6 md:px-8 py-4 md:py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-bold">
                            {players.map((player) => (
                                <tr key={player.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 md:px-8 py-4 md:py-6">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
                                                <User className="w-4 h-4 md:w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white text-xs md:text-sm">{player.name}</p>
                                                <p className="text-[10px] text-white/20 font-medium">{player.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-4 md:py-6">
                                        <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                                            <Globe className="w-3.5 h-3.5 text-accent-yellow/40 group-hover:text-accent-yellow transition-colors" />
                                            <span className="text-xs md:text-sm">{player.site}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-4 md:py-6">
                                        <span className="text-white text-xs md:text-sm">{player.balance}</span>
                                    </td>
                                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                                        <span className={cn(
                                            "px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[9px] md:text-[10px] uppercase font-black tracking-widest",
                                            player.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                        )}>
                                            {player.status}
                                        </span>
                                    </td>
                                    <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button title="Quick Block" className="p-2 md:p-2.5 bg-white/5 hover:bg-red-500/10 rounded-lg md:rounded-xl text-white/40 hover:text-red-400 transition-all shadow-xl">
                                                <Ban className="w-3.5 h-3.5 md:w-4 h-4" />
                                            </button>
                                            <button title="View Full Profile" className="p-2 md:p-2.5 bg-white/5 hover:bg-accent-yellow hover:text-primary-dark rounded-lg md:rounded-xl transition-all shadow-xl">
                                                <MoreVertical className="w-3.5 h-3.5 md:w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Showing 3 of 12,450 players</p>
                </div>
            </div>
        </div>
    );
};

export default UsersManager;
