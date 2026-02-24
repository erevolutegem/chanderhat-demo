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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white">Project <span className="text-accent-yellow text-4xl">Players</span></h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Manage all users across your whitelabel network</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                        <Filter className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-secondary-dark/50 p-4 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent-yellow transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        className="w-full bg-white/5 border border-white/5 focus:border-accent-yellow/50 outline-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-accent-yellow/50 appearance-none min-w-[150px]">
                        <option>All Sites</option>
                        <option>playbaji.live</option>
                        <option>sportsbet.pro</option>
                    </select>
                </div>
            </div>

            {/* Players Table */}
            <div className="bg-secondary-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5 bg-white/[0.01]">
                                <th className="px-8 py-6">Player Info</th>
                                <th className="px-8 py-6">Domain</th>
                                <th className="px-8 py-6">Balance</th>
                                <th className="px-8 py-6">Joined Date</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-bold">
                            {players.map((player) => (
                                <tr key={player.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm">{player.name}</p>
                                                <p className="text-xs text-white/20 font-medium">{player.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                                            <Globe className="w-4 h-4 text-accent-yellow/40 group-hover:text-accent-yellow transition-colors" />
                                            <span className="text-sm">{player.site}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-white text-sm">{player.balance}</span>
                                    </td>
                                    <td className="px-8 py-6 text-white/20 text-sm font-medium">
                                        {player.joined}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest",
                                            player.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                        )}>
                                            {player.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button title="Quick Block" className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all shadow-xl">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                            <button title="View Full Profile" className="p-2.5 bg-white/5 hover:bg-accent-yellow hover:text-primary-dark rounded-xl transition-all shadow-xl">
                                                <MoreVertical className="w-4 h-4" />
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
